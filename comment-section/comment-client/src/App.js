import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';
import './App.css';
import qqQRCode from './assets/qq.jpg';  // 假设图片放在 src/assets 目录下

function App() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [nickname, setNickname] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyToNickname, setReplyToNickname] = useState('');
  const [selectedComment, setSelectedComment] = useState(null);
  const [selectedReply, setSelectedReply] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [stats, setStats] = useState({ total: 0, today: 0 });
  const [theme, setTheme] = useState('dark');
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchComments(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEmojiPicker && !event.target.closest('.emoji-picker-container') && !event.target.closest('.emoji-button')) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showEmojiPicker]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
  }, []);

  const fetchComments = useCallback(async (page) => {
    try {
      const response = await axios.get(`/api/comments?page=${page}`);
      setComments(response.data.comments);
      
      if (response.data.totalPages !== totalPages) {
        setTotalPages(response.data.totalPages);
      }
      
      if (page > response.data.totalPages) {
        setCurrentPage(1);
      } else {
        setCurrentPage(page);
      }
    } catch (err) {
      console.error('获取评论列表失败:', err);
    }
  }, [totalPages]);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/comments/stats');
      setStats(response.data);
    } catch (err) {
      console.error('获取统计数据失败:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const _ = await axios.post('/api/comments', {
        content: newComment,
        nickname: nickname || '匿名用户',
        parentId: replyTo
      });

      setNewComment('');
      setNickname('');

      // 如果是回复评论
      if (replyTo) {
        // 先重新获取当前页的评论列表以更新回复数量
        const commentsResponse = await axios.get(`/api/comments?page=${currentPage}`);
        setComments(commentsResponse.data.comments);

        // 如果是回复主评论
        if (selectedComment && replyTo === selectedComment._id) {
          // 获取更新后的回复列表
          const repliesResponse = await axios.get(`/api/comments/${selectedComment._id}/replies`);
          
          setSelectedComment(prevComment => ({
            ...prevComment,
            replies: repliesResponse.data,
            replyCount: repliesResponse.data.length
          }));
        }
        // 如果是回复二级评论
        else if (selectedReply && replyTo === selectedReply._id) {
          // 获取更新后的二级回复列表
          const secondLevelReplies = await axios.get(`/api/comments/${selectedReply._id}/second-level-replies`);
          
          setSelectedReply(prevReply => ({
            ...prevReply,
            replies: secondLevelReplies.data,
            replyCount: secondLevelReplies.data.length
          }));

          if (selectedComment) {
            // 重新获取一级评论的所有回复
            const updatedReplies = await axios.get(`/api/comments/${selectedComment._id}/replies`);
            
            // 更新一级评论的回复列表
            setSelectedComment(prevComment => ({
              ...prevComment,
              replies: updatedReplies.data
            }));
          }
        }
        // 如果是回复一级评论（不在二级回复面板中）
        else {
          // 找到被回复的一级评论
          const parentComment = commentsResponse.data.comments.find(comment => {
            const hasReply = comment.replies?.some(reply => reply._id === replyTo);
            const isInSelectedComment = selectedComment && 
              selectedComment._id === comment._id && 
              selectedComment.replies?.some(reply => reply._id === replyTo);
            return hasReply || isInSelectedComment;
          });
          
          if (parentComment) {
            // 重新获取该评论的所有回复
            const updatedReplies = await axios.get(`/api/comments/${parentComment._id}/replies`);
            
            if (selectedComment && selectedComment._id === parentComment._id) {
              setSelectedComment(prevComment => ({
                ...prevComment,
                replies: updatedReplies.data,
                replyCount: updatedReplies.data.length
              }));
            }
          }
        }
      } else {
        // 如果是发表新评论，回到第一页
        await fetchComments(1);
        setCurrentPage(1);
      }

      // 重置回复状态
      setReplyTo(null);
      setReplyToNickname('');
      
      // 更新统计数据
      fetchStats();
    } catch (err) {
      console.error('发表评论失败:', err);
    }
  };

  const handleReply = (commentId, nickname) => {
    setReplyTo(commentId);
    setReplyToNickname(nickname);
  };

  const handleViewReplies = async (comment) => {
    try {
      // 获取一级回复列表
      const repliesResponse = await axios.get(`/api/comments/${comment._id}/replies`);
      
      // 为每个一级回复获取其二级回复数量
      const repliesWithCounts = await Promise.all(repliesResponse.data.map(async (reply) => {
        const secondLevelReplies = await axios.get(`/api/comments/${reply._id}/second-level-replies`);
        return {
          ...reply,
          replyCount: secondLevelReplies.data.length
        };
      }));

      setSelectedReply(null);
      setSelectedComment({
        ...comment,
        replies: repliesWithCounts
      });
    } catch (err) {
      console.error('获取回复失败:', err);
    }
  };

  const handleViewSecondLevelReplies = async (reply) => {
    try {
      // 获取二级回复列表
      const secondLevelReplies = await axios.get(`/api/comments/${reply._id}/second-level-replies`);
      
      // 更新选中的一级回复，包括其回复数量
      setSelectedReply({
        ...reply,
        replies: secondLevelReplies.data,
        replyCount: secondLevelReplies.data.length
      });

      // 同时更新 selectedComment 中对应的一级回复的回复数量
      if (selectedComment) {
        setSelectedComment(prevComment => ({
          ...prevComment,
          replies: prevComment.replies.map(r => 
            r._id === reply._id 
              ? { 
                  ...r, 
                  replyCount: secondLevelReplies.data.length,
                  replies: secondLevelReplies.data
                }
              : r
          )
        }));
      }
    } catch (err) {
      console.error('获取二级回复失败:', err);
    }
  };

  const renderContent = (content) => {
    const parts = content.split(/(!?\[.*?\]\(.*?\))/g);
    return parts.map((part, index) => {
      const imgMatch = part.match(/!\[(.*?)\]\((.*?)\)/);
      if (imgMatch) {
        return (
          <img 
            key={index} 
            src={imgMatch[2]} 
            alt={imgMatch[1]} 
            onClick={() => setPreviewImage(imgMatch[2])}
            style={{ cursor: 'pointer' }}
          />
        );
      }
      return part;
    });
  };

  const ReplyPanel = () => {
    return (
      <div className="reply-panel">
        {selectedComment ? (
          <>
            <div className="reply-panel-header">
              <h3>{selectedComment.floor}楼的回复</h3>
              <button className="close-button" onClick={() => {
                setSelectedComment(null);
                setSelectedReply(null);
              }}>×</button>
            </div>
            <div className="original-comment">
              <div className="comment-header">
                <span className="nickname">{selectedComment.nickname}</span>
                <span className="floor">{selectedComment.floor}楼</span>
              </div>
              <div className="comment-content">{renderContent(selectedComment.content)}</div>
            </div>
            <div className="replies-list">
              {selectedComment.replies?.map(reply => (
                <div key={reply._id} className="reply">
                  <div className="comment-header">
                    <span className="nickname">{reply.nickname}</span>
                    <span className="reply-time">{new Date(reply.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="comment-content">{renderContent(reply.content)}</div>
                  <div className="reply-actions">
                    <button onClick={() => handleReply(reply._id, reply.nickname)}>回复</button>
                    {(reply.replyCount > 0 || reply.replies?.length > 0) && (
                      <button
                        className="view-replies-btn"
                        onClick={() => handleViewSecondLevelReplies(reply)}
                      >
                        查看{reply.replyCount || reply.replies?.length}条回复
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-panel" style={{ marginLeft: '10px' }}>
            <h3>一级回复</h3>
            <p>点击评论中的"查看回复"按钮查看回复内容</p>
          </div>
        )}
      </div>
    );
  };

  const SecondLevelReplyPanel = () => {
    return (
      <div className="reply-panel second-level">
        {selectedReply ? (
          <>
            <div className="reply-panel-header">
              <h3>回复详情</h3>
              <button className="close-button" onClick={() => setSelectedReply(null)}>×</button>
            </div>
            <div className="original-comment">
              <div className="comment-header">
                <span className="nickname">{selectedReply.nickname}</span>
                <span className="reply-time">{new Date(selectedReply.createdAt).toLocaleString()}</span>
              </div>
              <div className="comment-content">{renderContent(selectedReply.content)}</div>
            </div>
            <div className="replies-list">
              {selectedReply.replies?.map(reply => (
                <div key={reply._id} className="reply">
                  <div className="comment-header">
                    <span className="nickname">{reply.nickname}</span>
                    <span className="reply-time">{new Date(reply.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="comment-content">{renderContent(reply.content)}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-panel" style={{ marginLeft: '10px' }}>
            <h3>二级回复</h3>
            <p>点击一级回复中"查看回复"按钮查看回复内容</p>
          </div>
        )}
      </div>
    );
  };

  const CommentItem = ({ comment }) => {
    return (
      <div className="comment">
        <div className="comment-header">
          <div className="user-info">
            <span className="nickname">{comment.nickname}</span>
            <span className="comment-time">{new Date(comment.createdAt).toLocaleString()}</span>
          </div>
          <span className="floor">{comment.floor}楼</span>
        </div>
        <div className="comment-content">{renderContent(comment.content)}</div>
        <div className="comment-actions">
          <button onClick={() => handleReply(comment._id, comment.nickname)}>回复</button>
          {comment.replyCount > 0 && (
            <button
              className="view-replies-btn"
              onClick={() => handleViewReplies(comment)}
            >
              查看{comment.replyCount}条回复
            </button>
          )}
        </div>
      </div>
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // 滚动到页面顶部
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const Pagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          上一页
        </button>
        {pages}
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          下一页
        </button>
      </div>
    );
  };

  const SourceModal = () => {
    if (!showSourceModal) return null;
    
    return (
      <div className="modal-overlay" onClick={() => setShowSourceModal(false)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>网站源码</h3>
            <button className="close-button" onClick={() => setShowSourceModal(false)}>×</button>
          </div>
          <div className="modal-body">
            <p>
              <strong>GitHub:</strong>
              <a href="https://github.com/JHM2004/TJU-Web-Visualization" target="_blank" rel="noopener noreferrer">
                @https://github.com/JHM2004/TJU-Web-Visualization
              </a>
            </p>
            <p>
              <strong>Gitee:</strong>
              <a href="https://gitee.com/Yang_yuxin123/TJU-Web-Visualization" target="_blank" rel="noopener noreferrer">
                @https://gitee.com/Yang_yuxin123/TJU-Web-Visualization
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  };

  const ContactModal = () => {
    if (!showContactModal) return null;
    
    return (
      <div className="modal-overlay" onClick={() => setShowContactModal(false)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>联系作者</h3>
            <button className="close-button" onClick={() => setShowContactModal(false)}>×</button>
          </div>
          <div className="modal-body">
            <p className="author-intro">一枚有梦想的大学生~</p>
            <p>
              <strong>QQ:</strong>
              <span className="contact-info">2011342963</span>
            </p>
            <p>
              <strong>QQ群:</strong>
              <span className="contact-info">可视前端-学习/聊天群: 585135622</span>
            </p>
            <p>
              <strong>bilibili:</strong>
              <a href="https://space.bilibili.com/1959928946" target="_blank" rel="noopener noreferrer">
                0x767
              </a>
            </p>
            <div className="qr-code">
              <p className="qr-title">QQ群二维码</p>
              <img src={qqQRCode} alt="QQ群二维码" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const onEmojiClick = (emojiData, event) => {
    const cursor = document.getElementById('comment-textarea').selectionStart;
    const text = newComment.slice(0, cursor) + emojiData.emoji + newComment.slice(cursor);
    setNewComment(text);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const imageUrl = response.data.url;
      setUploadedImages([...uploadedImages, imageUrl]);
      setNewComment(newComment + `\n![图片](${imageUrl})`);
    } catch (err) {
      console.error('上传图片失败:', err);
      alert('上传图片失败，请重试');
    }
  };

  const CommentStats = () => (
    <div className="comment-stats">
      <div className="stat-item">
        <span className="stat-label">总评论</span>
        <span className="stat-value">{stats.total}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">今日评论</span>
        <span className="stat-value">{stats.today}</span>
      </div>
    </div>
  );

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handlePaste = async (e) => {
    const items = e.clipboardData.items;
    
    for (let item of items) {
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();
        
        const file = item.getAsFile();
        const formData = new FormData();
        formData.append('image', file);

        try {
          const response = await axios.post('/api/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          const imageUrl = response.data.url;
          setUploadedImages([...uploadedImages, imageUrl]);
          setNewComment(newComment + `\n![图片](${imageUrl})`);
        } catch (err) {
          console.error('上传图���失败:', err);
          alert('上传图片失败，请重试');
        }
        break;
      }
    }
  };

  const ImagePreviewModal = () => {
    if (!previewImage) return null;
    
    return (
      <div 
        className="modal-overlay" 
        onClick={() => setPreviewImage(null)}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        <img 
          src={previewImage} 
          alt="预览图片" 
          style={{
            maxWidth: '90%',
            maxHeight: '90vh',
            objectFit: 'contain'
          }}
          onClick={e => e.stopPropagation()}
        />
      </div>
    );
  };

  return (
    <div className="app">
      <div className="main-content">
        <div className="head">
          <div className="header-container">
            <button 
              className="nav-btn"
              onClick={() => window.location.href = 'http://39.105.163.119:80'}
              style={{
                position: 'fixed',
                left: '0px',
                top: '15px',
                padding: '10px 15px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '0 4px 4px 0',
                cursor: 'pointer',
                zIndex: '1000',
                fontSize: '14px',
                boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                fontWeight: '500'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#45a049';
                e.target.style.transform = 'translateX(5px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#4CAF50';
                e.target.style.transform = 'translateX(0)';
              }}
            >
              跳转到生物演化史导航页
            </button>
            <h1>评论交流区</h1>
            <div className="header-buttons">
              <button 
                className="theme-toggle-btn"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <button 
                className="source-code-btn"
                onClick={() => setShowSourceModal(true)}
              >
                网站源码-开源仓库
              </button>
              <button 
                className="contact-btn"
                onClick={() => setShowContactModal(true)}
              >
                联系作者
              </button>
            </div>
          </div>
          <CommentStats />
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="昵称（选填）"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <div className="textarea-container">
              <textarea
                id="comment-textarea"
                placeholder={replyTo ? `回复 ${replyToNickname}...` : "写下你的评论...\n\n\n备注:\n①支持直接粘贴图片/截图\n②上传的图片路径不能包含中文,否则会导致上传失败"}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onPaste={handlePaste}
                required
              />
              <div className="textarea-controls">
                <button
                  type="button"
                  className="emoji-button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  😊
                </button>
                <label className="upload-button">
                  📷
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              {showEmojiPicker && (
                <div className="emoji-picker-container">
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    width={300}
                    height={400}
                    searchDisabled={false}
                    skinTonesDisabled={true}
                    theme={theme}
                    emojiStyle="native"
                    lazyLoadEmojis={true}
                  />
                </div>
              )}
            </div>
            <div className="form-footer">
              {replyTo && (
                <button type="button" onClick={() => {
                  setReplyTo(null);
                  setReplyToNickname('');
                }}>取消回复</button>
              )}
              <button type="submit">{replyTo ? '发表回复' : '发表评论'}</button>
            </div>
          </form>
        </div>


        <div className="comments">
          {(() => {
            if (!comments || !comments.length) {
              return <div className="no-comments">暂无评论</div>;
            }

            const commentElements = [];
            for (let i = 0; i < comments.length; i++) {
              const comment = comments[i];
              commentElements.push(
                <CommentItem key={comment._id} comment={comment} />
              );
            }
            return commentElements;
          })()}
        </div>
        <Pagination />
      </div>
      <div className="panels-container">
        <ReplyPanel />
        <SecondLevelReplyPanel />
      </div>
      <SourceModal />
      <ContactModal />
      <ImagePreviewModal />
    </div>
  );
}

export default App; 
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    default: '匿名用户'
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  floor: {
    type: Number,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comment', commentSchema); 

/**
 * {
  _id: ObjectId,        // MongoDB 自动生成的唯一标识符
  content: String,      // 评论内容
  nickname: String,     // 评论者昵称
  parentId: ObjectId,   // 父评论的 ID（如果是回复的话）
  createdAt: Date,      // 评论创建时间
  floor: Number         // 楼层号
}
 * 
 */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Comment = require('./models/Comment');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Jimp = require('jimp');

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5173'], // 允许的前端域名
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Disposition'], // 允许前端访问的响应头
  credentials: true, // 允许携带凭证
  maxAge: 86400 // CORS 预检请求的有效期，单位秒
};

// 确保 CORS 中间件在所有路由之前
app.use(cors(corsOptions));
app.use(express.json());

// 添加图片审核函数
async function checkImageContent(imagePath) {
  try {
    const image = await Jimp.read(imagePath);
    
    // 基本的图片验证（尺寸检查）
    if (image.bitmap.width > 4096 || image.bitmap.height > 4096) {
      throw new Error('图片尺寸过大');
    }
    
    return true;
  } catch (error) {
    throw new Error(`图片验证失败: ${error.message}`);
  }
}

// 确保上传目录存在
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置图片存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);  // 使用绝对路径
  },
  filename: function (req, file, cb) {
    // 添加时间戳和随机数，避免文件名冲突
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// 添加文件验证函数
const validateFile = (file) => {
  // 检查文件大小（5MB）
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('文件大小不能超过5MB');
  }

  // 检查文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error('只支持 JPG、PNG、GIF 格式的图片');
  }

  // 检查图片尺寸（可选）
  const maxDimension = 4096; // 最大尺寸4096像素
  if (file.width > maxDimension || file.height > maxDimension) {
    throw new Error('图片尺寸不能超过4096x4096像素');
  }

  return true;
};

// 配置 multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1 // 一次只能上传一个文件
  },
  fileFilter: (req, file, cb) => {
    try {
      // 检查文件扩展名
      const filetypes = /jpeg|jpg|png|gif/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);

      if (!mimetype || !extname) {
        return cb(new Error('只支持 JPG、PNG、GIF 格式的图片'));
      }

      // 检查文件名长度
      if (file.originalname.length > 100) {
        return cb(new Error('文件名过长'));
      }

      // 检查文件名是否包含特殊字符
      const validFilename = /^[a-zA-Z0-9-_. ]+$/.test(file.originalname);
      if (!validFilename) {
        return cb(new Error('文件名包含非法字符'));
      }

      cb(null, true);
    } catch (err) {
      cb(err);
    }
  }
});

// 修改静态文件服务的 CORS 配置
app.use('/uploads', cors(corsOptions), express.static(uploadDir));

// 修改上传接口的 CORS 配置
app.post('/api/upload', cors(corsOptions), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '请选择要上传的图片' });
    }

    // 基本验证
    try {
      validateFile(req.file);
    } catch (err) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: err.message });
    }

    // 内容审核
    try {
      await checkImageContent(req.file.path);
    } catch (err) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: err.message });
    }

    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    res.json({
      url: imageUrl,
      message: '上传成功'
    });
  } catch (err) {
    console.error('文件上传错误:', err);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ 
      message: '文件上传失败，请重试',
      error: err.message 
    });
  }
});

// 添加错误处理中间件
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer 错误处理
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({ message: '文件大小不能超过5MB' });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({ message: '一次只能上传一个文件' });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({ message: '未预期的文件字段' });
      default:
        return res.status(400).json({ message: '文件上传失败' });
    }
  }
  
  if (err) {
    console.error('上传错误:', err);
    return res.status(500).json({ 
      message: '服务器错误',
      error: err.message 
    });
  }
  
  next();
});

// 设置端口
const PORT = 5000;

// 修改数据库连接部分
mongoose.connect('mongodb://localhost:27017/comment-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Successfully connected to MongoDB.');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// 添加数据库连接错误处理
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// 确保在应用退出时关闭数据库连接
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

// 将服务器启动移到数据库连接成功之后
mongoose.connection.once('open', async () => {
  // 检查是否已有数据
  try {
    const count = await Comment.countDocuments();
    if (count === 0) {
      // 添加测试数据
      await Comment.create([
        {
          content: '这是一条测试评论: 祝你早安、午安和晚安。',
          nickname: '用户1',
          floor: 1
        }
      ]);
      console.log('Added test comments');
    }
  } catch (error) {
    console.error('Error adding test data:', error);
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

// 修改评论统计接口
app.get('/api/comments/stats', async (req, res) => {
  try {
    // 获取所有评论数（包括主评论和回复）
    const totalComments = await Comment.countDocuments();
    
    // 获取今日所有评论数
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayComments = await Comment.countDocuments({
      createdAt: { $gte: today }
    });
    
    // 返回统计数据
    res.json({
      total: totalComments,
      today: todayComments
    });
  } catch (err) {
    console.error('获取统计数据失败:', err);
    res.status(500).json({ message: err.message });
  }
});
// 获取所有评论
app.get('/api/comments', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;
    
    // 获取分页数据
    const comments = await Comment.find({ parentId: null })
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    
    // 为每个评论添加回复数量
    const commentsWithReplyCount = await Promise.all(comments.map(async (comment) => {
      const replyCount = await Comment.countDocuments({ parentId: comment._id });
      return {
        ...comment.toObject(),
        replyCount
      };
    }));
    
    const total = await Comment.countDocuments({ parentId: null });
    
    res.json({
      comments: commentsWithReplyCount,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page
    });
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ message: err.message });
  }
});

// 发表新评论
app.post('/api/comments', async (req, res) => {
  const comment = new Comment({
    content: req.body.content,
    nickname: req.body.nickname || '匿名用户',
    parentId: req.body.parentId
  });

  try {
    // 如果是顶层评论，计算楼层
    if (!req.body.parentId) {
      const count = await Comment.countDocuments({ parentId: null });
      comment.floor = count + 1;
    }
    
    const newComment = await comment.save();
    
    // 如果是回复，计算并返回父评论的回复数量
    if (req.body.parentId) {
      // 获取父评论
      const parentComment = await Comment.findById(req.body.parentId);
      if (parentComment) {
        // 计算父评论的回复数量
        const replyCount = await Comment.countDocuments({ parentId: parentComment._id });
        
        // 如果父评论本身是回复，还要计算它的回复数量
        if (parentComment.parentId) {
          const secondLevelReplyCount = await Comment.countDocuments({ parentId: parentComment._id });
          return res.status(201).json({
            ...newComment.toObject(),
            parentReplyCount: replyCount,
            secondLevelReplyCount
          });
        }
        
        return res.status(201).json({
          ...newComment.toObject(),
          parentReplyCount: replyCount
        });
      }
    }
    
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 获取指定评论的所有回复
app.get('/api/comments/:commentId/replies', async (req, res) => {
  try {
    const replies = await Comment.find({ 
      parentId: req.params.commentId 
    }).sort({ createdAt: 1 });

    // 为每个一级回复添加二级回复数量
    const repliesWithCount = await Promise.all(replies.map(async (reply) => {
      const replyCount = await Comment.countDocuments({ parentId: reply._id });
      return {
        ...reply.toObject(),
        replyCount
      };
    }));

    res.json(repliesWithCount);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 获取二级回复
app.get('/api/comments/:replyId/second-level-replies', async (req, res) => {
  try {
    const replies = await Comment.find({ 
      parentId: req.params.replyId 
    }).sort({ createdAt: 1 });
    res.json(replies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});
 
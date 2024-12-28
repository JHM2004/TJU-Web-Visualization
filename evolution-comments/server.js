const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 连接MongoDB
mongoose.connect('mongodb://localhost:27017/evolution_comments', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// 定义评论模型
const Comment = mongoose.model('Comment', {
    nodeId: String,
    content: String,
    time: { type: Date, default: Date.now }
});

app.use(cors());
app.use(express.json());

// 获取指定节点的评论
app.get('/api/comments/:nodeId', async (req, res) => {
    try {
        const nodeId = req.params.nodeId;
        console.log('Fetching comments for nodeId:', nodeId);
        
        const page = parseInt(req.query.page) || 1;
        const pageSize = 5;
        
        const total = await Comment.countDocuments({ nodeId });
        console.log('Total comments:', total);
        
        const comments = await Comment.find({ nodeId })
            .sort({ time: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
            
        console.log('Found comments:', comments);
        
        res.json({
            comments,
            pagination: {
                total,
                currentPage: page,
                totalPages: Math.ceil(total / pageSize),
                pageSize
            }
        });
    } catch (err) {
        console.error('Error fetching comments:', err);
        res.status(500).json({ error: err.message });
    }
});

// 添加新评论
app.post('/api/comments', async (req, res) => {
    try {
        console.log('Adding new comment:', req.body);
        
        const comment = new Comment({
            nodeId: req.body.nodeId,
            content: req.body.content
        });
        
        const savedComment = await comment.save();
        console.log('Comment saved:', savedComment);
        
        res.json(savedComment);
    } catch (err) {
        console.error('Error adding comment:', err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(8081, () => {
    console.log('Server running on port 8081');
}); 
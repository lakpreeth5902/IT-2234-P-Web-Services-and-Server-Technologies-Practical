const express = require('express');
const users = require('./users');
const blogPosts = require('./posts');
const comments = require('./comments');

const app = express();
const PORT = 3000;

app.use(express.json());

// Route for user summary (Question 1)
app.get('/api/users/:id/summary', (req, res) => {
    const userId = req.params.id;
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const userPosts = blogPosts.filter(post => post.authorId === userId);
    const userComments = comments.filter(comment => comment.userId === userId);

    const response = {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        totalPosts: userPosts.length,
        totalComments: userComments.length
    };

    res.json(response);
});

// Route for post comments with commentator names (Question 2)
app.get('/api/posts/:id/comments', (req, res) => {
    const postId = req.params.id;
    const post = blogPosts.find(p => p.id === postId);

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    const postComments = comments.filter(comment => comment.postId === postId);
    const commentsWithNames = postComments.map(comment => {
        const user = users.find(u => u.id === comment.userId);
        return {
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            commentator: user.fullName
        };
    });

    res.json(commentsWithNames);
});

// Error handling for unavailable IDs (Question 3)
app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
});

app.get('/api/posts/:id', (req, res) => {
    const postId = req.params.id;
    const post = blogPosts.find(p => p.id === postId);

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
});

// Separate routes for users and blog posts (Question 4)
app.get('/api/users', (req, res) => {
    res.json(users);
});

app.get('/api/posts', (req, res) => {
    res.json(blogPosts);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
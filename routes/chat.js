const express = require('express');
const router = express.Router();

// `/chat/video` 라우트
router.get('/video', (req, res) => {
    res.render('chat/video', { title: '채팅 페이지' });
});

// `/chat/video2` 라우트
router.get('/video2', (req, res) => {
    res.render('chat/video2', { title: '채팅2 페이지' });
});

// `/chat/video2` 라우트
router.get('/video3', (req, res) => {
    res.render('chat/video3', { title: '채팅3 페이지' });
});

module.exports = router;
const express = require('express');
const router = express.Router();

// `/about/info` 라우트
router.get('/chat', (req, res) => {
    res.render('video/chat', { title: '채팅 페이지' });
});

module.exports = router;
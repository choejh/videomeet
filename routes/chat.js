const express = require('express');
const router = express.Router();

// `/about/info` 라우트
router.get('/video', (req, res) => {
    res.render('chat/video', { title: '채팅 페이지' });
});

module.exports = router;
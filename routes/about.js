const express = require('express');
const router = express.Router();

// `/about/info` 라우트
router.get('/info', (req, res) => {
    res.render('about/info', { title: '정보 페이지' });
});

// `/about/info/history` 라우트
router.get('/info/history', (req, res) => {
    res.render('about/history', { title: '히스토리 페이지' });
});

module.exports = router;
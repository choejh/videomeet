const express = require('express');
const path = require('path');
const app = express();

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});


// EJS를 템플릿 엔진으로 사용 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));  // 'views' 폴더를 템플릿 파일 디렉토리로 설정

// 정적 파일 제공 (CSS)
app.use(express.static(path.join(__dirname, 'public')));

// '/' 경로로 요청이 오면 EJS 템플릿을 렌더링
app.get('/', (req, res) => {
    res.render('index', { title: 'Welcome to My Site' });  // 'views/index.ejs' 템플릿을 렌더링
});

// `/about` 관련 라우트 불러오기
const aboutRoutes = require('./routes/about');
app.use('/about', aboutRoutes);  // '/about' 하위의 라우트들 적용


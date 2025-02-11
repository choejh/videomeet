const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public")); // 클라이언트 정적 파일 제공

io.on("connection", (socket) => {
    console.log("🔗 사용자 연결됨:", socket.id);

    // Offer 보내기
    socket.on("offer", (data) => {
        socket.broadcast.emit("offer", data);
    });

    // Answer 보내기
    socket.on("answer", (data) => {
        socket.broadcast.emit("answer", data);
    });

    // ICE Candidate 전송
    socket.on("ice-candidate", (data) => {
        socket.broadcast.emit("ice-candidate", data);
    });

    socket.on("disconnect", () => {
        console.log("❌ 사용자 연결 종료:", socket.id);
    });
});

server.listen(3000, () => {
    console.log("✅ 서버 실행 중: http://localhost:3000");
});
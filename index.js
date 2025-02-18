'use strict';

var os = require('os');
var nodeStatic = require('node-static');
var http = require('http');
var socketIO = require('socket.io');

// node-static 서버 생성
var fileServer = new nodeStatic.Server();

// HTTP 서버 생성
var server = http.createServer(function(req, res) {
  fileServer.serve(req, res);
}).listen(8070);

// 소켓 서버에 CORS 설정 추가
var io = socketIO(server, {
  cors: {
    origin: "http://localhost:8080",  // 클라이언트의 포트(웹 서버 포트)
    methods: ["GET", "POST"],
    credentials: true  // 쿠키를 사용하려면 필요
  }
});

// 클라이언트 연결 시 실행되는 코드
io.on('connection', function(socket) {
  
  // convenience function to log server messages on the client
  function log() {
    var array = ['Message from server:'];
    array.push.apply(array, arguments);
    socket.emit('log', array);
  }

  socket.on('message', function(message) {
    log('Client said: ', message);
    socket.broadcast.emit('message', message);  // 다른 클라이언트에게 메시지 전달
  });

  socket.on('create or join', function(room) {
    log('Received request to create or join room ' + room);

    var clientsInRoom = io.sockets.adapter.rooms.get(room);
    var numClients = clientsInRoom ? clientsInRoom.size : 0;
    log('Room ' + room + ' now has ' + numClients + ' client(s)');

    if (numClients === 0) {
      socket.join(room);
      log('Client ID ' + socket.id + ' created room ' + room);
      socket.emit('created', room, socket.id);

    } else if (numClients === 1) {
      log('Client ID ' + socket.id + ' joined room ' + room);
      io.to(room).emit('join', room);
      socket.join(room);
      socket.emit('joined', room, socket.id);
      io.to(room).emit('ready');
    } else { // 최대 두 클라이언트만 허용
      socket.emit('full', room);
    }
  });

  socket.on('ipaddr', function() {
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
      ifaces[dev].forEach(function(details) {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          socket.emit('ipaddr', details.address);  // 클라이언트에게 IP 주소 전송
        }
      });
    }
  });
});

console.log('Server running on http://localhost:8070');
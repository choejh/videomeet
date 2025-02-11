const socket = io(); // WebSocket 연결
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

let localStream;
let peerConnection;
const iceServers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] }; // 구글 STUN 서버

// 1️⃣ 카메라 & 마이크 접근
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
        localVideo.srcObject = stream;
        localStream = stream;
    })
    .catch((error) => console.error("🚨 미디어 접근 실패:", error));

// 2️⃣ WebRTC PeerConnection 생성
function createPeerConnection() {
    peerConnection = new RTCPeerConnection(iceServers);

    // 로컬 스트림 추가
    localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));

    // 상대방 영상 수신
    peerConnection.ontrack = (event) => {
        remoteVideo.srcObject = event.streams[0];
    };

    // ICE Candidate 전송
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit("ice-candidate", event.candidate);
        }
    };
}

// 3️⃣ WebRTC Offer & Answer 처리
socket.on("offer", async (offer) => {
    createPeerConnection();
    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit("answer", answer);
});

socket.on("answer", async (answer) => {
    await peerConnection.setRemoteDescription(answer);
});

socket.on("ice-candidate", async (candidate) => {
    try {
        await peerConnection.addIceCandidate(candidate);
    } catch (e) {
        console.error("ICE Candidate 오류:", e);
    }
});

// 4️⃣ 통화 시작 (Offer 생성)
function startCall() {
    createPeerConnection();
    peerConnection.createOffer()
        .then((offer) => peerConnection.setLocalDescription(offer))
        .then(() => socket.emit("offer", peerConnection.localDescription));
}
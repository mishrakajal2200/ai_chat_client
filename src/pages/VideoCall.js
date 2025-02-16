
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "peerjs";

const socket = io("https://ai-chat-app-ev4d.onrender.com");

const Videocall = () => {
  const myVideo = useRef();
  const userVideo = useRef();
  const peerInstance = useRef();
  const [callAccepted, setCallAccepted] = useState(false);
  const [peerId, setPeerId] = useState(null);

  useEffect(() => {
    peerInstance.current = new Peer();

    peerInstance.current.on("open", (id) => {
      setPeerId(id);
      socket.emit("join-room", { userId: id });
    });

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      myVideo.current.srcObject = stream;

      socket.on("user-connected", (userId) => {
        console.log("User connected:", userId);
        callUser(userId, stream);
      });

      peerInstance.current.on("call", (call) => {
        call.answer(stream);
        call.on("stream", (userStream) => {
          userVideo.current.srcObject = userStream;
        });
      });
    });

    socket.on("incoming-call", ({ from, offer }) => {
      peerInstance.current.signal(offer);
      setCallAccepted(true);
    });

    socket.on("call-accepted", ({ answer }) => {
      peerInstance.current.signal(answer);
      setCallAccepted(true);
    });

    socket.on("call-ended", () => {
      endCall();
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-accepted");
      socket.off("call-ended");
    };
  }, []);

  const callUser = (userId, stream) => {
    const call = peerInstance.current.call(userId, stream);
    call.on("stream", (userStream) => {
      userVideo.current.srcObject = userStream;
    });
  };

  const endCall = () => {
    socket.emit("end-call", { userId: peerId });
    myVideo.current.srcObject = null;
    userVideo.current.srcObject = null;
    setCallAccepted(false);
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="flex">
        <video ref={myVideo} autoPlay playsInline className="w-1/2 border" />
        <video ref={userVideo} autoPlay playsInline className="w-1/2 border" />
      </div>
      {callAccepted && (
        <button onClick={endCall} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
          End Call
        </button>
      )}
    </div>
  );
};

export default Videocall;

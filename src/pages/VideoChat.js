import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("https://ai-chat-app-2-eah1.onrender.com", {
    transports: ["websocket", "polling"],
  });
  

const VideoChat = () => {
    const { roomId } = useParams();
    const myVideo = useRef(null);
    const remoteVideo = useRef(null);
    const peerRef = useRef(null);
    const streamRef = useRef(null);
    
    const [peerId, setPeerId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [brotherUsername, setBrotherUsername] = useState("");
    const [incomingCall, setIncomingCall] = useState(null);
    const [callActive, setCallActive] = useState(false);
    const [activeCall, setActiveCall] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("No token found!");

                const response = await axios.get("https://ai-chat-app-2-eah1.onrender.com/api/user", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUserId(response.data._id);
            } catch (error) {
                console.error("Fetch User Error:", error.response?.data || error.message);
            }
        };

        fetchUser();

        const peer = new Peer();
        peerRef.current = peer;

        peer.on("open", (id) => {
            setPeerId(id);
        });

        peer.on("call", (call) => {
            console.log("Incoming Call!", call);
            setIncomingCall(call);
        });

        return () => {
            peer.off("call");
            peer.destroy();
            socket.disconnect();
        };
    }, [roomId]);

    useEffect(() => {
        if (peerId && userId) {
            axios.post("https://ai-chat-app-2-eah1.onrender.com/api/update-peer", { userId, peerId })
                .then(() => console.log("Peer ID updated in DB!"))
                .catch(err => console.error("Error updating Peer ID:", err));
        }
    }, [peerId, userId]);

    const getUserMediaStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            streamRef.current = stream;
            if (myVideo.current) myVideo.current.srcObject = stream;
            return stream;
        } catch (error) {
            console.error("Error accessing camera/microphone:", error);
        }
    };

    const callUser = async () => {
        if (!brotherUsername) {
            return console.error("Please enter a username before calling.");
        }
    
        try {
            const response = await axios.get(`https://ai-chat-app-2-eah1.onrender.com/api/get-peer/${brotherUsername}`);
            const brotherPeerId = response.data.peerId;
            if (!brotherPeerId) {
                return console.error("Brother is offline or has no active Peer ID.");
            }
    
            console.log("Calling Peer ID:", brotherPeerId);
    
            const stream = await getUserMediaStream();
            if (!stream) return;
    
            const call = peerRef.current.call(brotherPeerId, stream);
    
            call.on("stream", (remoteStream) => {
                if (remoteVideo.current) {
                    remoteVideo.current.srcObject = remoteStream;
                }
            });
    
            // Send user's stream back to remote user
            call.on("close", () => {
                stream.getTracks().forEach(track => track.stop());
                setCallActive(false);
            });
    
            setActiveCall(call);
            setCallActive(true);
        } catch (error) {
            console.error("Error calling brother:", error);
        }
    };
    

    const answerCall = async () => {
        if (!incomingCall) return;
    
        try {
            const stream = await getUserMediaStream();
            if (!stream) return;
    
            incomingCall.answer(stream); // Answer the call with our stream
    
            incomingCall.on("stream", (remoteStream) => {
                if (remoteVideo.current) {
                    remoteVideo.current.srcObject = remoteStream;
                }
            });
    
            // Handle call end
            incomingCall.on("close", () => {
                stream.getTracks().forEach(track => track.stop());
                setCallActive(false);
            });
    
            setActiveCall(incomingCall);
            setCallActive(true);
            setIncomingCall(null);
        } catch (error) {
            console.error("Error answering call:", error);
        }
    };
    
    // Function to reject the incoming call
    const rejectCall = () => {
        if (!incomingCall) return;
    
        incomingCall.close(); // End the call
        setIncomingCall(null); // Reset the incoming call state
    
        // Optionally notify the caller if using WebRTC or Socket.io
        if (socket) {
            socket.emit("callRejected");
        }
    
        console.log("Call rejected");
    };

    

    const endCall = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (activeCall) {
            activeCall.close();
        }
        setCallActive(false);
        setActiveCall(null);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Video Chat Room: {roomId}</h2>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 w-full max-w-4xl">
                {/* Local Video */}
                <div className="relative w-full sm:w-1/2">
                    <video ref={myVideo} autoPlay className="w-full h-64 sm:h-72 rounded-lg border-4 border-green-500 shadow-lg" />
                    <p className="absolute bottom-2 left-2 bg-green-600 text-xs px-2 py-1 rounded-md">You</p>
                </div>
                {/* Remote Video */}
                <div className="relative w-full sm:w-1/2">
                    <video ref={remoteVideo} autoPlay className="w-full h-64 sm:h-72 rounded-lg border-4 border-blue-500 shadow-lg" />
                    <p className="absolute bottom-2 left-2 bg-blue-600 text-xs px-2 py-1 rounded-md">Remote User</p>
                </div>
            </div>

            {/* Input & Call Button */}
            <div className="mt-6 w-full max-w-md flex flex-col sm:flex-row items-center gap-4">
                <input
                    type="text"
                    placeholder="Enter Brother's Username"
                    value={brotherUsername}
                    onChange={(e) => setBrotherUsername(e.target.value)}
                    className="w-full sm:w-auto p-3 text-black rounded-lg focus:outline-none"
                />
                <button 
                    onClick={callUser} 
                    className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition"
                >
                    Call Brother
                </button>
            </div>

            {/* Call Control Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
                {!callActive ? (
                    <button 
                        onClick={callUser} 
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition w-full sm:w-auto"
                    >
                        Start Call
                    </button>
                ) : (
                    <button 
                        onClick={endCall} 
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition w-full sm:w-auto"
                    >
                        End Call
                    </button>
                )}
            </div>

            {/* Incoming Call Notification */}
            {incomingCall && (
    <div className="mt-4 p-4 bg-yellow-500 text-black rounded-lg">
        <p>📞 Incoming call...</p>
        <div className="flex gap-4 mt-2">
            <button 
                onClick={answerCall} 
                className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
                ✅ Accept
            </button>
            <button 
                onClick={rejectCall} 
                className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
                ❌ Reject
            </button>
        </div>
    </div>
)}

        </div>
    );
};

export default VideoChat;

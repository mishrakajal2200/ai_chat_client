

// import React, { useEffect, useRef, useState } from "react";
// import Peer from "peerjs";
// import { useParams } from "react-router-dom";
// import { io } from "socket.io-client";
// import axios from "axios";

// const socket = io("http://localhost:5000");

// const VideoChat = () => {
//     const { roomId } = useParams();
//     const myVideo = useRef(null);
//     const remoteVideo = useRef(null);
//     const peerRef = useRef(null);
//     const streamRef = useRef(null);

//     const [peerId, setPeerId] = useState(null);
//     const [userId, setUserId] = useState(null);
//     const [callActive, setCallActive] = useState(false);

//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 console.log("Fetching user...");
        
//                 const token = localStorage.getItem("token");
//                 if (!token) throw new Error("No token found!");
        
//                 const response = await axios.get("http://localhost:5000/api/user", {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
        
//                 console.log("API Response:", response.data); // Debug log
        
//                 setUserId(response.data._id);  // Fix here
//                 console.log("✅ User ID:", response.data._id);
//             } catch (error) {
//                 console.error("❌ Fetch User Error:", error.response?.data || error.message);
//             }
//         };
        

//         fetchUser();

//         // Create PeerJS instance
//         const peer = new Peer();
//         peerRef.current = peer;

//         peer.on("open", (id) => {
//             console.log("🔹 My Peer ID:", id);
//             setPeerId(id);  
//         });

//         socket.on("user-connected", ({ peerId }) => {
//             console.log("📞 Incoming Call from:", peerId);
//             if (streamRef.current) {
//                 callUser(peerId, streamRef.current);
//             }
//         });

//         peer.on("call", (call) => {
//             navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
//                 call.answer(stream);
//                 streamRef.current = stream;
//                 if (myVideo.current) myVideo.current.srcObject = stream;

//                 call.on("stream", (remoteStream) => {
//                     if (remoteVideo.current) remoteVideo.current.srcObject = remoteStream;
//                 });
//             });
//         });

//         return () => {
//             peer.destroy();
//             socket.disconnect();
//         };
//     }, [roomId]);

//     useEffect(() => {
//         if (peerId && userId) {
//             axios.post("http://localhost:5000/api/update-peer", { userId, peerId })
//                 .then(() => console.log("✅ Peer ID updated in DB!"))
//                 .catch(err => console.error("❌ Error updating Peer ID:", err));
//         }
//     }, [peerId, userId]);

//     const callUser = (peerId, stream) => {
//         if (!peerRef.current) return console.error("❌ Peer instance not found!");

//         const call = peerRef.current.call(peerId, stream);
//         call.on("stream", (remoteStream) => {
//             if (remoteVideo.current) remoteVideo.current.srcObject = remoteStream;
//         });
//     };

//     const startCall = async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//             streamRef.current = stream;
//             if (myVideo.current) myVideo.current.srcObject = stream;

//             socket.emit("call-user", { roomId, peerId });

//             setCallActive(true);
//         } catch (error) {
//             console.error("❌ Error starting call:", error);
//         }
//     };

//     const endCall = () => {
//         if (streamRef.current) {
//             streamRef.current.getTracks().forEach(track => track.stop());
//         }
//         setCallActive(false);
//     };


//     const callBrother = async (brotherUsername) => {
//         console.log("🔍 brotherUsername:", brotherUsername); // Debugging step
//         if (typeof brotherUsername !== "string") {
//             return console.error("❌ brotherUsername must be a string, but got:", brotherUsername);
//         }
    
//         try {
//             const response = await axios.get(`http://localhost:5000/api/get-peer/${brotherUsername}`);
//             console.log("✅ API Response:", response.data);
    
//             const brotherPeerId = response.data.peerId;
//             if (!brotherPeerId) return console.error("❌ Brother is offline or has no active Peer ID.");
    
//             console.log("📞 Calling Peer ID:", brotherPeerId);
            
//             if (!peerRef.current || !peerRef.current.open) {
//                 return console.error("❌ PeerJS connection is not ready.");
//             }
    
//             const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//             streamRef.current = stream;
//             if (myVideo.current) myVideo.current.srcObject = stream;
    
//             const call = peerRef.current.call(brotherPeerId, stream);
//             call.on("stream", (remoteStream) => {
//                 console.log("🎥 Received remote stream");
//                 if (remoteVideo.current) remoteVideo.current.srcObject = remoteStream;
//             });
    
//             setCallActive(true);
//         } catch (error) {
//             console.error("❌ Error calling brother:", error);
//         }
//     };
    
 
//     return (
//         <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
//             <h2 className="text-2xl font-bold mb-4">Video Chat Room: {roomId}</h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
//                 <div className="relative">
//                     <video ref={myVideo} autoPlay className="w-full h-64 rounded-lg border-4 border-green-500 shadow-lg" />
//                     <p className="absolute bottom-2 left-2 bg-green-600 text-xs px-2 py-1 rounded-md">You</p>
//                 </div>
//                 <div className="relative">
//                     <video ref={remoteVideo} autoPlay className="w-full h-64 rounded-lg border-4 border-blue-500 shadow-lg" />
//                     <p className="absolute bottom-2 left-2 bg-blue-600 text-xs px-2 py-1 rounded-md">Remote User</p>
//                 </div>
//             </div>

//             <div className="flex space-x-4 mt-6">
//                 {!callActive ? (
//                     <button 
//                         onClick={startCall} 
//                         className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition"
//                     >
//                         Start Call
//                     </button>
//                 ) : (
//                     <button 
//                         onClick={endCall} 
//                         className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition"
//                     >
//                         End Call
//                     </button>
//                 )}

//                 <button onClick={() => callBrother("brotherUsername")}>Call Brother</button>

//             </div>

//             <p className="mt-4 text-sm">My Peer ID: {peerId}</p>
//             <p className="text-sm">My User ID: {userId}</p>
//         </div>
//     );
// };

// export default VideoChat;


import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

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

    useEffect(() => {
        const fetchUser = async () => {
            try {
                console.log("Fetching user...");
                const token = localStorage.getItem("token");
                if (!token) throw new Error("No token found!");

                const response = await axios.get("http://localhost:5000/api/user", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUserId(response.data._id);
                console.log("✅ User ID:", response.data._id);
            } catch (error) {
                console.error("❌ Fetch User Error:", error.response?.data || error.message);
            }
        };

        fetchUser();

        // Initialize PeerJS
        const peer = new Peer();
        peerRef.current = peer;

        peer.on("open", (id) => {
            console.log("🔹 My Peer ID:", id);
            setPeerId(id);
        });

        // Listen for incoming calls
        peer.on("call", (call) => {
            console.log("📞 Incoming Call!");
            setIncomingCall(call); // Store incoming call in state
        });

        return () => {
            peer.destroy();
            socket.disconnect();
        };
    }, [roomId]);

    useEffect(() => {
        if (peerId && userId) {
            axios.post("http://localhost:5000/api/update-peer", { userId, peerId })
                .then(() => console.log("✅ Peer ID updated in DB!"))
                .catch(err => console.error("❌ Error updating Peer ID:", err));
        }
    }, [peerId, userId]);

    // Function to start a call
    const callUser = async (brotherUsername) => {
        if (!brotherUsername) {
            return console.error("❌ Please enter a username before calling.");
        }

        try {
            const response = await axios.get(`http://localhost:5000/api/get-peer/${brotherUsername}`);
            const brotherPeerId = response.data.peerId;
            if (!brotherPeerId) {
                return console.error("❌ Brother is offline or has no active Peer ID.");
            }

            console.log("📞 Calling Peer ID:", brotherPeerId);

            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            streamRef.current = stream;
            if (myVideo.current) myVideo.current.srcObject = stream;

            const call = peerRef.current.call(brotherPeerId, stream);
            call.on("stream", (remoteStream) => {
                if (remoteVideo.current) remoteVideo.current.srcObject = remoteStream;
            });

            setCallActive(true);
        } catch (error) {
            console.error("❌ Error calling brother:", error);
        }
    };

    // Function to answer an incoming call
    const answerCall = async () => {
        if (!incomingCall) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            streamRef.current = stream;
            if (myVideo.current) myVideo.current.srcObject = stream;

            incomingCall.answer(stream);
            incomingCall.on("stream", (remoteStream) => {
                if (remoteVideo.current) remoteVideo.current.srcObject = remoteStream;
            });

            setCallActive(true);
            setIncomingCall(null);
        } catch (error) {
            console.error("❌ Error answering call:", error);
        }
    };

    // Function to reject a call
    const rejectCall = () => {
        setIncomingCall(null);
    };

    // Function to end the call
    const endCall = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        setCallActive(false);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
            <h2 className="text-2xl font-bold mb-4">Video Chat Room: {roomId}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
                <div className="relative">
                    <video ref={myVideo} autoPlay className="w-full h-64 rounded-lg border-4 border-green-500 shadow-lg" />
                    <p className="absolute bottom-2 left-2 bg-green-600 text-xs px-2 py-1 rounded-md">You</p>
                </div>
                <div className="relative">
                    <video ref={remoteVideo} autoPlay className="w-full h-64 rounded-lg border-4 border-blue-500 shadow-lg" />
                    <p className="absolute bottom-2 left-2 bg-blue-600 text-xs px-2 py-1 rounded-md">Remote User</p>
                </div>
            </div>

            {/* Input for username */}
            <div className="mt-4">
                <input
                    type="text"
                    placeholder="Enter Brother's Username"
                    value={brotherUsername}
                    onChange={(e) => setBrotherUsername(e.target.value)}
                    className="p-2 text-black rounded-lg"
                />
                <button 
                    onClick={() => callUser(brotherUsername)} 
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition ml-2"
                >
                    Call Brother
                </button>
            </div>

            {/* Buttons for starting and ending calls */}
            <div className="flex space-x-4 mt-6">
                {!callActive ? (
                    <button 
                        onClick={() => callUser(brotherUsername)} 
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition"
                    >
                        Start Call
                    </button>
                ) : (
                    <button 
                        onClick={endCall} 
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition"
                    >
                        End Call
                    </button>
                )}
            </div>

            {/* Incoming call notification */}
            {incomingCall && (
                <div className="mt-4 p-4 bg-yellow-500 text-black rounded-lg">
                    <p>📞 Incoming call...</p>
                    <button onClick={answerCall} className="bg-green-500 text-white px-4 py-2 rounded-md m-2">Accept</button>
                    <button onClick={rejectCall} className="bg-red-500 text-white px-4 py-2 rounded-md">Reject</button>
                </div>
            )}

            <p className="mt-4 text-sm">My Peer ID: {peerId}</p>
            <p className="text-sm">My User ID: {userId}</p>
        </div>
    );
};

export default VideoChat;

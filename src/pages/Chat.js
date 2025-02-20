
// import { useEffect, useState, useRef } from "react";
// import { io } from "socket.io-client";
// import { Link, useNavigate } from "react-router-dom";
// import { FaPaperPlane, FaVideo } from "react-icons/fa";

// const socket = io("http://localhost:5000");

// const Chat = () => {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [matchedUsers, setMatchedUsers] = useState([]); // Ensure matchedUsers is always an array
//   const navigate = useNavigate();
//   const messagesEndRef = useRef(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   // Retrieve userId from localStorage
//   const userId = localStorage.getItem("userId"); 

//   useEffect(() => {
//     if (!userId) {
//       navigate("/"); // Redirect to login if no userId found
//       return;
//     }

//     // Fetch matched users for chat
//     const fetchMatches = async () => {
//       try {
//           const response = await fetch(`http://localhost:5000/api/ai/match/${userId}`);
//           const data = await response.json();
//           console.log("Matched users:", data); // Debug log
//           setMatchedUsers(Array.isArray(data.matchedUsers) ? data.matchedUsers : []);
//       } catch (error) {
//           console.error("Error fetching matches:", error);
//           setMatchedUsers([]);
//       }
//   };
  

//     fetchMatches();
//   }, [userId, navigate]);

//   useEffect(() => {
//     socket.on("receiveMessage", (msg) => {
//       setMessages((prev) => [...prev, msg]);
//     });

//     return () => socket.off("receiveMessage");
//   }, []);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = async () => {
//     if (message.trim() === "") return;

//     setMessages((prev) => [...prev, { text: message, sender: "You" }]);

//     try {
//       const response = await fetch("http://localhost:5000/api/ai/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message }),
//       });

//       const data = await response.json();

//       if (data.response) {
//         setMessages((prev) => [...prev, { text: data.response, sender: "AI" }]);
//       }
//     } catch (error) {
//       console.error("Error fetching AI response:", error);
//     }

//     setMessage("");
//   };

//   const startVideoCall = async () => {
//     if (matchedUsers.length === 0) {
//         console.error("No matched users available for video call");
//         return;
//     }

//     try {
//         const response = await fetch("http://localhost:5000/api/ai/video-call", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 senderId: userId,
//                 receiverId: matchedUsers[0]._id, // Use correct _id
//             }),
//         });

//         const data = await response.json();
//         if (data.success) {
//             navigate(`/video-call/${data.roomId}`);
//         }
//     } catch (error) {
//         console.error("Error starting video call:", error);
//     }
// };


//   return (
//     <div className="h-screen flex bg-gray-100">
//       {/* Sidebar */}
//       <aside className={`w-64 bg-gray-800 text-white transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
//         <div className="p-4">
//           <h2 className="text-lg font-bold mb-4">Sidebar</h2>
//           <ul>
//             <li className="py-2 hover:bg-gray-700 cursor-pointer"><Link to="/profile">Profile</Link></li>
//             <li className="py-2 hover:bg-gray-700 cursor-pointer">Settings</li>
//           </ul>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Navbar */}
//         <nav className="bg-blue-500 text-white p-4 flex justify-between items-center shadow-md">
//           <div className="flex items-center">
//             <button className="lg:hidden mr-4 focus:outline-none" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </button>
//             <h2 className="text-lg font-bold">Chat Room</h2>
//           </div>
//           {matchedUsers.length > 0 ? (
//     <ul>
//         {matchedUsers.map((user) => (
//             <li key={user._id} className="text-white flex items-center justify-between">
//                 <span>{user.username}</span>
//                 <button 
//                     onClick={() => startVideoCall(user._id)} 
//                     className="ml-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
//                 >
//                     <FaVideo className="mr-2" /> Start Video Call
//                 </button>
//             </li>
//         ))}
//     </ul>
// ) : (
//     <p className="text-white">No matches found</p>
// )}


//         </nav>

//         {/* Chat Area */}
//         <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-100">
//           {messages.map((msg, index) => (
//             <div key={index} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
//               <div className={`max-w-xs p-3 rounded-lg shadow-md ${msg.sender === "You" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-900"}`}>
//                 {msg.text}
//               </div>
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Input Field */}
//         <div className="bg-white p-4 flex items-center shadow-md">
//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="Type a message..."
//             className="flex-1 p-2 border rounded-lg outline-none"
//           />
//           <button
//             onClick={sendMessage}
//             className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
//           >
//             <FaPaperPlane className="mr-2" /> Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;

import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Link, useNavigate } from "react-router-dom";
import { FaPaperPlane, FaVideo, FaBars } from "react-icons/fa";

const socket = io("http://localhost:5000");

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [matchedUsers, setMatchedUsers] = useState([]);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const userId = localStorage.getItem("userId"); 

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    const fetchMatches = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/ai/match/${userId}`);
        const data = await response.json();
        setMatchedUsers(Array.isArray(data.matchedUsers) ? data.matchedUsers : []);
      } catch (error) {
        console.error("Error fetching matches:", error);
        setMatchedUsers([]);
      }
    };

    fetchMatches();
  }, [userId, navigate]);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (message.trim() === "") return;

    setMessages((prev) => [...prev, { text: message, sender: "You" }]);

    try {
      const response = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (data.response) {
        setMessages((prev) => [...prev, { text: data.response, sender: "AI" }]);
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }

    setMessage("");
  };

  const startVideoCall = async (receiverId) => {
    if (!receiverId) {
        console.error("No receiver selected for video call");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/ai/video-call", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sender: userId, receiver: receiverId }),  // Fix key names
        });

        const data = await response.json();
        if (data.success) {
            navigate(`/video-call/${data.roomId}`);
        } else {
            console.error("Video call failed:", data.error);
        }
    } catch (error) {
        console.error("Error starting video call:", error);
    }
};


  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className={`absolute lg:relative w-64 bg-gray-800 text-white transition-all duration-300 z-50 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-64"} lg:translate-x-0`}>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Menu</h2>
          <ul>
            <li className="py-2 hover:bg-gray-700 cursor-pointer px-3 rounded-md">
              <Link to="/profile">Profile</Link>
            </li>
            <li className="py-2 hover:bg-gray-700 cursor-pointer px-3 rounded-md">Settings</li>
          </ul>
        </div>
      </aside>

      {/* Main Chat Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <nav className="bg-blue-500 text-white p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center">
            <button className="lg:hidden mr-4 focus:outline-none" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <FaBars className="text-2xl" />
            </button>
            <h2 className="text-xl font-bold">Chat Room</h2>
          </div>

          {/* Matched Users & Video Call */}
          <div className="hidden lg:flex space-x-4">
            {matchedUsers.length > 0 ? (
              matchedUsers.map((user) => (
                <button 
                  key={user._id}
                  onClick={() => startVideoCall(user._id)} 
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <FaVideo className="mr-2" /> {user.username}
                </button>
              ))
            ) : (
              <p className="text-sm">No matches found</p>
            )}
          </div>
        </nav>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100 space-y-3">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs p-3 rounded-lg shadow-md text-sm 
                ${msg.sender === "You" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-900"}`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Field */}
        <div className="bg-white p-4 flex items-center shadow-md">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={sendMessage}
            className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaPaperPlane className="mr-2" /> Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

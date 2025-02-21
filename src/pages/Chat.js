
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Link, useNavigate } from "react-router-dom";
import { FaPaperPlane, FaVideo, FaBars } from "react-icons/fa";

const socket = io("https://ai-chat-app-1-d9nn.onrender.com");

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
        const response = await fetch(`https://ai-chat-app-1-d9nn.onrender.com/api/ai/match/${userId}`);
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
      const response = await fetch("https://ai-chat-app-1-d9nn.onrender.com/api/ai/chat", {
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
        const response = await fetch("https://ai-chat-app-1-d9nn.onrender.com/api/ai/video-call", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sender: userId, receiver: receiverId }),
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
    <div className="h-screen flex flex-col lg:flex-row bg-gray-100">
      {/* Sidebar */}
      <aside className={`absolute lg:relative w-64 bg-gray-800 text-white transition-all duration-300 z-50 h-full overflow-y-auto
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
          <div className="flex space-x-4 overflow-x-auto max-w-xs lg:max-w-none">
            {matchedUsers.length > 0 ? (
              matchedUsers.map((user) => (
                <button 
                  key={user._id}
                  onClick={() => startVideoCall(user._id)} 
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center whitespace-nowrap"
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


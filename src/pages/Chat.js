
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Link, useNavigate } from "react-router-dom";
import { FaPaperPlane, FaVideo } from "react-icons/fa";

const socket = io("http://localhost:5000");

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // ... (Your existing chat logic - socket.on, socket.off)
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    // ... (Your existing sendMessage logic)
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

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className={`w-64 bg-gray-800 text-white transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">Sidebar</h2>
          <ul>
            <li className="py-2 hover:bg-gray-700 cursor-pointer"><Link to="/profile">Profile</Link></li>
            <li className="py-2 hover:bg-gray-700 cursor-pointer">Settings</li>
            {/* ... more sidebar items */}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <nav className="bg-blue-500 text-white p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center">
            <button className="lg:hidden mr-4 focus:outline-none" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-lg font-bold">Chat Room</h2>
          </div>
          <button
            onClick={() => navigate("/video-call")}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center"
          >
            <FaVideo className="mr-2" /> Video Call
          </button>
        </nav>

        {/* Chat Area (Now the main content) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-100">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-xs p-3 rounded-lg shadow-md ${msg.sender === "You" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-900"}`}>
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
            className="flex-1 p-2 border rounded-lg outline-none"
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



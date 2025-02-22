
// import { useState } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Link, useNavigate } from "react-router-dom";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [buttonText, setButtonText] = useState("Login");
//   const [isLoggingIn, setIsLoggingIn] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     if (isLoggingIn) return;

//     setIsLoggingIn(true);
//     setButtonText("Logging in....");

//     try {
//       const response = await axios.post("https://ai-chat-app-ev4d.onrender.com/api/auth/login", {
//         email,
//         password,
//       });
//       localStorage.setItem("token", response.data.token);
// localStorage.setItem("userId", response.data.userId);
// localStorage.setItem("username", response.data.username);
// localStorage.setItem("email", response.data.email);

//       toast.success("Login successful!", { position: "top-right" });
//       navigate("/chat");
//     } catch (error) {
//       toast.error("Login failed! " + (error.response?.data?.message || "Try again."), {
//         position: "top-right",
//       });
//     } finally {
//       setIsLoggingIn(false);
//       setButtonText("Login");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-200">
//     <ToastContainer/>
//       <form className="bg-white p-6 rounded-lg shadow-lg w-96" onSubmit={handleLogin}>
//         <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full p-2 mb-3 border rounded"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full p-2 mb-3 border rounded"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button
//           type="submit"
//           className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
//           disabled={isLoggingIn} // Disable while logging in
//         >
//           {buttonText} {/* Dynamic button text */}
//         </button>
//         <p className="mt-5">
//           Don't Have An Account? <Link to="/register">Signup</Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Login;

import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buttonText, setButtonText] = useState("Login");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoggingIn) return;
  
    setIsLoggingIn(true);
    setButtonText("Logging in...");
  
    try {
      const response = await axios.post(
        "https://ai-chat-app-2-eah1.onrender.com/api/auth/login",
        { email, password }
      );
  
      console.log("📌 Login API Response:", response.data); // Debug API response
  
      // Store token & user data in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
  
  
      toast.success("Login successful!", { position: "top-right" });
      navigate("/chat");
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error.message); // Debug log
      toast.error("Login failed! " + (error.response?.data?.error || "Try again."), {
        position: "top-right",
      });
    } finally {
      setIsLoggingIn(false);
      setButtonText("Login");
    }
  };
  

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <ToastContainer />
      <form className="bg-white p-6 rounded-lg shadow-lg w-96" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          disabled={isLoggingIn}
        >
          {buttonText}
        </button>
        <p className="mt-5">
          Don't Have An Account? <Link to="/register">Signup</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

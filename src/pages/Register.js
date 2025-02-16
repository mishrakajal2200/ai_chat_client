
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buttonText, setButtonText] = useState("Sign Up");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (isSigningUp) return; // Prevent multiple clicks

    setIsSigningUp(true);
    setButtonText("Creating Account... Please Wait");

    try {
      const response = await axios.post("https://ai-chat-app-ev4d.onrender.com/api/auth/register", {
        userName,
        email,
        password,
      });
      alert(response.data.message);
      navigate("/"); // Redirect to login after signup
    } catch (error) {
      alert("Registration failed"); // Or a more specific error message
    } finally {
      setIsSigningUp(false);
      setButtonText("Sign Up");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <form className="bg-white p-6 rounded-lg shadow-md w-96" onSubmit={handleSignup}>
        <h2 className="text-2xl font-bold mb-4 text-center">Signup</h2>
        {/* ... (Your input fields) */}
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 mb-3 border rounded"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
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
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={isSigningUp} // Disable the button while signing up
        >
          {buttonText} {/* Dynamic button text */}
        </button>
        <p>
          Already Have An Account?
          <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
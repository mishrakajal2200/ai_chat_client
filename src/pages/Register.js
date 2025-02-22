
// // import { useState } from "react";
// // import axios from 'axios';
// // import { ToastContainer, toast } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";
// // import { Link,useNavigate } from "react-router-dom";

// // const Register = () => {
// //   const navigate = useNavigate();
// //   const [formData, setFormData] = useState({
// //     username: "",
// //     email: "",
// //     password: "",
// //     interests: [],
// //     interestInput: "", // Temporary input field for adding interests
// //     peerId:""
// //   });

// //   const handleChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   const handleInterestChange = (e) => {
// //     setFormData({ ...formData, interestInput: e.target.value });
// //   };

// //   const addInterest = () => {
// //     if (
// //       formData.interestInput &&
// //       !formData.interests.includes(formData.interestInput)
// //     ) {
// //       setFormData((prev) => ({
// //         ...prev,
// //         interests: [...prev.interests, prev.interestInput],
// //         interestInput: "", // Clear input field
// //       }));
// //     }
// //   };

// //   const removeInterest = (interest) => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       interests: prev.interests.filter((i) => i !== interest),
// //     }));
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
  
// //     try {
// //       const response = await axios.post("http://localhost:5000/api/auth/register", {
// //         username: formData.username,
// //         email: formData.email,
// //         password: formData.password,
// //         interests: formData.interests, // Send interests array
// //         peerId:formData.peerId
// //       });
  
// //       console.log("Response:", response.data);
// //       toast.success("Signup successful!", { position: "top-right" });

// //       // Save username and interests to localStorage
// //     localStorage.setItem("username", formData.username);
// //     localStorage.setItem("interests", JSON.stringify(formData.interests));

// //       navigate('/chat');
// //     } catch (error) {
// //       console.error("Error:", error.response?.data || error.message);

// //       toast.error("Signup failed! " + (error.response?.data?.message || "Try again."), {
// //         position: "top-right",
// //       });
// //     }
// //   };
// //   return (
// //     <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
// //       <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
// //       <ToastContainer/>
// //       <form onSubmit={handleSubmit} className="space-y-4">
// //         <input
// //           type="text"
// //           name="username"
// //           placeholder="Username"
// //           value={formData.username}
// //           onChange={handleChange}
// //           className="w-full p-2 border rounded-lg"
// //           required
// //         />
// //         <input
// //           type="email"
// //           name="email"
// //           placeholder="Email"
// //           value={formData.email}
// //           onChange={handleChange}
// //           className="w-full p-2 border rounded-lg"
// //           required
// //         />
// //         <input
// //           type="password"
// //           name="password"
// //           placeholder="Password"
// //           value={formData.password}
// //           onChange={handleChange}
// //           className="w-full p-2 border rounded-lg"
// //           required
// //         />

// //         {/* Interests Input Field */}
// //         <div>
// //           <p className="font-medium">Enter Interests:</p>
// //           <div className="flex gap-2 mt-2">
// //             <input
// //               type="text"
// //               value={formData.interestInput}
// //               onChange={handleInterestChange}
// //               className="w-full p-2 border rounded-lg"
// //               placeholder="Type an interest and press Add"
// //             />
// //             <button
// //               type="button"
// //               onClick={addInterest}
// //               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
// //             >
// //               Add
// //             </button>
// //           </div>

// //           {/* Display Added Interests */}
// //           <div className="mt-3 flex flex-wrap gap-2">
// //             {formData.interests.map((interest, index) => (
// //               <span
// //                 key={index}
// //                 className="bg-gray-200 px-3 py-1 rounded-full text-sm cursor-pointer"
// //                 onClick={() => removeInterest(interest)}
// //               >
// //                 {interest} ❌
// //               </span>
// //             ))}
// //           </div>
// //         </div>

// //         <button
// //           type="submit"
// //           className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition"
// //         >
// //           Sign Up
// //         </button>
// //         <p>Already Have An Account? <Link to='/'>Login</Link></p>
// //       </form>
// //     </div>
// //   );
// // };

// // export default Register;

// import { useState, useEffect } from "react";
// import axios from 'axios';
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Link, useNavigate } from "react-router-dom";

// const Register = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     interests: [],
//     interestInput: "",
//     peerId: "",  // Make sure it's properly set
//   });

//   // Simulate getting peerId (Replace with actual method if using WebRTC/PeerJS)
//   useEffect(() => {
//     const generatedPeerId = `peer-${Math.random().toString(36).substr(2, 9)}`;
//     console.log("Generated peerId:", generatedPeerId);  // Debugging
//     setFormData((prev) => ({ ...prev, peerId: generatedPeerId }));
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleInterestChange = (e) => {
//     setFormData({ ...formData, interestInput: e.target.value });
//   };

//   const addInterest = () => {
//     if (formData.interestInput && !formData.interests.includes(formData.interestInput)) {
//       setFormData((prev) => ({
//         ...prev,
//         interests: [...prev.interests, prev.interestInput],
//         interestInput: "",
//       }));
//     }
//   };

//   const removeInterest = (interest) => {
//     setFormData((prev) => ({
//       ...prev,
//       interests: prev.interests.filter((i) => i !== interest),
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Submitting Form Data:", formData); // Debugging

//     try {
//       const response = await axios.post("http://localhost:5000/api/auth/register", {
//         username: formData.username,
//         email: formData.email,
//         password: formData.password,
//         interests: formData.interests,
//         peerId: formData.peerId, // Ensure peerId is included
//       });

//       console.log("Response:", response.data);
//       toast.success("Signup successful!", { position: "top-right" });

//       // Save data to localStorage
//       localStorage.setItem("username", formData.username);
//       localStorage.setItem("interests", JSON.stringify(formData.interests));

//       navigate('/chat');
//     } catch (error) {
//       console.error("Error:", error.response?.data || error.message);
//       toast.error("Signup failed! " + (error.response?.data?.message || "Try again."), {
//         position: "top-right",
//       });
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
//       <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
//       <ToastContainer/>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           name="username"
//           placeholder="Username"
//           value={formData.username}
//           onChange={handleChange}
//           className="w-full p-2 border rounded-lg"
//           required
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           className="w-full p-2 border rounded-lg"
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           className="w-full p-2 border rounded-lg"
//           required
//         />

//         {/* Interests Input Field */}
//         <div>
//           <p className="font-medium">Enter Interests:</p>
//           <div className="flex gap-2 mt-2">
//             <input
//               type="text"
//               value={formData.interestInput}
//               onChange={handleInterestChange}
//               className="w-full p-2 border rounded-lg"
//               placeholder="Type an interest and press Add"
//             />
//             <button
//               type="button"
//               onClick={addInterest}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//             >
//               Add
//             </button>
//           </div>

//           {/* Display Added Interests */}
//           <div className="mt-3 flex flex-wrap gap-2">
//             {formData.interests.map((interest, index) => (
//               <span
//                 key={index}
//                 className="bg-gray-200 px-3 py-1 rounded-full text-sm cursor-pointer"
//                 onClick={() => removeInterest(interest)}
//               >
//                 {interest} ❌
//               </span>
//             ))}
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition"
//         >
//           Sign Up
//         </button>
//         <p>Already Have An Account? <Link to='/'>Login</Link></p>
//       </form>
//     </div>
//   );
// };

// export default Register;


import { useState, useEffect } from "react";
import Peer from "peerjs"; // Import PeerJS
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    interests: [],
    interestInput: "",
    peerId: "",
  });

  // Generate Peer ID on component mount
  useEffect(() => {
    const peer = new Peer();

    peer.on("open", (id) => {
      console.log("Generated Peer ID:", id);
      setFormData((prev) => ({ ...prev, peerId: id })); // 🔥 Update state
    });

    peer.on("error", (err) => {
      console.error("PeerJS Error:", err);
    });

    return () => peer.destroy(); // Cleanup PeerJS instance on unmount
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInterestChange = (e) => {
    setFormData({ ...formData, interestInput: e.target.value });
  };

  const addInterest = () => {
    if (
      formData.interestInput &&
      !formData.interests.includes(formData.interestInput)
    ) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, prev.interestInput],
        interestInput: "",
      }));
    }
  };

  const removeInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://ai-chat-app-2-eah1.onrender.com/api/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        interests: formData.interests,
        peerId: formData.peerId, // 🔥 Sending Peer ID
      });

      console.log("Response:", response.data);
      toast.success("Signup successful!", { position: "top-right" });

      localStorage.setItem("username", formData.username);
      localStorage.setItem("interests", JSON.stringify(formData.interests));

      navigate("/chat");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error("Signup failed! " + (error.response?.data?.message || "Try again."), {
        position: "top-right",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
      <ToastContainer />
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        />

        {/* Interests Input Field */}
        <div>
          <p className="font-medium">Enter Interests:</p>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={formData.interestInput}
              onChange={handleInterestChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Type an interest and press Add"
            />
            <button
              type="button"
              onClick={addInterest}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>

          {/* Display Added Interests */}
          <div className="mt-3 flex flex-wrap gap-2">
            {formData.interests.map((interest, index) => (
              <span
                key={index}
                className="bg-gray-200 px-3 py-1 rounded-full text-sm cursor-pointer"
                onClick={() => removeInterest(interest)}
              >
                {interest} ❌
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition"
        >
          Sign Up
        </button>
        <p>
          Already Have An Account? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;

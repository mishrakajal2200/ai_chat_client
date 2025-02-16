import { useEffect, useState } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/me'); // Replace with your API endpoint
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle error, e.g., display an error message
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <div>Loading...</div>; // Display a loading message while fetching data
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Example: Displaying user information */}
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {/* Add more fields as needed */}
        <p><strong>Bio:</strong> {user.bio}</p>  {/* Example: Bio field */}
        <img src={user.profilePicture} alt="Profile" /> {/*Example: Profile picture */}

      </div>
    </div>
  );
};

export default Profile;
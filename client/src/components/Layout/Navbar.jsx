// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Home, User, LogOut } from 'lucide-react';

// const Navbar = () => {
//   return (
//     <nav className="bg-teal-500 border-b border-gray-200 shadow-md p-4">
//       <div className="container mx-auto flex justify-between items-center">
//         <Link 
//           to="/" 
//           className="text-xl font-semibold text-white flex items-center space-x-2 hover:text-teal-700 transition-colors duration-300"
//         >
//           {/* <Home className="w-6 h-6" /> */}
//           <span>Signify</span>
//         </Link>
//         <div className="flex items-center space-x-4">
//           <Link 
//             to="/profile" 
//             className="flex items-center space-x-2 text-white-500 hover:text-teal-600 transition-colors duration-300 group"
//           >
//             <User className="w-5 h-5 text-white-500 group-hover:text-teal-600 transition-colors" />
//             <span className="text-sm font-medium">Profile</span>
//           </Link>
//           <Link 
//             to="/logout" 
//             className="flex items-center space-x-2 text-red-500 hover:text-red-600 transition-colors duration-300 group"
//           >
//             <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-600 transition-colors" />
//             <span className="text-sm font-medium">Logout</span>
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, User, LogOut } from 'lucide-react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const Navbar = () => {
  const [username, setUsername] = useState('');
  const auth = getAuth();

  // Listen to the authenticated user and retrieve their display name
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsername(user.displayName || 'User'); // Fallback to 'User' if no displayName is set
      } else {
        setUsername('');
      }
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [auth]);

  // Logout functionality
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('Successfully logged out');
      // Redirect to login page or home page after logout
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <nav className="bg-teal-500 border-b border-gray-200 shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link 
          to="/" 
          className="text-xl font-semibold text-white flex items-center space-x-2 hover:text-teal-700 transition-colors duration-300"
        >
          <span>Signify</span>
        </Link>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-white">
            <User className="w-5 h-5" />
            <span className="text-sm font-medium">{username}</span>
          </div>
          <button 
            onClick={handleLogout} 
            className="flex items-center space-x-2 text-red-500 hover:text-red-600 transition-colors duration-300 group"
          >
            <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-600 transition-colors" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

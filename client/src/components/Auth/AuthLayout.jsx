// import React from 'react';

// const AuthLayout = ({ children }) => {
//   return (
//     // <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-900 via-teal-300 to-teal-900">
//     <div className="min-h-screen flex items-center justify-center bg-teal-500">
//       <div className="p-4 w-full max-w-md">{children}</div>
//     </div>
//   );
// };

// export default AuthLayout;

// import React from 'react';
// import { motion } from 'framer-motion';

// const AuthLayout = ({ children }) => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-600 to-teal-900">
//       <motion.div 
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="min-h-screen flex items-center justify-center p-4"
//       >
//         <div className="w-full max-w-md">
//           {children}
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default AuthLayout;

import React from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AuthLayout = ({ children }) => {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-teal-600 to-teal-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-teal-500 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-teal-700 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex items-center justify-center p-4 relative z-10"
      >
        <div className="w-full max-w-md">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
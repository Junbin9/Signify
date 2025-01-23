// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Card, Input, Button, Typography } from '@material-tailwind/react';
// import { loginUser } from '../../utils/authAPI';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await loginUser(email, password);
//       response.token 
//         ? (localStorage.setItem('token', response.token), navigate('/dashboard')) 
//         : response.error && setError(response.error);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <Card shadow={true} className="p-8 w-full">
//       <Typography variant="h4" color="black" className="text-center font-bold mb-6">
//         Login
//       </Typography>
//       {error && <Typography color="red" className="text-center mb-4">{error}</Typography>}
//       <form className="space-y-6" onSubmit={handleLogin}>
//         <Input
//           type="email"
//           label="Email"
//           size="lg"
//           className="mb-4"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <Input
//           type="password"
//           label="Password"
//           size="lg"
//           className="mb-4"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <Button type="submit" className="w-full">
//           Sign In
//         </Button>
//       </form>
//       <Typography color="gray" className="text-center mt-6">
//         Don't have an account? <a href="/register" className="text-customGreen-500 hover:underline">Register</a>
//       </Typography>
//     </Card>
//   );
// };

// export default Login;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Card, Input, Button, Typography } from '@material-tailwind/react';
// import { loginUser } from '../../utils/authAPI';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await loginUser(email, password);
//       if (response.token) {
//         localStorage.setItem('token', response.token);
//         navigate('/dashboard');
//       } else if (response.error) {
//         setError(response.error);
//       }
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <Card shadow={true} className="overflow-hidden">
//         {/* Logo Section */}
//         <div className="p-8 text-center bg-teal-50">
//           <motion.div
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ delay: 0.2 }}
//             className="mb-4"
//           >
//             {/* <svg 
//               className="w-16 h-16 mx-auto text-teal-600" 
//               fill="none" 
//               viewBox="0 0 24 24" 
//               stroke="currentColor"
//             >
//               <path 
//                 strokeLinecap="round" 
//                 strokeLinejoin="round" 
//                 strokeWidth={2} 
//                 d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
//               />
//             </svg> */}
//             <div className="w-20 h-20 mx-auto">
//               <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
//                 <circle cx="100" cy="100" r="90" fill="#0d9488" opacity="0.1"/>
//                 <path 
//                   d="M140 60 L95 105 L90 110 L85 125 L100 120 L105 115 L150 70 Z" 
//                   fill="#0d9488"
//                   stroke="#0d9488"
//                   stroke-width="2"
//                 />
//                 <path 
//                   d="M150 70 L140 60 L155 45 L165 55 Z" 
//                   fill="#134e4a"
//                   stroke="#134e4a"
//                   stroke-width="2"
//                 />
//                 <path 
//                   d="M60 125 Q80 115 100 125 Q120 135 140 125" 
//                   fill="none"
//                   stroke="#0d9488"
//                   stroke-width="4"
//                   stroke-linecap="round"
//                 />
//                 <circle cx="50" cy="125" r="4" fill="#134e4a"/>
//                 <circle cx="150" cy="125" r="4" fill="#134e4a"/>
//                 <path 
//                   d="M85 85 L85 65 L115 65 L115 85 L100 95 Z" 
//                   fill="none"
//                   stroke="#134e4a"
//                   stroke-width="3"
//                   opacity="0.6"
//                 />
//               </svg>
//             </div>
//           </motion.div>
//           <Typography variant="h3" className="text-teal-900 font-bold">
//             Signify
//           </Typography>
//           <Typography variant="small" className="text-teal-600 mt-2">
//             Secure e-Signature Solution
//           </Typography>
//         </div>

//         {/* Login Form */}
//         <div className="p-8">
//           {error && (
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               className="mb-4"
//             >
//               <Typography color="red" className="text-center p-4 bg-red-50 rounded-lg">
//                 {error}
//               </Typography>
//             </motion.div>
//           )}

//           <form className="space-y-6" onSubmit={handleLogin}>
//             <div>
//               <Typography variant="small" className="mb-2 font-medium">
//                 Email Address
//               </Typography>
//               <Input
//                 type="email"
//                 size="lg"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="!border-t-blue-gray-200 focus:!border-teal-500"
//                 labelProps={{
//                   className: "before:content-none after:content-none",
//                 }}
//                 placeholder="Enter your email"
//               />
//             </div>

//             <div>
//               <Typography variant="small" className="mb-2 font-medium">
//                 Password
//               </Typography>
//               <Input
//                 type="password"
//                 size="lg"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="!border-t-blue-gray-200 focus:!border-teal-500"
//                 labelProps={{
//                   className: "before:content-none after:content-none",
//                 }}
//                 placeholder="Enter your password"
//               />
//             </div>

//             <motion.div
//               whileHover={{ scale: 1.01 }}
//               whileTap={{ scale: 0.99 }}
//             >
//               <Button
//                 type="submit"
//                 className="w-full bg-teal-600 hover:bg-teal-700 transition-colors duration-200"
//                 size="lg"
//               >
//                 Sign In
//               </Button>
//             </motion.div>
//           </form>

//           <Typography color="gray" className="text-center mt-6">
//             Don't have an account?{' '}
//             <a 
//               href="/register" 
//               className="text-teal-600 hover:text-teal-700 font-medium hover:underline transition-all duration-200"
//             >
//               Register
//             </a>
//           </Typography>
//         </div>
//       </Card>
//     </motion.div>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Input, Button, Typography } from '@material-tailwind/react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { loginUser } from '../../utils/authAPI';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginUser(email, password);
      if (response.token) {
        // Success animation before navigation
        await new Promise(resolve => setTimeout(resolve, 1000));
        // localStorage.setItem('token', response.token);
        navigate('/dashboard');
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden backdrop-blur-sm bg-white/90">
        {/* Logo Section */}
        <div className="p-8 text-center bg-teal-50/50">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            {/* Insert your SVG logo here */}
            <div className="w-20 h-20 mx-auto">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="90" fill="#0d9488" opacity="0.1"/>
                <path 
                  d="M140 60 L95 105 L90 110 L85 125 L100 120 L105 115 L150 70 Z" 
                  fill="#0d9488"
                  stroke="#0d9488"
                  stroke-width="2"
                />
                <path 
                  d="M150 70 L140 60 L155 45 L165 55 Z" 
                  fill="#134e4a"
                  stroke="#134e4a"
                  stroke-width="2"
                />
                <path 
                  d="M60 125 Q80 115 100 125 Q120 135 140 125" 
                  fill="none"
                  stroke="#0d9488"
                  stroke-width="4"
                  stroke-linecap="round"
                />
                <circle cx="50" cy="125" r="4" fill="#134e4a"/>
                <circle cx="150" cy="125" r="4" fill="#134e4a"/>
                <path 
                  d="M85 85 L85 65 L115 65 L115 85 L100 95 Z" 
                  fill="none"
                  stroke="#134e4a"
                  stroke-width="3"
                  opacity="0.6"
                />
              </svg>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Typography variant="h3" className="text-teal-900 font-bold">
              Welcome to Signify
            </Typography>
            <Typography variant="small" className="text-teal-600 mt-2">
              Secure Digital Signatures Made Simple
            </Typography>
          </motion.div>
        </div>

        {/* Login Form */}
        <div className="p-8">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4"
              >
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <Typography color="red" className="text-sm">
                    {error}
                  </Typography>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email Field */}
            <motion.div
              animate={focusedField === 'email' ? { scale: 1.02 } : { scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Typography variant="small" className="mb-2 font-medium">
                Email Address
              </Typography>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-teal-500" />
                </div>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="pl-12 !border-t-blue-gray-200 focus:!border-teal-500"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  containerProps={{
                    className: "min-w-0",
                  }}
                  placeholder="Enter your email"
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              animate={focusedField === 'password' ? { scale: 1.02 } : { scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Typography variant="small" className="mb-2 font-medium">
                Password
              </Typography>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-teal-500" />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="pl-12 !border-t-blue-gray-200 focus:!border-teal-500"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  containerProps={{
                    className: "min-w-0",
                  }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-teal-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-teal-500" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Forgot Password Link */}
            {/* <div className="flex justify-end">
              <Typography
                as="a"
                href="/forgot-password"
                className="text-sm text-teal-600 hover:text-teal-700 transition-colors duration-200"
              >
                Forgot Password?
              </Typography>
            </div> */}

            {/* Submit Button */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 transition-colors duration-200"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  "Sign In"
                )}
              </Button>
            </motion.div>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <Typography color="gray">
              Don't have an account?{' '}
              <motion.a 
                href="/register" 
                className="text-teal-600 hover:text-teal-700 font-medium hover:underline transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Register
              </motion.a>
            </Typography>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default Login;
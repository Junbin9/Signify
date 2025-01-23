// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Card, Input, Button, Typography } from '@material-tailwind/react';
// import { registerUser } from '../../utils/authAPI';

// const Register = () => {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await registerUser(username, email, password);
//       if (response.status === 201) {
//         navigate('/login');
//       }
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <Card shadow={true} className="p-8 w-full">
//       <Typography variant="h4" color="customGreen-600" className="text-center font-bold mb-6">
//         Register
//       </Typography>
//       {error && <Typography color="red" className="text-center mb-4">{error}</Typography>}
//       <form className="space-y-6" onSubmit={handleRegister}>
//         <Input
//           type="text"
//           label="Username"
//           size="lg"
//           className="mb-4"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />
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
//         <Button type="submit" color="customGreen" className="w-full">
//           Sign Up
//         </Button>
//       </form>
//       <Typography color="gray" className="text-center mt-6">
//         Already have an account? <a href="/login" className="text-customGreen-500 hover:underline">Login</a>
//       </Typography>
//     </Card>
//   );
// };

// export default Register;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Input, Button, Typography } from '@material-tailwind/react';
import { Eye, EyeOff, Mail, Lock, User, Check } from 'lucide-react';
import { registerUser } from '../../utils/authAPI';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [stage, setStage] = useState(0); // For success animation
  const navigate = useNavigate();

  const validatePassword = (pass) => {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters long" },
      { regex: /[0-9]/, text: "Contains a number" },
      { regex: /[a-z]/, text: "Contains a lowercase letter" },
      { regex: /[A-Z]/, text: "Contains an uppercase letter" },
      { regex: /[^A-Za-z0-9]/, text: "Contains a special character" }
    ];
    return requirements.map(req => ({
      ...req,
      met: req.regex.test(pass)
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Check if all password requirements are met
    const passwordValidation = validatePassword(password);
    const isPasswordValid = passwordValidation.every(req => req.met);
    
    if (!isPasswordValid) {
      setError('Please ensure all password requirements are met');
      return;
    }
    
    setLoading(true);
    setError('');
  
    try {
      const response = await registerUser(username, email, password);
      if (response.status === 201) {
        setStage(1);
        await new Promise(resolve => setTimeout(resolve, 1500));
        // localStorage.setItem('token', response.token);
        navigate('/login');
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
        {/* Header Section */}
        <div className="p-8 text-center bg-teal-50/50">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            {/* Insert your logo SVG here */}
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
              Join Signify
            </Typography>
            <Typography variant="small" className="text-teal-600 mt-2">
              Create your account to get started
            </Typography>
          </motion.div>
        </div>

        {/* Registration Form */}
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

          <form className="space-y-6" onSubmit={handleRegister}>
            {/* Username Field */}
            <motion.div
              animate={focusedField === 'username' ? { scale: 1.02 } : { scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Typography variant="small" className="mb-2 font-medium">
                Username
              </Typography>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-teal-500" />
                </div>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  className="pl-12 !border-t-blue-gray-200 focus:!border-teal-500"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  placeholder="Choose a username"
                />
              </div>
            </motion.div>

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
                  placeholder="Create a password"
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

              {/* Password Requirements */}
              {password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 space-y-2"
                >
                  {validatePassword(password).map((req, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`text-sm ${req.met ? 'text-green-500' : 'text-gray-400'}`}
                      >
                        {req.met ? <Check size={16} /> : '○'}
                      </motion.div>
                      <Typography variant="small" color={req.met ? 'green' : 'gray'}>
                        {req.text}
                      </Typography>
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 transition-colors duration-200"
                size="lg"
                disabled={loading || stage === 1}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : stage === 1 ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center justify-center"
                  >
                    <Check className="mr-2" /> Registration Successful
                  </motion.div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </motion.div>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <Typography color="gray">
              Already have an account?{' '}
              <motion.a 
                href="/login" 
                className="text-teal-600 hover:text-teal-700 font-medium hover:underline transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.a>
            </Typography>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default Register;

// import React, { useState, useEffect } from 'react';
// import { Input, Button, Typography, Dialog, DialogHeader, DialogBody, DialogFooter } from '@material-tailwind/react';
// import { updateSignature } from '../../../utils/signAPI';
// import { Pencil, X } from 'lucide-react';

// const SignatureEdit = ({ isOpen, onClose, signature, refreshSignatures, clearEditing }) => {
//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (signature) {
//       setPreview(signature.url);
//     }
//   }, [signature]);

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//       setPreview(URL.createObjectURL(selectedFile));
//       setError('');
//     } else {
//       setError('Please select a file.');
//     }
//   };

//   const handleUpdate = async () => {
//     if (!file) {
//       setError('No file selected');
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       await updateSignature(signature.file_id, file, token);
//       refreshSignatures();
//       clearEditing();
//     } catch (error) {
//       setError('Failed to update file');
//     }
//   };

// //   return (
// //     <Card className="p-6 bg-white rounded shadow-lg">
// //       <Typography variant="h5" color="customGreen-600" className="mb-4">Edit Signature</Typography>
// //       {error && <Typography color="red" className="mb-4">{error}</Typography>}
// //       <Input type="file" onChange={handleFileChange} className="mb-4" />
// //       {preview && (
// //         <div className="mb-4">
// //           <Typography color="gray" className="mb-2">Preview:</Typography>
// //           <img src={preview} alt="Signature Preview" className="mx-auto border p-2 max-w-full" />
// //         </div>
// //       )}
// //       <div className="flex justify-end">
// //         <Button onClick={handleUpdate} color="customGreen">Update</Button>
// //         <Button onClick={clearEditing} color="gray" className="ml-4">Cancel</Button>
// //       </div>
// //     </Card>
// //   );
// // };

// // return (
// //   <Card className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mt-6">
// //     <div className="flex items-center justify-between mb-4">
// //       <div className="flex items-center">
// //         <PencilIcon className="h-6 w-6 text-blue-500 mr-2" />
// //         <Typography variant="h5" color="blue" className="font-bold">
// //           Edit Signature
// //         </Typography>
// //       </div>
// //       <Button 
// //         variant="text" 
// //         color="gray" 
// //         onClick={clearEditing}
// //         className="p-2"
// //       >
// //         <XMarkIcon className="h-5 w-5" />
// //       </Button>
// //     </div>

// //     {error && (
// //       <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4">
// //         {error}
// //       </div>
// //     )}

// //     <Input 
// //       type="file" 
// //       onChange={handleFileChange} 
// //       className="file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 file:px-4 file:py-2 hover:file:bg-blue-100 mb-4"
// //     />

// //     {preview && (
// //       <div className="mb-4 border-2 border-dashed border-blue-100 p-4 rounded-lg">
// //         <Typography color="gray" className="mb-2 text-center">Preview</Typography>
// //         <img 
// //           src={preview} 
// //           alt="Signature Preview" 
// //           className="mx-auto max-h-48 object-contain rounded-lg shadow-md" 
// //         />
// //       </div>
// //     )}

// //     <div className="flex justify-end space-x-4">
// //       <Button 
// //         onClick={handleUpdate} 
// //         color="blue" 
// //         className="flex items-center space-x-2"
// //         disabled={!file}
// //       >
// //         <PencilIcon className="h-5 w-5" />
// //         <span>Update</span>
// //       </Button>
// //       <Button 
// //         onClick={clearEditing} 
// //         color="gray" 
// //         variant="outlined"
// //       >
// //         Cancel
// //       </Button>
// //     </div>
// //   </Card>
// // );
// return (
//   <Dialog open={isOpen} handler={onClose} className="p-6 rounded-xl">
//     <div className="flex items-center justify-between mb-4">
//       <div className="flex items-center">
//         <Pencil className="h-6 w-6 text-teal-500 mr-2" />
//         <Typography variant="h5" color="teal" className="font-bold">
//           Edit Signature
//         </Typography>
//       </div>
//       <Button
//         variant="text"
//         color="gray"
//         onClick={onClose}
//         className="p-2"
//       >
//         <X className="h-5 w-5" />
//       </Button>
//     </div>

//     {error && (
//       <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4">
//         {error}
//       </div>
//     )}

//     <DialogBody className="flex flex-col gap-4">
//       <Input
//         type="file"
//         onChange={handleFileChange}
//         className="file:mr-4 file:rounded-full file:border-0 file:bg-teal-50 file:text-teal-500 file:px-4 hover:file:bg-teal-100"
//       />

//       {preview && (
//         <div className="mb-4 border-2 border-dashed border-blue-100 p-4 rounded-lg">
//           <Typography color="gray" className="mb-2 text-center">
//             Preview
//           </Typography>
//           <img
//             src={preview}
//             alt="Signature Preview"
//             className="mx-auto max-h-48 object-contain rounded-lg shadow-md"
//           />
//         </div>
//       )}
//     </DialogBody>

//     <DialogFooter className="flex justify-end space-x-4">
//       <Button
//         onClick={handleUpdate}
//         color="teal"
//         className="flex items-center space-x-2"
//         disabled={!file}
//       >
//         <Pencil className="h-5 w-5" />
//         <span>Update</span>
//       </Button>
//       <Button
//         onClick={onClose}
//         color="gray"
//         variant="outlined"
//       >
//         Cancel
//       </Button>
//     </DialogFooter>
//   </Dialog>
// );
// };

// export default SignatureEdit;

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
  Progress,
  Alert,
} from '@material-tailwind/react';
import { Pencil, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { updateSignature } from '../../../utils/signAPI';

const SignatureEdit = ({ isOpen, onClose, signature, refreshSignatures, clearEditing }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];

  useEffect(() => {
    if (signature) {
      setPreview(signature.url);
    }
  }, [signature]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) {
      setError('Please select a file.');
      return;
    }

    if (!validImageTypes.includes(selectedFile.type)) {
      setError('Please upload a valid image file (PNG, JPEG, JPG, or SVG).');
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setError('');
  };

  const handleFileChange = (e) => {
    validateAndSetFile(e.target.files[0]);
  };

  const simulateUploadProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        refreshSignatures();
        clearEditing();
      }
    }, 100);
  };

  const handleUpdate = async () => {
    if (!file) {
      setError('No file selected');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      const token = localStorage.getItem('token');
      await updateSignature(signature.file_id, file, token);
      simulateUploadProgress();
    } catch (error) {
      setError('Failed to update signature');
      setIsUploading(false);
    }
  };

  const fileInputRef = React.useRef(null);

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog
      open={isOpen}
      handler={onClose}
      size="sm"
      className="bg-white shadow-none"
    >
      <DialogHeader className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {/* <Pencil className="h-5 w-5 text-teal-500" /> */}
          <Typography variant="h5" color="teal" className="font-bold">
            Edit Signature
          </Typography>
        </div>
        <Typography variant="small" color="gray" className="font-normal">
          Upload a new signature image to replace the current one
        </Typography>
      </DialogHeader>

      <DialogBody divider className="space-y-4">
        {error && (
          <Alert
            color="red"
            variant="outlined"
            className="flex items-center gap-2"
            icon={
              <AlertCircle className="h-4 w-4" />
            }
          >
            {error}
          </Alert>
        )}

        <div className="mb-4 border-2 border-dashed border-teal-100 p-4 rounded-lg">
          <Typography color="gray" className="mb-2 text-center font-medium">
            Current Signature
          </Typography>
          <img
            src={signature.signatureUrl}
            alt="Current Signature"
            className="mx-auto max-h-32 object-contain rounded-lg shadow-sm"
          />
        </div>

        <div
          onClick={handleClickUpload}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center
            transition-colors duration-200 ease-in-out
            ${isDragging ? 'border-teal-500 bg-teal-50' : 'border-gray-300'}
            ${!file ? 'cursor-pointer hover:border-teal-400' : ''}
          `}
        >
          {!file ? (
            <div className="space-y-3">
              <div className="flex justify-center">
                <ImageIcon className="h-10 w-10 text-teal-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <span className="text-teal-500 hover:text-teal-700 cursor-pointer">
                    Select new image
                  </span>
                  {' or drag and drop'}
                </label>
                <p className="text-xs text-gray-500 mt-1">PNG, JPEG, JPG, or SVG</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".png,.jpg,.jpeg,.svg"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative group">
                <img
                  src={preview}
                  alt="New Signature Preview"
                  className="mx-auto max-h-32 object-contain rounded-lg shadow-md"
                />
                <Button
                  variant="text"
                  color="gray"
                  size="sm"
                  onClick={() => setFile(null)}
                  className="absolute -top-2 -right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Typography variant="small" color="gray" className="text-center">
                New: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </Typography>
            </div>
          )}
        </div>

        {isUploading && (
          <div className="space-y-2">
            <Progress value={uploadProgress} size="sm" color="teal" />
            <Typography
              variant="small"
              color="gray"
              className="text-center"
            >
              Updating... {uploadProgress}%
            </Typography>
          </div>
        )}
      </DialogBody>

      <DialogFooter className="space-x-2">
        <Button
          variant="text"
          color="gray"
          onClick={onClose}
          disabled={isUploading}
        >
          Cancel
        </Button>
        <Button
          variant="filled"
          color="teal"
          onClick={handleUpdate}
          disabled={!file || isUploading}
          className="flex items-center gap-2"
        >
          <Pencil className="h-4 w-4" />
          Update
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default SignatureEdit;
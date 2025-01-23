// import React, { useState } from 'react';
// import {
//   Input,
//   Button,
//   Typography,
//   Dialog,
//   DialogHeader,
//   DialogBody,
//   DialogFooter,
// } from '@material-tailwind/react';
// import { uploadDocument } from '../../../utils/docAPI';

// const DocumentUpload = ({ isOpen, onClose, refreshDocuments }) => {
//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [error, setError] = useState('');
//   const [fileType, setFileType] = useState('');

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       const fileType = selectedFile.type;
//       setFile(selectedFile);
//       setFileType(fileType);

//       if (fileType.startsWith('image/')) {
//         // Generate image preview
//         setPreview(URL.createObjectURL(selectedFile));
//       } else if (fileType === 'application/pdf') {
//         // Generate PDF preview
//         setPreview(URL.createObjectURL(selectedFile));
//       } else {
//         // For unsupported file types
//         setPreview(null);
//       }

//       setError('');
//     } else {
//       setError('Please select a file.');
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       setError('No file selected');
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       await uploadDocument(file, token);
//       refreshDocuments();
//       onClose(); // Close the modal after success
//     } catch (error) {
//       setError('Failed to upload file');
//     }
//   };

//   return (
//     <Dialog open={isOpen} handler={onClose} size="sm">
//       <DialogHeader>
//         <Typography variant="h5" color="teal" className="font-bold">
//           Upload Document
//         </Typography>
//       </DialogHeader>
//       <DialogBody divider>
//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4">
//             {error}
//           </div>
//         )}

//         <div className="mb-4">
//           <Input
//             type="file"
//             onChange={handleFileChange}
//             className="file:mr-4 file:rounded-full file:border-0 file:bg-teal-50 file:text-teal-500 file:px-4 hover:file:bg-teal-100"
//           />
//         </div>

//         {preview && (
//           <div className="mb-4 border-2 border-dashed border-green-100 p-4 rounded-lg">
//             <Typography color="gray" className="mb-2 text-center">
//               Preview
//             </Typography>
//             {fileType.startsWith('image/') ? (
//               <img
//                 src={preview}
//                 alt="Document Preview"
//                 className="mx-auto max-h-48 object-contain rounded-lg shadow-md"
//               />
//             ) : fileType === 'application/pdf' ? (
//               <embed
//                 src={preview}
//                 type="application/pdf"
//                 className="w-full h-48"
//               />
//             ) : (
//               <div className="text-center text-gray-500">
//                 No preview available for this file type
//               </div>
//             )}
//           </div>
//         )}
//       </DialogBody>
//       <DialogFooter>
//         <Button variant="text" color="red" onClick={onClose} className="mr-2">
//           Cancel
//         </Button>
//         <Button
//           onClick={handleUpload}
//           color="teal"
//           className="flex items-center justify-center space-x-2"
//           disabled={!file}
//         >
//           Upload
//         </Button>
//       </DialogFooter>
//     </Dialog>
//   );
// };

// export default DocumentUpload;

import React, { useState } from 'react';
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
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { uploadDocument } from '../../../utils/docAPI';

const DocumentUpload = ({ isOpen, onClose, refreshDocuments }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

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

    if (selectedFile.type !== 'application/pdf') {
      setError('Only PDF files are allowed.');
      return;
    }

    setFile(selectedFile);
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
        refreshDocuments();
        onClose();
      }
    }, 100);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('No file selected');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      const token = localStorage.getItem('token');
      await uploadDocument(file, token);
      simulateUploadProgress();
    } catch (error) {
      setError('Failed to upload file');
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError('');
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
        <Typography variant="h5" color="teal" className="font-bold">
          Upload PDF Document
        </Typography>
        <Typography variant="small" color="gray" className="font-normal">
          Upload your PDF document here
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

        <div
          onClick={handleClickUpload}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center
            transition-colors duration-200 ease-in-out
            ${isDragging ? 'border-teal-500 bg-teal-50' : 'border-gray-300'}
            ${!file ? 'cursor-pointer hover:border-teal-400' : ''}
          `}
        >
          {!file ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <Upload className="h-12 w-12 text-teal-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <span className="text-teal-500 hover:text-teal-700 cursor-pointer">
                    Click to upload
                  </span>
                  {' or drag and drop'}
                </label>
                <p className="text-xs text-gray-500">PDF files only</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-teal-500" />
                  <div className="text-left">
                    <Typography variant="small" className="font-medium">
                      {file.name}
                    </Typography>
                    <Typography variant="small" color="gray" className="text-xs">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </Typography>
                  </div>
                </div>
                <Button
                  variant="text"
                  color="gray"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
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
              Uploading... {uploadProgress}%
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
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload PDF
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default DocumentUpload;

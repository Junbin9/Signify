// import React, { useState, useEffect } from 'react';
// import { Input, Button, Typography, Card } from '@material-tailwind/react';
// import { addWatermark } from '../../../utils/signAPI';

// const WatermarkUpload = ({ signatureId, refreshSignatures, clearEditing }) => {
//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (file) {
//       setPreview(file.url);
//     }
//   }, [file]);

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

//   const handleUpload = async () => {
//     if (!file) {
//       setError('Please select a watermark file to upload');
//       return;
//     }

//     try {
//       await addWatermark(signatureId, file);
//       refreshSignatures();
//       clearEditing();
//     } catch (error) {
//       setError('Failed to apply watermark');
//     }
//   };

//   return (
//     <Card className="p-6 bg-white rounded shadow-lg mt-6">
//       <Typography variant="h5" color="customGreen-600" className="mb-4">Upload Watermark</Typography>
//       {error && <Typography color="red" className="mb-4">{error}</Typography>}
//       <Input type="file" onChange={handleFileChange} className="mb-4" />
//       {preview && (
//         <div className="mb-4">
//           <Typography color="gray" className="mb-2">Preview:</Typography>
//           <img src={preview} alt="Watermark Preview" className="mx-auto border p-2 max-w-full" />
//         </div>
//       )}
//       <div className="flex justify-end">
//         <Button onClick={handleUpload} color="customGreen">Apply Watermark</Button>
//         <Button onClick={clearEditing} color="gray" className="ml-4">Cancel</Button>
//       </div>
//     </Card>
//   );
// };

// export default WatermarkUpload;

import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
  Progress,
  Alert,
  Input,
} from '@material-tailwind/react';
import { Upload, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { addWatermark } from '../../../utils/signAPI';

const WatermarkUpload = ({ isOpen, onClose, signatureId, refreshSignatures }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [watermarkText, setWatermarkText] = useState('');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
  const fileInputRef = useRef(null);

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
        onClose();
      }
    }, 100);
  };

  const handleApplyWatermark = async () => {
    if (!file && !watermarkText) {
      setError('Please provide either a watermark image or text');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      await addWatermark(signatureId, file, watermarkText);
      simulateUploadProgress();
    } catch (error) {
      setError('Failed to apply watermark');
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    setError('');
  };

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
          Apply Watermark
        </Typography>
        <Typography variant="small" color="gray" className="font-normal">
          Add a watermark image or text to your signature
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
                <ImageIcon className="h-12 w-12 text-teal-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <span className="text-teal-500 hover:text-teal-700 cursor-pointer">
                    Click to upload
                  </span>
                  {' or drag and drop'}
                </label>
                <p className="text-xs text-gray-500">PNG, JPEG, JPG, or SVG</p>
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
            <div className="space-y-4">
              <div className="relative group">
                <img
                  src={preview}
                  alt="Watermark Preview"
                  className="mx-auto max-h-48 object-contain rounded-lg shadow-md"
                />
                <Button
                  variant="text"
                  color="gray"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="absolute -top-2 -right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Typography variant="small" color="gray" className="text-center">
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </Typography>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Typography variant="small" color="gray" className="font-medium">
            Watermark Text
          </Typography>
          <Input
            type="text"
            placeholder="Enter watermark text (optional)"
            value={watermarkText}
            onChange={(e) => setWatermarkText(e.target.value)}
            className="!border-t-blue-gray-200 focus:!border-t-teal-500"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
        </div>

        {isUploading && (
          <div className="space-y-2">
            <Progress value={uploadProgress} size="sm" color="teal" />
            <Typography
              variant="small"
              color="gray"
              className="text-center"
            >
              Applying watermark... {uploadProgress}%
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
          onClick={handleApplyWatermark}
          disabled={(!file && !watermarkText) || isUploading}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Apply Watermark
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default WatermarkUpload;

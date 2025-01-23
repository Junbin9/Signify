// import React, { useEffect, useState } from 'react';
// import { Typography, Button, Card, Dialog, DialogHeader, DialogBody, DialogFooter } from '@material-tailwind/react';
// import { getSignatures, deleteSignature, addWatermark } from '../../../utils/signAPI';
// import { ref, getDownloadURL } from 'firebase/storage';
// import { storage } from '../../../config/firebaseConfig';
// import { 
//   Signature, 
//   Upload, 
//   Pencil, 
//   Trash2 
// } from 'lucide-react';
// import SignatureUpload from '../Signature/SignatureUpload';

// const SignatureList = ({ setEditingSignature, refreshSignatures, setShowEditModal }) => {
//   const [signatures, setSignatures] = useState([]);
//   const [error, setError] = useState('');
//   const [deleteConfirmation, setDeleteConfirmation] = useState(null);
//   const [showUploadModal, setShowUploadModal] = useState(false);

//   const fetchSignatures = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await getSignatures(token);

//       // const signaturesWithUrls = await Promise.all(
//       //   response.map(async (signature) => {
//       //     const signatureRef = ref(storage, `signatures/${signature.file_path}`);
//       //     const watermarkedSignatureRef = ref(storage, `watermarked_signatures/${signature.file_path}`);
//       //     const signatureUrl = await getDownloadURL(signatureRef);
//       //     const watermarkedSignatureUrl = await getDownloadURL(watermarkedSignatureRef);
//       //     return { ...signature, signatureUrl, watermarkedSignatureUrl };
//       //   })
//       // );

//       const signaturesWithUrls = await Promise.all(
//         response.map(async (signature) => {
//           const signatureRef = ref(storage, `signatures/${signature.file_path}`);
//           const watermarkedSignatureRef = ref(storage, `watermarked_signatures/${signature.file_path}`);
          
//           // Get the original signature URL
//           const signatureUrl = await getDownloadURL(signatureRef);
          
//           let watermarkedSignatureUrl = null; // Default value if the watermarked signature does not exist
//           try {
//             // Try to get the watermarked signature URL
//             watermarkedSignatureUrl = await getDownloadURL(watermarkedSignatureRef);
//           } catch (error) {
//             if (error.code === 'storage/object-not-found') {
//               console.warn(`Watermarked signature not found for path: ${signature.file_path}`);
//             } else {
//               console.error(`Error fetching watermarked signature: ${error.message}`);
//             }
//           }
          
//           return { ...signature, signatureUrl, watermarkedSignatureUrl };
//         })
//       );      

//       setSignatures(signaturesWithUrls);
//     } catch (error) {
//       setError('Failed to fetch signatures');
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const token = localStorage.getItem('token');
//       await deleteSignature(id, token);
//       fetchSignatures();
//     } catch (error) {
//       setError('Failed to delete signature');
//     }
//   };

//   const handleAddWatermark = async (id, file) => {
//     try {
//       await addWatermark(id, file);
//       refreshSignatures();
//     } catch (error) {
//       setError('Failed to add watermark');
//     }
//   };

//   useEffect(() => {
//     fetchSignatures();
//   }, [refreshSignatures]);

// return (
//   <Card className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
//     <div className="flex items-center justify-between mb-4">
//       <Typography variant="h5" color="teal" className="font-bold flex items-center gap-2">
//         <Signature className="h-6 w-6 text-teal-500" />
//         My Signatures
//       </Typography>
//       <Button 
//         variant="gradient" 
//         color="teal"
//         className="flex items-center gap-2"
//         onClick={() => setShowUploadModal(true)}
//       >
//         <Upload className="h-5 w-5" />
//         Upload New Signature
//       </Button>
//     </div>

//     {error && (
//       <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4">
//         {error}
//       </div>
//     )}

//     <div className="space-y-4">
//       {signatures.map((signature) => (
//         <div 
//           key={signature.file_id} 
//           className="flex items-center justify-between bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
//         >
//           <div className="flex items-center space-x-10">
//             <img 
//               src={signature.signatureUrl} 
//               alt="Signature" 
//               className="h-16 w-16 object-contain rounded-md shadow-sm" 
//             />
//             {signature.watermarkedSignatureUrl && (
//               <div className="flex items-end space-x-2">
//                 <img
//                   src={signature.watermarkedSignatureUrl}
//                   alt="Watermarked Signature"
//                   className="h-16 w-16 object-contain rounded-md shadow-sm" />
//                 <div className="bg-teal-500 text-white px-2 py-1 rounded-full text-xs">
//                     Watermarked
//                 </div>
//               </div>
//             )}
//           </div>
          
//           <div className="flex space-x-2">
//             <Button 
//               onClick={() => {setEditingSignature(signature); setShowEditModal(true);}} 
//               color="teal" 
//               variant="outlined"
//               className="flex items-center space-x-1"
//             >
//               <Pencil className="h-4 w-4" />
//               <span>Edit</span>
//             </Button>
//             <Button 
//               onClick={() => setDeleteConfirmation(signature)} 
//               color="red" 
//               variant="outlined"
//               className="flex items-center space-x-1"
//             >
//               <Trash2 className="h-4 w-4" />
//               <span>Delete</span>
//             </Button>
//           </div>
//         </div>
//       ))}
//     </div>

//     {showUploadModal && <SignatureUpload 
//       isOpen={showUploadModal}
//       onClose={() => setShowUploadModal(false)} 
//       refreshSignatures={refreshSignatures} 
//     />}

//     {deleteConfirmation && (
//       <Dialog open={!!deleteConfirmation} handler={() => setDeleteConfirmation(null)}>
//         <DialogHeader>Delete Signature?</DialogHeader>
//         <DialogBody>
//           Are you sure you want to delete this signature? This action cannot be undone.
//         </DialogBody>
//         <DialogFooter>
//           <Button 
//             variant="text" 
//             color="gray" 
//             onClick={() => setDeleteConfirmation(null)}
//             className="mr-4"
//           >
//             Cancel
//           </Button>
//           <Button 
//             color="red" 
//             onClick={() => {
//               handleDelete(deleteConfirmation.file_id);
//               setDeleteConfirmation(null);
//             }}
//           >
//             Confirm Delete
//           </Button>
//         </DialogFooter>
//       </Dialog>
//     )}
//   </Card>
// );
// };

// export default SignatureList;

import React, { useEffect, useState } from 'react';
import { Typography, Button, Card, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Tooltip } from '@material-tailwind/react';
import { getSignatures, deleteSignature, addWatermark } from '../../../utils/signAPI';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../config/firebaseConfig';
import {
  Signature,
  Upload,
  Pencil,
  Trash2,
  ShieldPlus,
  ShieldX,
  ShieldCheck,
  AlertTriangle,
  Info,
  Eye,
  EyeOff,
  Check,
  X,
  ImageIcon
} from 'lucide-react';
import SignatureUpload from '../Signature/SignatureUpload';

const SignatureList = ({ setEditingSignature, refreshSignatures, setShowEditModal }) => {
  const [signatures, setSignatures] = useState([]);
  const [error, setError] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showWatermarkModal, setShowWatermarkModal] = useState(false);
  const [selectedSignature, setSelectedSignature] = useState(null);
  const [watermarkFile, setWatermarkFile] = useState(null);
  const [watermarkText, setWatermarkText] = useState('');
  const [watermarkConfirmation, setWatermarkConfirmation] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showExtractionModal, setShowExtractionModal] = useState(false);
  const [extractionStatus, setExtractionStatus] = useState('idle'); // idle, extracting, complete, error
  const [selectedWatermarkedSignature, setSelectedWatermarkedSignature] = useState(null);
  const [extractedData, setExtractedData] = useState(null);

  const fetchSignatures = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await getSignatures(token);

      const signaturesWithUrls = await Promise.all(
        response.map(async (signature) => {
          const signatureRef = ref(storage, `signatures/${signature.file_path}`);
          const watermarkedSignatureRef = ref(storage, `watermarked_signatures/${signature.file_path}`);
          const watermarkImageRef = ref(storage, `watermark_images/${signature.file_path}`);
          const signatureUrl = await getDownloadURL(signatureRef);

          let watermarkedSignatureUrl = null;
          let watermarkImageUrl = null;
          try {
            watermarkedSignatureUrl = await getDownloadURL(watermarkedSignatureRef);
            watermarkImageUrl = await getDownloadURL(watermarkImageRef);
          } catch (error) {
            if (error.code === 'storage/object-not-found') {
              console.warn(`Watermarked signature not found for path: ${signature.file_path}`);
              console.warn(`Watermark image not found for path: ${signature.file_path}`);
            } else {
              console.error(`Error fetching watermarked signature: ${error.message}`);
              console.error(`Error fetching watermark image: ${error.message}`);
            }
          }

          return { ...signature, signatureUrl, watermarkedSignatureUrl, watermarkImageUrl };
        })
      );

      console.log(signaturesWithUrls);
      setSignatures(signaturesWithUrls);
    } catch (error) {
      setError('Failed to fetch signatures');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await deleteSignature(id, token);
      fetchSignatures();
    } catch (error) {
      setError('Failed to delete signature');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setWatermarkFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleAddWatermark = async () => {
    try {
      if (!watermarkFile || !watermarkText || !selectedSignature) {
        setError('Please provide all required inputs for watermarking');
        return;
      }

      await addWatermark(selectedSignature.file_path, watermarkFile, watermarkText);
      setShowWatermarkModal(false);
      setWatermarkFile(null);
      setWatermarkText('');
      setSelectedSignature(null);
      setPreviewUrl(null);
      setShowPreview(false);
      refreshSignatures();
    } catch (error) {
      setError('Failed to add watermark');
    }
  };

  const handleExtractWatermark = async (signature) => {
    try {
      setSelectedWatermarkedSignature(signature);
      setShowExtractionModal(true);
      setExtractionStatus('extracting');

      // Simulate API call to extract watermark (replace with actual API call)
      // const extractedWatermark = await extractWatermark(signature.file_path);
      
      setExtractedData({
        watermarkImage: signature.watermarkImageUrl,
        watermarkText: signature.watermark_text,
      });
      
      setExtractionStatus('complete');
    } catch (error) {
      setExtractionStatus('error');
      setError('Failed to extract watermark');
    }
  };

  useEffect(() => {
    fetchSignatures();
  }, [refreshSignatures]);

  return (
    <Card className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <Typography variant="h5" color="teal" className="font-bold flex items-center gap-2">
          <Signature className="h-6 w-6 text-teal-500" />
          My Signatures
        </Typography>
        <Button
          variant="gradient"
          color="teal"
          className="flex items-center gap-2"
          onClick={() => setShowUploadModal(true)}
        >
          <Upload className="h-5 w-5" />
          Upload New Signature
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {signatures.map((signature) => (
    <div
      key={signature.file_id}
      className="flex items-center justify-between bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-center space-x-10">
        <img
          src={signature.signatureUrl}
          alt="Signature"
          className="h-16 w-16 object-contain rounded-md shadow-sm"
        />
        {signature.watermarkedSignatureUrl && (
          <div className="flex items-end space-x-2">
            <img
              src={signature.watermarkedSignatureUrl}
              alt="Watermarked Signature"
              className="h-16 w-16 object-contain rounded-md shadow-sm"
            />
            <div className="bg-teal-500 text-white px-2 py-1 rounded-full text-xs">
              Watermarked
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        {!signature.watermarkedSignatureUrl ? (
          <Button
            onClick={() => {
              setSelectedSignature(signature);
              setShowWatermarkModal(true);
            }}
            color="teal"
            variant="filled"
            className="flex items-center space-x-1"
          >
            <ShieldX className="h-4 w-4" />
            <span>Watermark</span>
          </Button>
        ) : (
          <Button
            onClick={() => handleExtractWatermark(signature)}
            color="teal"
            variant="filled"
            className="flex items-center space-x-1"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Watermark</span>
          </Button>
        )}
              <Button
                onClick={() => {
                  setEditingSignature(signature);
                  setShowEditModal(true);
                }}
                color="teal"
                variant="outlined"
                className="flex items-center space-x-1"
              >
                <Pencil className="h-4 w-4" />
                <span>Edit</span>
              </Button>
              <Button
                onClick={() => setDeleteConfirmation(signature)}
                color="red"
                variant="outlined"
                className="flex items-center space-x-1"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {showUploadModal && (
        <SignatureUpload
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          refreshSignatures={refreshSignatures}
        />
      )}

{showWatermarkModal && (
  <Dialog 
    open={showWatermarkModal} 
    handler={() => setShowWatermarkModal(false)}
    size="md"
    className="bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto"
  >
    {/* Header */}
    <div className="p-4 md:p-6 border-b border-gray-100 sticky top-0 bg-teal-50 z-10">
      <h3 className="text-xl font-semibold text-teal-600">Protect your signature with a custom watermark</h3>
      <p className="text-sm text-gray-600 mt-1">
        Upload your watermark image and text
      </p>
    </div>

    {/* Body */}
    <div className="p-4 md:p-6 space-y-6">
      {/* Selected Signature Preview */}
      {selectedSignature && (
        <div className="bg-gray-50 p-4 rounded-lg flex justify-center items-center">
          <div>
            <p className="text-sm text-gray-600 mb-2 text-center">Selected Signature</p>
            <img
              src={selectedSignature.signatureUrl}
              alt="Selected signature"
              className="h-24 object-contain bg-white p-2 border border-gray-200 rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Watermark Image Upload */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-gray-700">Watermark Image</span>
          <Tooltip content="Upload a transparent PNG image for best results">
            <Info className="h-4 w-4 text-gray-400 cursor-help" />
          </Tooltip>
        </div>

        <div 
          className={`border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-teal-500 transition-colors relative ${
            watermarkFile ? 'p-0' : ''
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add('border-teal-500');
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove('border-teal-500');
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove('border-teal-500');
            const file = e.dataTransfer.files[0];
            if (file) {
              const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
              const fileType = file.type;

              if (!validTypes.includes(fileType)) {
                setError('Please upload a PNG, JPEG, JPG, or SVG file');
                return;
              }

              setWatermarkFile(file);
              setPreviewUrl(URL.createObjectURL(file));
            }
          }}
        >
          {!previewUrl ? (
            <label className="cursor-pointer w-full h-full block">
              <div className="space-y-2">
                <ImageIcon className="h-6 w-6 mx-auto text-teal-400" />
                <p>
                  <span className='text-sm text-teal-600 hover:underline'>Click to upload</span>
                  <span className='text-sm text-gray-600'> or drag and drop</span>
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPEG, JPG or SVG
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".png,.jpg,.jpeg,.svg"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setWatermarkFile(file);
                    setPreviewUrl(URL.createObjectURL(file));
                  }
                }}
              />
            </label>
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <img
                src={previewUrl}
                alt="Watermark preview"
                className="max-h-32 object-contain rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* Watermark Text Input */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-gray-700">Watermark Text</span>
          <Tooltip content="This text will be embedded along with the image">
            <Info className="h-4 w-4 text-gray-400 cursor-help" />
          </Tooltip>
        </div>
        <Input
          type="text"
          value={watermarkText}
          onChange={(e) => setWatermarkText(e.target.value)}
          placeholder="Enter watermark text"
          className="!border-gray-200 focus:!border-teal-500"
          labelProps={{
            className: "hidden",
          }}
        />
      </div>

      {/* Requirements Check */}
      <div className="space-y-2">
        <RequirementCheck 
          met={watermarkText.trim().length > 0}
          text="Text is not empty"
        />
        <RequirementCheck 
          met={watermarkFile !== null}
          text="Watermark image selected"
        />
      </div>

      {/* Tips Section */}
      <div className="bg-blue-50 rounded-lg p-4">
        <p className="text-sm text-blue-800 mb-2 font-medium">
          💡 Tips for best results:
        </p>
        <ul className="text-sm text-blue-700 space-y-1 ml-5 list-disc">
          <li>Use transparent PNG images for the best watermark results</li>
          <li>Keep the watermark text concise for better visibility</li>
          <li>The watermark process cannot be undone once applied</li>
        </ul>
      </div>
    </div>

    {/* Footer */}
    <div className="p-4 md:p-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white z-10">
      <Button
        variant="text"
        color="gray"
        onClick={() => setShowWatermarkModal(false)}
        className="font-normal"
      >
        Cancel
      </Button>
      <Button
        color="teal"
        onClick={() => setWatermarkConfirmation(selectedSignature)}
        disabled={!watermarkFile || !watermarkText.trim()}
        className="flex items-center gap-2 disabled:opacity-50"
      >
        <ShieldPlus className="h-4 w-4" />
        Apply Watermark
      </Button>
    </div>
  </Dialog>
)}

      {watermarkConfirmation && (
        <Dialog 
          open={!!watermarkConfirmation} 
          handler={() => setWatermarkConfirmation(null)}
          className="bg-white rounded-xl shadow-2xl"
          size="md"
        >
          <DialogHeader className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 bg-amber-50">
            <div className="bg-amber-100 p-2 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <Typography variant="h5" className="text-gray-900 font-semibold">
                Confirm Watermark Application
              </Typography>
              <Typography variant="small" className="text-amber-600 font-normal mt-1">
                This action is permanent and cannot be undone
              </Typography>
            </div>
          </DialogHeader>
          
          <DialogBody className="px-6 py-8">
            <div className="space-y-6">
              {/* Warning Message */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <Typography className="text-amber-800 text-sm leading-relaxed">
                  <span className="font-semibold block mb-2">⚠️ Important Notice:</span>
                  Once a watermark is applied to your signature:
                  <ul className="list-disc ml-5 mt-2 space-y-1">
                    <li>The process cannot be reversed</li>
                    <li>Additional watermarks cannot be added</li>
                    <li>The original signature will be permanently modified</li>
                  </ul>
                </Typography>
              </div>

              {/* Current Status */}
              {watermarkConfirmation.watermarkedSignatureUrl ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <Typography className="text-red-700 text-sm flex items-center gap-2">
                    <X className="h-5 w-5" />
                    This signature already has a watermark applied
                  </Typography>
                </div>
              ) : (
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                  <Typography className="text-teal-700 text-sm flex items-center gap-2">
                    <Check className="h-5 w-5" />
                    Signature is ready for watermark application
                  </Typography>
                </div>
              )}
            </div>
          </DialogBody>
          
          <DialogFooter className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
            <Button 
              variant="text" 
              color="gray"
              onClick={() => setWatermarkConfirmation(null)}
              className="font-normal"
            >
              Cancel
            </Button>
            <Button 
              color="teal"
              onClick={() => {
                handleAddWatermark(watermarkConfirmation);
                setWatermarkConfirmation(null);
              }}
              disabled={!!watermarkConfirmation.watermarkedSignatureUrl}
              className="flex items-center gap-2"
            >
              <ShieldPlus className="h-4 w-4" />
              Confirm & Apply
            </Button>
          </DialogFooter>
        </Dialog>
      )}

      {deleteConfirmation && (
  <Dialog open={!!deleteConfirmation} handler={() => setDeleteConfirmation(null)} className="rounded-lg shadow-xl">
    <DialogHeader className="flex items-center gap-2 text-red-600">
      <Trash2 className="h-6 w-6" />
      Delete Signature?
    </DialogHeader>
    <DialogBody className="space-y-4">
      <div className="flex flex-col items-center">
        <img
          src={deleteConfirmation.signatureUrl}
          alt="Signature Preview"
          className="h-20 w-20 object-contain rounded-md shadow-md"
        />
        <p className="text-gray-600 text-center mt-2">
          Are you sure you want to delete the signature{' '}
          <strong>{deleteConfirmation.file_name || 'this signature'}</strong>?
          This action <span className="text-red-500 font-bold">cannot be undone</span>.
        </p>
      </div>
    </DialogBody>
    <DialogFooter className="flex justify-end space-x-4">
      <Button
        variant="text"
        color="gray"
        onClick={() => setDeleteConfirmation(null)}
        className="transition duration-300 hover:bg-gray-100"
      >
        Cancel
      </Button>
      <Button
        color="red"
        onClick={() => {
          handleDelete(deleteConfirmation.file_id);
          setDeleteConfirmation(null);
        }}
        className="bg-red-500 hover:bg-red-600 transition duration-300"
      >
        Confirm Delete
      </Button>
    </DialogFooter>
  </Dialog>
)}

{showExtractionModal && (
    <Dialog 
      open={showExtractionModal} 
      handler={() => {
        if (extractionStatus !== 'extracting') {
          setShowExtractionModal(false);
          setExtractionStatus('idle');
          setExtractedData(null);
        }
      }}
      size="md"
      className="bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto"
    >
      <div className="p-4 md:p-6 border-b border-gray-100 sticky top-0 bg-teal-50 z-10">
        <h3 className="text-xl font-semibold text-teal-600">Watermark Information</h3>
        <p className="text-sm text-gray-600 mt-1">
          View the watermark details for your signature
        </p>
      </div>

      <DialogBody className="p-4 md:p-6 space-y-6">
        {extractionStatus === 'extracting' ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mb-4"></div>
            <Typography className="text-gray-700">
              Extracting watermark information...
            </Typography>
          </div>
        ) : extractionStatus === 'complete' && extractedData ? (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <Typography variant="h6" className="text-gray-700 mb-4">
                Watermarked Signature Preview
              </Typography>
              <div className="flex justify-center">
                <img
                  src={selectedWatermarkedSignature.watermarkedSignatureUrl}
                  alt="Watermarked signature"
                  className="max-h-32 object-contain rounded-lg shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Typography variant="h6" className="text-gray-700 mb-2">
                  Watermark Image
                </Typography>
                <div className="bg-white border border-gray-200 rounded-lg p-4 flex justify-center">
                  <img
                    src={extractedData.watermarkImage}
                    alt="Watermark"
                    className="max-h-32 object-contain"
                  />
                </div>
              </div>

              <div>
                <Typography variant="h6" className="text-gray-700 mb-2">
                  Watermark Text
                </Typography>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <Typography className="text-gray-600">
                    {extractedData.watermarkText}
                  </Typography>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <Typography className="text-blue-700 text-sm">
                <span className="font-semibold">💡 Note:</span> This watermark has been permanently applied to your signature for protection.
              </Typography>
            </div>
          </div>
        ) : extractionStatus === 'error' ? (
          <div className="text-center py-8">
            <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <Typography className="text-red-600">
              Failed to extract watermark information. Please try again later.
            </Typography>
          </div>
        ) : null}
      </DialogBody>

      <DialogFooter className="p-4 md:p-6 border-t border-gray-100 flex justify-end gap-3">
        <Button
          variant="text"
          color="gray"
          onClick={() => {
            setShowExtractionModal(false);
            setExtractionStatus('idle');
            setExtractedData(null);
          }}
          disabled={extractionStatus === 'extracting'}
          className="font-normal"
        >
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  )}
    </Card>
  );
};

const RequirementCheck = ({ met, text }) => (
  <div className="flex items-center gap-2">
    {met ? (
      <Check className="h-4 w-4 text-green-500" />
    ) : (
      <X className="h-4 w-4 text-red-500" />
    )}
    <Typography className={`text-xs ${met ? 'text-green-700' : 'text-red-700'}`}>
      {text}
    </Typography>
  </div>
);

export default SignatureList;

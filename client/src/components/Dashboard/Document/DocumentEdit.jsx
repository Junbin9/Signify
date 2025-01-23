// import React, { useState, useEffect } from 'react';
// import { Input, Button, Typography, Card, Dialog, DialogHeader, DialogBody, DialogFooter } from '@material-tailwind/react';
// import { updateSignature } from '../../../utils/signAPI';
// import { Pencil, X } from 'lucide-react';

// const DocumentEdit = ({ isOpen, onClose, signature, refreshSignatures, clearEditing }) => {
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

// export default DocumentEdit;

import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  Typography,
  Button,
  Dialog,
  IconButton,
  Tooltip,
} from '@material-tailwind/react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../config/firebaseConfig';
import { getSignatures } from '../../../utils/signAPI';
import { PDFDocument } from 'pdf-lib';
import { Document, Page, pdfjs } from 'react-pdf';
import {
  Signature,
  FileSignature,
  Save,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import { updateDocument } from '../../../utils/docAPI';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const DocumentEdit = ({
  isOpen,
  onClose,
  document,
  refreshDocuments,
  clearEditing,
}) => {
  const [signatures, setSignatures] = useState([]);
  const [selectedSignature, setSelectedSignature] = useState(null);
  const [documentUrl, setDocumentUrl] = useState('');
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [signaturePositions, setSignaturePositions] = useState({});
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scale, setScale] = useState(1.0);
  const [activeSignature, setActiveSignature] = useState(null);
  const [signatureSize, setSignatureSize] = useState(20); // Default 20%
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });
  const [isPlacementMode, setIsPlacementMode] = useState(true);
  const [isDocumentSigned, setIsDocumentSigned] = useState(false);
  
  const pdfContainerRef = useRef(null);
  const pageRef = useRef(null);
  // Add new refs for tracking scroll position
  const containerScrollRef = useRef({ x: 0, y: 0 });

  // Fetch signatures and load document
  useEffect(() => {
    if (isOpen) {
      fetchSignatures();
      loadDocument();
    }
  }, [isOpen, document]);

  // Add useEffect to check document status when opened
  useEffect(() => {
    if (isOpen && document) {
      setIsDocumentSigned(document.signed || false);
    }
  }, [isOpen, document]);

  // Update page size effect to be more precise
  useEffect(() => {
    const updatePageSize = () => {
      if (pageRef.current) {
        const { width, height } = pageRef.current.getBoundingClientRect();
        setPageSize({ width, height });
      }
    };
    updatePageSize();
    window.addEventListener('resize', updatePageSize);
    return () => window.removeEventListener('resize', updatePageSize);
  }, [scale, pageNumber]);

  // Track scroll position
  useEffect(() => {
    const container = pdfContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      containerScrollRef.current = {
        x: container.scrollLeft,
        y: container.scrollTop
      };
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchSignatures = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await getSignatures(token);
  
      const signaturesWithUrls = await Promise.all(
        response.map(async (signature) => {
          const watermarkedSignatureRef = ref(storage, `watermarked_signatures/${signature.file_path}`);
          let watermarkedSignatureUrl = null;
          try {
            watermarkedSignatureUrl = await getDownloadURL(watermarkedSignatureRef);
          } catch (error) {
            if (error.code === 'storage/object-not-found') {
              console.warn(`Watermarked signature not found for path: ${signature.file_path}`);
            } else {
              console.error(`Error fetching watermarked signature: ${error.message}`);
            }
          }
          return { ...signature, watermarkedSignatureUrl };
        })
      );
  
      // Filter out signatures without a valid watermarkedSignatureUrl
      const validSignatures = signaturesWithUrls.filter(
        (signature) => signature.watermarkedSignatureUrl !== null
      );
  
      setSignatures(validSignatures);
    } catch (error) {
      setError('Failed to fetch signatures');
    }
  };  

  const loadDocument = async () => {
    try {
      const documentRef = ref(storage, `documents/${document.file_path}`);
      const url = await getDownloadURL(documentRef);
      setDocumentUrl(url);
    } catch (error) {
      setError('Failed to load document');
    }
  };

  const handlePdfClick = (event) => {
    if (!selectedSignature || isDragging || !isPlacementMode) return;

    const container = pdfContainerRef.current;
    const page = pageRef.current;
    if (!container || !page) return;

    const pageRect = page.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Calculate position relative to page, accounting for scroll
    const x = (event.clientX + containerScrollRef.current.x - containerRect.left - pageRect.left) / pageRect.width;
    const y = (event.clientY + containerScrollRef.current.y - containerRect.top - pageRect.top) / pageRect.height;

    // Check if click is within page bounds
    if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
      setSignaturePositions(prev => ({
        ...prev,
        [pageNumber]: [...(prev[pageNumber] || []), { x, y }]
      }));
      setIsPlacementMode(false);
    }
  };

  const handleSignatureDragStart = (event, index) => {
    event.preventDefault();
    const page = pageRef.current;
    if (!page) return;

    const pageRect = page.getBoundingClientRect();
    const containerRect = pdfContainerRef.current.getBoundingClientRect();
    const positions = signaturePositions[pageNumber];
    const currentPos = positions[index];

    setActiveSignature(index);
    setIsDragging(true);
    setIsPlacementMode(false);

    // Calculate drag offset including scroll position
    setDragOffset({
      x: event.clientX + containerScrollRef.current.x - containerRect.left - (currentPos.x * pageRect.width),
      y: event.clientY + containerScrollRef.current.y - containerRect.top - (currentPos.y * pageRect.height)
    });
  };

  const handleSignatureMove = (event) => {
    if (!isDragging || activeSignature === null) return;

    const page = pageRef.current;
    const container = pdfContainerRef.current;
    if (!page || !container) return;

    const pageRect = page.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Calculate signature dimensions based on page size
    const signatureWidth = (pageRect.width * signatureSize) / 100;
    const signatureHeight = (signatureWidth * 0.3); // Assume 0.3 aspect ratio, adjust as needed

    // Calculate new position with scroll offset
    let x = (event.clientX + containerScrollRef.current.x - containerRect.left - dragOffset.x) / pageRect.width;
    let y = (event.clientY + containerScrollRef.current.y - containerRect.top - dragOffset.y) / pageRect.height;

    // Constrain signature within page bounds, accounting for signature size
    const marginX = (signatureWidth / 2) / pageRect.width;
    const marginY = (signatureHeight / 2) / pageRect.height;

    x = Math.max(marginX, Math.min(1 - marginX, x));
    y = Math.max(marginY, Math.min(1 - marginY, y));

    setSignaturePositions(prev => {
      const positions = [...(prev[pageNumber] || [])];
      positions[activeSignature] = { x, y };
      return { ...prev, [pageNumber]: positions };
    });
  };

  const handleSignatureDragEnd = () => {
    setActiveSignature(null);
    setIsDragging(false);
  };

  const handleDeleteSignature = (index) => {
    setSignaturePositions(prev => {
      const positions = [...(prev[pageNumber] || [])];
      positions.splice(index, 1);
      return { ...prev, [pageNumber]: positions };
    });
  };

  const handleSave = async () => {
    if (!selectedSignature || !documentUrl) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Download the original PDF document
      const documentResponse = await fetch(documentUrl);
      const documentBytes = await documentResponse.arrayBuffer();
      
      // Load the PDF document
      const pdfDoc = await PDFDocument.load(documentBytes);
      
      // Download the signature image
      const signatureResponse = await fetch(selectedSignature.watermarkedSignatureUrl);
      const signatureBlob = await signatureResponse.blob();
      const signatureType = signatureBlob.type.toLowerCase();
      
      // Convert SVG to PNG if necessary and get final image bytes
      let imageBytes;
      if (signatureType.includes('svg')) {
        imageBytes = await convertSvgToPng(signatureBlob);
      } else {
        imageBytes = await signatureBlob.arrayBuffer();
      }
      
      // Embed the image based on its type
      let signatureImage;
      try {
        if (signatureType.includes('png') || signatureType.includes('svg')) {
          signatureImage = await pdfDoc.embedPng(imageBytes);
        } else if (signatureType.includes('jpg') || signatureType.includes('jpeg')) {
          signatureImage = await pdfDoc.embedJpg(imageBytes);
        } else {
          throw new Error('Unsupported image format. Please use PNG, JPEG, or SVG.');
        }
      } catch (embedError) {
        console.error('Error embedding image:', embedError);
        throw new Error('Failed to embed signature image. Please ensure the image format is valid.');
      }
      
      // Get the dimensions of the signature image
      const { width: sigWidth, height: sigHeight } = signatureImage.scale(1);
      
      // Process each page that has signatures
      for (const [pageNumStr, positions] of Object.entries(signaturePositions)) {
        const pageNum = parseInt(pageNumStr);
        const page = pdfDoc.getPage(pageNum - 1);
        const { width: pageWidth, height: pageHeight } = page.getSize();
        
        for (const position of positions) {
          const targetWidth = (pageWidth * signatureSize) / 100;
          const scale = targetWidth / sigWidth;
          const targetHeight = sigHeight * scale;
          
          // Calculate position with proper scaling and centering
          const x = position.x * pageWidth - (targetWidth / 2);
          const y = pageHeight - (position.y * pageHeight) - (targetHeight / 2);
          
          // Ensure signature stays within page bounds
          const finalX = Math.max(0, Math.min(pageWidth - targetWidth, x));
          const finalY = Math.max(0, Math.min(pageHeight - targetHeight, y));
          
          page.drawImage(signatureImage, {
            x: finalX,
            y: finalY,
            width: targetWidth,
            height: targetHeight,
          });
        }
      }
      
      // Save the modified PDF
      const modifiedPdfBytes = await pdfDoc.save();
      
      // Convert to Blob
      const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      const file = new File([blob], `[signed] ${document.file_name}`, { type: 'application/pdf' });
      
      // // Create form data for upload
      // const formData = new FormData();
      // formData.append('file', file);
      // formData.append('document_id', document.file_id);
      
      // Upload the signed document
      const token = localStorage.getItem('token');
      const response = await updateDocument(document.file_id, file, token);

      // Update signed status
      setIsDocumentSigned(true);
      
      // Refresh the documents list and close the editor
      await refreshDocuments();
      clearEditing();
      onClose();
      
    } catch (error) {
      console.error('Error saving signed document:', error);
      setError('Failed to save signed document: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to convert SVG to PNG
  const convertSvgToPng = async (svgBlob) => {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      
      img.onload = () => {
        // Create canvas with proper dimensions
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw SVG on canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        // Convert to PNG
        canvas.toBlob(async (pngBlob) => {
          URL.revokeObjectURL(url);
          const pngBuffer = await pngBlob.arrayBuffer();
          resolve(pngBuffer);
        }, 'image/png');
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to convert SVG to PNG'));
      };
      
      img.src = url;
    });
  };

  return (
    <Dialog
      size="xl"
      open={isOpen}
      handler={onClose}
      className="bg-transparent shadow-none"
    >
      <Card className="mx-auto w-full max-w-[90%] h-[90vh] overflow-hidden flex flex-col bg-gray-50">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-teal-100">
          <div className="flex items-center gap-2">
            <FileSignature className="h-6 w-6 text-teal-500" />
            <Typography variant="h6" color="teal">
              {document.file_name}
            </Typography>
          </div>
          <IconButton
            variant="text"
            color="teal"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </IconButton>
        </div>

        {/* Signature Control Bar */}
        {selectedSignature && (
          <div className="px-4 py-3 bg-white border-b border-teal-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedSignature.watermarkedSignatureUrl}
                  alt="Selected Signature"
                  className="h-10 w-10 object-contain bg-gray-50 rounded p-1"
                />
                <Typography variant="small" color="gray">
                  {isPlacementMode ? 'Click to place signature' : 'Drag to adjust position'}
                </Typography>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <Typography variant="small" color="gray">
                    Size:
                  </Typography>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={signatureSize}
                    onChange={(e) => setSignatureSize(parseInt(e.target.value))}
                    className="w-24"
                  />
                  <Typography variant="small" color="gray">
                    {signatureSize}%
                  </Typography>
                </div>
                <Button
                  variant="text"
                  color="teal"
                  size="sm"
                  onClick={() => setIsPlacementMode(true)}
                  className="flex items-center gap-2"
                >
                  <Signature className="h-4 w-4" />
                  Place New
                </Button>
                <Button
                  variant="text"
                  color="red"
                  size="sm"
                  onClick={() => {
                    setSelectedSignature(null);
                    setSignaturePositions({});
                    setIsPlacementMode(true);
                  }}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Clear All
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {error && (
            <div className="m-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* PDF Viewer */}
          <div
            ref={pdfContainerRef}
            className="flex-1 relative bg-gray-100 overflow-auto"
            onClick={handlePdfClick}
            onMouseMove={handleSignatureMove}
            onMouseUp={handleSignatureDragEnd}
            onMouseLeave={handleSignatureDragEnd}
          >
            <div className="min-h-full flex justify-center p-4">
              <div ref={pageRef}>
                <Document
                  file={documentUrl}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  onLoadError={(error) => setError('Failed to load PDF')}
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    className="shadow-lg"
                  />
                
                {/* Placed Signatures */}
                {signaturePositions[pageNumber]?.map((pos, index) => (
                    <div
                      key={index}
                      className={`group absolute cursor-move transition-all ${
                        activeSignature === index ? 'ring-2 ring-teal-500 ring-offset-2' : ''
                      }`}
                      style={{
                        left: `${pos.x * 100}%`,
                        top: `${pos.y * 100}%`,
                        width: `${signatureSize}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      onMouseDown={(e) => handleSignatureDragStart(e, index)}
                    >
                      <div className="relative">
                        {/* Delete button */}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Button
                            size="sm"
                            color="red"
                            variant="filled"
                            className="px-2 py-1 flex items-center gap-1 shadow-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSignature(index);
                              setIsPlacementMode(true);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                            <span className="text-xs">Delete</span>
                          </Button>
                        </div>
                        
                        {/* Signature Image */}
                        <img
                          src={selectedSignature?.watermarkedSignatureUrl}
                          alt="Placed Signature"
                          className="w-full h-auto select-none"
                          draggable={false}
                        />
                      </div>
                    </div>
                  ))}
                </Document>
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="p-4 bg-white border-t border-teal-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Button
                  variant="outlined"
                  color="teal"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setShowSignatureDialog(true)}
                  disabled={loading || isDocumentSigned}
                >
                  <Signature className="h-4 w-4" />
                  Select Signature
                </Button>
                
                <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
                  <IconButton
                    variant="text"
                    color="teal"
                    size="sm"
                    onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </IconButton>
                  <Typography variant="small" color="gray" className="w-16 text-center">
                    {Math.round(scale * 100)}%
                  </Typography>
                  <IconButton
                    variant="text"
                    color="teal"
                    size="sm"
                    onClick={() => setScale(prev => Math.min(2, prev + 0.1))}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <IconButton
                    variant="text"
                    color="teal"
                    size="sm"
                    onClick={() => setPageNumber(prev => prev - 1)}
                    disabled={pageNumber <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </IconButton>
                  <Typography variant="small" color="gray" className="w-24 text-center">
                    Page {pageNumber} of {numPages}
                  </Typography>
                  <IconButton
                    variant="text"
                    color="teal"
                    size="sm"
                    onClick={() => setPageNumber(prev => prev + 1)}
                    disabled={pageNumber >= numPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </IconButton>
                </div>

                {isDocumentSigned ? (
                  <Button
                    variant="filled"
                    color="teal"
                    size="sm"
                    className="flex items-center gap-2"
                    disabled={true}
                  >
                    <Save className="h-4 w-4" />
                    Signed
                  </Button>
                ) : (
                  <Button
                    variant="filled"
                    color="teal"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={handleSave}
                    disabled={!selectedSignature || loading}
                  >
                    <Save className="h-4 w-4" />
                    {loading ? 'Saving...' : 'Save Signed Document'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Signature Selection Dialog */}
        <Dialog
          size="md"
          open={showSignatureDialog}
          handler={() => setShowSignatureDialog(false)}
        >
          <div className="p-6">
            <Typography variant="h6" color="teal" className="mb-4">
              Select a Watermarked Signature
            </Typography>
            <div className="grid grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto">
              {signatures.map((signature) => (
                <div
                  key={signature.file_id}
                  className={`border-2 p-4 cursor-pointer rounded-lg transition-all hover:bg-gray-50 ${
                    selectedSignature?.file_id === signature.file_id
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200'
                  }`}
                  onClick={() => {
                    setSelectedSignature(signature);
                    setShowSignatureDialog(false);
                  }}
                >
                  <img
                    src={signature.watermarkedSignatureUrl}
                    alt="Signature"
                    className="w-full h-auto object-contain"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <Button
                variant="text"
                color="gray"
                onClick={() => setShowSignatureDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Dialog>
      </Card>
    </Dialog>
  );
};

export default DocumentEdit;

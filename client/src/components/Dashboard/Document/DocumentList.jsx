import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Card,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { getDocuments, deleteDocument } from "../../../utils/docAPI";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../../config/firebaseConfig";
import { File, FileText, FileSignature, Upload, Pencil, Trash2 } from "lucide-react";
import DocumentUpload from "./DocumentUpload";

const DocumentList = ({
  setEditingDocument,
  refreshDocuments,
  setShowEditModal,
}) => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await getDocuments(token);

      const documentsWithUrls = await Promise.all(
        response.map(async (document) => {
          const documentRef = ref(storage, `documents/${document.file_path}`);
          const documentUrl = await getDownloadURL(documentRef);
          return { ...document, documentUrl };
        })
      );

      setDocuments(documentsWithUrls);
    } catch (error) {
      setError("Failed to fetch documents");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await deleteDocument(id, token);
      fetchDocuments();
    } catch (error) {
      setError("Failed to delete document");
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [refreshDocuments]);

  return (
    <Card className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <Typography
          variant="h5"
          color="teal"
          className="font-bold flex items-center gap-2"
        >
          <File className="h-6 w-6 text-teal-500" />
          My Documents
        </Typography>
        <Button
          variant="gradient"
          color="teal"
          className="flex items-center gap-2"
          onClick={() => setShowUploadModal(true)}
        >
          <Upload className="h-5 w-5" />
          Upload New Document
        </Button>
      </div>
  
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
  
      {/* Grid layout for document cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {documents.map((document) => (
          <Card
            key={document.file_id}
            className="p-4 flex flex-col justify-between bg-gray-50 rounded-lg shadow hover:shadow-lg transition duration-300"
          >
            {/* Thumbnail or File Icon */}
            <div
              className="cursor-pointer"
              onClick={() => window.open(document.documentUrl, "_blank")}
            >
              <FileText className="h-12 w-12 text-teal-500 mx-auto mb-4" />
              <Typography variant="subtitle2" className="text-center">
                {document.file_name}
              </Typography>
            </div>
  
            <div className="flex justify-between mt-4">
              <Button
                onClick={() => {
                  setEditingDocument(document);
                  setShowEditModal(true);
                }}
                color="teal"
                variant="filled"
                className="flex items-center space-x-1"
              >
                <FileSignature className="h-4 w-4" />
                <span>Sign</span>
              </Button>
              <Button
                onClick={() => setDeleteConfirmation(document)}
                color="red"
                variant="outlined"
                className="flex items-center space-x-1"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>
  
      {/* Document Upload Modal */}
      {showUploadModal && (
        <DocumentUpload
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          refreshDocuments={refreshDocuments}
        />
      )}
  
      {/* Delete Document Dialog */}
      {deleteConfirmation && (
  <Dialog
    open={!!deleteConfirmation}
    handler={() => setDeleteConfirmation(null)}
    className="rounded-xl shadow-2xl max-w-md mx-auto"
    animate={{
      mount: { scale: 1, opacity: 1 },
      unmount: { scale: 0.9, opacity: 0 },
    }}
  >
    <DialogHeader className="flex flex-col items-center space-y-4 pt-6">
      <div className="rounded-full bg-red-50 p-4">
        <Trash2 className="h-8 w-8 text-red-500" />
      </div>
      <div className="text-center">
        <Typography variant="h5" className="font-bold text-gray-900">
          Delete Document
        </Typography>
        <Typography className="text-sm text-gray-500 mt-1">
          This action cannot be undone
        </Typography>
      </div>
    </DialogHeader>

    <DialogBody className="px-6 py-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-full p-3 bg-gray-50 rounded-lg border border-gray-100">
          <Typography className="text-center text-gray-700 font-medium">
            {deleteConfirmation.file_name}
          </Typography>
        </div>
        <Typography className="text-gray-600 text-center text-sm">
          Are you sure you want to permanently delete this document? All of its contents will be permanently lost.
        </Typography>
      </div>
    </DialogBody>

    <DialogFooter className="flex justify-end space-x-3 px-6 pb-6">
      <Button
        variant="outlined"
        color="gray"
        onClick={() => setDeleteConfirmation(null)}
        className="flex-1 py-2 transition-all duration-200 hover:bg-gray-50"
      >
        Cancel
      </Button>
      <Button
        color="red"
        onClick={() => {
          handleDelete(deleteConfirmation.file_id);
          setDeleteConfirmation(null);
        }}
        className="flex-1 py-2 bg-red-500 hover:bg-red-600 transition-all duration-200"
      >
        Delete Document
      </Button>
    </DialogFooter>
  </Dialog>
)}
    </Card>
  );  
};

export default DocumentList;

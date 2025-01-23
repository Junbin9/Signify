import React, { useState } from 'react';
import Navbar from '../components/Layout/Navbar';
import Sidebar from '../components/Layout/Sidebar';
import SignatureList from '../components/Dashboard/Signature/SignatureList';
import SignatureEdit from '../components/Dashboard/Signature/SignatureEdit';

const SignaturePage = () => {
  const [editingSignature, setEditingSignature] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const refreshSignatures = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="flex-1 flex flex-col">
      <Navbar />
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto">
            <SignatureList
              setEditingSignature={setEditingSignature}
              refreshSignatures={refreshSignatures}
              setShowEditModal={setShowEditModal}
            />
            {editingSignature && showEditModal && (
              <div className="mt-6">
                <SignatureEdit 
                  isOpen={showEditModal}
                  onClose={() => setShowEditModal(false)}
                  signature={editingSignature}
                  refreshSignatures={refreshSignatures}
                  clearEditing={() => setEditingSignature(null)}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SignaturePage;
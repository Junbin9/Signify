// import React, { useState } from 'react';
// import Navbar from '../components/Layout/Navbar';
// import Sidebar from '../components/Layout/Sidebar';
// import DocumentList from '../components/Dashboard/Document/DocumentList';
// import DocumentEdit from '../components/Dashboard/Document/DocumentEdit';

// const DocumentPage = () => {
//   const [editingDocument, setEditingDocument] = useState(null);
//   const [refresh, setRefresh] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);

//   const refreshDocuments = () => {
//     setRefresh(!refresh);
//   };

//   return (
//     <div className="flex-1 flex flex-col">
//       <Navbar />
//       <div className="flex min-h-screen">
//         <Sidebar />
//         <main className="flex-1 overflow-y-auto p-6">
//           <div className="container mx-auto">
//             <DocumentList
//               setEditingDocument={setEditingDocument}
//               refreshDocuments={refreshDocuments}
//               setShowEditModal={setShowEditModal}
//             />
//             {editingDocument && showEditModal && (
//               <div className="mt-6">
//                 <DocumentEdit 
//                   isOpen={showEditModal}
//                   onClose={() => setShowEditModal(false)}
//                   document={editingDocument}
//                   refreshDocuments={refreshDocuments}
//                   clearEditing={() => setEditingDocument(null)}
//                 />
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DocumentPage;

import React, { useState } from 'react';
import Navbar from '../components/Layout/Navbar';
import Sidebar from '../components/Layout/Sidebar';
import DocumentList from '../components/Dashboard/Document/DocumentList';
import DocumentEdit from '../components/Dashboard/Document/DocumentEdit';

const DocumentPage = () => {
  const [editingDocument, setEditingDocument] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const refreshDocuments = () => {
    setRefresh(!refresh);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setEditingDocument(null);
  };

  return (
    <div className="flex-1 flex flex-col">
      <Navbar />
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto">
            <DocumentList
              setEditingDocument={setEditingDocument}
              refreshDocuments={refreshDocuments}
              setShowEditModal={setShowEditModal}
            />
            {editingDocument && showEditModal && (
              <div className="mt-6">
                <DocumentEdit 
                  isOpen={showEditModal}
                  onClose={handleCloseEdit}
                  document={editingDocument}
                  refreshDocuments={refreshDocuments}
                  clearEditing={() => setEditingDocument(null)}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocumentPage;
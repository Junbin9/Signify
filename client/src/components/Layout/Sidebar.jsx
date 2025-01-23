// const Sidebar = () => {
//   return (
//     <aside className="w-64 bg-teal-200 text-white min-h-screen p-4 shadow-lg">
//       <nav>
//         <ul>
//           <li className="mb-4">
//             <Link to="/dashboard" className="block py-2 px-4 rounded hover:bg-teal-800 transition duration-300">
//               Dashboard
//             </Link>
//           </li>
//           <li className="mb-4">
//             <Link to="/settings" className="block py-2 px-4 rounded hover:bg-teal-800 transition duration-300">
//               Settings
//             </Link>
//           </li>
//         </ul>
//       </nav>
//     </aside>
//   );
// };

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Signature,
  File, 
  Settings, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarItems = [
    { 
      icon: Signature, 
      label: 'Signatures', 
      path: '/dashboard/signatures' 
    },
    { 
      icon: File, 
      label: 'Documents', 
      path: '/dashboard/documents' 
    }
    // { 
    //   icon: Settings, 
    //   label: 'Settings', 
    //   path: '/settings' 
    // }
  ];

  return (
    <aside 
      className={`
        bg-white border-r border-gray-200 shadow-lg h-screen 
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-64'}
        flex flex-col
      `}
    >
      <div className={`
        flex items-center
        ${isCollapsed ? 'justify-center' : 'justify-between'}
        py-4
        ${isCollapsed ? 'px-0' : 'px-4'}
        border-b border-gray-200
      `}>
        {!isCollapsed && (
          <div className="pl-4">
            <span className="text-xl font-semibold text-teal-600">Dashboard</span>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="
            p-2 rounded-full 
            hover:bg-gray-100 
            transition-colors 
            duration-300
          "
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5 text-black" /> : <ChevronLeft className="w-5 h-5 text-black" />}
        </button>
      </div>
      
      <nav className="flex-grow pt-4">
        <ul>
          {sidebarItems.map((item, index) => (
            <li key={index} className="px-4 mb-2">
              <Link 
                to={item.path} 
                className={`
                  flex items-center 
                  ${isCollapsed ? 'justify-center' : 'justify-start'}
                  py-2 
                  ${isCollapsed ? 'px-2' : 'px-4'}
                  rounded-lg 
                  hover:bg-teal-50 
                  group 
                  transition-colors 
                  duration-300
                `}
              >
                <item.icon 
                  className={`
                    w-5 h-5 
                    ${isCollapsed ? 'mr-0' : 'mr-3'}
                    text-gray-500 
                    group-hover:text-teal-600
                    transition-colors
                  `} 
                />
                {!isCollapsed && (
                  <span 
                    className="
                      text-sm 
                      font-medium 
                      text-gray-700 
                      group-hover:text-teal-600
                      transition-colors
                    "
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
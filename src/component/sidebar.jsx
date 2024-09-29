// src/Sidebar.jsx
import React, { useState } from 'react';
// import { Sidebar } from 'primereact/sidebar';
// import {}

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="fixed z-40 top-5 left-5 flex flex-col justify-around h-10 w-10 bg-transparent border-none cursor-pointer"
      >
        <div className={`w-8 h-0.5 bg-white transform transition duration-300 ease-in-out ${isOpen ? "rotate-45 translate-y-2.5" : ""}`}></div>
        <div className={`w-8 h-0.5 bg-white transition duration-300 ease-in-out ${isOpen ? "opacity-0" : "opacity-100"}`}></div>
        <div className={`w-8 h-0.5 bg-white transform transition duration-300 ease-in-out ${isOpen ? "-rotate-45 -translate-y-2.5" : ""}`}></div>
      </button>
      <Sidebar visible={visible} onHide={() => setVisible(false)}></Sidebar>
      <div className={`transform top-0 left-0 w-64 bg-gray-800 text-white fixed h-full overflow-auto ease-in-out transition-all duration-300 z-30 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <button 
          onClick={() => setIsOpen(false)} 
          className="absolute top-0 right-0 mt-5 mr-5 flex flex-col justify-around h-10 w-10 bg-transparent border-none cursor-pointer z-50"
        >
          <div className="w-8 h-0.5 bg-white transform rotate-45"></div>
          <div className="w-8 h-0.5 bg-white transform -rotate-45"></div>
        </button>
        <ul className="space-y-2">
          <li className="p-4 border-b border-gray-600">Home</li>
          <li className="p-4 border-b border-gray-600">About</li>
          <li className="p-4 border-b border-gray-600">Services</li>
          <li className="p-4 border-b border-gray-600">Contact</li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;

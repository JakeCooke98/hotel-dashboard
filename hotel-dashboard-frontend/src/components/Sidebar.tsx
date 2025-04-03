
import React from 'react';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-[220px] bg-hugo-dark text-white h-screen fixed">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-center mb-2">
          <div className="border border-white inline-flex items-center justify-center w-10 h-10 text-lg font-semibold">H</div>
          <div className="ml-2 uppercase tracking-widest text-lg font-bold">Hugo</div>
        </div>
        <div className="text-center text-xs tracking-widest text-gray-400">ESTABLISHED</div>
      </div>
      
      <div className="p-2">
        <Link 
          to="/"
          className="flex items-center text-sm px-4 py-2 rounded-md text-white hover:bg-gray-700 transition-colors"
        >
          <Home className="w-4 h-4 mr-3" />
          <span>Room list</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;

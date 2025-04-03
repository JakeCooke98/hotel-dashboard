import React from 'react';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "./ui/sidebar";

const Sidebar = () => {
  return (
    <div className="h-screen w-[220px] fixed">
      <ShadcnSidebar side="left" className="border-r border-gray-700">
        <SidebarContent>
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-center mb-2">
              <div className="border border-white inline-flex items-center justify-center w-10 h-10 text-lg font-semibold">H</div>
              <div className="ml-2 uppercase tracking-widest text-lg font-bold">Hugo</div>
            </div>
            <div className="text-center text-xs tracking-widest text-gray-400">ESTABLISHED</div>
          </div>
          
          {/* Menu */}
          <div className="p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/" className="flex items-center text-sm">
                    <Home className="w-4 h-4 mr-3" />
                    <span>Room list</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </SidebarContent>
      </ShadcnSidebar>
    </div>
  );
};

export default Sidebar;

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import logo from '../assets/logo.svg';

const Sidebar = () => {
  return (
    <div className="h-screen w-[220px] fixed">
      <ShadcnSidebar side="left" className="border-r border-gray-700 bg-hugo-dark text-white">
        <SidebarContent>
          {/* Header with Logo */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-center mb-2">
              <img 
                src={logo}
                alt="HUGO"
                className="h-8 w-auto"
              />
            </div>
          </div>
          
          {/* Menu */}
          <div className="p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/" className="flex items-center w-full text-l font-karla">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="#D94E41" 
                      className="w-4 h-4 mr-3 flex-shrink-0"
                    >
                      <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                      <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                    </svg>
                    <span className="flex-1">Room list</span>
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

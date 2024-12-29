'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from "react";
import { MdDashboard, MdWorkOutline } from "react-icons/md";
import { HiOutlineUserGroup } from "react-icons/hi";
import { BiNetworkChart } from "react-icons/bi";
import { IoSettingsOutline, IoStatsChartOutline } from "react-icons/io5";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FiLogOut, FiUser } from "react-icons/fi";
import { HiChevronLeft } from "react-icons/hi2";
import { SiOpenai } from "react-icons/si";
import { BiBrain } from "react-icons/bi";
import Image from "next/image";
import { useProfile } from "@/lib/supabase/hooks/use-profile";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSupabase } from '@/lib/supabase/hooks/use-supabase'

interface SidebarProps {
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  isOverlayVisible?: boolean;
}

const sidebarLinks = [
  {
    icon: MdDashboard,
    name: "Home",
    link: "/dashboard/home",
    iconColor: "#4795F3",
    tooltip: "Dashboard Home"
  },
  {
    icon: BiNetworkChart,
    name: "Network",
    link: "/dashboard/network",
    iconColor: "#4795F3",
    tooltip: "Grow Your Network"
  },
  {
    icon: MdWorkOutline,
    name: "Content & Calendar",
    link: "/dashboard/content",
    iconColor: "#4795F3",
    tooltip: "Create & Schedule Content"
  },
  {
    icon: HiOutlineUserGroup,
    name: "Community",
    link: "/dashboard/community",
    iconColor: "#4795F3",
    tooltip: "Join Community"
  },
  {
    icon: IoStatsChartOutline,
    name: "Success Insights",
    link: "/dashboard/success-insights",
    iconColor: "#4795F3",
    tooltip: "View Performance"
  },
];

const bottomLinks = [
  {
    icon: FaRegQuestionCircle,
    name: "Help",
    iconColor: "#4795F3",
    tooltip: "Get assistance"
  },
  {
    icon: IoSettingsOutline,
    name: "Settings",
    link: "/dashboard/settings",
    iconColor: "#4795F3",
    tooltip: "Manage settings"
  },
];

const Sidebar: React.FC<SidebarProps> = ({ 
  showSidebar, 
  setShowSidebar,
  isOverlayVisible = false 
}) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { profile } = useProfile();
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useSupabase()

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (mounted && isMobile) {
      setShowSidebar(false);
    }
  }, [isMobile, mounted, setShowSidebar]);

  const sidebarVariants = {
    open: {
      width: 250,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      width: 100,
      opacity: 0.95,
      scale: 0.98,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const linkVariants = {
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20
      }
    },
    tap: {
      scale: 0.98
    }
  };

  const activeVariants = {
    active: {
      backgroundColor: "rgba(71, 149, 243, 0.1)",
      boxShadow: "0 0 20px 1px rgba(71, 149, 243, 0.1)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    inactive: {
      backgroundColor: "transparent",
      boxShadow: "none",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <motion.div
      initial="closed"
      animate={showSidebar ? "open" : "closed"}
      variants={sidebarVariants}
      className={`
        fixed left-0 top-[70px] bottom-0
        flex-shrink-0 transition-all duration-300 ease-in-out 
        bg-gradient-to-b from-white via-blue-50/60 to-indigo-50/60
        backdrop-blur-[6px] backdrop-saturate-[1.1]
        z-30 flex flex-col
        overflow-visible
        ${isOverlayVisible ? 'pointer-events-none' : ''}
        ${isMobile ? 'translate-x-0' : ''}
      `}
    >
      {/* Border effects - enhanced glow */}
      <div className="absolute right-0 top-0 bottom-0 w-[0.2px] bg-gradient-to-b from-blue-400/40 via-indigo-500/50 to-blue-400/40" />
      <div className="absolute right-[-0.5px] top-0 bottom-0 w-[2px] 
        shadow-[0_0_16px_2px_rgba(59,130,246,0.5),0_0_6px_1px_rgba(99,102,241,0.4)]" />
      <div className="absolute right-0 top-0 bottom-0 w-[2px] 
        bg-gradient-to-r from-blue-400/30 to-transparent" />
      
      {/* Toggle Button - Enhanced glow and hover */}
      <motion.button
        onClick={toggleSidebar}
        className="absolute right-[-28px] top-[15px] z-50
          w-[36px] h-[36px] rounded-full
          bg-gradient-to-r from-[#4795F3] to-[#6366F1]
          flex items-center justify-center
          shadow-lg shadow-indigo-500/30
          border-2 border-white/40
          hover:shadow-xl hover:shadow-indigo-500/50 
          hover:border-white/60
          hover:brightness-110
          transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          animate={{ rotate: showSidebar ? 0 : 180 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="flex items-center justify-center w-full h-full"
        >
          <HiChevronLeft className="w-5 h-5 text-white" />
        </motion.div>
      </motion.button>
      
      {/* Main content */}
      <div className="flex flex-col h-full w-full overflow-y-auto">
        <div className="flex flex-col h-full p-[10px]">
          {/* Logo Section - Enhanced glow */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-[#4795F3] via-[#5A7AF5] to-[#6366F1]
              border-2 border-[#6366F1]/40 text-[16px] mb-5
              rounded-xl h-[44px] cursor-pointer
              flex items-center justify-center gap-2 pl-2
              text-white shadow-lg shadow-indigo-500/30 
              hover:shadow-xl hover:shadow-indigo-500/50 
              hover:border-[#6366F1]/60 hover:brightness-110
              transition-all duration-300"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={showSidebar ? "openai" : "brain"}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                className="relative w-6 h-6"
              >
                {showSidebar ? (
                  <SiOpenai className="w-6 h-6 absolute inset-0" />
                ) : (
                  <BiBrain className="w-6 h-6 absolute inset-0" />
                )}
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.span
                key={showSidebar ? "full" : "short"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="font-mono font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100"
              >
                {showSidebar ? "AI POWERED" : "AI"}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          {/* Navigation Links Container */}
          <div className="flex-1 flex flex-col pt-6">
            <nav className="space-y-5 px-3">
              {sidebarLinks.map((link) => (
                <TooltipProvider key={link.name} delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={link.link || '#'}>
                        <motion.div
                          variants={linkVariants}
                          whileHover="hover"
                          whileTap="tap"
                          className={`
                            relative flex items-center gap-3 p-3 rounded-xl
                            transition-all duration-300
                            ${!showSidebar ? 'justify-center' : ''}
                            ${pathname === link.link 
                              ? 'bg-[#EEF4FF] text-blue-600 ring-1 ring-blue-200 shadow-[0_2px_8px_-2px_rgba(66,133,244,0.25)] border border-blue-100/50' 
                              : 'text-gray-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-100/90 hover:via-purple-50/90 hover:to-indigo-100/90 hover:shadow-lg hover:shadow-blue-500/20 hover:ring-1 hover:ring-blue-400/40'}
                          `}
                        >
                          {/* Icon */}
                          <div className="relative">
                            <link.icon 
                              className={`
                                transition-all duration-300 relative z-10
                                ${!showSidebar ? 'w-6 h-6' : 'w-5 h-5'}
                                ${pathname === link.link ? 'text-blue-600' : 'text-gray-500'}
                                group-hover:scale-105 transform
                                group-hover:text-blue-600
                              `}
                            />
                          </div>
                          
                          {/* Text */}
                          <AnimatePresence mode="wait">
                            {showSidebar && (
                              <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className={`
                                  text-sm whitespace-nowrap
                                  ${pathname === link.link ? 'font-semibold' : 'font-medium'}
                                `}
                              >
                                {link.name}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </Link>
                    </TooltipTrigger>
                    {!showSidebar && (
                      <TooltipContent 
                        side="right" 
                        className="ml-2 px-3 py-1.5 bg-white border border-gray-100 shadow-sm"
                        sideOffset={10}
                      >
                        <span className="text-sm font-medium text-gray-700">
                          {link.name}
                        </span>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              ))}
            </nav>
          </div>

          {/* Bottom links with same styling */}
          <div className="mt-auto space-y-2">
            {bottomLinks.map((link) => (
              <TooltipProvider key={link.name} delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={link.link || '#'}>
                      <motion.div
                        variants={linkVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className={`
                          flex items-center gap-3 p-3 rounded-xl group
                          transition-all duration-300
                          ${!showSidebar ? 'justify-center' : ''}
                          text-gray-600 hover:text-blue-600
                          hover:bg-gradient-to-r hover:from-blue-50/80 hover:via-indigo-50/80 hover:to-blue-50/80
                          hover:shadow-lg hover:shadow-blue-500/5
                          hover:ring-1 hover:ring-blue-400/20
                        `}
                      >
                        <div className="relative">
                          <link.icon 
                            className={`
                              transition-all duration-300 relative z-10
                              ${!showSidebar ? 'w-6 h-6' : 'w-5 h-5'}
                              text-gray-500
                              group-hover:scale-105 transform
                              group-hover:text-blue-600
                            `}
                          />
                          {/* Subtle icon glow effect */}
                          <div className={`
                            absolute inset-0 rounded-full blur-[2px]
                            transition-all duration-300 opacity-0 scale-100
                            group-hover:opacity-75 group-hover:scale-110
                            bg-gradient-to-r from-blue-400/30 via-indigo-400/30 to-blue-400/30
                          `} />
                        </div>
                        <AnimatePresence mode="wait">
                          {showSidebar && (
                            <motion.span
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className="text-sm font-medium whitespace-nowrap relative z-10
                                group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 
                                group-hover:bg-clip-text group-hover:text-transparent"
                            >
                              {link.name}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </Link>
                  </TooltipTrigger>
                  {!showSidebar && (
                    <TooltipContent 
                      side="right" 
                      className="ml-2 px-3 py-1.5 bg-white border border-gray-100 shadow-sm"
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {link.name}
                      </span>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))}

            {/* Profile Section with enhanced styling */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-3 cursor-pointer"
                >
                  <div className={`
                    flex items-center gap-3 p-2 rounded-xl group
                    bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-blue-500/5
                    hover:from-blue-500/10 hover:via-indigo-500/10 hover:to-blue-500/10
                    hover:shadow-lg hover:shadow-blue-500/10
                    hover:ring-1 hover:ring-blue-400/30
                    transition-all duration-300
                    ${!showSidebar ? 'justify-center' : ''}
                  `}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`
                        relative overflow-hidden
                        ${!showSidebar ? 'w-8 h-8' : 'w-10 h-10'}
                        rounded-lg ring-2 ring-blue-500/20 hover:ring-blue-500/40
                        transition-all duration-300
                        group-hover:shadow-lg group-hover:shadow-blue-500/20
                      `}
                    >
                      <Image
                        src="/profile.png"
                        alt="Profile"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                      {/* Enhanced gradient overlay on hover */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 bg-gradient-to-t from-blue-500/30 via-indigo-500/20 to-transparent"
                      />
                      {/* Glow effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                        bg-gradient-to-r from-blue-400/20 to-indigo-400/20 blur-md"
                      />
                    </motion.div>
                    <AnimatePresence mode="wait">
                      {showSidebar && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="flex-1 min-w-0"
                        >
                          <p className="text-sm font-medium text-gray-900 truncate group-hover:bg-gradient-to-r 
                            group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:bg-clip-text group-hover:text-transparent">
                            {profile?.full_name || user?.email?.split('@')[0] || "Guest User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {profile?.headline || "Welcome to Techperks"}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-gradient-to-b from-white to-blue-50/90 backdrop-blur-sm border-blue-100"
              >
                <Link href="/dashboard/profile">
                  <DropdownMenuItem className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 focus:bg-blue-50 group">
                    <FiUser className="mr-2 h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                    <span className="group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 
                      group-hover:bg-clip-text group-hover:text-transparent">Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/dashboard/settings">
                  <DropdownMenuItem className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 focus:bg-blue-50 group">
                    <IoSettingsOutline className="mr-2 h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                    <span className="group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 
                      group-hover:bg-clip-text group-hover:text-transparent">Settings</span>
                  </DropdownMenuItem>
                </Link>
                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 focus:bg-blue-50 group">
                      <FaRegQuestionCircle className="mr-2 h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                      <span className="group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 
                        group-hover:bg-clip-text group-hover:text-transparent">Help</span>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="bg-gradient-to-b from-white to-blue-50/90 backdrop-blur-sm border-blue-100">
                    <DialogHeader>
                      <DialogTitle className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        How can we help you?
                      </DialogTitle>
                      <DialogDescription>
                        Our AI assistant is here to help you with any questions you might have.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border border-blue-100">
                        <p className="text-sm text-blue-600">AI assistance coming soon...</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 hover:bg-red-50/50 focus:bg-red-50/50 focus:text-red-600 group"
                  onClick={() => {
                    const signOut = async () => {
                      try {
                        await fetch('/api/auth/signout', { method: 'POST' });
                        window.location.href = '/';
                      } catch (error) {
                        console.error('Error signing out:', error);
                      }
                    };
                    signOut();
                  }}
                >
                  <FiLogOut className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;

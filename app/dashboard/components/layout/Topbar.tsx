'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSearch, IoNotificationsOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { FiUser, FiSettings, FiHelpCircle, FiLogOut, FiBell } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from 'next/link';
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Calendar, Briefcase, BookOpen } from 'lucide-react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useProfile } from "@/lib/supabase/hooks/use-profile";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type Notification = {
  id: string;
  type: 'message' | 'event' | 'opportunity' | 'learning';
  title: string;
  description: string;
  time: string;
  read: boolean;
};

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'message',
    title: 'New connection request',
    description: 'Sarah from Google wants to connect',
    time: '10m ago',
    read: false,
  },
  {
    id: '2',
    type: 'event',
    title: 'Upcoming Tech Conference',
    description: 'Register for DevCon 2024',
    time: '1h ago',
    read: false,
  },
  {
    id: '3',
    type: 'opportunity',
    title: 'Job Match Found',
    description: 'New Senior Developer position',
    time: '2h ago',
    read: true,
  },
  {
    id: '4',
    type: 'learning',
    title: 'Course Recommendation',
    description: 'Advanced React Patterns',
    time: '3h ago',
    read: true,
  },
];

const typeIcons = {
  message: MessageSquare,
  event: Calendar,
  opportunity: Briefcase,
  learning: BookOpen,
};

interface TopBarProps {
  setShowSidebar: (show: boolean) => void;
  showSidebar: boolean;
  setIsOverlayVisible: (visible: boolean) => void;
}

export default function TopBar({ setShowSidebar, showSidebar, setIsOverlayVisible }: TopBarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showCommandDialog, setShowCommandDialog] = useState(false);
  const router = useRouter();
  const { profile } = useProfile();
  
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  // Update overlay visibility when dialogs change
  useEffect(() => {
    setIsOverlayVisible(showCommandDialog || isNotificationsOpen || isProfileOpen);
  }, [showCommandDialog, isNotificationsOpen, isProfileOpen, setIsOverlayVisible]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isProfileOpen || isNotificationsOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('.dropdown-container')) {
          setIsProfileOpen(false);
          setIsNotificationsOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen, isNotificationsOpen]);

  // Keyboard shortcuts
  useHotkeys('meta+k', (e) => {
    e.preventDefault();
    setShowCommandDialog(true);
  });

  // Handle command actions
  const handleCommand = (command: string) => {
    setShowCommandDialog(false);
    switch (command) {
      case 'create_post':
        router.push('/dashboard/content');
        break;
      case 'schedule_content':
        router.push('/dashboard/content');
        break;
      case 'view_insights':
        router.push('/dashboard/success-insights');
        break;
      case 'generate_ideas':
        router.push('/dashboard/ai-partner');
        break;
      case 'analyze_performance':
        router.push('/dashboard/success-insights');
        break;
      case 'network_suggestions':
        router.push('/dashboard/network');
        break;
    }
  };

  return (
    <>
      {/* Overlay for dialogs */}
      <AnimatePresence>
        {(showCommandDialog || isNotificationsOpen || isProfileOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => {
              setShowCommandDialog(false);
              setIsNotificationsOpen(false);
              setIsProfileOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      <CommandDialog open={showCommandDialog} onOpenChange={setShowCommandDialog}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => handleCommand('create_post')}>
              <span>Create new post</span>
            </CommandItem>
            <CommandItem onSelect={() => handleCommand('schedule_content')}>
              <span>Schedule content</span>
            </CommandItem>
            <CommandItem onSelect={() => handleCommand('view_insights')}>
              <span>View insights</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="AI Help">
            <CommandItem onSelect={() => handleCommand('generate_ideas')}>
              <span>Generate content ideas</span>
            </CommandItem>
            <CommandItem onSelect={() => handleCommand('analyze_performance')}>
              <span>Analyze my performance</span>
            </CommandItem>
            <CommandItem onSelect={() => handleCommand('network_suggestions')}>
              <span>Get networking suggestions</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <div className="w-full h-[70px] fixed top-0 left-0 z-50 
        bg-gradient-to-r from-white via-blue-50/80 to-indigo-50/80
        backdrop-blur-[8px] backdrop-saturate-[1.2]
        border-b border-blue-100/50
        shadow-[0_2px_15px_-3px_rgba(59,130,246,0.05)]"
      >
        <div className="h-full mx-auto px-6 flex items-center justify-between">
          {/* Logo and Menu Toggle */}
          <div className="w-[280px] flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 rounded-xl bg-white/50 backdrop-blur-sm border border-blue-100/50 
                hover:bg-white/80 transition-all duration-300"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </motion.button>
            <Link href="/dashboard">
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  filter: "brightness(1.1)",
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                whileTap={{ 
                  scale: 0.98,
                  transition: { duration: 0.1 }
                }}
                className="flex items-center cursor-pointer"
              >
                <Image
                  src="/logo.png"
                  alt="TechPerks Logo"
                  width={160}
                  height={40}
                  className="object-contain w-auto h-auto"
                  priority
                />
              </motion.div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-auto px-4">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="relative"
            >
              <div className={`
                relative rounded-xl transition-all duration-300 ease-in-out
                bg-white/50 backdrop-blur-sm border border-blue-100/50
                ${searchFocused ? 'ring-2 ring-blue-200 shadow-lg bg-white/80' : 'shadow-sm hover:bg-white/60'}
              `}>
                <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Search or press ⌘K for AI help..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-none focus:outline-none bg-transparent text-sm"
                  onFocus={() => {
                    setSearchFocused(true);
                    setShowCommandDialog(true);
                  }}
                  onBlur={() => setSearchFocused(false)}
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-50">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </motion.div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative dropdown-container">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-xl bg-white/50 backdrop-blur-sm border border-blue-100/50 hover:bg-white/80 transition-all duration-300"
              >
                <FiBell className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </motion.button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-96 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <h3 className="text-sm font-semibold">Notifications</h3>
                    </div>
                    <ScrollArea className="h-[400px]">
                      <div className="py-2">
                        {mockNotifications.map((notification) => {
                          const Icon = typeIcons[notification.type];
                          return (
                            <div
                              key={notification.id}
                              className={`px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ${
                                !notification.read ? 'bg-blue-50/50' : ''
                              }`}
                            >
                              <div className="flex gap-3">
                                <div className={`mt-1 rounded-full p-2 ${
                                  !notification.read ? 'bg-blue-100' : 'bg-gray-100'
                                }`}>
                                  <Icon className="h-4 w-4 text-gray-600" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {notification.title}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {notification.description}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {notification.time}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                    <div className="px-4 py-3 border-t border-gray-100">
                      <Link
                        href="/dashboard/notifications"
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View all notifications
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div className="relative dropdown-container">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-2 rounded-xl bg-white/50 backdrop-blur-sm border border-blue-100/50 hover:bg-white/80 transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm ring-2 ring-[#3B82F6]/20">
                  <Image
                    src="/profile.png"
                    alt="Profile"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">{profile?.full_name || "John Doe"}</span>
                <IoIosArrowDown className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 py-1 focus:outline-none z-50"
                  >
                    <div className="py-1">
                      <Link href="/dashboard/profile">
                        <div className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-150 cursor-pointer">
                          <FiUser className="mr-3 h-4 w-4" />
                          Profile
                        </div>
                      </Link>
                      <Link href="/dashboard/settings">
                        <div className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-150 cursor-pointer">
                          <FiSettings className="mr-3 h-4 w-4" />
                          Settings
                        </div>
                      </Link>
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-150 cursor-pointer">
                            <FiHelpCircle className="mr-3 h-4 w-4" />
                            Help
                          </div>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>How can we help you?</DialogTitle>
                            <DialogDescription>
                              Our AI assistant is here to help you with any questions you might have.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="rounded-lg bg-blue-50 p-4">
                              <p className="text-sm text-blue-600">AI assistance coming soon...</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <button
                        onClick={async () => {
                          try {
                            // Call your sign out API
                            await fetch('/api/auth/signout', { method: 'POST' });
                            // Redirect to landing page
                            window.location.href = '/';
                          } catch (error) {
                            console.error('Error signing out:', error);
                          }
                        }}
                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 cursor-pointer w-full"
                      >
                        <FiLogOut className="mr-3 h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

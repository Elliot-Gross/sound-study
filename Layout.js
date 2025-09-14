import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Music, Home, Plus, Brain, BarChart3, User, Headphones, Sparkles, TrendingUp } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Discover",
    url: createPageUrl("Discover"),
    icon: Home,
  },
  {
    title: "Create",
    url: createPageUrl("Create"),
    icon: Plus,
  },
  {
    title: "My Songs",
    url: createPageUrl("MySongs"),
    icon: Headphones,
  },
  {
    title: "Quizzes", 
    url: createPageUrl("Quizzes"),
    icon: Brain,
  },
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: BarChart3,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-purple-50/30">
        <style>
          {`
            :root {
              --gradient-primary: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%);
              --gradient-accent: linear-gradient(135deg, #EC4899 0%, #F59E0B 100%);
              --gradient-warm: linear-gradient(135deg, #FDE68A 0%, #FCA5A5 100%);
              --sidebar-width: 280px;
            }
            
            .sidebar-gradient {
              background: linear-gradient(180deg, 
                rgba(139, 92, 246, 0.05) 0%,
                rgba(99, 102, 241, 0.05) 50%, 
                rgba(59, 130, 246, 0.05) 100%);
            }
          `}
        </style>
        
        <Sidebar className="border-r border-purple-100 sidebar-gradient backdrop-blur-sm">
          <SidebarHeader className="border-b border-purple-100/50 p-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/25">
                  <Music className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  SongStudy
                </h2>
                <p className="text-sm text-purple-500 font-semibold tracking-wide">Learn Through Music</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-bold text-purple-600 uppercase tracking-widest px-3 py-3 mb-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.url || 
                      (item.url.includes('?') ? location.pathname + location.search === item.url : false);
                    
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`group hover:bg-gradient-to-r hover:from-purple-100 hover:to-indigo-100 transition-all duration-300 rounded-xl mb-1 ${
                            isActive
                              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/25' 
                              : 'text-gray-700 hover:text-purple-700 hover:shadow-md'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-4 px-4 py-3">
                            <item.icon className={`w-5 h-5 transition-all duration-300 group-hover:scale-110 ${
                              isActive ? 'text-white' : 'text-purple-600'
                            }`} />
                            <span className="font-semibold">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-xs font-bold text-purple-600 uppercase tracking-widest px-3 py-3 mb-2">
                Quick Stats
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-4 py-3 space-y-4">
                  <div className="flex items-center gap-3 text-sm bg-green-50 p-3 rounded-xl border border-green-100">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-sm"></div>
                    <span className="text-gray-700 font-medium">Study Streak</span>
                    <span className="ml-auto font-bold text-green-600 bg-green-100 px-2 py-1 rounded-lg text-xs">
                      7 days
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm bg-blue-50 p-3 rounded-xl border border-blue-100">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full shadow-sm"></div>
                    <span className="text-gray-700 font-medium">Songs Created</span>
                    <span className="ml-auto font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-lg text-xs">
                      5
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm bg-purple-50 p-3 rounded-xl border border-purple-100">
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full shadow-sm"></div>
                    <span className="text-gray-700 font-medium">Quiz Accuracy</span>
                    <span className="ml-auto font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-lg text-xs">
                      87%
                    </span>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-purple-100/50 p-4">
            <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-100">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">Learning Student</p>
                <p className="text-xs text-purple-600 truncate font-medium">🎵 Transform notes into music</p>
              </div>
            </div>
            
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500 font-medium">
                🧠 Backed by spaced repetition science
              </p>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100/50 px-6 py-4 md:hidden sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-purple-100 p-2 rounded-lg transition-colors duration-200" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Music className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  SongStudy
                </h1>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
import React, { createContext, useContext, useState, useEffect } from 'react'

const SidebarContext = createContext()

export function SidebarProvider({ children }) {
  const [open, setOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setOpen(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <SidebarContext.Provider value={{ open, setOpen, isMobile }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function Sidebar({ className = '', ...props }) {
  const { open, isMobile } = useContext(SidebarContext) || {}
  
  const baseClasses = 'shrink-0 transition-all duration-300 ease-in-out'
  const widthClasses = open ? 'w-64' : 'w-0'
  const mobileClasses = isMobile ? 'fixed inset-y-0 left-0 z-50' : ''
  const hiddenClasses = !open && isMobile ? 'hidden' : ''
  
  return (
    <aside 
      className={`${baseClasses} ${widthClasses} ${mobileClasses} ${hiddenClasses} ${className}`} 
      {...props} 
    />
  )
}

export function SidebarContent({ className = '', ...props }) {
  return <div className={`flex-1 overflow-auto ${className}`} {...props} />
}

export function SidebarHeader({ className = '', ...props }) {
  return <div className={`p-4 font-semibold ${className}`} {...props} />
}

export function SidebarFooter({ className = '', ...props }) {
  return <div className={`p-4 ${className}`} {...props} />
}

export function SidebarGroup({ className = '', ...props }) {
  return <div className={`p-2 ${className}`} {...props} />
}

export function SidebarGroupContent({ className = '', ...props }) {
  return <div className={`${className}`} {...props} />
}

export function SidebarGroupLabel({ className = '', ...props }) {
  return <div className={`px-2 text-xs uppercase text-gray-500 ${className}`} {...props} />
}

export function SidebarMenu({ className = '', ...props }) {
  return <ul className={`flex flex-col gap-1 ${className}`} {...props} />
}

export function SidebarMenuItem({ className = '', ...props }) {
  return <li className={className} {...props} />
}

export function SidebarMenuButton({ className = '', asChild = false, ...props }) {
  const baseClasses = 'w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors duration-200'
  
  if (asChild) {
    return <div className={`${baseClasses} ${className}`} {...props} />
  }
  
  return <button className={`${baseClasses} ${className}`} {...props} />
}

export function SidebarTrigger({ className = '', ...props }) {
  const { open, setOpen, isMobile } = useContext(SidebarContext) || {}
  
  return (
    <button 
      className={`px-2 py-1 rounded border hover:bg-gray-100 transition-colors duration-200 ${className}`} 
      onClick={() => setOpen && setOpen(!open)} 
      {...props}
    >
      <svg 
        className="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
        />
      </svg>
    </button>
  )
}

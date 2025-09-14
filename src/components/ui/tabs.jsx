import React, { createContext, useContext, useState } from 'react'
const TabsCtx = createContext()
export function Tabs({ defaultValue, children, className = '' }) {
  const [value, setValue] = useState(defaultValue)
  return <TabsCtx.Provider value={{ value, setValue }}><div className={className}>{children}</div></TabsCtx.Provider>
}
export function TabsList({ className = '', ...props }) {
  return <div className={`flex gap-2 ${className}`} {...props} />
}
export function TabsTrigger({ value, className = '', ...props }) {
  const ctx = useContext(TabsCtx) || {}
  const active = ctx.value === value
  return (
    <button
      className={`px-3 py-1 rounded ${active ? 'bg-black text-white' : 'bg-gray-100'} ${className}`}
      onClick={() => ctx.setValue && ctx.setValue(value)}
      {...props}
    />
  )
}
export function TabsContent({ value, className = '', ...props }) {
  const ctx = useContext(TabsCtx) || {}
  if (ctx.value !== value) return null
  return <div className={className} {...props} />
}

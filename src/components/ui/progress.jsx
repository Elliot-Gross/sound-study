import React from 'react'
export function Progress({ value = 0, className = '' }) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0))
  return (
    <div className={`h-2 w-full bg-gray-200 rounded ${className}`}>
      <div className="h-full bg-blue-500 rounded" style={{ width: `${pct}%` }} />
    </div>
  )
}

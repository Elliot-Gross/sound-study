import React from 'react'
export function Alert({ className = '', ...props }) {
  return <div className={`border rounded-md p-3 bg-yellow-50 ${className}`} {...props} />
}
export function AlertDescription({ className = '', ...props }) {
  return <div className={`text-sm text-yellow-800 ${className}`} {...props} />
}

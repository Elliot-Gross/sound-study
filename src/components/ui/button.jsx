import React from 'react'
export function Button({ className = '', ...props }) {
  return <button className={`px-3 py-2 rounded-md border bg-white hover:bg-gray-50 ${className}`} {...props} />
}

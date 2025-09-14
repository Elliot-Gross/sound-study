import React from 'react'
export function Textarea({ className = '', ...props }) {
  return <textarea className={`w-full rounded-md border p-2 ${className}`} {...props} />
}

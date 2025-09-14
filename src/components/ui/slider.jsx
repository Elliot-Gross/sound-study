import React from 'react'
export function Slider({ value = [0], onValueChange, min = 0, max = 100, step = 1, className = '' }) {
  const v = Array.isArray(value) ? value[0] : Number(value) || 0
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={v}
      onChange={e => onValueChange && onValueChange([Number(e.target.value)])}
      className={`w-full ${className}`}
    />
  )
}

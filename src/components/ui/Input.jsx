import React from 'react'

const Input = ({ 
  label, 
  error, 
  helperText, 
  icon, 
  className = '', 
  containerClassName = '',
  ...props 
}) => {
  const baseClasses = 'w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white'
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : ''
  const iconClasses = icon ? 'pl-12' : ''
  
  const classes = `
    ${baseClasses}
    ${errorClasses}
    ${iconClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-gray-400 text-lg">{icon}</span>
          </div>
        )}
        
        <input
          className={classes}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}

export default Input

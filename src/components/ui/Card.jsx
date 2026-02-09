import React from 'react'

const Card = ({ 
  children, 
  className = '', 
  hover = true, 
  padding = 'normal',
  shadow = 'md',
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300'
  
  const hoverClasses = hover ? 'hover:shadow-xl hover:-translate-y-1' : ''
  
  const paddings = {
    none: '',
    sm: 'p-4',
    normal: 'p-6',
    lg: 'p-8',
  }
  
  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  }
  
  const classes = `
    ${baseClasses}
    ${hoverClasses}
    ${paddings[padding]}
    ${shadows[shadow]}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-4 border-b border-gray-100 ${className}`} {...props}>
    {children}
  </div>
)

const CardBody = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-4 ${className}`} {...props}>
    {children}
  </div>
)

const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-4 border-t border-gray-100 bg-gray-50 ${className}`} {...props}>
    {children}
  </div>
)

Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter

export default Card

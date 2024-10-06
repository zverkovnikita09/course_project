import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom';

export const Portal = ({ children }) => {
  const [container] = useState(() => {
    return document.createElement('div');
  });

  useEffect(() => {
    document.body.appendChild(container)
    return () => {
      document.body.removeChild(container)
    }
  }, [])

  return createPortal(children, container)
}
import './Popup.css'
import { useCallback, useEffect, useRef } from 'react';
import { Portal } from '../Portal/Portal';

export const Popup = ({ children, isActive, closePopup }) => {
  const overlayRef = useRef(null)

  const closePopupOnEsc = useCallback((e) => {
    if (e.key === 'Escape') closePopup()
  }, [closePopup])

  useEffect(() => {
    if (isActive) document?.addEventListener("keydown", closePopupOnEsc)
    return () => document?.removeEventListener("keydown", closePopupOnEsc)
  }, [closePopupOnEsc, isActive])

  const closePopupByOverlayClick = (e) => {
    if (e.target === overlayRef.current) closePopup()
  }

  return (
    <Portal>
      <div
        className={`overlay ${isActive ? "active" : ""}`}
        onClick={closePopupByOverlayClick}
        ref={overlayRef}
      >
        <div className="content">
          {children}
        </div>
      </div>
    </Portal>
  )
}
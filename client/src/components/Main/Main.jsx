import { useCallback, useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import "./Main.css"
import DashBoard from '../DashBoard/DashBoard';

export default function Main() {
  const [userData, setUserData] = useState(localStorage.getItem("userLSData"));
  const navigate = useNavigate();

  const storageListener = useCallback(() => {
    const userLSData = localStorage.getItem("userLSData");

    if (userLSData) {
      setUserData(JSON.parse(userLSData));
      return;
    }

    setUserData(userLSData)
  }, []);

  useEffect(() => {
    window.addEventListener('storage', storageListener, false)

    return () => window.removeEventListener('storage', storageListener)
  }, [])

  const logout = () => {
    localStorage.removeItem("userLSData");
    setUserData(null)
  }

  if (!userData) return (
    <Navigate to="/login" />
  )

  return (
    <div className='main'>
      <div className='main__top'>
        <h1 className='main__title'>Доска пользователя {JSON.parse(userData).name}</h1>
        <button className='link' onClick={logout}>Сменить пользователя</button>
      </div>
      <DashBoard />
    </div>
  )
}
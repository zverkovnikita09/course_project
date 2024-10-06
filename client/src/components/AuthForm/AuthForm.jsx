import { useState } from "react"
import "./AuthForm.css"
import { Spinner } from "../Spinner/Spinner";
import { useSendData } from "../../hooks/useSendData";
import { Link, Navigate, useNavigate } from 'react-router-dom'

export default function AuthForm() {
  const userData = localStorage.getItem("userLSData");

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { error, handleSendData, isSending } = useSendData({
    url: '/login', onSuccess: (data) => {
      localStorage.setItem("userLSData", JSON.stringify(data))
      navigate("/")
    }
  });

  const onSumbit = async (e) => {
    e.preventDefault();
    if (!login || !password) return;
    handleSendData({ login, password })
  }

  if (userData) return (
    <Navigate to="/" />
  )

  return (
    <>
      <form className="authForm" onSubmit={onSumbit}>
        <label className="authForm__label">
          Логин
          <input value={login} onChange={e => setLogin(e.target.value)} type="text" className="authForm__input" />
        </label>
        <label className="authForm__label">
          Пароль
          <input value={password} onChange={e => setPassword(e.target.value)} className="authForm__input" type="password" />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="authForm__submit" disabled={isSending}>
          {isSending ? <Spinner /> : "Войти"}
        </button>
      </form>
      <Link to="/register" className="link">Зарегестрироваться</Link>
    </>
  )
}
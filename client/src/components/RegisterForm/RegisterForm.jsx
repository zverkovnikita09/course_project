import { useState } from "react"
import "./RegisterForm.css"
import { Spinner } from "../Spinner/Spinner";
import { useSendData } from "../../hooks/useSendData";
import { Link, useNavigate } from 'react-router-dom'

export default function RegisterForm() {
  const [login, setLogin] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { error, handleSendData, isSending } = useSendData({
    url: '/register', onSuccess: (data) => {
      localStorage.setItem("userLSData", JSON.stringify(data))
      navigate("/")
    }
  });

  const onSumbit = async (e) => {
    e.preventDefault();
    if (!login || !password || !name) return;
    handleSendData({ login, password, name })
  }

  return (
    <>
      <form className="registerForm" onSubmit={onSumbit}>
        <label className="registerForm__label">
          Имя пользователя
          <input value={name} onChange={e => setName(e.target.value)} type="text" className="registerForm__input" />
        </label>
        <label className="registerForm__label">
          Логин
          <input value={login} onChange={e => setLogin(e.target.value)} type="text" className="registerForm__input" />
        </label>
        <label className="registerForm__label">
          Пароль
          <input value={password} onChange={e => setPassword(e.target.value)} className="registerForm__input" type="password" />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="registerForm__submit" disabled={isSending}>
          {isSending ? <Spinner /> : "Зарегестрироваться"}
        </button>
      </form>
      <Link to="/login" className="link">Войти</Link>
    </>
  )
}
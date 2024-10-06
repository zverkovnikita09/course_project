import AuthForm from "./components/AuthForm/AuthForm"
import { Route, Routes } from 'react-router-dom';
import Main from './components/Main/Main';
import RegisterForm from "./components/RegisterForm/RegisterForm";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Main />} />
      <Route path='/login' element={<AuthForm />} />
      <Route path='/register' element={<RegisterForm />} />
    </Routes>
  )
}

export default App

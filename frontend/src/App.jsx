import { useState } from 'react'

import './App.css'
import { Route, Routes } from 'react-router-dom'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import HomePage from './pages/Home'
import { ToastContainer, toast } from 'react-toastify';
import { useIdeal } from './context'
import LoadingAnimation from './components/loadingAnimation'
import 'react-toastify/dist/ReactToastify.css';
import AdminPage from './pages/Admin'
import CustomModal from './components/customModal';
import "react-confirm-alert/src/react-confirm-alert.css";
import ReportPage from './pages/adminpages/report'

function App() {
  const {toggled, setToggled} = useState(false);
  const {pending} = useIdeal();

  return (
    <>
    {pending ? <LoadingAnimation isIntro={true}/> : null}
      <Routes>
        <Route exact path="/" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/home" element={<HomePage/>}/>
        <Route path="/admin" element={<AdminPage/>}/>
        <Route path="/admin/report" element={<ReportPage/>}/>
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App

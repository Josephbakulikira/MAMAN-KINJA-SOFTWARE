import React, { useEffect, useState } from 'react'
import "../styles/auth.css"
import { Link, useNavigate } from 'react-router-dom';
import { useIdeal } from '../context';
import { toast } from 'react-toastify';
import { registerUser } from '../api/user';

function RegisterPage() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const {setPending, pending} = useIdeal()
    const navigate = useNavigate()

    function checkUser() {
        if(localStorage.getItem("userInfo")){
            navigate("/home")
        }
    }

    async function register(e) {
        e.preventDefault();
        setPending(true);
        if(password !== confirmPassword){
            setPending(false);
            return toast.warn("les deux mot de passes ne sont pas identique!")
        }
        try{
            const res = await registerUser({email, name, password, confirmPassword});
            if(res?.success){
                toast.success("Utilisateur Ajouté");
                setEmail("");
                setPassword("");
                setConfirmPassword("")
                setName("");

                setPending(false);
                navigate("/")

            }else{
                toast.error(res?.message || "Erreur ! Verifier votre connexion")
                setPending(false);
            }
        }catch(err){
            toast.error(`Erreur ! ${err.message}`);
            setPending(false);
        }
    }

    useEffect(() => {
        checkUser();
    }, [])
    return (
        <div className='center-full-screen'>
            <form className="form_main" action="" onSubmit={register} autoComplete='off'>
            <p className="heading">S'inscrire</p>
            <input type='hidden' autoComplete='false'/>
            
            <div className="inputContainer">
                <input value={name} onChange={(e) => setName(e.target.value)}  placeholder="Nom & post nom" id="email" className="inputField" type="text" required/>
            </div>

            <div className="inputContainer">
                <svg viewBox="0 0 16 16" fill="#2e2e2e" height="16" width="16" xmlns="http://www.w3.org/2000/svg" className="inputIcon">
                <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"></path>
                </svg>
                <input value={email} onChange={(e) => setEmail(e.target.value)}  placeholder="email" id="email" className="inputField" type="email" required/>
            </div>
            
            <div className="inputContainer">
                <svg viewBox="0 0 16 16" fill="#2e2e2e" height="16" width="16" xmlns="http://www.w3.org/2000/svg" className="inputIcon">
                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
                </svg>
                <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" id="password" className="inputField" type="password" required/>
            </div>
            <div className="inputContainer">
                <svg viewBox="0 0 16 16" fill="#2e2e2e" height="16" width="16" xmlns="http://www.w3.org/2000/svg" className="inputIcon">
                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
                </svg>
                <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirmer mot de passe" id="password" className="inputField" type="password" required/>
            </div>
                        
                    
            <button id='button' type="submit" disabled={pending}>Continue</button>
                <div className="signupContainer">
                    <p>Vous avez deja un compte?</p>
                    <Link to="/">Se connecter</Link>
                </div>
            </form>

        </div>
    )
}

export default RegisterPage

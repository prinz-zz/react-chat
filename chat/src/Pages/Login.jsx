import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';


export default function Login() {

    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (error) {
            setError(true);
        }
        
   };

    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo"><sub>pg</sub>CHAT</span>
                <span className="register">Login</span>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email"/>
                    <input type="password" placeholder="Password"/>
                    <button>Sign In</button>
                    {error && <span>Something went wrong!!!</span>}
                </form>
                <p>You don't have an account? <Link to="/register">Register</Link> </p>
            </div>
        </div>
    )
}
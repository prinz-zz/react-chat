import { signOut } from 'firebase/auth';
import { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { auth } from '../firebase';

export default function Navbar() {

    const { currentUser } = useContext(AuthContext);
    return (
        <div className="navbar">
            <span className="logo"><sub>pg</sub>CHAT</span>
            <div className="user">
                <img src={currentUser.photoURL} alt="" />
                <span>{currentUser.displayName}</span>
                <button onClick={() => signOut(auth)}>Logout</button>
            </div>
        </div>
    )
}
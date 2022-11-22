import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth, storage, db } from "../firebase";
import Add from '../images/add.png';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { Link, useNavigate } from "react-router-dom";



export default function Register() {
    const [error, setError] = useState(false);
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];

        try {
                const res = await createUserWithEmailAndPassword(auth, email, password);
                const storageRef = ref(storage, displayName);           
                const uploadTask = uploadBytesResumable(storageRef, file);            
               
                //await uploadBytesResumable(storageRef, file).then(() => {        
                uploadTask.on(               
                (error) => {
                    setError(true);
                }, 
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
                        await updateProfile(res.user, {
                            displayName,
                            photoURL : downloadURL,
                        });                        

                        await setDoc(doc(db, "users", res.user.uid), {
                            uid: res.user.uid,
                            displayName,
                            email,
                            photoURL: downloadURL,
                        });

                        await setDoc(doc(db, "userChats", res.user.uid),
                            {});
                        navigate('/');
                    });
                  }
                );

        } catch (error) {
            setError(true);
        }
        
   };
       
                    return (
                        <div className="formContainer">
                            <div className="formWrapper">
                                <span className="logo"><sub>pg</sub>CHAT</span>
                                <span className="register">Register</span>
                                <form onSubmit={handleSubmit}>
                                    <input type="text" placeholder="Displayname" />
                                    <input type="email" placeholder="Email" />
                                    <input type="password" placeholder="Password" />
                                    <input style={{ display: 'none' }} type="file" id="file" />
                                    <label htmlFor="file">
                                        <img src={Add} alt='' />
                                        <span>Add an avatar</span>
                                    </label>
                                    <button>Sign Up</button>
                                    {error && <span>Something went wrong!!!</span>}
                                    
                                </form>
                                <p>You do have an account? <Link to='/login'>Login</Link> </p>
                            </div>
                        </div>
                    )
                };
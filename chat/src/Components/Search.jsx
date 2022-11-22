import { useState } from "react";
// Create a reference to the users collection
import { collection, query, where, setDoc, doc, updateDoc, serverTimestamp, getDoc, getDocs } from "firebase/firestore";
import { db } from '../firebase';
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";


export default function Search() {

    const [username, setUsername] = useState('');
    const [user, setUser] = useState(null);
    const [error, setError] = useState(false);
    const { currentUser } = useContext(AuthContext);

    const handleSearch = async () => {
        const q = query(collection(db, 'users'), where('displayName', '==', username));

        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setUser(doc.data());
            });
        }
        catch (error) {
            setError(true);
        }
    }

    const handleKey = (e) => {
        e.code === 'Enter' && handleSearch();
    }
   
    const handleSelect = async () => {
        //check user exist or not
        const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
        try {
            const res = await getDoc(doc(db, 'chats', combinedId));
            if (!res.exists()) {
                //create a chat in the database
                await setDoc(doc(db, 'chats', combinedId), { messges: [] });
                //update chats in the database
                await updateDoc(doc(db, 'userChats', currentUser.uid), {
                    [combinedId + '.userInfo']: {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    },
                    //firebase timestamp
                    [combinedId + '.date']: serverTimestamp()
                });

                await updateDoc(doc(db, 'userChats', user.uid), {
                    [combinedId + '.userInfo']: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL
                    },
                    //firebase timestamp
                    [combinedId + '.date']: serverTimestamp()
                });
            }
        }
        catch (error) {
            //setError(true);
        }
        setUser(null);
        setUsername('');
    }

    return (
        <>
        <div className="search">
            <div className="searchForm">
                <input type="text" placeholder='Search...' onKeyDown={handleKey} onChange={(e) => setUsername(e.target.value)} value={username} />
            </div>        
        </div>
                    
            {error && <span>User not found!</span>}
            { user && <div className="userChat" onClick={handleSelect}>
                <img src={user.photoURL} alt="" />
                <div className="userChatInfo">
                    <span>{user.displayName}</span>
                </div>
            </div>}
                
        </>    
    );
};
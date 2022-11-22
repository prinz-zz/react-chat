import { doc, onSnapshot } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { ChatContext } from '../Context/ChatContext';
import {db} from '../firebase';
//import Avatar from '../images/avatar.png';

export default function Chats() {

    const [chats, setChats] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);
  
    const handleSelect = (user) => { 
        dispatch({ type:'CHANGE_USER', payload: user})
      }

  useEffect(() => {
      //at the beginning there will no user id, so wrap it in a function to avoid error
      const getChats = () => {
          //Firebase real time updtate : onSnapshot()
            const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
              setChats(doc.data());
              //console.log("Current data: ", doc.data());
            });
            return () => {
                unsub();
            };
    };
        //Invoke the function if it only has userId
        currentUser.uid && getChats(); 
    }, [currentUser.uid]);

   console.log(Object.entries(chats));


    return (
        <div className="chats">
      {Object.entries(chats)?.sort((a,b) => b[1].date - a[1].date).map((chat) => (
        <div className="userChat" key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>
          <img src={chat[1].userInfo.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{chat[1].userInfo.displayName}</span>
            <p>{chat[1].lastMessage?.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
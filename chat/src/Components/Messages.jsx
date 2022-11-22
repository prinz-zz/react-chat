import { doc, onSnapshot } from "firebase/firestore";
import { useState, useContext, useEffect } from "react";
import { ChatContext } from "../Context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";


export default function Messages() {

    const [messages, setMessages] = useState([]);
    const { data } = useContext(ChatContext);

    useEffect(() => {
         //at the beginning there will no user id, so wrap it in a function to avoid error
            const getChat = () => {                
                const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
                    setMessages(doc.data().messages);
                });
                
                return () => {
                    unsub();
                };
        };
          //Invoke the function if it only has userId
           data.chatId && getChat();
        },[data.chatId]);
   

    return (
        <div className="messages">
            {messages.map((msg) => 
                <Message message={msg} key={msg.id}/>
            )}
        </div>
    )
}
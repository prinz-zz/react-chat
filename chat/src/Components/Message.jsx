import { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { ChatContext } from '../Context/ChatContext';
//import Avatar from '../images/avatar.png';


export default function Message({ message }) {
    
    const {currentUser} = useContext(AuthContext)
    const { data } = useContext(ChatContext);
    
    //To scroll to the latest message
    const ref = useRef();
    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    },[message]);

    return (
        <div ref={ref} className={`message ${message.senderId === currentUser.uid && 'owner'}`}>
            <div className="messageInfo">
                <img src={message.senderId === currentUser.uid ?
                    currentUser.photoURL
                    : data.user.photoURL
                    } alt="" />
                <span>Just now</span>
            </div>
            <div className="messageContent">
                <p>{message.text}</p>
                {message.img && <img src={message.img} alt="" />}
            </div>
        </div>
    )
}
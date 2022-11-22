import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import SendIcon from '@material-ui/icons/Send';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { useContext, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { ChatContext } from '../Context/ChatContext';
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { v4 as uuid } from 'uuid';
import { db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';



export default function Input() {

    const [text, setText] = useState('');
    const [img, setImg] = useState(null);

    const {currentUser} = useContext(AuthContext)
    const { data } = useContext(ChatContext);

    const handleSend = async () => {
        if (img) {
            const storageRef = ref(storage, uuid());
            const uploadTask = uploadBytesResumable(storageRef, img);
            
            uploadTask.on(
                (error) => {
                    //setError(true);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateDoc(doc(db, 'chats', data.chatId), {
                            messages: arrayUnion({
                                id: uuid(),
                                text,
                                senderId: currentUser.uid,
                                date: Timestamp.now(),
                                img: downloadURL,
                            }),
                        });
                    });
                }
            );
            
        } else {
            await updateDoc(doc(db, 'chats', data.chatId), {
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                }),
            });
        }
        await updateDoc(doc(db, 'userChats', currentUser.uid), {
            [data.chatId + '.lastMessage']: {
                text
            },
            [data.chatId + '.date']: serverTimestamp(),
        });

        await updateDoc(doc(db, 'userChats', data.user.uid), {
            [data.chatId + '.lastMessage']: {
                text
            },
            [data.chatId + '.date']: serverTimestamp(),
        });

        setText('');
        setImg(null);
    };

    return (
        <div className="input">
            <input type="text" placeholder="Message" onChange={ (e) => setText(e.target.value)} value={text} />
            <div className="send">
                <AttachFileIcon className="rotate"/>
                <input style={{ display: 'none' }} type="file" id="file" onChange={ (e) => setImg(e.target.files[0])}/>
                    <label htmlFor="file">
                    <AddPhotoAlternateIcon style={{marginTop:'5px'}} />
                    </label>
                    <SendIcon onClick={handleSend} />
            </div>
        </div>
    )
}
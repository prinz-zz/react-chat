
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import VideocamIcon from '@material-ui/icons/Videocam';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Messages from './Messages';
import Input from './Input';
import { useContext } from 'react';
import { ChatContext } from '../Context/ChatContext';


export default function Chat() {

    const { data } = useContext(ChatContext);

    return (
        <div className="chat">
            <div className="chatInfo">
                <span>{data.user?.displayName}</span>
                <div className="chatIcons">
                    <VideocamIcon/> 
                    <PersonAddIcon/> 
                    <MoreHorizIcon/> 
                </div>
            </div>
            <Messages />
            <Input/>
        </div>
    )
}
import React, { useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Button, Navbar } from '../components';
import classes from '../styles/group-chat.module.scss';
import { DataContext } from '../context/Context';
import { ACTION_TYPE } from '../reducer/actionTypes';
import { fetchMessages, fetchLoggedInUser, sendMessage } from '../utils/api';
import { getMessageDate } from '../utils/utils';

const GroupChat = () => {
    const { dispatch, loading } = useContext(DataContext);
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const scrollRef = useRef(null);

    useEffect(() => {
        const fetch = async () => {
            dispatch({ type: ACTION_TYPE.REQUEST_START });
            try {
                const resUser = await fetchLoggedInUser();
                setUser(resUser[0]);
                const resMessages = await fetchMessages();
                setMessages(resMessages);
                dispatch({ type: ACTION_TYPE.REQUEST_SUCCESS });
            } catch (error) {
                dispatch({ type: ACTION_TYPE.REQUEST_ERROR });
                toast.error(error.response.data.message);
            }
        };
        fetch();
    }, [dispatch]);

    const scrollToBottom = () => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        const date = getMessageDate();
        if (message.trim() === "") return toast.warn("Message is required");
        const messageData = {
            user_id: user._id,
            message: message,
            time: date
        };
        dispatch({ type: ACTION_TYPE.REQUEST_START });
        try {
            const message = await sendMessage(messageData);
            setMessages([...messages, message]);
            dispatch({ type: ACTION_TYPE.REQUEST_SUCCESS });
            setMessage("");
        } catch (error) {
            dispatch({ type: ACTION_TYPE.REQUEST_ERROR });
            toast.error(error.response.data.message);
        }
    };

    return (
        <>
            <Navbar />
            <div className={classes.container}>
                <div className={classes.gcHeader}>
                    <h5>Group Chat</h5>
                    <button type="button" className="btn-close" aria-label="Close"></button>
                </div>
                <div className={classes.gcBody}>
                    {messages?.map((message) => {
                        return (
                            <p key={message?._id}>[{message?.time}] {message?.sender?.[0]?.name} : {message?.message}</p>
                        );
                    })}
                    <div ref={scrollRef} />
                </div>
                <div className={classes.gcFooter}>
                    <label htmlFor="message">{user.name}</label>
                    <input type="text" name="message" value={message} placeholder="I am good" onChange={(e) => setMessage(e.target.value)} />
                    <div className={classes.actions}>
                        <Button unstyled text="Send" loading={loading} bold click={handleSendMessage} />
                        <Button unstyled text="Refresh" bold click={() => { navigate(0); }} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default GroupChat;
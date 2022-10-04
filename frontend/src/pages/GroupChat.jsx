import React, { useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { Button } from '../components';
import classes from '../styles/group-chat.module.scss';
import { DataContext } from '../context/Context';
import { fetchMessages, fetchLoggedInUser, sendMessage } from '../utils/api';
import { accessTokenChecker, getMessageDate } from '../utils/utils';
import { RequestError, RequestStart, RequestSuccess } from '../reducer/actions';

var socket;

const GroupChat = () => {
    const { dispatch, loading } = useContext(DataContext);
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const scrollRef = useRef(null);

    useEffect(() => {
        // useEffect for creating socket implementation
        socket = io("http://localhost:5000", {
            extraHeaders: {
                auuth_token: accessTokenChecker("accessToken")
            }
        });
        socket.on("receive_message", (message) => {
            setMessages([...messages, message]);
        });
    });

    useEffect(() => {
        const fetch = async () => {
            dispatch(RequestStart());
            try {
                const resUser = await fetchLoggedInUser();
                setUser(resUser[0]);
                const resMessages = await fetchMessages();
                setMessages(resMessages);
                dispatch(RequestSuccess());
            } catch (error) {
                dispatch(RequestError());
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
        dispatch(RequestStart());
        try {
            const message = await sendMessage(messageData);
            dispatch(RequestSuccess());
            socket.emit("send_message", message);
            setMessage("");
        } catch (error) {
            dispatch(RequestError());
            toast.error(error.response.data.message);
        }
    };

    return (
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
                    <Button type="unstyled" text="Send" loading={loading} bold click={handleSendMessage} />
                    <Button type="unstyled" text="Refresh" bold click={() => { navigate(0); }} />
                </div>
            </div>
        </div>
    );
};

export default GroupChat;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatApp: React.FC = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [author, setAuthor] = useState('YourName');
    const [lastMessageDate, setLastMessageDate] = useState('');

    const fetchMessages = async () => {
        try {
            const url = lastMessageDate
                ? `http://146.185.154.90:8000/messages?datetime=${lastMessageDate}`
                : 'http://146.185.154.90:8000/messages';

            const response = await axios.get(url);
            const retrievedMessages = response.data;
            setMessages(retrievedMessages);
            if (retrievedMessages.length > 0) {
                setLastMessageDate(retrievedMessages[retrievedMessages.length - 1].datetime);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = async () => {
        try {
            const url = 'http://146.185.154.90:8000/messages';
            const data = new URLSearchParams();
            data.set('message', newMessage);
            data.set('author', author);

            await axios.post(url, data);

            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    useEffect(() => {
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchMessages();
    }, [lastMessageDate]);

    return (
        <div>
            <h1>Chat App</h1>
            <div>
                {messages.map((message) => (
                    <div key={message._id}>
                        <p>{message.message}</p>
                        <p>Author: {message.author}</p>
                        <p>Date and Time: {message.datetime}</p>
                    </div>
                ))}
            </div>
            <div>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Your Name"
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatApp;

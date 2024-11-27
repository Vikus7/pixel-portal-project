import React, { useState, useRef, useEffect } from 'react';
import { Send, X } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import UserAvatar from './UserAvatar';

const ChatWindow = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user'));
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // TODO: Implementar WebSocket aca es ws o socket.io dependera del backend
  // const ws = new WebSocket('ws://localhost:3001');
  // ws.onopen = () => {
  //   console.log('Conectado al servidor de chat');
  //   // Enviar información del usuario al conectarse
  //   ws.send(JSON.stringify({
  //     type: 'USER_CONNECTED',
  //     user: {
  //       id: user.uid,
  //       name: user.nombreUsuario
  //     }
  //   }));
  // };
  // 
  // ws.onmessage = (event) => {
  //   const message = JSON.parse(event.data);
  //   setMessages(prev => [...prev, message]);
  // };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      id: Date.now(),
      text: newMessage,
      sender: {
        id: user.uid,
        name: user.nombreUsuario,
        avatar: user.fotoPerfil
      },
      timestamp: new Date().toISOString()
    };

    // TODO: Enviar por WebSocket
    // ws.send(JSON.stringify({
    //   type: 'CHAT_MESSAGE',
    //   message: messageData
    // }));

    setMessages(prev => [...prev, messageData]);
    setNewMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-8 w-96 h-[500px] bg-gray-800 rounded-lg shadow-lg flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 p-4 rounded-t-lg flex justify-between items-center">
        <h3 className="text-white font-bold">Chat Global</h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${
              message.sender.id === user.uid ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <UserAvatar 
                src={message.sender.avatar} 
                alt={message.sender.name}
                size="small"
              />
              <span className="text-sm text-gray-400">{message.sender.name}</span>
              <span className="text-xs text-gray-500">
                {format(new Date(message.timestamp), 'HH:mm', { locale: es })}
              </span>
            </div>
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender.id === user.uid
                  ? 'bg-purple-600 text-white rounded-br-none'
                  : 'bg-gray-700 text-white rounded-bl-none'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-gray-900 rounded-b-lg">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-gray-700 text-white p-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-lg transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
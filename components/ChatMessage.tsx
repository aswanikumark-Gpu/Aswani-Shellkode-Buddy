
import React from 'react';
import { Message, MessageAuthor } from '../types';

interface ChatMessageProps {
  message: Message;
}

const UserIcon = () => (
    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
        S
    </div>
);

const BotIcon = () => (
    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
    </div>
);


const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.author === MessageAuthor.BOT;

  return (
    <div className={`flex items-start gap-3 ${isBot ? '' : 'flex-row-reverse'}`}>
      {isBot ? <BotIcon /> : <UserIcon />}
      <div className={`p-4 rounded-lg max-w-lg lg:max-w-xl xl:max-w-3xl break-words ${isBot ? 'bg-gray-700' : 'bg-blue-600'}`}>
        <p className="text-white whitespace-pre-wrap">{message.text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;

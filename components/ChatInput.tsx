import React from 'react';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  placeholder: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ input, setInput, onSendMessage, isLoading, placeholder }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!isLoading && input.trim()) {
        onSendMessage();
      }
    }
  };

  return (
    <div className="bg-gray-800 p-4 sticky bottom-0">
      <div className="relative max-w-4xl mx-auto">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="w-full bg-gray-700 text-white rounded-lg pl-4 pr-16 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200"
          disabled={isLoading}
        />
        <button
          onClick={onSendMessage}
          disabled={isLoading || !input.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
          aria-label="Send message"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatInput;

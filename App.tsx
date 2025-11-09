import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Chat } from '@google/genai';
import { Message, MessageAuthor } from './types';
import { createChatSession, generateImage } from './services/geminiService';
import ChatInput from './components/ChatInput';
import ChatMessage from './components/ChatMessage';
import ExamplePrompts from './components/ExamplePrompts';

type Mode = 'chat' | 'image';

const INDUSTRIES = [
  'Retail & E-commerce',
  'Logistics',
  'Financial Services & Fintech',
  'SaaS & Technology',
  'Healthcare',
];

const EXAMPLE_PROMPTS = [
  "Tell me about a success story in this industry.",
  "What challenges did we solve for a client here?",
  "What were the business outcomes for one of our clients?",
  "Give me a summary of our work in this sector."
];

const App: React.FC = () => {
  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      author: MessageAuthor.BOT,
      text: "Hello! I'm the Shellkode Sales Buddy. To get started, please select an industry you're interested in.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const chatRef = useRef<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // App mode and Image Generator state
  const [mode, setMode] = useState<Mode>('chat');
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    chatRef.current = createChatSession();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || !chatRef.current) return;

    const userMessage: Message = { author: MessageAuthor.USER, text: messageText };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatRef.current.sendMessage({ message: messageText });
      const botMessage: Message = { author: MessageAuthor.BOT, text: response.text };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to get a response: ${errorMessage}`);
      const errorBotMessage: Message = {
        author: MessageAuthor.BOT,
        text: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prevMessages) => [...prevMessages, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSendMessage = () => {
    sendMessage(input);
    setInput('');
  };

  const handleIndustrySelect = useCallback(async (industry: string) => {
    setSelectedIndustry(industry);
    const userSelectionMessage: Message = {
      author: MessageAuthor.USER,
      text: `I'm interested in ${industry}.`
    };
    
    setMessages((prev) => [...prev, userSelectionMessage]);
    setIsLoading(true);
    setError(null);

    if (chatRef.current) {
      try {
        const response = await chatRef.current.sendMessage({ message: `Let's focus on case studies in the ${industry} sector. Give me a brief, welcoming confirmation message that asks me what I want to know.` });
        const botResponseMessage: Message = { author: MessageAuthor.BOT, text: response.text };
        setMessages((prev) => [...prev, botResponseMessage]);
      } catch (e) {
         const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
         setError(`Failed to get a response: ${errorMessage}`);
         const errorBotMessage: Message = {
           author: MessageAuthor.BOT,
           text: `Sorry, I encountered an error setting the industry context. Please try again.`,
         };
         setMessages((prevMessages) => [...prevMessages, errorBotMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;

    setIsGenerating(true);
    setImageError(null);
    setImageUrl(null);

    try {
      const url = await generateImage(imagePrompt);
      setImageUrl(url);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setImageError(`Failed to generate image: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const showExamplePrompts = selectedIndustry && !isLoading && messages.length === 3;

  const renderImageGenerator = () => (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 items-center w-full">
        <div className="w-full p-4 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2 text-center">Image Generator</h2>
            <p className="text-gray-400 text-center mb-4">Create blog post heroes, concept art, or unique assets. Describe the image you want to create.</p>
            <textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="e.g., A futuristic cityscape at sunset, with flying cars and neon lights, in a photorealistic style."
                rows={3}
                className="w-full bg-gray-700 text-white rounded-lg p-3 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200"
                disabled={isGenerating}
            />
            <button
                onClick={handleGenerateImage}
                disabled={isGenerating || !imagePrompt.trim()}
                className="mt-4 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
            >
                {isGenerating ? (
                    <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Generating...</>
                ) : 'Generate Image'}
            </button>
        </div>

        <div className="w-full aspect-square bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-700 overflow-hidden">
            {isGenerating ? (
                <div className="text-center text-gray-400">
                    <svg className="animate-spin mx-auto h-10 w-10 text-white mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p>Creating your image... This may take a moment.</p>
                </div>
            ) : imageError ? (
                <div className="w-full h-full flex items-center justify-center bg-red-500/10 text-red-300 p-4">
                  <p>{imageError}</p>
                </div>
            ) : imageUrl ? (
                <img src={imageUrl} alt={imagePrompt} className="w-full h-full object-contain" />
            ) : (
                <div className="text-center text-gray-500 p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <p className="mt-2">Your generated image will appear here.</p>
                </div>
            )}
        </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 shadow-md sticky top-0 z-10">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
            <h1 className="text-xl md:text-2xl font-bold tracking-wider">Shellkode Sales Buddy</h1>
            <div className="flex items-center gap-2 rounded-full bg-gray-700 p-1">
                <button
                    onClick={() => setMode('chat')}
                    className={`px-4 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${mode === 'chat' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
                    aria-pressed={mode === 'chat'}
                >
                    Sales Chat
                </button>
                <button
                    onClick={() => setMode('image')}
                    className={`px-4 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${mode === 'image' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
                    aria-pressed={mode === 'image'}
                >
                    Image Gen
                </button>
            </div>
        </div>
      </header>
      
      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        {mode === 'chat' ? (
           <div className="max-w-4xl mx-auto flex flex-col gap-6">
             {messages.map((msg, index) => (
               <ChatMessage key={index} message={msg} />
             ))}
   
             {!selectedIndustry && !isLoading && (
               <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                 {INDUSTRIES.map((industry) => (
                   <button
                     key={industry}
                     onClick={() => handleIndustrySelect(industry)}
                     className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-full transition-colors duration-200"
                   >
                     {industry}
                   </button>
                 ))}
               </div>
             )}
   
             {showExamplePrompts && (
               <ExamplePrompts prompts={EXAMPLE_PROMPTS} onPromptClick={(prompt) => sendMessage(prompt)} />
             )}
   
             {isLoading && messages.length > 0 && messages[messages.length - 1].author === MessageAuthor.USER && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-700">
                      <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                      </div>
                  </div>
                </div>
              )}
             {error && (
               <div className="bg-red-500/20 text-red-300 p-3 rounded-lg max-w-4xl mx-auto text-center">
                 {error}
               </div>
             )}
           </div>
        ) : renderImageGenerator()}
      </main>

      {mode === 'chat' && (
        <ChatInput
          input={input}
          setInput={setInput}
          onSendMessage={handleSendMessage}
          isLoading={isLoading || !selectedIndustry}
          placeholder={!selectedIndustry ? "Please select an industry above to begin." : "Ask about a use case, client, or technology..."}
        />
      )}
    </div>
  );
};

export default App;

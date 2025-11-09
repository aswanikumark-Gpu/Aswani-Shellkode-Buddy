import React from 'react';

interface ExamplePromptsProps {
  prompts: string[];
  onPromptClick: (prompt: string) => void;
}

const ExamplePrompts: React.FC<ExamplePromptsProps> = ({ prompts, onPromptClick }) => {
  return (
    <div className="flex flex-col items-center gap-3 my-4">
        <p className="text-sm text-gray-400">Or try one of these example prompts:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
            {prompts.map((prompt, index) => (
                <button
                key={index}
                onClick={() => onPromptClick(prompt)}
                className="bg-gray-700/50 hover:bg-gray-700 text-left text-white p-3 rounded-lg transition-colors duration-200 text-sm"
                >
                {prompt}
                </button>
            ))}
        </div>
    </div>
  );
};

export default ExamplePrompts;

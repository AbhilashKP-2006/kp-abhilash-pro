import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types/portfolio';

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const SUGGESTED_QUESTIONS = [
  'Who is Abhilash?',
  'What are his skills?',
  'Tell me about his projects',
  'Hackathon achievements',
  'How can I contact him?',
];

export const AiAssistant: React.FC<AiAssistantProps> = ({ isOpen, onClose, onOpen }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hi! I'm Abhilash's AI assistant. Ask me about his skills, projects, hackathons, certificates or how to contact him.",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStreamText, setCurrentStreamText] = useState('');

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, currentStreamText, isLoading]);

  // Focus input when opened & handle Escape key
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const handleSendMessage = async (textToSend?: string) => {
    const raw = textToSend !== undefined ? textToSend : input;
    const text = raw.trim();
    if (!text || isLoading) return;

    if (text.length > 500) {
      alert('Message must be under 500 characters.');
      return;
    }

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setCurrentStreamText('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to communicate with AI');
      }

      if (!response.body) {
        throw new Error('No readable stream in response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setCurrentStreamText(accumulated);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: 'assistant-' + Date.now(),
          sender: 'assistant',
          text: accumulated || "The AI is resting right now, please try again or email Abhilash at akp911187@gmail.com.",
          timestamp: Date.now(),
        },
      ]);
      setCurrentStreamText('');
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'assistant-' + Date.now(),
          sender: 'assistant',
          text: err.message?.includes('Rate limit')
            ? err.message
            : "The AI is resting right now, please try again or email Abhilash at akp911187@gmail.com.",
          timestamp: Date.now(),
        },
      ]);
      setCurrentStreamText('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: "Hi! I'm Abhilash's AI assistant. Ask me about his skills, projects, hackathons, certificates or how to contact him.",
        timestamp: Date.now(),
      },
    ]);
    setCurrentStreamText('');
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      {!isOpen && (
        <button
          onClick={onOpen}
          aria-label="Ask my AI assistant"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-[#FF4A1C] hover:bg-[#ff5f36] text-black font-mono font-bold text-xs uppercase px-4 py-3 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <span>Ask my AI</span>
        </button>
      )}

      {/* Chat Panel Modal / Sheet */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Ask Abhilash AI Assistant"
          className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 w-full sm:w-[400px] h-full sm:h-[580px] bg-[#141414] border border-[#2A2A2A] sm:rounded-xl flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0E0E0F] border-b border-[#2A2A2A] select-none">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#FF4A1C]">
                <img
                  src="/assets/abhilash-portrait.webp"
                  alt="Abhilash AI Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-sm uppercase tracking-wide text-[#F2F2F2]">
                    ASK ABHILASH AI
                  </span>
                  <span
                    className="w-2 h-2 rounded-full bg-emerald-500 inline-block"
                    title="Online"
                  />
                </div>
                <div className="font-mono text-[10px] text-[#A3A3A3]">
                  Gemini 3.8 Flash Engine
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleClearChat}
                className="font-mono text-[10px] text-[#A3A3A3] hover:text-[#FF4A1C] transition-colors"
                title="Clear conversation"
              >
                Clear
              </button>
              <button
                onClick={onClose}
                className="text-[#A3A3A3] hover:text-[#F2F2F2] p-1.5 rounded transition-colors"
                aria-label="Close AI chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div
            ref={chatContainerRef}
            aria-live="polite"
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.map((msg, index) => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 text-xs sm:text-sm leading-relaxed ${
                      isAssistant
                        ? 'bg-[#1C1C1E] text-[#F2F2F2] border border-[#2A2A2A]'
                        : 'bg-[#FF4A1C] text-black font-medium'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>

                  {/* Render Suggested Questions chips below the first message */}
                  {index === 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5 max-w-full">
                      {SUGGESTED_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          onClick={() => handleSendMessage(q)}
                          className="font-mono text-[11px] text-[#A3A3A3] hover:text-[#FF4A1C] bg-[#1C1C1E] hover:bg-[#252528] border border-[#2A2A2A] hover:border-[#FF4A1C] px-2.5 py-1 rounded transition-colors text-left"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Currently streaming message */}
            {currentStreamText && (
              <div className="flex flex-col items-start">
                <div className="max-w-[85%] rounded-lg p-3 text-xs sm:text-sm leading-relaxed bg-[#1C1C1E] text-[#F2F2F2] border border-[#2A2A2A]">
                  <p className="whitespace-pre-wrap">{currentStreamText}</p>
                </div>
              </div>
            )}

            {/* Typing Indicator */}
            {isLoading && !currentStreamText && (
              <div className="flex items-center space-x-1.5 p-3 max-w-[80px] bg-[#1C1C1E] border border-[#2A2A2A] rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4A1C] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4A1C] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4A1C] animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-[#0E0E0F] border-t border-[#2A2A2A]">
            <div className="relative flex items-end bg-[#141414] border border-[#2A2A2A] focus-within:border-[#FF4A1C] rounded-lg p-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Abhilash (e.g. skills, hackathons)..."
                maxLength={500}
                rows={2}
                className="w-full resize-none bg-transparent text-xs text-[#F2F2F2] placeholder-[#737373] focus:outline-none"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !input.trim()}
                className={`ml-2 px-3 py-1.5 font-mono text-xs font-semibold uppercase rounded transition-colors ${
                  input.trim() && !isLoading
                    ? 'bg-[#FF4A1C] text-black hover:bg-[#ff5f36]'
                    : 'bg-[#2A2A2A] text-[#737373] cursor-not-allowed'
                }`}
              >
                Send
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 px-1 text-[10px] font-mono text-[#737373]">
              <span>Enter to send · Shift+Enter newline</span>
              <span>{input.length}/500</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

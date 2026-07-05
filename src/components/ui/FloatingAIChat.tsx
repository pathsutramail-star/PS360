import React, { useState } from 'react';
import { Send, Bot, User, X, MessageCircle } from 'lucide-react';

export function FloatingAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Hello! I'm your PS360 AI Copilot. How can I assist you today?"
    }
  ]);

  const handleSendMessage = () => {
    if (query.trim()) {
      setMessages([
        ...messages,
        { type: 'user', text: query },
        { type: 'bot', text: 'I\'m analyzing your query. In a real implementation, this would connect to an AI backend.' }
      ]);
      setQuery('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-[#2F9A3D] text-white rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center z-40 hover:scale-110"
          aria-label="Open AI Chat"
        >
          <MessageCircle size={28} className="text-white" strokeWidth={1.5} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-[#689249] to-[#557A3A] rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <MessageCircle size={18} className="text-[#689249]" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">PS360 AI Chat</h3>
                <p className="text-xs text-green-100">Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close Chat"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'bot'
                      ? 'bg-gradient-to-br from-[#2de071] to-[#689249]'
                      : 'bg-gray-900'
                  }`}
                >
                  {message.type === 'bot' ? (
                    <Bot size={14} className="text-white" />
                  ) : (
                    <User size={14} className="text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                    message.type === 'bot'
                      ? 'bg-gray-100 text-gray-800 border border-gray-200'
                      : 'bg-[#689249] text-white'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-100 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question..."
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-[#689249] text-white rounded-lg hover:bg-[#557A3A] transition-colors shadow-sm flex-shrink-0"
                aria-label="Send Message"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

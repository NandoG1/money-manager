'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import ReactMarkdown from 'react-markdown';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const storedSessionId = localStorage.getItem('chatSessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
      fetchHistory(storedSessionId);
    } else {
      const newSessionId = crypto.randomUUID();
      localStorage.setItem('chatSessionId', newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchHistory = async (sid: string) => {
    try {
      const response = await fetch(`/api/chat?sessionId=${sid}`);
      if (response.ok) {
        const data = await response.json();
        const formattedMessages = data.history.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
          timestamp: new Date()
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: input,
          sessionId: sessionId
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.sessionId && data.sessionId !== sessionId) {
          setSessionId(data.sessionId);
          localStorage.setItem('chatSessionId', data.sessionId);
        }
        
        const aiMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } else {
        console.error('Error from API:', await response.text());
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        aria-label="Open chat bot"
      >
        <Bot className="h-6 w-6" />
        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 md:p-0">
          <div className="relative w-full max-w-md h-[600px] max-h-[90vh] rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-medium text-white">FinTrack Assistant</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-white/80 hover:bg-white/10 transition-colors"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="h-[calc(100%-120px)] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-4 rounded-full bg-blue-500/10 p-3">
                    <Bot className="h-8 w-8 text-blue-500" />
                  </div>
                  <h4 className="mb-2 text-lg font-medium text-white">FinTrack AI Assistant</h4>
                  <p className="max-w-xs text-sm text-gray-400">
                    I can help you with financial advice, budgeting tips, and answer questions about your finances.
                  </p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-white border border-gray-700'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      ) : (
                        <div className="text-sm markdown-content">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-2">{children}</p>,
                              strong: ({ children }) => <span className="font-bold text-blue-300">{children}</span>,
                              em: ({ children }) => <span className="italic text-blue-200">{children}</span>,
                              ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                              li: ({ children }) => <li className="mb-1">{children}</li>,
                              h1: ({ children }) => <h1 className="text-lg font-bold text-blue-300 mb-2">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-base font-bold text-blue-300 mb-2">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-sm font-bold text-blue-300 mb-1">{children}</h3>,
                              a: ({ href, children }) => <a href={href} className="text-blue-400 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                              blockquote: ({ children }) => <blockquote className="border-l-2 border-blue-500 pl-2 italic my-2">{children}</blockquote>,
                              code: ({ children }) => <code className="bg-gray-700 px-1 rounded">{children}</code>,
                              pre: ({ children }) => <pre className="bg-gray-700 p-2 rounded my-2 overflow-x-auto">{children}</pre>,
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      )}
                      <p className="mt-1 text-right text-xs opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="mb-4 flex justify-start">
                  <div className="max-w-[80%] rounded-2xl bg-gray-800 border border-gray-700 px-4 py-3 text-white">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                      <p className="text-sm text-gray-300">Thinking...</p>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-gray-900 p-3">
              <div className="flex items-center gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about finance..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows={1}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    isLoading || !input.trim()
                      ? 'bg-gray-700 text-gray-400'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } transition-colors`}
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;

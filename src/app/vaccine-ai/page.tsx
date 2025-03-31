'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BottomNav } from '@/components/bottom-nav';
import { Brain, Send, RotateCcw, User, StopCircle, RefreshCw, Sparkles, Eraser } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  "What vaccines are recommended for a 2-month-old baby?",
  "What are common side effects of the MMR vaccine?",
  "How do vaccines work to protect against diseases?",
  "When should adults get tetanus boosters?",
  "Is it safe to get multiple vaccines at once?"
];

export default function VaccineAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your Vaccine AI assistant. Ask me any questions about vaccines, immunizations, or related health topics.',
      timestamp: new Date()
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [controller, setController] = useState<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lastMessageRef = useRef<string>("");

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent, regenerateContent?: string) => {
    e.preventDefault();
    const content = regenerateContent || input.trim();
    if (!content || isLoading) return;

    const userMessage: Message = { role: 'user', content, timestamp: new Date() };
    if (!regenerateContent) {
      setInput('');
    }
    setIsLoading(true);
    setShowSuggestions(false);

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    try {
      const abortController = new AbortController();
      setController(abortController);

      const response = await fetch('/api/vaccine-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages.map(({ role, content }) => ({ role, content }))
        }),
        signal: abortController.signal
      });

      if (!response.ok) {
        throw new Error('Failed to get a response');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      let assistantMessage = '';
      const assistantResponseMessage: Message = {
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantResponseMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantMessage += chunk;
        assistantResponseMessage.content = assistantMessage;

        setMessages(prev => [
          ...prev.slice(0, -1),
          { ...assistantResponseMessage }
        ]);
      }

      lastMessageRef.current = assistantMessage;
      
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log('Response generation stopped');
      } else {
        console.error('Error:', error);
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: 'Sorry, I encountered an error. Please try again.',
            timestamp: new Date()
          },
        ]);
      }
    } finally {
      setIsLoading(false);
      setController(null);
      inputRef.current?.focus();
    }
  };

  const stopGenerating = () => {
    if (controller) {
      controller.abort();
      setController(null);
      setIsLoading(false);
    }
  };

  const regenerateResponse = async () => {
    if (isLoading || messages.length === 0) return;
    const lastUserMessage = messages.findLast(m => m.role === 'user');
    if (!lastUserMessage) return;

    // Remove the last assistant message if it exists
    const newMessages = messages.filter(m => 
      !(m.role === 'assistant' && m.content === lastMessageRef.current)
    );
    setMessages(newMessages);
    lastMessageRef.current = "";
    
    // Resubmit with the last user message
    await handleSubmit(new Event('submit') as any, lastUserMessage.content);
  };

  const handleSuggestionClick = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  const resetChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Hello! I\'m your Vaccine AI assistant. Ask me any questions about vaccines, immunizations, or related health topics.',
        timestamp: new Date()
      },
    ]);
    setShowSuggestions(true);
  };

  // Custom components for ReactMarkdown
  const components = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={`${className} bg-gray-800 px-1 py-0.5 rounded text-sm`} {...props}>
          {children}
        </code>
      );
    },
    table({ children }: any) {
      return (
        <div className="overflow-x-auto my-4">
          <table className="min-w-full divide-y divide-gray-700">
            {children}
          </table>
        </div>
      );
    },
    th({ children }: any) {
      return (
        <th className="px-6 py-3 bg-gray-800 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
          {children}
        </th>
      );
    },
    td({ children }: any) {
      return (
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
          {children}
        </td>
      );
    }
  };

  return (
    <main className="bg-gray-950 min-h-screen text-white">
      {/* Main Content */}
      <div className="pb-20">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-gray-950 z-30">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <Brain className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Vaccine AI</h1>
              <p className="text-xs text-gray-400">Powered by AI Engine</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {messages.length > 1 && (
              <button 
                onClick={resetChat}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="max-w-2xl mx-auto p-4">
          {messages.length === 1 && showSuggestions ? (
            <div className="my-8 space-y-6">
              <div className="text-center">
                <div className="bg-green-500/10 rounded-full p-3 w-16 h-16 mx-auto flex items-center justify-center">
                  <Brain className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mt-4">
                  How can I help with vaccines today?
                </h2>
                <p className="mt-2 text-gray-400 max-w-md mx-auto">
                  Ask me anything about vaccines, immunizations, schedules, or safety information.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SUGGESTED_QUESTIONS.map((question, i) => (
                  <motion.button
                    key={question}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => handleSuggestionClick(question)}
                    className="p-4 text-left rounded-lg border border-gray-800 hover:bg-gray-800/50 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-green-500 mb-2" />
                    <p className="text-sm">{question}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              <AnimatePresence>
                {messages.map((message, i) => (
                  i === 0 ? null : (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex items-start gap-3 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div className={`flex gap-3 max-w-[85%] ${
                        message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.role === 'user' 
                            ? 'bg-green-600' 
                            : 'bg-gray-800'
                        }`}>
                          {message.role === 'user' 
                            ? <User className="w-5 h-5 text-white" />
                            : <Brain className="w-5 h-5 text-green-500" />
                          }
                        </div>
                        <div className={`rounded-lg px-4 py-2 ${
                          message.role === 'user'
                            ? 'bg-green-800 text-white'
                            : 'bg-gray-800 text-gray-100'
                        }`}>
                          <div className="prose prose-invert max-w-none prose-sm">
                            {message.role === 'user' ? (
                              <p>{message.content}</p>
                            ) : (
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={components}
                              >
                                {message.content}
                              </ReactMarkdown>
                            )}
                          </div>
                          <div className="text-xs mt-1 opacity-50 flex items-center justify-between gap-2">
                            <span>{message.timestamp.toLocaleTimeString()}</span>
                            {message.role === 'assistant' && message.content === lastMessageRef.current && (
                              <button
                                onClick={regenerateResponse}
                                className="hover:text-green-400 flex items-center gap-1"
                              >
                                <RefreshCw className="h-3 w-3" />
                                <span>Regenerate</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 text-green-500 animate-spin" />
                  </div>
                  <div className="bg-gray-800 rounded-lg px-4 py-2 flex items-center gap-3">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '400ms' }}></div>
                    </div>
                    <button
                      onClick={stopGenerating}
                      className="text-xs flex items-center text-red-400 hover:text-red-300 transition-colors"
                    >
                      <StopCircle className="h-3 w-3 mr-1" />
                      <span>Stop generating</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />

          {/* Floating Stop Button - Mobile */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 z-20 md:hidden"
            >
              <button
                onClick={stopGenerating}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white shadow-lg rounded-full py-2 px-4"
              >
                <StopCircle className="h-4 w-4 text-red-500" />
                <span>Stop generating</span>
              </button>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="fixed bottom-16 left-0 right-0 border-t border-gray-800 bg-gray-900 p-4 z-20">
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about vaccines..."
                className="w-full p-3 pr-12 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white resize-none"
                rows={1}
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
              <div className="absolute right-2 flex items-center gap-2">
                {input.trim() && (
                  <button
                    type="button"
                    onClick={() => setInput('')}
                    className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    <Eraser className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={`p-2 rounded-full ${
                    input.trim() && !isLoading
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Press Enter to send, Shift + Enter for new line
            </div>
          </form>
        </div>
      </div>
      <BottomNav />
    </main>
  );
} 
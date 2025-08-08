import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, 
  Menu, 
  X, 
  Plus, 
  Edit3, 
  Trash2, 
  Send,
  Sidebar
} from 'lucide-react';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

interface HistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  history: HistoryMessage[];
  createdAt: Date;
}

// Custom styles for the futuristic scrollbar
const customStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(59, 130, 246, 0.1);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #2563eb, #7c3aed);
  }
  
  .message-fade-in {
    animation: fadeInUp 0.5s ease-out;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .glow-effect {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = customStyles;
  document.head.appendChild(styleElement);
}

const Chatbot = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle window resize and mobile detection
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile && isSidebarOpen) {
        // Don't auto-close on mobile, let user control it
      } else if (!mobile && !isSidebarOpen) {
        setIsSidebarOpen(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load chat sessions from localStorage on component mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('chatbot-sessions');
    const savedCurrentSessionId = localStorage.getItem('chatbot-current-session');
    
    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions).map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt)
        }));
        setChatSessions(parsedSessions);
        if (savedCurrentSessionId && parsedSessions.find((s: ChatSession) => s.id === savedCurrentSessionId)) {
          setCurrentSessionId(savedCurrentSessionId);
        } else if (parsedSessions.length > 0) {
          setCurrentSessionId(parsedSessions[0].id);
        }
      } catch (error) {
        console.error('Failed to load chat sessions:', error);
      }
    }
  }, []);

  // Save chat sessions to localStorage whenever they change
  useEffect(() => {
    if (chatSessions.length > 0) {
      localStorage.setItem('chatbot-sessions', JSON.stringify(chatSessions));
    }
  }, [chatSessions]);

  // Save current session ID to localStorage
  useEffect(() => {
    if (currentSessionId) {
      localStorage.setItem('chatbot-current-session', currentSessionId);
    }
  }, [currentSessionId]);

  // Get current session
  const currentSession = chatSessions.find(session => session.id === currentSessionId);
  const messages = currentSession?.messages || [];
  const history = currentSession?.history || [];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Create new chat session
  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      history: [],
      createdAt: new Date(),
    };
    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  // Initialize with first chat if none exists
  useEffect(() => {
    if (chatSessions.length === 0) {
      createNewChat();
    }
  }, [chatSessions.length]);

  // Update session title based on first message
  const updateSessionTitle = (sessionId: string, firstMessage: string) => {
    setChatSessions(prev => 
      prev.map(session => 
        session.id === sessionId 
          ? { ...session, title: firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : '') }
          : session
      )
    );
  };

  // Delete chat session
  const deleteSession = (sessionId: string) => {
    setChatSessions(prev => {
      const newSessions = prev.filter(session => session.id !== sessionId);
      // Update localStorage
      if (newSessions.length > 0) {
        localStorage.setItem('chatbot-sessions', JSON.stringify(newSessions));
      } else {
        localStorage.removeItem('chatbot-sessions');
        localStorage.removeItem('chatbot-current-session');
      }
      return newSessions;
    });
    
    if (currentSessionId === sessionId) {
      const remainingSessions = chatSessions.filter(session => session.id !== sessionId);
      if (remainingSessions.length > 0) {
        setCurrentSessionId(remainingSessions[0].id);
      } else {
        // Create a new chat if no sessions remain
        setTimeout(createNewChat, 100);
      }
    }
  };

  // Clear all chats
  const clearAllChats = () => {
    setChatSessions([]);
    setCurrentSessionId(null);
    localStorage.removeItem('chatbot-sessions');
    localStorage.removeItem('chatbot-current-session');
    setTimeout(createNewChat, 100);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N for new chat
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        createNewChat();
      }
      // Ctrl/Cmd + B to toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setIsSidebarOpen(!isSidebarOpen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen]);

  // Handle sending message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '' || !currentSessionId) return;

    const userInput = input;
    setInput('');
    setLoading(true);

    // Update current session with user message
    setChatSessions(prev => 
      prev.map(session => 
        session.id === currentSessionId
          ? { ...session, messages: [...session.messages, { text: userInput, sender: 'user' as const }] }
          : session
      )
    );

    // Update title if it's the first message
    const currentSessionBeforeUpdate = chatSessions.find(s => s.id === currentSessionId);
    if (currentSessionBeforeUpdate?.messages.length === 0) {
      updateSessionTitle(currentSessionId, userInput);
    }

    try {
      // Send prompt and history to backend
      const response = await fetch('/api/AIRequestHistory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userInput,
          history: history,
        }),
      });
      const data = await response.json();
      const aiText = data.response || 'No response from Nexis.';

      // Update current session with AI response and history
      setChatSessions(prev => 
        prev.map(session => 
          session.id === currentSessionId
            ? { 
                ...session, 
                messages: [...session.messages, { text: aiText, sender: 'ai' as const }],
                history: [
                  ...session.history,
                  { role: 'user' as const, content: userInput },
                  { role: 'assistant' as const, content: aiText },
                ]
              }
            : session
        )
      );
    } catch (err) {
      // Update with error message
      setChatSessions(prev => 
        prev.map(session => 
          session.id === currentSessionId
            ? { ...session, messages: [...session.messages, { text: 'Error: Could not get response from Nexis.', sender: 'ai' as const }] }
            : session
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${isMobile ? 'fixed' : 'relative'} ${isMobile ? '' : 'md:translate-x-0'} z-50 w-72 transition-all duration-300 bg-gradient-to-b from-slate-800 via-blue-900 to-indigo-900 text-white flex flex-col h-full shadow-2xl border-r border-blue-500/20`}>
        <div className="p-4 border-b border-blue-400/30 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
          <Button
            onClick={createNewChat}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0 text-white flex items-center justify-center gap-2 h-11 rounded-xl shadow-lg transition-all duration-200 hover:shadow-blue-500/25"
          >
            <Plus className="w-5 h-5" />
            New Chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
          {chatSessions.length === 0 ? (
            <div className="text-center text-blue-300/60 text-sm mt-8">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              No chat history yet
            </div>
          ) : (
            chatSessions.map((session) => (
              <div
                key={session.id}
                className={`group relative mb-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                  currentSessionId === session.id 
                    ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/30 shadow-lg border border-blue-400/30' 
                    : 'hover:bg-blue-800/30 hover:shadow-md'
                }`}
                onClick={() => setCurrentSessionId(session.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 truncate">
                    <MessageCircle className="w-4 h-4 inline mr-3 text-blue-300" />
                    <span className="text-sm font-medium">{session.title}</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session.id);
                      }}
                      className="h-7 w-7 p-0 text-blue-300 hover:text-red-400 hover:bg-red-500/20 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-blue-300/70 mt-2 flex items-center">
                  <div className="w-1 h-1 bg-blue-400 rounded-full mr-2"></div>
                  {session.createdAt.toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Clear All Button */}
        {chatSessions.length > 0 && (
          <div className="p-4 border-t border-blue-400/30">
            <Button
              onClick={clearAllChats}
              variant="ghost"
              className="w-full text-blue-300 hover:text-red-400 hover:bg-red-500/20 text-sm rounded-xl h-10 transition-all duration-200"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Chats
            </Button>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-xl border-b border-blue-200/50 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-100/50 rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Nexis AI Assistant
              </h1>
            </div>
          </div>
          <div className="text-xs text-blue-600/70 hidden sm:block font-medium">
            {currentSession ? `${currentSession.title.length > 25 ? currentSession.title.slice(0, 25) + '...' : currentSession.title}` : ''}
          </div>
        </div>

        {/* Messages Area - Fixed height to prevent scrolling issues */}
        <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ height: 'calc(100vh - 140px)' }}>
          <div className="max-w-4xl mx-auto px-6 py-8">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-blue-600/70 min-h-[400px]">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl glow-effect">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  How can I help you today?
                </h2>
                <p className="text-sm text-blue-500/60 text-center max-w-md">
                  Start a conversation with Nexis, your AI assistant. I'm here to help with any questions you might have.
                </p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                  <div className="p-4 rounded-xl bg-white/60 backdrop-blur border border-blue-200/50 hover:bg-white/80 hover:glow-effect transition-all duration-300 cursor-pointer">
                    <div className="text-blue-600 font-medium text-sm">💡 Ask about features</div>
                    <div className="text-blue-500/70 text-xs mt-1">Learn about the portal's capabilities</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/60 backdrop-blur border border-blue-200/50 hover:bg-white/80 hover:glow-effect transition-all duration-300 cursor-pointer">
                    <div className="text-blue-600 font-medium text-sm">🔧 Get help</div>
                    <div className="text-blue-500/70 text-xs mt-1">Technical support and guidance</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex message-fade-in ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-4 max-w-3xl ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg ${
                        msg.sender === 'user' 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 glow-effect' 
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 glow-effect'
                      }`}>
                        {msg.sender === 'user' ? '👤' : '✨'}
                      </div>
                      <div className={`rounded-2xl px-6 py-4 shadow-lg transition-all duration-200 hover:shadow-xl ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white glow-effect'
                          : 'bg-white/80 backdrop-blur border border-blue-200/50 text-gray-800 hover:bg-white/90'
                      }`}>
                        {msg.sender === 'ai' ? (
                          <div className="prose prose-sm max-w-none prose-blue">
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start message-fade-in">
                    <div className="flex items-start gap-4 max-w-3xl">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold shadow-lg glow-effect">
                        ✨
                      </div>
                      <div className="bg-white/80 backdrop-blur border border-blue-200/50 rounded-2xl px-6 py-4 shadow-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          <span className="text-blue-600/70 text-sm ml-2">Nexis is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="bg-white/90 backdrop-blur-xl border-t border-blue-200/50 p-6 shadow-lg">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSend} className="relative">
              <div className="relative">
                <Input
                  className="w-full pr-14 py-4 px-6 border-2 border-blue-200/50 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 bg-white/80 backdrop-blur text-gray-800 placeholder-blue-400/70 text-sm transition-all duration-200 shadow-lg hover:shadow-xl focus:glow-effect"
                  placeholder="Message Nexis..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  disabled={loading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                />
                <Button
                  type="submit"
                  disabled={input.trim() === '' || loading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 p-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 disabled:from-gray-300 disabled:to-gray-400 rounded-xl shadow-lg transition-all duration-200 hover:shadow-blue-500/25 hover:glow-effect"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
            <div className="mt-3 text-xs text-blue-500/60 text-center flex items-center justify-center gap-4">
              <span className="flex items-center gap-1">
                🤖 Nexis can make mistakes. Consider checking important information.
              </span>
              {!isMobile && (
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-0.5 text-xs font-mono bg-blue-100 text-blue-600 rounded border border-blue-200">Enter</kbd>
                  <span>to send</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
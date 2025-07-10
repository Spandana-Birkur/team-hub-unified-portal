import React, { useState, useEffect, useRef } from 'react';
import { Search, Users, FileText, Calendar, Ticket, BookOpen, Settings, ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'employee' | 'document' | 'event' | 'ticket' | 'training' | 'settings';
  url: string;
  icon: React.ReactNode;
}

const GlobalSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Mock search data
  const searchData: SearchResult[] = [
    {
      id: '1',
      title: 'John Smith',
      description: 'Software Engineer - IT Department',
      type: 'employee',
      url: '/employee-portal',
      icon: <Users className="h-4 w-4" />
    },
    {
      id: '2',
      title: 'Employee Handbook',
      description: 'Company policies and procedures',
      type: 'document',
      url: '/documents',
      icon: <FileText className="h-4 w-4" />
    },
    {
      id: '3',
      title: 'Team Meeting',
      description: 'Weekly standup - Tomorrow 10:00 AM',
      type: 'event',
      url: '/calendar',
      icon: <Calendar className="h-4 w-4" />
    },
    {
      id: '4',
      title: 'TKT-2024-001',
      description: 'Network connectivity issue - High Priority',
      type: 'ticket',
      url: '/it-helpdesk',
      icon: <Ticket className="h-4 w-4" />
    },
    {
      id: '5',
      title: 'Cybersecurity Training',
      description: 'Required training module - Due this week',
      type: 'training',
      url: '/training',
      icon: <BookOpen className="h-4 w-4" />
    },
    {
      id: '6',
      title: 'Account Settings',
      description: 'Update profile and preferences',
      type: 'settings',
      url: '/settings',
      icon: <Settings className="h-4 w-4" />
    }
  ];

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = searchData.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setResults(filtered);
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearchTerm('');
        setSelectedIndex(0);
      }
      
      if (isOpen && results.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % results.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    setIsOpen(false);
    setSearchTerm('');
    setSelectedIndex(0);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'employee':
        return 'bg-blue-100 text-blue-800';
      case 'document':
        return 'bg-green-100 text-green-800';
      case 'event':
        return 'bg-purple-100 text-purple-800';
      case 'ticket':
        return 'bg-orange-100 text-orange-800';
      case 'training':
        return 'bg-indigo-100 text-indigo-800';
      case 'settings':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        className="w-64 justify-start text-muted-foreground"
        onClick={() => setIsOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Search anything...
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-[50%] top-[20%] z-50 grid w-full max-w-lg translate-x-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder="Search employees, documents, events, tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 p-0 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-6 w-6 p-0"
          >
            ✕
          </Button>
        </div>
        
        {results.length > 0 && (
          <div ref={resultsRef} className="max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div
                key={result.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  index === selectedIndex ? 'bg-muted' : 'hover:bg-muted/50'
                }`}
                onClick={() => handleResultClick(result)}
              >
                <div className="flex-shrink-0 text-muted-foreground">
                  {result.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{result.title}</p>
                    <Badge variant="secondary" className={`text-xs ${getTypeColor(result.type)}`}>
                      {result.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{result.description}</p>
                </div>
                <div className="flex-shrink-0 text-muted-foreground">
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            ))}
          </div>
        )}
        
        {searchTerm && results.length === 0 && (
          <div className="p-4 text-center text-muted-foreground">
            No results found for "{searchTerm}"
          </div>
        )}
        
        {!searchTerm && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Quick search:</p>
            <div className="grid grid-cols-2 gap-2">
              {searchData.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-2 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleResultClick(item)}
                >
                  <div className="text-muted-foreground">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSearch; 
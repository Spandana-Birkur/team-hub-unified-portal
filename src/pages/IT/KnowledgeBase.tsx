import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Shield, Search, BookOpen, Wrench, Lock, Monitor, Plus, Star, Eye, Download } from 'lucide-react';

const KnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Articles', icon: BookOpen, count: 156 },
    { id: 'setup', name: 'Setup Guides', icon: Monitor, count: 23 },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: Wrench, count: 45 },
    { id: 'security', name: 'Security Policies', icon: Lock, count: 18 },
    { id: 'software', name: 'Software Manuals', icon: Shield, count: 34 },
    { id: 'hardware', name: 'Hardware Guides', icon: Monitor, count: 36 },
  ];

  const articles = [
    {
      id: 'KB-001',
      title: 'How to Set Up VPN Connection',
      category: 'setup',
      author: 'IT Support Team',
      lastUpdated: '2024-01-15',
      views: 1247,
      rating: 4.8,
      tags: ['VPN', 'Network', 'Security'],
      description: 'Step-by-step guide for configuring VPN connection on various devices and operating systems.'
    },
    {
      id: 'KB-002',
      title: 'Troubleshooting WiFi Connection Issues',
      category: 'troubleshooting',
      author: 'Network Team',
      lastUpdated: '2024-01-12',
      views: 892,
      rating: 4.6,
      tags: ['WiFi', 'Network', 'Troubleshooting'],
      description: 'Common WiFi connection problems and their solutions for office and remote work environments.'
    },
    {
      id: 'KB-003',
      title: 'Password Security Best Practices',
      category: 'security',
      author: 'Security Team',
      lastUpdated: '2024-01-10',
      views: 1567,
      rating: 4.9,
      tags: ['Security', 'Passwords', 'Best Practices'],
      description: 'Guidelines for creating and managing secure passwords in the workplace.'
    },
    {
      id: 'KB-004',
      title: 'Installing Adobe Creative Suite',
      category: 'software',
      author: 'Software Support',
      lastUpdated: '2024-01-08',
      views: 634,
      rating: 4.7,
      tags: ['Software', 'Adobe', 'Installation'],
      description: 'Complete installation guide for Adobe Creative Suite with license activation.'
    },
    {
      id: 'KB-005',
      title: 'Laptop Maintenance Schedule',
      category: 'hardware',
      author: 'Hardware Team',
      lastUpdated: '2024-01-05',
      views: 445,
      rating: 4.5,
      tags: ['Hardware', 'Maintenance', 'Laptops'],
      description: 'Recommended maintenance schedule and procedures for company laptops.'
    },
    {
      id: 'KB-006',
      title: 'Email Configuration Guide',
      category: 'setup',
      author: 'IT Support Team',
      lastUpdated: '2024-01-03',
      views: 1123,
      rating: 4.8,
      tags: ['Email', 'Outlook', 'Configuration'],
      description: 'Setting up email accounts in Outlook and other email clients.'
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : BookOpen;
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">IT Knowledge Base</h1>
        <p className="text-muted-foreground">Common solutions, troubleshooting guides, and IT policies.</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search knowledge base articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Article
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.map((category) => {
                  const CategoryIcon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <CategoryIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Articles List */}
        <div className="lg:col-span-3">
          <div className="space-y-4">
            {filteredArticles.map((article) => {
              const CategoryIcon = getCategoryIcon(article.category);
              return (
                <Card key={article.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <CategoryIcon className="w-4 h-4 text-blue-600" />
                          <Badge variant="outline" className="text-xs">
                            {getCategoryName(article.category)}
                          </Badge>
                          <Badge className="border border-border bg-muted text-muted-foreground text-xs">
                            {article.id}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{article.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{article.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3">
                          <span>By {article.author}</span>
                          <span>Updated {article.lastUpdated}</span>
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {article.views}
                          </span>
                          <span className="flex items-center">
                            <Star className="w-3 h-3 mr-1 text-yellow-500" />
                            {article.rating}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {article.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredArticles.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Shield className="w-16 h-16 text-muted-foreground opacity-50 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No articles found</h3>
                <p className="text-muted-foreground">Try adjusting your search terms or category filter.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;

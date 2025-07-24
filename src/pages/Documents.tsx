import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, FolderPlus, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const initialDocuments = [
  { id: 1, title: 'Employee Handbook', type: 'Policy', lastUpdated: '2024-01-15', version: '2.1', owner: 'HR', category: 'Policies' },
  { id: 2, title: 'Leave Request Form', type: 'Form', lastUpdated: '2024-01-10', version: '1.3', owner: 'HR', category: 'Forms' },
  { id: 3, title: 'Code of Conduct', type: 'Policy', lastUpdated: '2024-01-08', version: '3.0', owner: 'HR', category: 'Policies' },
  { id: 4, title: 'Expense Reimbursement Form', type: 'Form', lastUpdated: '2024-01-05', version: '1.2', owner: 'Finance', category: 'Forms' },
  { id: 5, title: 'Onboarding Checklist', type: 'Checklist', lastUpdated: '2024-01-02', version: '1.0', owner: 'HR', category: 'Onboarding' },
  { id: 6, title: 'Remote Work Policy', type: 'Policy', lastUpdated: '2023-12-20', version: '1.1', owner: 'HR', category: 'Policies' },
  { id: 7, title: 'Performance Review Template', type: 'Template', lastUpdated: '2023-12-15', version: '2.0', owner: 'HR', category: 'Templates' },
  { id: 8, title: 'Employee Guide', type: 'Guide', lastUpdated: '2023-12-10', version: '1.0', owner: 'HR', category: 'Guides' },
];

const typeOptions = ['Policy', 'Form', 'Template', 'Guide', 'Checklist'];

const Documents = () => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [categories, setCategories] = useState(() => Array.from(new Set(initialDocuments.map(doc => doc.category))));
  const [newCategory, setNewCategory] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    name: '',
    owner: '',
    type: typeOptions[0],
    version: '',
    file: null as File | null,
    category: categories[0] || '',
  });

  const documentsByCategory = documents.reduce((acc, doc) => {
    acc[doc.category] = acc[doc.category] || [];
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, typeof documents>);

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories([...categories, trimmed]);
      setNewCategory('');
    }
  };

  const handleUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadData({ ...uploadData, file: e.target.files[0] });
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.name || !uploadData.owner || !uploadData.type || !uploadData.version || !uploadData.category) return;
    const newDoc = {
      id: documents.length + 1,
      title: uploadData.name,
      type: uploadData.type,
      lastUpdated: new Date().toISOString().slice(0, 10),
      version: uploadData.version,
      owner: uploadData.owner,
      category: uploadData.category,
      file: uploadData.file,
    };
    setDocuments([...documents, newDoc]);
    if (!categories.includes(uploadData.category)) {
      setCategories([...categories, uploadData.category]);
    }
    setUploadOpen(false);
    setUploadData({ name: '', owner: '', type: typeOptions[0], version: '', file: null, category: categories[0] || '' });
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white dark:text-white mb-2">Company Documents Directory</h1>
        <p className="text-white dark:text-white">Browse and manage all company documents by category.</p>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Documents</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button onClick={() => setUploadOpen(true)}>
              <Upload className="w-4 h-4 mr-1" /> Upload Document
            </Button>
            <input
              type="text"
              className="border rounded px-2 py-1 text-sm"
              placeholder="New category name"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAddCategory(); }}
              style={{ minWidth: 150 }}
            />
            <Button size="sm" onClick={handleAddCategory} variant="outline">
              <FolderPlus className="w-4 h-4 mr-1" />
              Create New Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {categories.map((category) => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-2 text-blue-700">{category}</h3>
                <div className="space-y-4">
                  {(documentsByCategory[category] || []).length === 0 && (
                    <div className="text-white dark:text-white italic">No documents in this category.</div>
                  )}
                  {(documentsByCategory[category] || []).map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white dark:text-white">{doc.title}</h4>
                        <p className="text-sm text-white dark:text-white">Type: {doc.type} • Version: {doc.version} • Owner: {doc.owner}</p>
                        <p className="text-xs text-white dark:text-white">Last updated: {doc.lastUpdated}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">View</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent>
          <form onSubmit={handleUploadSubmit}>
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-white dark:text-white">Document Name</label>
                <input type="text" className="border rounded px-2 py-1 w-full" value={uploadData.name} onChange={e => setUploadData({ ...uploadData, name: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white dark:text-white">Owner</label>
                <input type="text" className="border rounded px-2 py-1 w-full" value={uploadData.owner} onChange={e => setUploadData({ ...uploadData, owner: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white dark:text-white">Type</label>
                <select className="border rounded px-2 py-1 w-full" value={uploadData.type} onChange={e => setUploadData({ ...uploadData, type: e.target.value })} required>
                  {typeOptions.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white dark:text-white">Version</label>
                <input type="text" className="border rounded px-2 py-1 w-full" value={uploadData.version} onChange={e => setUploadData({ ...uploadData, version: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white dark:text-white">Category</label>
                <select className="border rounded px-2 py-1 w-full" value={uploadData.category} onChange={e => setUploadData({ ...uploadData, category: e.target.value })} required>
                  {categories.map(category => <option key={category} value={category}>{category}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-white dark:text-white">File Upload</label>
                <input type="file" className="border rounded px-2 py-1 w-full" onChange={handleUploadChange} required />
              </div>
            </div>
            <DialogFooter className="mt-6 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setUploadOpen(false)}>Cancel</Button>
              <Button type="submit">Upload</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Documents; 
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Download } from 'lucide-react';

const HRDocuments = () => {
  const [hrDocuments, setHrDocuments] = useState([
    { id: 1, title: 'Employee Handbook', type: 'Policy', lastUpdated: '2024-01-15', version: '2.1', category: 'Policies' },
    { id: 2, title: 'Leave Request Form', type: 'Form', lastUpdated: '2024-01-10', version: '1.3', category: 'Forms' },
    { id: 3, title: 'Code of Conduct', type: 'Policy', lastUpdated: '2024-01-08', version: '3.0', category: 'Policies' },
    { id: 4, title: 'Expense Reimbursement Form', type: 'Form', lastUpdated: '2024-01-05', version: '1.2', category: 'Forms' },
    { id: 5, title: 'Onboarding Checklist', type: 'Checklist', lastUpdated: '2024-01-02', version: '1.0', category: 'Onboarding' },
    { id: 6, title: 'Remote Work Policy', type: 'Policy', lastUpdated: '2023-12-20', version: '1.1', category: 'Policies' },
    { id: 7, title: 'Performance Review Template', type: 'Template', lastUpdated: '2023-12-15', version: '2.0', category: 'Templates' },
    { id: 8, title: 'Employee Guide', type: 'Guide', lastUpdated: '2023-12-10', version: '1.0', category: 'Guides' },
  ]);
  const [newDocumentModalOpen, setNewDocumentModalOpen] = useState(false);
  const [newDocument, setNewDocument] = useState({
    title: '',
    type: 'Policy',
    category: 'Policies',
    version: '1.0'
  });

  // HR Documents functions
  const handleUploadDocument = () => {
    setNewDocumentModalOpen(true);
  };

  const handleSubmitNewDocument = () => {
    const newId = Math.max(...hrDocuments.map(d => d.id)) + 1;
    const newDoc = {
      id: newId,
      title: newDocument.title,
      type: newDocument.type,
      category: newDocument.category,
      version: newDocument.version,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setHrDocuments(prev => [...prev, newDoc]);
    setNewDocument({ title: '', type: 'Policy', category: 'Policies', version: '1.0' });
    setNewDocumentModalOpen(false);
  };

  const closeNewDocumentModal = () => {
    setNewDocumentModalOpen(false);
    setNewDocument({ title: '', type: 'Policy', category: 'Policies', version: '1.0' });
  };

  const handleDownloadDocument = (document: any) => {
    // Simulate download
    alert(`Downloading ${document.title}...`);
  };

  const handleViewDocument = (document: any) => {
    alert(`Opening ${document.title}...`);
  };

  // Helper to group documents by category
  const documentsByCategory = hrDocuments.reduce((acc, doc) => {
    acc[doc.category] = acc[doc.category] || [];
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, typeof hrDocuments>);

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>HR Policies & Documents</span>
          </CardTitle>
          <Button onClick={handleUploadDocument}>Upload Document</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {Object.keys(documentsByCategory).map((category) => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-2 text-blue-700">{category}</h3>
                <div className="space-y-4">
                  {documentsByCategory[category].map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{doc.title}</h4>
                        <p className="text-sm text-gray-600">Type: {doc.type} • Version: {doc.version}</p>
                        <p className="text-xs text-gray-500">Last updated: {doc.lastUpdated}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleDownloadDocument(doc)}>
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleViewDocument(doc)}>View</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* New Document Modal */}
      <Dialog open={newDocumentModalOpen} onOpenChange={setNewDocumentModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Upload New Document</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Document Title</label>
              <Input 
                placeholder="Enter document title"
                value={newDocument.title}
                onChange={(e) => setNewDocument(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Document Type</label>
              <select 
                className="w-full mt-1 p-2 border rounded-md"
                value={newDocument.type}
                onChange={(e) => setNewDocument(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="Policy">Policy</option>
                <option value="Form">Form</option>
                <option value="Template">Template</option>
                <option value="Guide">Guide</option>
                <option value="Checklist">Checklist</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              <select 
                className="w-full mt-1 p-2 border rounded-md"
                value={newDocument.category}
                onChange={(e) => setNewDocument(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="Policies">Policies</option>
                <option value="Forms">Forms</option>
                <option value="Templates">Templates</option>
                <option value="Guides">Guides</option>
                <option value="Onboarding">Onboarding</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Version</label>
              <Input 
                placeholder="1.0"
                value={newDocument.version}
                onChange={(e) => setNewDocument(prev => ({ ...prev, version: e.target.value }))}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={closeNewDocumentModal}>
                Cancel
              </Button>
              <Button onClick={handleSubmitNewDocument} disabled={!newDocument.title}>
                Upload Document
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HRDocuments;

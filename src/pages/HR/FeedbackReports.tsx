import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MessageSquare, FileText, AlertTriangle } from 'lucide-react';
import { safetyReports } from '@/data/safetyReports';

const FeedbackReports = () => {
  const [feedbackEntries, setFeedbackEntries] = useState([
    { id: 1, from: 'Jane Smith', to: 'John Doe', type: 'positive', content: 'Excellent work on the recent project', date: '2024-01-15' },
    { id: 2, from: 'David Wilson', to: 'Sarah Johnson', type: 'constructive', content: 'Great leadership shown in team meetings', date: '2024-01-14' },
  ]);
  const [reports, setReports] = useState(safetyReports);
  const [viewReport, setViewReport] = React.useState(null);

  const handleDownloadReport = (report: any) => {
    alert(`Downloading ${report.file}...`);
  };

  const handleResolveReport = (id: number) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'Resolved' } : r));
    setViewReport(null);
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Employee Feedback</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feedbackEntries.length === 0 ? (
              <div className="text-gray-500">No feedback entries yet.</div>
            ) : (
              feedbackEntries.map(entry => (
                <div key={entry.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-xs font-semibold ${entry.type === 'positive' ? 'text-green-600' : 'text-yellow-600'}`}>{entry.type === 'positive' ? 'Positive' : 'Constructive'}</span>
                      <span className="text-xs text-gray-400">{entry.date}</span>
                    </div>
                    <div className="font-medium text-gray-900">{entry.content}</div>
                    <div className="text-xs text-gray-500 mt-1">From: {entry.from} &rarr; To: {entry.to}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Employee</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.filter(r => r.type !== 'Special').length === 0 ? (
                  <tr><td colSpan={6} className="text-gray-500 px-4 py-4 text-center">No reports available.</td></tr>
                ) : (
                  reports.filter(r => r.type !== 'Special').map(report => (
                    <tr key={report.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{report.category}</td>
                      <td className="px-4 py-2">{report.description}</td>
                      <td className="px-4 py-2">{report.employee}</td>
                      <td className="px-4 py-2">{report.date}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${report.status === 'Submitted' ? 'bg-yellow-100 text-yellow-700' : report.status === 'In Review' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{report.status}</span>
                      </td>
                      <td className="px-4 py-2">
                        <Button size="sm" variant="outline" onClick={() => setViewReport(report)}>View</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Special Reports Section */}
          <div className="mt-10">
            <h3 className="font-semibold text-lg mb-2">Special Reports (Non-Male Form)</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-left">Employee</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.filter(r => r.type === 'Special').length === 0 ? (
                    <tr><td colSpan={6} className="text-gray-500 px-4 py-4 text-center">No special reports available.</td></tr>
                  ) : (
                    reports.filter(r => r.type === 'Special').map(report => (
                      <tr key={report.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{report.category}</td>
                        <td className="px-4 py-2">{report.description}</td>
                        <td className="px-4 py-2">{report.employee}</td>
                        <td className="px-4 py-2">{report.date}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${report.status === 'Submitted' ? 'bg-yellow-100 text-yellow-700' : report.status === 'In Review' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{report.status}</span>
                        </td>
                        <td className="px-4 py-2">
                          <Button size="sm" variant="outline" onClick={() => setViewReport(report)}>View</Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Report View Dialog */}
      <Dialog open={!!viewReport} onOpenChange={open => !open && setViewReport(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
          </DialogHeader>
          {viewReport && (
            <div className="space-y-2">
              <p><strong>Category:</strong> {viewReport.category}</p>
              <p><strong>Description:</strong> {viewReport.description}</p>
              <p><strong>Employee:</strong> {viewReport.employee}</p>
              <p><strong>Date:</strong> {viewReport.date}</p>
              <div><strong>Status:</strong> {viewReport.status}</div>
              <p><strong>Details:</strong> {viewReport.details || 'N/A'}</p>
              <p><strong>Anonymous:</strong> {viewReport.anonymous ? 'Yes' : 'No'}</p>
              {viewReport.status !== 'Resolved' && (
                <div className="flex justify-end pt-4">
                  <Button onClick={() => handleResolveReport(viewReport.id)}>
                    Mark as Resolved
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeedbackReports;

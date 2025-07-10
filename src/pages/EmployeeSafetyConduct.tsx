import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { useUserProfile } from '@/contexts/UserProfileContext';

const categories = [
  'Sexual Harassment',
  'Discrimination',
  'Bullying',
  'Unsafe Environment',
  'Other',
];

const policies = [
  { title: 'Sexual Harassment Policy', content: 'Our company strictly prohibits sexual harassment...' },
  { title: 'Anti-Discrimination Policy', content: 'We are committed to a workplace free from discrimination...' },
  { title: 'Whistleblower Protection Policy', content: 'Employees are encouraged to report misconduct without fear...' },
  { title: 'Code of Conduct', content: 'All employees must adhere to our code of conduct...' },
  { title: 'Retaliation Protection Information', content: 'Retaliation against employees who report issues is prohibited...' },
];

const resources = [
  { title: 'HR Contact Info', content: 'Email: hr@company.com | Phone: (555) 123-4567' },
  { title: 'External Reporting Channels', content: 'EEOC: www.eeoc.gov | Hotline: 1-800-669-4000' },
  { title: 'Mental Health & Counseling Services', content: 'Confidential counseling available at (555) 987-6543' },
  { title: 'Emergency Assistance', content: 'Dial 911 for emergencies or contact building security.' },
];

const faqs = [
  { q: 'What happens after I file a report?', a: 'HR will review your complaint and follow up as needed.' },
  { q: 'How is confidentiality handled?', a: 'Your identity is protected to the fullest extent possible.' },
  { q: 'Who reviews the complaint?', a: 'Only authorized HR personnel will review your report.' },
  { q: 'Can I withdraw a complaint?', a: 'Yes, you may withdraw your complaint at any time.' },
];

const training = [
  { title: 'Workplace Safety Training', link: '#', completed: true },
  { title: 'Anti-Harassment Module', link: '#', completed: false },
  { title: 'Diversity & Inclusion Workshop', link: '#', completed: false },
];

const EmployeeSafetyConduct: React.FC = () => {
  const { profile } = useUserProfile();
  const [reports, setReports] = useState<any[]>([]);
  const [generalForm, setGeneralForm] = useState({
    category: '',
    description: '',
    anonymous: false,
    details: '',
  });
  const [specialForm, setSpecialForm] = useState({
    category: '',
    description: '',
    anonymous: false,
    details: '',
  });
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('report');

  const isMale = profile.gender && profile.gender.toLowerCase() === 'male';

  const handleGeneralFormChange = (field: string, value: any) => {
    setGeneralForm((prev) => ({ ...prev, [field]: value }));
  };
  const handleSpecialFormChange = (field: string, value: any) => {
    setSpecialForm((prev) => ({ ...prev, [field]: value }));
  };
  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReports([
      {
        ...generalForm,
        type: 'General',
        status: 'Submitted',
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        messages: [],
      },
      ...reports,
    ]);
    setGeneralForm({ category: '', description: '', anonymous: false, details: '' });
  };
  const handleSpecialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReports([
      {
        ...specialForm,
        type: 'Special',
        status: 'Submitted',
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        messages: [],
      },
      ...reports,
    ]);
    setSpecialForm({ category: '', description: '', anonymous: false, details: '' });
  };

  const handleSendMessage = (id: number) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, messages: [...r.messages, { from: 'employee', text: message, date: new Date().toLocaleString() }] } : r
      )
    );
    setMessage('');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Employee Safety & Conduct</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="mb-4">
          <TabsTrigger value="report">Report an Issue</TabsTrigger>
          <TabsTrigger value="myreports">My Reports</TabsTrigger>
          <TabsTrigger value="policy">Policy Center</TabsTrigger>
          <TabsTrigger value="resources">Resources & Support</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="training">Training & Awareness</TabsTrigger>
        </TabsList>
        <TabsContent value="report">
          <Card>
            <CardHeader>
              <CardTitle>Report an Issue</CardTitle>
            </CardHeader>
            <CardContent>
              {/* General reporting form for all employees */}
              <div className="mb-8">
                <h2 className="font-semibold mb-2">General Reporting Form</h2>
                <form onSubmit={handleGeneralSubmit} className="space-y-4">
                  <div>
                    <label className="block font-medium mb-1">Category</label>
                    <Select value={generalForm.category} onValueChange={(v) => handleGeneralFormChange('category', v)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Description</label>
                    <Textarea
                      value={generalForm.description}
                      onChange={(e) => handleGeneralFormChange('description', e.target.value)}
                      required
                      placeholder="Describe the issue..."
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={generalForm.anonymous}
                      onChange={(e) => handleGeneralFormChange('anonymous', e.target.checked)}
                      id="anonymous"
                    />
                    <label htmlFor="anonymous">Report Anonymously</label>
                  </div>
                  {!generalForm.anonymous && (
                    <div>
                      <label className="block font-medium mb-1">Additional Details (optional)</label>
                      <Input
                        value={generalForm.details}
                        onChange={(e) => handleGeneralFormChange('details', e.target.value)}
                        placeholder="Any extra info..."
                      />
                    </div>
                  )}
                  <Button type="submit">Submit Report</Button>
                </form>
              </div>
              {/* Special form only for non-male employees */}
              {!isMale && (
                <div className="border-t pt-6 mt-6">
                  <h2 className="font-semibold mb-2 text-pink-700">Special Reporting Form (For Non-Male Employees Only)</h2>
                  <form onSubmit={handleSpecialSubmit} className="space-y-4">
                    <div>
                      <label className="block font-medium mb-1">Category</label>
                      <Select value={specialForm.category} onValueChange={(v) => handleSpecialFormChange('category', v)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Description</label>
                      <Textarea
                        value={specialForm.description}
                        onChange={(e) => handleSpecialFormChange('description', e.target.value)}
                        required
                        placeholder="Describe the issue..."
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={specialForm.anonymous}
                        onChange={(e) => handleSpecialFormChange('anonymous', e.target.checked)}
                        id="anonymous-nonmale"
                      />
                      <label htmlFor="anonymous-nonmale">Report Anonymously</label>
                    </div>
                    {!specialForm.anonymous && (
                      <div>
                        <label className="block font-medium mb-1">Additional Details (optional)</label>
                        <Input
                          value={specialForm.details}
                          onChange={(e) => handleSpecialFormChange('details', e.target.value)}
                          placeholder="Any extra info..."
                        />
                      </div>
                    )}
                    <Button type="submit">Submit Special Report</Button>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="myreports">
          <Card>
            <CardHeader>
              <CardTitle>My Reports</CardTitle>
            </CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <div className="text-gray-500">No reports submitted yet.</div>
              ) : (
                <div className="space-y-4">
                  {reports.filter(r => !r.anonymous).map((report) => (
                    <Card key={report.id} className="border p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="font-semibold">{report.category}</span> &mdash; <span className="text-xs text-gray-500">{report.date}</span>
                          <span className="ml-2 text-xs text-gray-400">[{report.type}]</span>
                        </div>
                        <span className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-700">{report.status}</span>
                      </div>
                      <div className="mb-2">{report.description}</div>
                      <div className="mb-2 text-xs text-gray-500">Details: {report.details || 'N/A'}</div>
                      <div className="mb-2">
                        <strong>HR Messages:</strong>
                        <div className="ml-2 space-y-1">
                          {report.messages.length === 0 ? (
                            <div className="text-xs text-gray-400">No messages yet.</div>
                          ) : (
                            report.messages.map((msg: any, idx: number) => (
                              <div key={idx} className="text-xs"><span className="font-semibold">{msg.from}:</span> {msg.text} <span className="text-gray-400">({msg.date})</span></div>
                            ))
                          )}
                        </div>
                        <div className="flex mt-2 gap-2">
                          <Input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message to HR..."
                          />
                          <Button size="sm" onClick={() => handleSendMessage(report.id)}>Send</Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="policy">
          <Accordion type="multiple" className="w-full">
            {policies.map((policy) => (
              <AccordionItem key={policy.title} value={policy.title}>
                <AccordionTrigger>{policy.title}</AccordionTrigger>
                <AccordionContent>{policy.content}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
        <TabsContent value="resources">
          <Accordion type="multiple" className="w-full">
            {resources.map((res) => (
              <AccordionItem key={res.title} value={res.title}>
                <AccordionTrigger>{res.title}</AccordionTrigger>
                <AccordionContent>{res.content}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
        <TabsContent value="faq">
          <Accordion type="multiple" className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.q} value={faq.q}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
        <TabsContent value="training">
          <Card>
            <CardHeader>
              <CardTitle>Training & Awareness</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {training.map((t) => (
                  <li key={t.title} className="flex items-center gap-2">
                    <a href={t.link} className="text-blue-600 underline">{t.title}</a>
                    {t.completed && <span className="text-green-600 text-xs ml-2">(Certificate Earned)</span>}
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-sm text-gray-500">Mandatory workshops are scheduled quarterly. Check your email for upcoming dates.</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeSafetyConduct; 
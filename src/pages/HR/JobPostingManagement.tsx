import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, MapPin, Clock, DollarSign, Building, FileText, Plus, Edit, Trash2, Eye, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUserProfile } from '@/contexts/UserProfileContext';

interface JobPosting {
  id: number;
  title: string;
  description: string;
  department: string;
  location: string;
  requirements: string;
  salary_range: string;
  job_type: string;
  status: string;
  created_date: string;
  deadline: string;
  applications_count: number;
}

interface JobApplication {
  id: number;
  job_posting_id: number;
  applicant_id: number;
  applicant_name: string;
  cover_letter: string;
  status: string;
  applied_date: string;
}

const JobPostingManagement = () => {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isApplicationsDialogOpen, setIsApplicationsDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [selectedJobApplications, setSelectedJobApplications] = useState<JobApplication[]>([]);
  const { toast } = useToast();
  const { profile } = useUserProfile();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    location: '',
    requirements: '',
    salary_range: '',
    job_type: '',
    deadline: ''
  });

  // Mock data for demonstration
  const mockJobPostings: JobPosting[] = [
    {
      id: 1,
      title: "Senior Software Engineer",
      description: "We are looking for a Senior Software Engineer to join our development team.",
      department: "Engineering",
      location: "San Francisco, CA",
      requirements: "• 5+ years of experience in software development\n• Proficiency in React, Node.js, and TypeScript",
      salary_range: "$120,000 - $150,000",
      job_type: "Full-time",
      status: "Active",
      created_date: "2024-08-01T10:00:00Z",
      deadline: "2024-09-01T23:59:59Z",
      applications_count: 3
    },
    {
      id: 2,
      title: "Product Manager",
      description: "Join our product team to drive the development of innovative solutions.",
      department: "Product",
      location: "New York, NY",
      requirements: "• 3+ years of product management experience\n• Strong analytical and strategic thinking",
      salary_range: "$130,000 - $160,000",
      job_type: "Full-time",
      status: "Active",
      created_date: "2024-08-05T14:30:00Z",
      deadline: "2024-09-15T23:59:59Z",
      applications_count: 1
    },
    {
      id: 3,
      title: "UX Designer",
      description: "Create exceptional user experiences by designing intuitive and beautiful interfaces.",
      department: "Design",
      location: "Remote",
      requirements: "• 4+ years of UX/UI design experience\n• Proficiency in Figma and design tools",
      salary_range: "$90,000 - $120,000",
      job_type: "Full-time",
      status: "Draft",
      created_date: "2024-08-10T09:15:00Z",
      deadline: "2024-09-30T23:59:59Z",
      applications_count: 0
    }
  ];

  const mockApplications: JobApplication[] = [
    {
      id: 1,
      job_posting_id: 1,
      applicant_id: 1,
      applicant_name: "John Doe",
      cover_letter: "I am excited to apply for the Senior Software Engineer position...",
      status: "Applied",
      applied_date: "2024-08-15T10:30:00Z"
    },
    {
      id: 2,
      job_posting_id: 1,
      applicant_id: 2,
      applicant_name: "Jane Smith",
      cover_letter: "I have been working as a software engineer for 6 years...",
      status: "Under Review",
      applied_date: "2024-08-16T14:20:00Z"
    },
    {
      id: 3,
      job_posting_id: 1,
      applicant_id: 3,
      applicant_name: "Mike Johnson",
      cover_letter: "I am passionate about building scalable software solutions...",
      status: "Interviewed",
      applied_date: "2024-08-17T09:45:00Z"
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setJobPostings(mockJobPostings);
      setApplications(mockApplications);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateJob = () => {
    if (!formData.title || !formData.description || !formData.department || !formData.location || 
        !formData.requirements || !formData.salary_range || !formData.job_type || !formData.deadline) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newJob: JobPosting = {
      id: Date.now(),
      ...formData,
      status: "Active",
      created_date: new Date().toISOString(),
      applications_count: 0
    };

    setJobPostings(prev => [newJob, ...prev]);
    setIsCreateDialogOpen(false);
    setFormData({
      title: '',
      description: '',
      department: '',
      location: '',
      requirements: '',
      salary_range: '',
      job_type: '',
      deadline: ''
    });

    toast({
      title: "Job Posting Created",
      description: "The job posting has been created successfully.",
    });
  };

  const handleEditJob = () => {
    if (!selectedJob) return;

    const updatedJob = { ...selectedJob, ...formData };
    setJobPostings(prev => prev.map(job => job.id === selectedJob.id ? updatedJob : job));
    setIsEditDialogOpen(false);
    setSelectedJob(null);
    setFormData({
      title: '',
      description: '',
      department: '',
      location: '',
      requirements: '',
      salary_range: '',
      job_type: '',
      deadline: ''
    });

    toast({
      title: "Job Posting Updated",
      description: "The job posting has been updated successfully.",
    });
  };

  const handleDeleteJob = (jobId: number) => {
    setJobPostings(prev => prev.filter(job => job.id !== jobId));
    toast({
      title: "Job Posting Deleted",
      description: "The job posting has been deleted successfully.",
    });
  };

  const handleViewApplications = (job: JobPosting) => {
    const jobApplications = applications.filter(app => app.job_posting_id === job.id);
    setSelectedJobApplications(jobApplications);
    setSelectedJob(job);
    setIsApplicationsDialogOpen(true);
  };

  const handleEditClick = (job: JobPosting) => {
    setSelectedJob(job);
    setFormData({
      title: job.title,
      description: job.description,
      department: job.department,
      location: job.location,
      requirements: job.requirements,
      salary_range: job.salary_range,
      job_type: job.job_type,
      deadline: job.deadline
    });
    setIsEditDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'Draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'Closed':
        return <Badge variant="destructive">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getApplicationStatusBadge = (status: string) => {
    switch (status) {
      case 'Applied':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Applied</Badge>;
      case 'Under Review':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Under Review</Badge>;
      case 'Interviewed':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Interviewed</Badge>;
      case 'Offered':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Offered</Badge>;
      case 'Rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Posting Management</h1>
          <p className="text-gray-600 mt-2">Create and manage internal job postings</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Job Posting
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Job Posting</DialogTitle>
              <DialogDescription>
                Fill in the details for the new job posting.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., San Francisco, CA"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary_range">Salary Range *</Label>
                <Input
                  id="salary_range"
                  value={formData.salary_range}
                  onChange={(e) => setFormData(prev => ({ ...prev, salary_range: e.target.value }))}
                  placeholder="e.g., $120,000 - $150,000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job_type">Job Type *</Label>
                <Select value={formData.job_type} onValueChange={(value) => setFormData(prev => ({ ...prev, job_type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline *</Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                  rows={4}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="requirements">Requirements *</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                  placeholder="List the key requirements, skills, and qualifications needed for this position..."
                  rows={4}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateJob}>
                Create Job Posting
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Postings</CardTitle>
          <CardDescription>Manage all internal job postings and view applications</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobPostings.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.department}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>{getStatusBadge(job.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>{job.applications_count}</span>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(job.deadline).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewApplications(job)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(job)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteJob(job.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job Posting</DialogTitle>
            <DialogDescription>
              Update the job posting details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Job Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-department">Department *</Label>
              <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Product">Product</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location *</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-salary_range">Salary Range *</Label>
              <Input
                id="edit-salary_range"
                value={formData.salary_range}
                onChange={(e) => setFormData(prev => ({ ...prev, salary_range: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-job_type">Job Type *</Label>
              <Select value={formData.job_type} onValueChange={(value) => setFormData(prev => ({ ...prev, job_type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-deadline">Application Deadline *</Label>
              <Input
                id="edit-deadline"
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit-description">Job Description *</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit-requirements">Requirements *</Label>
              <Textarea
                id="edit-requirements"
                value={formData.requirements}
                onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditJob}>
              Update Job Posting
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Applications Dialog */}
      <Dialog open={isApplicationsDialogOpen} onOpenChange={setIsApplicationsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Applications for {selectedJob?.title}</DialogTitle>
            <DialogDescription>
              Review and manage applications for this position.
            </DialogDescription>
          </DialogHeader>
          {selectedJobApplications.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-600">Applications will appear here once employees start applying.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedJobApplications.map((application) => (
                <Card key={application.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{application.applicant_name}</CardTitle>
                        <CardDescription>
                          Applied on {new Date(application.applied_date).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      {getApplicationStatusBadge(application.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Cover Letter</Label>
                        <p className="text-sm text-gray-600 mt-1">{application.cover_letter}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          View Profile
                        </Button>
                        <Button size="sm" variant="outline">
                          Schedule Interview
                        </Button>
                        <Button size="sm" variant="outline">
                          Update Status
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobPostingManagement;

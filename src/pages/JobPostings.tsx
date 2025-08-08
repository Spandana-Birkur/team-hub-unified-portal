import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Clock, DollarSign, Building, FileText, Send, CheckCircle, AlertCircle } from 'lucide-react';
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
}

interface JobApplication {
  id: number;
  job_posting_id: number;
  applicant_id: number;
  cover_letter: string;
  status: string;
  applied_date: string;
}

const JobPostings = () => {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [myApplications, setMyApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();
  const { profile } = useUserProfile();

  // Mock data for demonstration
  const mockJobPostings: JobPosting[] = [
    {
      id: 1,
      title: "Senior Software Engineer",
      description: "We are looking for a Senior Software Engineer to join our development team. You will be responsible for designing, developing, and maintaining high-quality software solutions.",
      department: "Engineering",
      location: "San Francisco, CA",
      requirements: "• 5+ years of experience in software development\n• Proficiency in React, Node.js, and TypeScript\n• Experience with cloud platforms (AWS/Azure)\n• Strong problem-solving skills\n• Excellent communication abilities",
      salary_range: "$120,000 - $150,000",
      job_type: "Full-time",
      status: "Active",
      created_date: "2024-08-01T10:00:00Z",
      deadline: "2024-09-01T23:59:59Z"
    },
    {
      id: 2,
      title: "Product Manager",
      description: "Join our product team to drive the development of innovative solutions. You will work closely with cross-functional teams to define product strategy and roadmap.",
      department: "Product",
      location: "New York, NY",
      requirements: "• 3+ years of product management experience\n• Strong analytical and strategic thinking\n• Experience with agile methodologies\n• Excellent stakeholder management skills\n• Technical background preferred",
      salary_range: "$130,000 - $160,000",
      job_type: "Full-time",
      status: "Active",
      created_date: "2024-08-05T14:30:00Z",
      deadline: "2024-09-15T23:59:59Z"
    },
    {
      id: 3,
      title: "UX Designer",
      description: "Create exceptional user experiences by designing intuitive and beautiful interfaces. You will collaborate with product and engineering teams to bring designs to life.",
      department: "Design",
      location: "Remote",
      requirements: "• 4+ years of UX/UI design experience\n• Proficiency in Figma and design tools\n• Strong portfolio showcasing user-centered design\n• Experience with design systems\n• Knowledge of accessibility standards",
      salary_range: "$90,000 - $120,000",
      job_type: "Full-time",
      status: "Active",
      created_date: "2024-08-10T09:15:00Z",
      deadline: "2024-09-30T23:59:59Z"
    },
    {
      id: 4,
      title: "Data Scientist",
      description: "Join our data science team to build machine learning models and derive insights from complex datasets. You will work on cutting-edge projects that drive business decisions.",
      department: "Data Science",
      location: "Austin, TX",
      requirements: "• 3+ years of data science experience\n• Proficiency in Python, R, and SQL\n• Experience with machine learning frameworks\n• Strong statistical background\n• Experience with big data technologies",
      salary_range: "$110,000 - $140,000",
      job_type: "Full-time",
      status: "Active",
      created_date: "2024-08-12T16:45:00Z",
      deadline: "2024-10-01T23:59:59Z"
    }
  ];

  const mockApplications: JobApplication[] = [
    {
      id: 1,
      job_posting_id: 1,
      applicant_id: profile?.EmployeeID || 1,
      cover_letter: "I am excited to apply for the Senior Software Engineer position...",
      status: "Applied",
      applied_date: "2024-08-15T10:30:00Z"
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setJobPostings(mockJobPostings);
      setMyApplications(mockApplications);
      setLoading(false);
    }, 1000);
  }, []);

  const handleApply = async (job: JobPosting) => {
    if (!coverLetter.trim()) {
      toast({
        title: "Cover Letter Required",
        description: "Please provide a cover letter for your application.",
        variant: "destructive",
      });
      return;
    }

    setIsApplying(true);
    
    // Simulate API call
    setTimeout(() => {
      const newApplication: JobApplication = {
        id: Date.now(),
        job_posting_id: job.id,
        applicant_id: profile?.EmployeeID || 1,
        cover_letter: coverLetter,
        status: "Applied",
        applied_date: new Date().toISOString()
      };

      setMyApplications(prev => [...prev, newApplication]);
      setCoverLetter('');
      setSelectedJob(null);
      setIsApplying(false);

      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully!",
      });
    }, 1500);
  };

  const hasApplied = (jobId: number) => {
    return myApplications.some(app => app.job_posting_id === jobId);
  };

  const getApplicationStatus = (jobId: number) => {
    const application = myApplications.find(app => app.job_posting_id === jobId);
    return application?.status || null;
  };

  const filteredJobs = jobPostings.filter(job => {
    if (filter === 'all') return true;
    if (filter === 'applied') return hasApplied(job.id);
    if (filter === 'not-applied') return !hasApplied(job.id);
    return job.department === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Applied':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" />Applied</Badge>;
      case 'Under Review':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Under Review</Badge>;
      case 'Interviewed':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800"><FileText className="w-3 h-3 mr-1" />Interviewed</Badge>;
      case 'Offered':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Offered</Badge>;
      case 'Rejected':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return null;
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
          <h1 className="text-3xl font-bold text-gray-900">Internal Job Postings</h1>
          <p className="text-gray-600 mt-2">Explore opportunities within the company</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter jobs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="not-applied">Not Applied</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Product">Product</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Data Science">Data Science</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold">{job.title}</CardTitle>
                  <CardDescription className="mt-2">
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <Building className="w-4 h-4 mr-1" />
                      {job.department}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {job.salary_range}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </div>
                  </CardDescription>
                </div>
                {hasApplied(job.id) && (
                  <div className="ml-2">
                    {getStatusBadge(getApplicationStatus(job.id) || 'Applied')}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {job.description}
              </p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-1">Requirements:</h4>
                  <p className="text-xs text-gray-600 line-clamp-3 whitespace-pre-line">
                    {job.requirements}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Badge variant="outline" className="text-xs">
                    {job.job_type}
                  </Badge>
                  
                  {hasApplied(job.id) ? (
                    <Button variant="outline" size="sm" disabled>
                      Already Applied
                    </Button>
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" onClick={() => setSelectedJob(job)}>
                          Apply Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Apply for {job.title}</DialogTitle>
                          <DialogDescription>
                            Please provide a cover letter explaining why you're interested in this position.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="cover-letter">Cover Letter</Label>
                            <Textarea
                              id="cover-letter"
                              placeholder="Explain why you're interested in this position and how your skills match the requirements..."
                              value={coverLetter}
                              onChange={(e) => setCoverLetter(e.target.value)}
                              rows={6}
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSelectedJob(null);
                                setCoverLetter('');
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => handleApply(job)}
                              disabled={isApplying || !coverLetter.trim()}
                            >
                              {isApplying ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Submitting...
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4 mr-2" />
                                  Submit Application
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600">Try adjusting your filters or check back later for new opportunities.</p>
        </div>
      )}
    </div>
  );
};

export default JobPostings;

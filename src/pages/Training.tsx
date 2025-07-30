import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Play, Award, Clock, Users, Star, CheckCircle, X } from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { useUserProfile } from '@/contexts/UserProfileContext';

const Training = () => {
  const { userRole } = useRole();
  const { profile } = useUserProfile();
  
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: 'Cybersecurity Fundamentals',
      description: 'Learn essential cybersecurity principles and best practices.',
      duration: '4 hours',
      difficulty: 'Beginner',
      enrolled: 124,
      rating: 4.8,
      progress: 0,
      category: 'Security',
      instructor: 'John Security',
      status: 'available',
      content: [
        { id: 1, title: 'Introduction to Cybersecurity', duration: '30 min', completed: false },
        { id: 2, title: 'Password Security Best Practices', duration: '45 min', completed: false },
        { id: 3, title: 'Phishing Awareness', duration: '60 min', completed: false },
        { id: 4, title: 'Data Protection Guidelines', duration: '45 min', completed: false }
      ]
    },
    {
      id: 2,
      title: 'Project Management Basics',
      description: 'Master the fundamentals of effective project management.',
      duration: '6 hours',
      difficulty: 'Intermediate',
      enrolled: 89,
      rating: 4.6,
      progress: 45,
      category: 'Management',
      instructor: 'Sarah PM',
      status: 'in-progress',
      content: [
        { id: 1, title: 'Project Planning Fundamentals', duration: '90 min', completed: true },
        { id: 2, title: 'Risk Management', duration: '60 min', completed: true },
        { id: 3, title: 'Team Communication', duration: '45 min', completed: false },
        { id: 4, title: 'Project Monitoring', duration: '45 min', completed: false }
      ]
    },
    {
      id: 3,
      title: 'Advanced Excel Techniques',
      description: 'Become proficient in advanced Excel functions and analysis.',
      duration: '3 hours',
      difficulty: 'Advanced',
      enrolled: 67,
      rating: 4.9,
      progress: 100,
      category: 'Technical',
      instructor: 'Mike Excel',
      status: 'completed',
      content: [
        { id: 1, title: 'Advanced Formulas', duration: '60 min', completed: true },
        { id: 2, title: 'Data Analysis Tools', duration: '45 min', completed: true },
        { id: 3, title: 'Pivot Tables', duration: '45 min', completed: true },
        { id: 4, title: 'Macros and Automation', duration: '30 min', completed: true }
      ]
    },
    {
      id: 4,
      title: 'Leadership and Communication',
      description: 'Develop essential leadership and communication skills.',
      duration: '5 hours',
      difficulty: 'Intermediate',
      enrolled: 156,
      rating: 4.7,
      progress: 0,
      category: 'Soft Skills',
      instructor: 'Lisa Leader',
      status: 'available',
      content: [
        { id: 1, title: 'Leadership Styles', duration: '60 min', completed: false },
        { id: 2, title: 'Effective Communication', duration: '75 min', completed: false },
        { id: 3, title: 'Conflict Resolution', duration: '60 min', completed: false },
        { id: 4, title: 'Team Building', duration: '45 min', completed: false }
      ]
    }
  ]);

  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [enrollmentDialogOpen, setEnrollmentDialogOpen] = useState(false);
  const [certificateDialogOpen, setCertificateDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);

  const achievements = [
    { title: 'First Course Completed', date: '2024-01-10', icon: Award, color: 'bg-yellow-500' },
    { title: 'Security Expert', date: '2024-01-08', icon: Star, color: 'bg-blue-500' },
    { title: 'Fast Learner', date: '2024-01-05', icon: Clock, color: 'bg-green-500' },
  ];

  const trainingStats = [
    { title: 'Courses Enrolled', value: courses.filter(c => c.status !== 'available').length.toString(), icon: BookOpen, color: 'bg-blue-500' },
    { title: 'Completed', value: courses.filter(c => c.status === 'completed').length.toString(), icon: Award, color: 'bg-green-500' },
    { title: 'Hours Learned', value: '34', icon: Clock, color: 'bg-purple-500' },
    { title: 'Certificates', value: courses.filter(c => c.status === 'completed').length.toString(), icon: Star, color: 'bg-yellow-500' },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'available': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEnrollCourse = (course: any) => {
    setSelectedCourse(course);
    setEnrollmentDialogOpen(true);
  };

  const confirmEnrollment = () => {
    if (selectedCourse) {
      setCourses(prevCourses => 
        prevCourses.map(course => 
          course.id === selectedCourse.id 
            ? { ...course, status: 'in-progress', progress: 0 }
            : course
        )
      );
      setEnrollmentDialogOpen(false);
      setSelectedCourse(null);
    }
  };

  const handleStartCourse = (course: any) => {
    setSelectedCourse(course);
    setCourseDialogOpen(true);
  };

  const handleCompleteModule = (courseId: number, moduleId: number) => {
    setCourses(prevCourses => 
      prevCourses.map(course => {
        if (course.id === courseId) {
          const updatedContent = course.content.map(module => 
            module.id === moduleId ? { ...module, completed: true } : module
          );
          const completedModules = updatedContent.filter(module => module.completed).length;
          const progress = Math.round((completedModules / course.content.length) * 100);
          const status = progress === 100 ? 'completed' : 'in-progress';
          
          return { ...course, content: updatedContent, progress, status };
        }
        return course;
      })
    );
    
    // Also update the selected course in the dialog to reflect changes immediately
    setSelectedCourse(prevCourse => {
      if (prevCourse && prevCourse.id === courseId) {
        const updatedContent = prevCourse.content.map(module => 
          module.id === moduleId ? { ...module, completed: true } : module
        );
        const completedModules = updatedContent.filter(module => module.completed).length;
        const progress = Math.round((completedModules / prevCourse.content.length) * 100);
        const status = progress === 100 ? 'completed' : 'in-progress';
        
        return { ...prevCourse, content: updatedContent, progress, status };
      }
      return prevCourse;
    });
  };

  const handleViewCertificate = (course: any) => {
    setSelectedCourse(course);
    setCertificateDialogOpen(true);
  };

  const enrolledCourses = courses.filter(course => course.status !== 'available');
  const completedCourses = courses.filter(course => course.status === 'completed');

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Training & Learning</h1>
        <p className="text-muted-foreground">Enhance your skills with our comprehensive training programs.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {trainingStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="courses">Available Courses</TabsTrigger>
          <TabsTrigger value="progress">My Progress</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          {userRole !== 'employee' && <TabsTrigger value="management">Training Management</TabsTrigger>}
        </TabsList>

        <TabsContent value="courses">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{course.duration}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{course.enrolled} enrolled</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span>{course.rating}</span>
                        </span>
                      </div>
                    </div>
                    <Badge className={getDifficultyColor(course.difficulty)}>
                      {course.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Instructor: {course.instructor}</span>
                      <Badge variant="outline">{course.category}</Badge>
                    </div>
                    
                    {course.progress > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2">
                      <Badge className={getStatusColor(course.status)}>
                        {course.status === 'in-progress' ? 'In Progress' : 
                         course.status === 'completed' ? 'Completed' : 'Available'}
                      </Badge>
                      <Button 
                        size="sm" 
                        className="flex items-center space-x-2"
                        onClick={() => {
                          if (course.status === 'completed') {
                            handleViewCertificate(course);
                          } else if (course.status === 'in-progress') {
                            handleStartCourse(course);
                          } else {
                            handleEnrollCourse(course);
                          }
                        }}
                      >
                        <Play className="w-4 h-4" />
                        <span>
                          {course.status === 'completed' ? 'View Certificate' :
                           course.status === 'in-progress' ? 'Continue' : 'Enroll'}
                        </span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Learning Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{course.title}</h4>
                        <p className="text-sm text-muted-foreground">Category: {course.category}</p>
                      </div>
                      <Badge className={getStatusColor(course.status)}>
                        {course.status === 'completed' ? 'Completed' : 'In Progress'}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-muted-foreground">Duration: {course.duration}</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          if (course.status === 'completed') {
                            handleViewCertificate(course);
                          } else {
                            handleStartCourse(course);
                          }
                        }}
                      >
                        {course.status === 'completed' ? 'View Certificate' : 'Continue'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Achievements & Certificates</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="border rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                    <div className={`w-16 h-16 mx-auto mb-3 rounded-full ${achievement.color} flex items-center justify-center`}>
                      <achievement.icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-semibold mb-1">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">Earned on {achievement.date}</p>
                  </div>
                ))}
                {completedCourses.map((course) => (
                  <div key={course.id} className="border rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-500 flex items-center justify-center">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-semibold mb-1">{course.title}</h4>
                    <p className="text-sm text-muted-foreground">Certificate Earned</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => handleViewCertificate(course)}
                    >
                      View Certificate
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {userRole !== 'employee' && (
          <TabsContent value="management">
            <div className="space-y-6">
              {/* Training Management Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Users className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold">45</p>
                        <p className="text-sm text-muted-foreground">Team Members</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold">12</p>
                        <p className="text-sm text-muted-foreground">Required Courses</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Award className="w-8 h-8 text-yellow-600" />
                      <div>
                        <p className="text-2xl font-bold">78%</p>
                        <p className="text-sm text-muted-foreground">Completion Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-8 h-8 text-red-600" />
                      <div>
                        <p className="text-2xl font-bold">8</p>
                        <p className="text-sm text-muted-foreground">Overdue Training</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Team Training Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Team Training Progress</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { name: 'Alice Smith', progress: 85, courses: 8, completed: 6 },
                        { name: 'Bob Johnson', progress: 92, courses: 10, completed: 9 },
                        { name: 'Carol White', progress: 67, courses: 6, completed: 4 },
                        { name: 'David Brown', progress: 100, courses: 12, completed: 12 },
                        { name: 'Eva Garcia', progress: 45, courses: 5, completed: 2 },
                        { name: 'Frank Miller', progress: 78, courses: 7, completed: 5 }
                      ].map((member, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-sm">{member.name}</h4>
                            <Badge variant={member.progress === 100 ? 'default' : 'secondary'}>
                              {member.progress}%
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Progress</span>
                              <span>{member.progress}%</span>
                            </div>
                            <Progress value={member.progress} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{member.completed}/{member.courses} completed</span>
                              <span>{member.courses - member.completed} remaining</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Training Management Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Training Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                    >
                      <Users className="w-6 h-6" />
                      <span>Assign Training</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                    >
                      <Award className="w-6 h-6" />
                      <span>Track Certifications</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                    >
                      <Clock className="w-6 h-6" />
                      <span>Set Deadlines</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                    >
                      <Star className="w-6 h-6" />
                      <span>Performance Reviews</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                    >
                      <BookOpen className="w-6 h-6" />
                      <span>Create Courses</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                    >
                      <Users className="w-6 h-6" />
                      <span>Team Reports</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Required Training Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Required Training Alerts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Eva Garcia', course: 'Cybersecurity Fundamentals', dueDate: '2024-02-01', status: 'overdue' },
                      { name: 'Frank Miller', course: 'Project Management Basics', dueDate: '2024-02-15', status: 'due-soon' },
                      { name: 'Carol White', course: 'Leadership and Communication', dueDate: '2024-02-20', status: 'due-soon' }
                    ].map((alert, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{alert.name}</p>
                          <p className="text-xs text-muted-foreground">{alert.course}</p>
                          <p className="text-xs text-muted-foreground">Due: {alert.dueDate}</p>
                        </div>
                        <Badge variant={alert.status === 'overdue' ? 'destructive' : 'secondary'}>
                          {alert.status === 'overdue' ? 'Overdue' : 'Due Soon'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>

             {/* Course Content Dialog */}
       <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
         <DialogContent className="max-w-4xl">
           <DialogHeader>
             <DialogTitle>{selectedCourse?.title}</DialogTitle>
             <DialogDescription>
               {selectedCourse?.description}
             </DialogDescription>
           </DialogHeader>
           
           {/* Course Progress Overview */}
           {selectedCourse && (
             <div className="mb-6 p-4 bg-muted rounded-lg">
               <div className="flex items-center justify-between mb-2">
                 <span className="text-sm font-medium">Course Progress</span>
                 <Badge className={getStatusColor(selectedCourse.status)}>
                   {selectedCourse.status === 'completed' ? 'Completed' : 'In Progress'}
                 </Badge>
               </div>
               <div className="space-y-2">
                 <div className="flex items-center justify-between text-sm">
                   <span>Progress</span>
                   <span>{selectedCourse.progress}%</span>
                 </div>
                 <Progress value={selectedCourse.progress} className="h-2" />
                 <div className="flex justify-between text-xs text-muted-foreground">
                   <span>
                     {selectedCourse.content.filter((m: any) => m.completed).length} of {selectedCourse.content.length} modules completed
                   </span>
                   <span>{selectedCourse.content.length - selectedCourse.content.filter((m: any) => m.completed).length} remaining</span>
                 </div>
               </div>
             </div>
           )}
           
           <div className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {selectedCourse?.content.map((module: any) => (
                 <div key={module.id} className="border rounded-lg p-4">
                   <div className="flex items-center justify-between mb-2">
                     <h4 className="font-semibold">{module.title}</h4>
                     <div className="flex items-center space-x-2">
                       <span className="text-sm text-muted-foreground">{module.duration}</span>
                       {module.completed ? (
                         <CheckCircle className="w-5 h-5 text-green-500" />
                       ) : (
                         <Button 
                           size="sm" 
                           onClick={() => handleCompleteModule(selectedCourse.id, module.id)}
                         >
                           Complete
                         </Button>
                       )}
                     </div>
                   </div>
                   {module.completed && (
                     <p className="text-sm text-green-600">✓ Completed</p>
                   )}
                 </div>
               ))}
             </div>
           </div>
           
           <DialogFooter>
             <Button variant="outline" onClick={() => setCourseDialogOpen(false)}>
               Close
             </Button>
             {selectedCourse?.status === 'completed' && (
               <Button onClick={() => handleViewCertificate(selectedCourse)}>
                 View Certificate
               </Button>
             )}
           </DialogFooter>
         </DialogContent>
       </Dialog>

      {/* Enrollment Dialog */}
      <Dialog open={enrollmentDialogOpen} onOpenChange={setEnrollmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enroll in Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to enroll in "{selectedCourse?.title}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEnrollmentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmEnrollment}>
              Enroll
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Certificate Dialog */}
      <Dialog open={certificateDialogOpen} onOpenChange={setCertificateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Certificate of Completion</DialogTitle>
            <DialogDescription>
              Congratulations! You have successfully completed "{selectedCourse?.title}".
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-8">
            <div className="w-32 h-32 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <Award className="w-16 h-16 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{selectedCourse?.title}</h3>
            <p className="text-muted-foreground mb-4">Certificate of Completion</p>
            <p className="text-sm text-muted-foreground">
              This certificate is awarded to {profile.firstName} {profile.lastName} for successfully completing the course.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Completed on {new Date().toLocaleDateString()}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCertificateDialogOpen(false)}>
              Close
            </Button>
            <Button>
              Download Certificate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Training;

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
      ],
      quizzes: [
        {
          id: 1,
          title: 'Cybersecurity Basics Quiz',
          questions: [
            {
              id: 1,
              question: 'What is phishing?',
              options: ['A type of malware', 'A social engineering attack', 'A firewall', 'A password manager'],
              answer: 1
            },
            {
              id: 2,
              question: 'Which is a strong password?',
              options: ['password123', 'qwerty', 'MyDog$2024!', '123456'],
              answer: 2
            }
          ]
        }
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
      ],
      quizzes: [
        {
          id: 1,
          title: 'Project Management Quiz',
          questions: [
            {
              id: 1,
              question: 'What does a Gantt chart represent?',
              options: ['Project schedule', 'Budget allocation', 'Risk assessment', 'Quality control'],
              answer: 0
            },
            {
              id: 2,
              question: 'Which is a key benefit of effective communication in project management?',
              options: ['Increased costs', 'Delayed timelines', 'Enhanced collaboration', 'Scope creep'],
              answer: 2
            }
          ]
        }
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
      ],
      quizzes: [
        {
          id: 1,
          title: 'Excel Advanced Functions Quiz',
          questions: [
            {
              id: 1,
              question: 'What does the VLOOKUP function do?',
              options: ['Looks up values vertically', 'Calculates the average of a range', 'Counts the number of cells', 'Finds the maximum value'],
              answer: 0
            },
            {
              id: 2,
              question: 'How can you protect a worksheet from being edited?',
              options: ['By hiding the sheet', 'By protecting it with a password', 'By making it read-only', 'By encrypting the file'],
              answer: 1
            }
          ]
        }
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
      ],
      quizzes: [
        {
          id: 1,
          title: 'Leadership and Communication Quiz',
          questions: [
            {
              id: 1,
              question: 'What is the primary focus of servant leadership?',
              options: ['Achieving results', 'Meeting organizational goals', 'Serving the needs of the team', 'Maintaining authority'],
              answer: 2
            },
            {
              id: 2,
              question: 'Which is a key component of effective communication?',
              options: ['Using complex language', 'Speaking loudly', 'Active listening', 'Avoiding eye contact'],
              answer: 2
            }
          ]
        }
      ]
    }
  ]);

  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [enrollmentDialogOpen, setEnrollmentDialogOpen] = useState(false);
  const [certificateDialogOpen, setCertificateDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<{ courseId: number; quizId: number } | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: number }>({});
  const [quizResult, setQuizResult] = useState<{ correct: number; total: number } | null>(null);

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
            ? { ...course, status: 'in-progress', progress: 0, content: course.content.map(m => ({ ...m, completed: false })) }
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
        
        const updatedCourse = { ...prevCourse, content: updatedContent, progress, status };
        
        // After completing a module, automatically start the quiz if available
        if (updatedCourse.quizzes && updatedCourse.quizzes.length > 0) {
          // Close the course dialog first
          setCourseDialogOpen(false);
          // Start the first quiz for this course
          setTimeout(() => {
            handleStartQuiz(courseId, updatedCourse.quizzes[0].id);
          }, 300);
        }
        
        return updatedCourse;
      }
      return prevCourse;
    });
  };

  const handleViewCertificate = (course: any) => {
    setSelectedCourse(course);
    setCertificateDialogOpen(true);
  };

  const handleStartQuiz = (courseId: number, quizId: number) => {
    setActiveQuiz({ courseId, quizId });
    setQuizAnswers({});
    setQuizResult(null);
  };

  const handleQuizAnswer = (questionId: number, optionIdx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmitQuiz = () => {
    if (!activeQuiz) return;
    const course = courses.find((c) => c.id === activeQuiz.courseId);
    const quiz = course?.quizzes?.find((q) => q.id === activeQuiz.quizId);
    if (!quiz) return;
    let correct = 0;
    quiz.questions.forEach((q) => {
      if (quizAnswers[q.id] === q.answer) correct++;
    });
    setQuizResult({ correct, total: quiz.questions.length });
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
                      <CardTitle className="text-lg mb-2 text-gray-900 dark:text-white">{course.title}</CardTitle>
                      <p className="text-sm text-gray-900 dark:text-white mb-3">{course.description}</p>
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
                    
                    {course.status !== 'available' && (
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

                    {/* Enhanced Quiz Section */}
                    {course.quizzes && course.quizzes.length > 0 && (
                      <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border">
                        <h5 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-blue-500" />
                          Knowledge Assessment
                        </h5>
                        <div className="space-y-2">
                          {course.quizzes.map((quiz) => (
                            <div key={quiz.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border">
                              <div>
                                <p className="font-medium text-sm text-gray-900 dark:text-white">{quiz.title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {quiz.questions.length} questions • Test your knowledge
                                </p>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleStartQuiz(course.id, quiz.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                <Star className="w-3 h-3 mr-1" />
                                Take Quiz
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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

      {/* Quiz Modal */}
      {activeQuiz && (() => {
        const course = courses.find((c) => c.id === activeQuiz.courseId);
        const quiz = course?.quizzes?.find((q) => q.id === activeQuiz.quizId);
        if (!quiz) return null;
        return (
          <Dialog open={true} onOpenChange={() => setActiveQuiz(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white">{quiz.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                {quiz.questions.map((q) => (
                  <div key={q.id}>
                    <p className="font-medium text-gray-900 dark:text-white mb-2">{q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((opt, idx) => (
                        <label key={idx} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`quiz-q${q.id}`}
                            checked={quizAnswers[q.id] === idx}
                            onChange={() => handleQuizAnswer(q.id, idx)}
                          />
                          <span className="text-gray-900 dark:text-white">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <DialogFooter className="mt-6 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setActiveQuiz(null)}>Cancel</Button>
                {!quizResult ? (
                  <Button onClick={handleSubmitQuiz}>Submit Quiz</Button>
                ) : (
                  <Button onClick={() => {
                    setActiveQuiz(null);
                    setQuizResult(null);
                    setQuizAnswers({});
                    // Reopen the course dialog
                    if (course) {
                      setSelectedCourse(course);
                      setCourseDialogOpen(true);
                    }
                  }}>
                    Close and Continue
                  </Button>
                )}
              </DialogFooter>
              {quizResult && (
                <div className="mt-4 p-4 bg-muted rounded-lg text-center">
                  <p className="font-semibold text-gray-900 dark:text-white mb-2">
                    Quiz Results
                  </p>
                  <p className="text-lg text-gray-900 dark:text-white">
                    You scored {quizResult.correct} out of {quizResult.total}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {quizResult.correct === quizResult.total ? 
                      "Excellent! Perfect score!" : 
                      `${Math.round((quizResult.correct / quizResult.total) * 100)}% - ${
                        quizResult.correct / quizResult.total >= 0.8 ? "Great job!" : 
                        quizResult.correct / quizResult.total >= 0.6 ? "Good effort!" : "Keep practicing!"
                      }`
                    }
                  </p>
                </div>
              )}
            </DialogContent>
          </Dialog>
        );
      })()}
    </div>
  );
};

export default Training;

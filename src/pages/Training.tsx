import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Play, Award, Clock, Users, Star, CheckCircle, X, Flag } from 'lucide-react';
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
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<{ courseId: number; quizId: number } | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: number }>({});
  const [quizResult, setQuizResult] = useState<{ correct: number; total: number } | null>(null);
  const [quizSlide, setQuizSlide] = useState(0);
  const [badgeDialogOpen, setBadgeDialogOpen] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState<{ courseName: string; quizName: string } | null>(null);
  const [certificationDialogOpen, setCertificationDialogOpen] = useState(false);

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

  const handleStartQuiz = (courseId: number, quizId: number) => {
    setActiveQuiz({ courseId, quizId });
    setQuizAnswers({});
    setQuizResult(null);
    setQuizSlide(0);
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
    
    // Check if perfect score - show certification directly
    if (correct === quiz.questions.length) {
      setTimeout(() => {
        setEarnedBadge({
          courseName: course?.title || 'Course',
          quizName: quiz.title
        });
        // Show certification dialog directly without badge dialog
        setCertificationDialogOpen(true);
      }, 1000); // Show certification after 1 second to let results show first
    }
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
                            // No action for completed courses - certificate shows after perfect quiz
                          } else if (course.status === 'in-progress') {
                            handleStartCourse(course);
                          } else {
                            handleEnrollCourse(course);
                          }
                        }}
                      >
                        <Play className="w-4 h-4" />
                        <span>
                          {course.status === 'completed' ? 'Completed' :
                           course.status === 'in-progress' ? 'Continue' : 'Enroll'}
                        </span>
                      </Button>
                    </div>

                    {/* Quiz Section - New Code Added Here */}
                    {course.quizzes && course.quizzes.length > 0 && (
                      <div className="mt-4">
                        <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Quiz</h5>
                        {course.quizzes.map((quiz) => (
                          <Button
                            key={quiz.id}
                            size="sm"
                            variant="outline"
                            onClick={() => handleStartQuiz(course.id, quiz.id)}
                            className="mb-2"
                          >
                            Take "{quiz.title}"
                          </Button>
                        ))}
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
                            // No action for completed courses - certificate shows after perfect quiz
                          } else {
                            handleStartCourse(course);
                          }
                        }}
                      >
                        {course.status === 'completed' ? 'Completed' : 'Continue'}
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
                     <p className="text-sm text-green-600">Module Completed</p>
                   )}
                 </div>
               ))}
             </div>
           </div>
           
           <DialogFooter>
             <Button variant="outline" onClick={() => setCourseDialogOpen(false)}>
               Close
             </Button>
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
      <Dialog open={certificationDialogOpen} onOpenChange={setCertificationDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Certificate of Completion</DialogTitle>
            <DialogDescription className="text-center text-lg">
              You have successfully completed "{earnedBadge?.courseName}".
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-8">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <Award className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{earnedBadge?.courseName}</h3>
            <p className="text-xl text-muted-foreground mb-6 font-semibold">Certificate of Completion</p>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6">
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
                This certificate is awarded to <span className="font-semibold text-gray-900 dark:text-white">{profile.firstName} {profile.lastName}</span>
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                for successfully completing the course.
              </p>
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              Completed on {new Date().toLocaleDateString()}
            </p>
          </div>
          <DialogFooter className="justify-center">
            <Button 
              variant="outline" 
              onClick={() => setCertificationDialogOpen(false)}
              className="px-8"
            >
              Close
            </Button>
            <Button 
              className="px-8 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
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
        const totalQuestions = quiz.questions.length;
        const currentQuestion = quiz.questions[quizSlide];
        // Animation classes for slide-in from right
        const slideBase = "transition-transform duration-500 ease-in-out";
        const slideIn = "translate-x-0 opacity-100";
        const slideOut = "translate-x-full opacity-0";
        return (
          <Dialog open={true} onOpenChange={() => setActiveQuiz(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] w-full p-0 overflow-hidden">
              {/* Top Bar Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{quiz.title}</h2>
                      <p className="text-blue-100 text-sm">Question {quizSlide + 1} of {totalQuestions}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveQuiz(null)}
                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {/* Progress Bar in Header */}
                <div className="mt-4">
                  <Progress 
                    value={((quizSlide) / totalQuestions) * 100} 
                    className="h-2 bg-white/20" 
                  />
                  <div className="flex justify-between text-xs mt-1 text-blue-100">
                    <span>Progress: {Math.round(((quizSlide) / totalQuestions) * 100)}%</span>
                    <span>{totalQuestions - quizSlide - 1} questions remaining</span>
                  </div>
                </div>
              </div>
              
              {/* Content Area */}
              <div className="p-6">
              <div className="relative min-h-[400px] flex items-center justify-center overflow-hidden">
                {/* Only show the current question as a slide */}
                <div
                  key={currentQuestion.id}
                  className={`absolute w-full ${slideBase} ${slideIn} bg-background p-8 rounded-lg shadow-lg border`}
                  style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)' }}
                >
                  <p className="font-medium text-gray-900 dark:text-white mb-6 text-xl leading-relaxed">{currentQuestion.question}</p>
                  <div className="space-y-4">
                    {currentQuestion.options.map((opt, idx) => (
                      <label key={idx} className={`flex items-center space-x-3 cursor-pointer px-4 py-3 rounded-lg border text-base transition-all hover:shadow-md ${quizAnswers[currentQuestion.id] === idx ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md' : 'border-gray-200 hover:border-blue-300'}` }>
                        <input
                          type="radio"
                          name={`quiz-q${currentQuestion.id}`}
                          checked={quizAnswers[currentQuestion.id] === idx}
                          onChange={() => handleQuizAnswer(currentQuestion.id, idx)}
                          className="accent-blue-600 w-4 h-4"
                        />
                        <span className="text-gray-900 dark:text-white">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 px-2">
                <Button
                  variant="outline"
                  onClick={() => setQuizSlide((s) => Math.max(0, s - 1))}
                  disabled={quizSlide === 0 || !!quizResult}
                  className="px-6 py-2 text-base"
                >
                  Previous
                </Button>
                {!quizResult ? (
                  quizSlide < totalQuestions - 1 ? (
                    <Button
                      onClick={() => setQuizSlide((s) => Math.min(totalQuestions - 1, s + 1))}
                      disabled={typeof quizAnswers[currentQuestion.id] !== 'number'}
                      className="px-6 py-2 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmitQuiz}
                      disabled={typeof quizAnswers[currentQuestion.id] !== 'number'}
                      className="px-6 py-2 text-base bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    >
                      Submit Quiz
                    </Button>
                  )
                ) : (
                  <Button
                    onClick={() => {
                      setActiveQuiz(null);
                      setQuizResult(null);
                      setQuizAnswers({});
                      setQuizSlide(0);
                      // Reopen the course dialog
                      if (course) {
                        setSelectedCourse(course);
                        setCourseDialogOpen(true);
                      }
                    }}
                    className="px-6 py-2 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Close and Continue
                  </Button>
                )}
              </div>
              </div>
              {/* Quiz Result */}
              {quizResult && (
                <div className="mx-6 mb-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg text-center border border-green-200 dark:border-green-800 animate-fade-in">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">
                    Quiz Results
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {quizResult.correct} / {quizResult.total}
                  </p>
                  <p className="text-base text-muted-foreground">
                    {quizResult.correct === quizResult.total ? 
                      "Excellent! Perfect score achieved." : 
                      `${Math.round((quizResult.correct / quizResult.total) * 100)}% - ${
                        quizResult.correct / quizResult.total >= 0.8 ? "Great performance!" : 
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

      {/* Badge Award Dialog */}
      <Dialog open={badgeDialogOpen} onOpenChange={setBadgeDialogOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          {/* Professional Header */}
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-6 text-center text-white">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold mb-1">Achievement Unlocked</h2>
            <p className="text-slate-200 text-sm">Perfect Quiz Performance</p>
          </div>

          {/* Badge Content */}
          <div className="p-6 text-center bg-white dark:bg-gray-900">
            <div className="relative inline-block mb-6">
              {/* Professional Badge Circle */}
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center">
                  <Star className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Excellence Badge
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3 font-medium">
              {earnedBadge?.courseName}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Perfect score achieved on "{earnedBadge?.quizName}"
            </p>

            {/* Professional Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
              <div className="text-center">
                <div className="text-xl font-bold text-slate-700 dark:text-slate-300">100%</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-700 dark:text-green-400">
                  <CheckCircle className="w-5 h-5 mx-auto" />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Complete</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-700 dark:text-blue-400">
                  <Star className="w-5 h-5 mx-auto" />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Expert</div>
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
              This achievement has been added to your professional development record.
            </p>

            <Button 
              onClick={() => {
                setBadgeDialogOpen(false);
                setEarnedBadge(null);
              }}
              className="w-full bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-700 text-white font-medium py-2.5"
            >
              Continue Learning
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Training;

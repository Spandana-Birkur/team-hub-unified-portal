import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookOpen, Play, Award, Clock, Users, Star, CheckCircle, X } from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useToast } from '@/hooks/use-toast';

import {
  getCourses,
  getEmployeeEnrollments,
  getCourseEnrollment,
  enrollInCourse,
  submitQuiz,
  getQuizForLevel,
  parseQuizQuestions,
  validateQuiz,
  isAnswerCorrect,
  type Course,
  type Enrollment,
  type Quiz
} from '@/services/courseService';

interface QuestionType {
  id: number;
  question: string;
  options: string[];
  answer: number;
}

interface CourseWithUI extends Course {
  difficulty: string;
  duration: string;
  enrolled: number;
  progress: number;
  status: 'available' | 'in-progress' | 'completed';
  category: string;
  instructor: string;
  rating?: number;
  content: Array<{
    id: number;
    title: string;
    duration: string;
    completed: boolean;
  }>;
  quizzes: Array<{
    title: string;
    questions: QuestionType[];
  }>;
}

const Training = () => {
  const { userRole } = useRole();
  const { profile } = useUserProfile();
  const { toast } = useToast();
  
  // Fetch courses and enrollments on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching courses data...');
        const [coursesData, enrollmentsData] = await Promise.all([
          getCourses(),
          getEmployeeEnrollments(profile.ID)
        ]);
        console.log('Courses data received:', coursesData);

        // Transform API courses into UI format
        const transformedCourses: CourseWithUI[] = coursesData.map(course => {
          const enrollment = enrollmentsData.find(e => e.CourseID === course.CourseID);
          return {
            ...course,
            difficulty: 'Beginner', // These could be added to the database later
            duration: '4 hours',
            enrolled: 100,
            progress: enrollment?.Level ? (enrollment.Level / 3) * 100 : 0,
            status: enrollment ? (enrollment.Level === 3 ? 'completed' : 'in-progress') : 'available',
            category: 'General',
            instructor: 'Course Instructor',
            content: [
              { id: 1, title: 'Course Introduction', duration: '30 min', completed: false },
              { id: 2, title: 'Core Concepts', duration: '45 min', completed: false },
              { id: 3, title: 'Practical Application', duration: '60 min', completed: false },
              { id: 4, title: 'Advanced Topics', duration: '45 min', completed: false }
            ],
            quizzes: [
              {
                id: 1,
                title: course.Quiz1?.Title || 'Quiz 1',
                questions: parseQuizQuestions(course.Quiz1 as Quiz).map((q, i) => ({
                  ...q,
                  options: ['Option A', 'Option B', 'Option C', 'Option D'],
                  answer: parseInt((course.Quiz1?.AnswerString || '0')[i])
                }))
              },
              {
                id: 2,
                title: course.Quiz2?.Title || 'Quiz 2',
                questions: parseQuizQuestions(course.Quiz2 as Quiz).map((q, i) => ({
                  ...q,
                  options: ['Option A', 'Option B', 'Option C', 'Option D'],
                  answer: parseInt((course.Quiz2?.AnswerString || '0')[i])
                }))
              },
              {
                id: 3,
                title: course.Quiz3?.Title || 'Quiz 3',
                questions: parseQuizQuestions(course.Quiz3 as Quiz).map((q, i) => ({
                  ...q,
                  options: ['Option A', 'Option B', 'Option C', 'Option D'],
                  answer: parseInt((course.Quiz3?.AnswerString || '0')[i])
                }))
              }
            ]
          };
        });

        setCourses(transformedCourses);
        setEnrollments(enrollmentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load courses. Please try again later.',
          variant: 'destructive'
        });
      }
    };

    fetchData();
  }, [profile?.ID]);
  
  const [courses, setCourses] = useState<CourseWithUI[]>([]);

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseWithUI | null>(null);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [enrollmentDialogOpen, setEnrollmentDialogOpen] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<{ courseId: number; currentLevel: number } | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: number }>({});
  const [quizResult, setQuizResult] = useState<{ correct: number; total: number } | null>(null);
  const [quizSlide, setQuizSlide] = useState(0);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuizQuestions, setCurrentQuizQuestions] = useState<QuestionType[]>([]);
  const [certificationDialogOpen, setCertificationDialogOpen] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState<{ courseName: string; quizName: string } | null>(null);

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

  const handleEnrollCourse = (course: CourseWithUI) => {
    setSelectedCourse(course);
    setEnrollmentDialogOpen(true);
  };

  const confirmEnrollment = async () => {
    if (!selectedCourse) return;
    
    try {
      await enrollInCourse(profile.ID, selectedCourse.CourseID);
      
      // Update local state
      setCourses(prevCourses =>
        prevCourses.map(course =>
          course.CourseID === selectedCourse.CourseID
            ? { ...course, status: 'in-progress', progress: 0 }
            : course
        )
      );

      // Add to enrollments
      const newEnrollment: Enrollment = {
        EnrollmentID: Date.now(), // This will be replaced by the server-generated ID
        CourseID: selectedCourse.CourseID,
        EmployeeID: profile.ID,
        Level: 0
      };
      setEnrollments(prev => [...prev, newEnrollment]);

      toast({
        title: 'Success',
        description: 'Successfully enrolled in course',
      });
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast({
        title: 'Error',
        description: 'Failed to enroll in course. Please try again.',
        variant: 'destructive'
      });
    }

    setEnrollmentDialogOpen(false);
    setSelectedCourse(null);
  };

  const handleStartCourse = async (course: CourseWithUI) => {
    try {
      // Get current enrollment level
      const enrollment = await getCourseEnrollment(profile.ID, course.CourseID);
      if (enrollment) {
        setSelectedCourse(course);
        if (enrollment.Level < 3) {
          // If not mastered, prepare quiz for current level
          const quiz = getQuizForLevel(course, enrollment.Level);
          if (quiz) {
            console.log('Quiz Answer String:', quiz.AnswerString);
            setCurrentQuiz(quiz);
            setCurrentQuizQuestions(parseQuizQuestions(quiz).map((q, i) => ({
              ...q,
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              answer: parseInt(quiz.AnswerString[i])
            })));
            setActiveQuiz({ 
              courseId: course.CourseID, 
              currentLevel: enrollment.Level 
            });
            setQuizAnswers({});
            setQuizResult(null);
            setQuizSlide(0);
          } else {
            toast({
              title: 'Error',
              description: 'No quiz available for current level',
              variant: 'destructive'
            });
          }
        }
        setCourseDialogOpen(true);
      }
    } catch (error) {
      console.error('Error starting course:', error);
      toast({
        title: 'Error',
        description: 'Failed to start course. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleQuizAnswer = (questionId: number, optionIdx: number) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz || !currentQuiz) return;

    const passed = validateQuiz(currentQuiz, quizAnswers);
    const correctAnswers = Object.entries(quizAnswers).reduce((acc, [qIndex, answer]) => {
      return acc + (isAnswerCorrect(currentQuiz, parseInt(qIndex) - 1, answer) ? 1 : 0);
    }, 0);

    setQuizResult({ 
      correct: correctAnswers,
      total: 10 // Quiz always has 10 questions
    });

    try {
      const result = await submitQuiz({
        employeeId: profile.ID,
        courseId: activeQuiz.courseId,
        currentLevel: activeQuiz.currentLevel,
        passed
      });

      if (passed) {
        // Update local state
        setCourses(prevCourses =>
          prevCourses.map(course => {
            if (course.CourseID === activeQuiz.courseId) {
              const newLevel = result.newLevel;
              return {
                ...course,
                progress: (newLevel / 3) * 100,
                status: newLevel === 3 ? 'completed' : 'in-progress'
              };
            }
            return course;
          })
        );

        setEnrollments(prev =>
          prev.map(enrollment => {
            if (enrollment.CourseID === activeQuiz.courseId) {
              return { ...enrollment, Level: result.newLevel };
            }
            return enrollment;
          })
        );

        // If all questions are correct, show certificate
        if (correctAnswers === 10) {
          const course = courses.find(c => c.CourseID === activeQuiz.courseId);
          if (course) {
            setEarnedBadge({
              courseName: course.CourseName,
              quizName: currentQuiz.Title
            });
            setCertificationDialogOpen(true);
          }
        }

        toast({
          title: 'Success',
          description: passed ? 'Quiz passed! Level increased.' : 'Quiz failed. Try again.',
        });
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit quiz. Please try again.',
        variant: 'destructive'
      });
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
              <Card key={course.CourseID} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 text-gray-900 dark:text-white">{course.CourseName}</CardTitle>
                      <p className="text-sm text-gray-900 dark:text-white mb-3">{course.Description}</p>
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
                                onClick={() => handleStartCourse(course)}
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
                  <div key={course.CourseID} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{course.CourseName}</h4>
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
                  <div key={course.CourseID} className="border rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-500 flex items-center justify-center">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-semibold mb-1">{course.CourseName}</h4>
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
             <DialogTitle>{selectedCourse?.CourseName}</DialogTitle>
             <DialogDescription>
               {selectedCourse?.Description}
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
                           onClick={() => {/* TODO: Implement handleCompleteModule */}}
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
              Are you sure you want to enroll in "{selectedCourse?.CourseName}"?
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
        const course = courses.find((c) => c.CourseID === activeQuiz.courseId);
        const quiz = course?.quizzes?.[activeQuiz.currentLevel];
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
      <Dialog open={!!earnedBadge} onOpenChange={(open) => !open && setEarnedBadge(null)}>
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

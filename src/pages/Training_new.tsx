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
  content: Array<{
    id: number;
    title: string;
    duration: string;
    completed: boolean;
  }>;
  quizzes: Array<{
    id: number;
    title: string;
    questions: QuestionType[];
  }>;
}

const Training = () => {
  const { userRole } = useRole();
  const { profile } = useUserProfile();
  const { toast } = useToast();
  
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

  // Fetch courses and enrollments on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, enrollmentsData] = await Promise.all([
          getCourses(),
          getEmployeeEnrollments(profile.EmployeeID)
        ]);

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
  }, [profile.EmployeeID]);

  const handleEnrollCourse = (course: CourseWithUI) => {
    setSelectedCourse(course);
    setEnrollmentDialogOpen(true);
  };

  const confirmEnrollment = async () => {
    if (!selectedCourse) return;
    
    try {
      await enrollInCourse(profile.EmployeeID, selectedCourse.CourseID);
      
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
        EmployeeID: profile.EmployeeID,
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
      const enrollment = await getCourseEnrollment(profile.EmployeeID, course.CourseID);
      if (enrollment) {
        setSelectedCourse(course);
        if (enrollment.Level < 3) {
          // If not mastered, prepare quiz for current level
          const quiz = getQuizForLevel(course, enrollment.Level);
          if (quiz) {
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
        employeeId: profile.EmployeeID,
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
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

  // Compute derived values
  const enrolledCourses = courses.filter(course => course.status !== 'available');
  const completedCourses = courses.filter(course => course.status === 'completed');

  const achievements = [
    { title: 'First Course Completed', date: '2024-01-10', icon: Award, color: 'bg-yellow-500' },
    { title: 'Security Expert', date: '2024-01-08', icon: Star, color: 'bg-blue-500' },
    { title: 'Fast Learner', date: '2024-01-05', icon: Clock, color: 'bg-green-500' },
  ];

  const trainingStats = [
    { title: 'Courses Enrolled', value: enrolledCourses.length.toString(), icon: BookOpen, color: 'bg-blue-500' },
    { title: 'Completed', value: completedCourses.length.toString(), icon: Award, color: 'bg-green-500' },
    { title: 'Hours Learned', value: '34', icon: Clock, color: 'bg-purple-500' },
    { title: 'Certificates', value: completedCourses.length.toString(), icon: Star, color: 'bg-yellow-500' },
  ];

  return (
    // Rest of the JSX remains the same as before
    // Just update the data references and handlers in the JSX
  );
};

export default Training;

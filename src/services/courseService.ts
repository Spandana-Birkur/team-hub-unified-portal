import { baseUrl } from '@/utils/apiBase';

export interface Quiz {
  QuizID: number;
  Title: string;
  Question1: string;
  Question2: string;
  Question3: string;
  Question4: string;
  Question5: string;
  Question6: string;
  Question7: string;
  Question8: string;
  Question9: string;
  Question10: string;
  AnswerString: string;
}

export interface Course {
  CourseID: number;
  CourseName: string;
  Description: string | null;
  Quiz1: Quiz | null;
  Quiz2: Quiz | null;
  Quiz3: Quiz | null;
}

export interface Enrollment {
  EnrollmentID: number;
  CourseID: number;
  EmployeeID: number;
  Level: number;
}

export interface QuizSubmission {
  employeeId: number;
  courseId: number;
  currentLevel: number;
  passed: boolean;
}

// Function to get all courses
export const getCourses = async (): Promise<Course[]> => {
  console.log('Making request to:', `${baseUrl}/api/courses`);
  const response = await fetch(`${baseUrl}/api/courses`);
  console.log('Response status:', response.status);
  if (!response.ok) {
    console.error('Failed to fetch courses:', response.statusText);
    throw new Error('Failed to fetch courses');
  }
  const data = await response.json();
  console.log('Courses data:', data);
  return data.courses;
};

// Function to get course by ID
export const getCourseById = async (courseId: number): Promise<Course> => {
  const response = await fetch(`${baseUrl}/courses/${courseId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch course');
  }
  const data = await response.json();
  return data;
};

// Function to get enrollments for an employee
export const getEmployeeEnrollments = async (employeeId: number): Promise<Enrollment[]> => {
  const response = await fetch(`${baseUrl}/api/courses/enrollments/${employeeId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch enrollments');
  }
  const data = await response.json();
  return data.enrollments;
};

// Function to get enrollment for a specific course
export const getCourseEnrollment = async (employeeId: number, courseId: number): Promise<Enrollment | null> => {
  const response = await fetch(`${baseUrl}/api/courses/enrollment/${employeeId}/${courseId}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error('Failed to fetch enrollment');
  }
  const data = await response.json();
  return data;
};

// Function to enroll in a course
export const enrollInCourse = async (employeeId: number, courseId: number): Promise<void> => {
  const response = await fetch(`${baseUrl}/api/courses/enroll`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      EmployeeID: employeeId,
      CourseID: courseId,
      level: 0,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to enroll in course');
  }
};

// Function to submit quiz and update progress
export const submitQuiz = async (submission: QuizSubmission): Promise<{ newLevel: number }> => {
  const response = await fetch(`${baseUrl}/api/courses/quiz/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(submission),
  });
  if (!response.ok) {
    throw new Error('Failed to submit quiz');
  }
  const data = await response.json();
  return { newLevel: data.newLevel };
};

// Helper function to get the appropriate quiz based on level
export const getQuizForLevel = (course: Course, level: number): Quiz | null => {
  let quiz = null;
  switch (level) {
    case 0:
      quiz = course.Quiz1;
      break;
    case 1:
      quiz = course.Quiz2;
      break;
    case 2:
      quiz = course.Quiz3;
      break;
    default:
      return null;
  }
  if (quiz) {
    console.log(`Quiz Level ${level + 1} Answer String:`, quiz.AnswerString);
  }
  return quiz;
};

// Helper function to parse quiz questions from Quiz object
export const parseQuizQuestions = (quiz: Quiz) => {
  return [
    { id: 1, question: quiz.Question1 },
    { id: 2, question: quiz.Question2 },
    { id: 3, question: quiz.Question3 },
    { id: 4, question: quiz.Question4 },
    { id: 5, question: quiz.Question5 },
    { id: 6, question: quiz.Question6 },
    { id: 7, question: quiz.Question7 },
    { id: 8, question: quiz.Question8 },
    { id: 9, question: quiz.Question9 },
    { id: 10, question: quiz.Question10 },
  ];
};

// Helper function to check if an answer is correct based on AnswerString
export const isAnswerCorrect = (quiz: Quiz, questionIndex: number, answer: number): boolean => {
  const answerKey: { [key: string]: number } = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
  const correctAnswer = answerKey[quiz.AnswerString[questionIndex]];
  console.log(`Question ${questionIndex + 1}: Your answer: ${answer}, Correct answer: ${correctAnswer} (${quiz.AnswerString[questionIndex]})`);
  return answer === correctAnswer;
};

// Helper function to validate quiz answers and determine if quiz is passed
export const validateQuiz = (quiz: Quiz, answers: { [key: string]: number }): boolean => {
  let correctAnswers = 0;
  for (let i = 0; i < quiz.AnswerString.length; i++) {
    if (isAnswerCorrect(quiz, i, answers[i + 1])) {
      correctAnswers++;
    }
  }
  return correctAnswers >= 7; // Pass threshold is 7 out of 10
};

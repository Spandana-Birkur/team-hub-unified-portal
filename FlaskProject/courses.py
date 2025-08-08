import os
import pyodbc
from dbconnect import *

class Course:

    def __init__(self, CourseID=None, CourseName=None, Quiz1=None, Quiz2=None, Quiz3=None, Description=None):
        self.CourseID = CourseID
        self.CourseName = CourseName
        self.Quiz1 = Quiz1
        self.Quiz2 = Quiz2
        self.Quiz3 = Quiz3
        self.Description = Description

    def toDict(self):
        return {
            "CourseID": self.CourseID,
            "CourseName": self.CourseName,
            "Quiz1": self.Quiz1.toDict() if self.Quiz1 else None,
            "Quiz2": self.Quiz2.toDict() if self.Quiz2 else None,
            "Quiz3": self.Quiz3.toDict() if self.Quiz3 else None,
            "Description": self.Description
        }

class Quiz:

    def __init__(self, QuizID=None, QuizName=None, Question1=None, Question2=None, Question3=None, Question4=None, Question5=None, Question6=None, Question7=None, Question8=None, Question9=None, Question10=None, AnswerString=None):
        self.QuizID = QuizID
        self.QuizName = QuizName
        self.Question1 = Question1
        self.Question2 = Question2
        self.Question3 = Question3
        self.Question4 = Question4
        self.Question5 = Question5
        self.Question6 = Question6
        self.Question7 = Question7
        self.Question8 = Question8
        self.Question9 = Question9
        self.Question10 = Question10
        self.AnswerString = AnswerString

    def toDict(self):
        return {
            "QuizID": self.QuizID,
            "QuizName": self.QuizName,
            "Question1": self.Question1,
            "Question2": self.Question2,
            "Question3": self.Question3,
            "Question4": self.Question4,
            "Question5": self.Question5,
            "Question6": self.Question6,
            "Question7": self.Question7,
            "Question8": self.Question8,
            "Question9": self.Question9,
            "Question10": self.Question10,
            "AnswerString": self.AnswerString
        }
    
class Enrollment:

    def __init__(self, EnrollmentID=None, CourseID=None, EmployeeID=None, Level=1):
        self.EnrollmentID = EnrollmentID
        self.CourseID = CourseID
        self.EmployeeID = EmployeeID
        self.Level = Level

    def toDict(self):
        return {
            "EnrollmentID": self.EnrollmentID,
            "CourseID": self.CourseID,
            "EmployeeID": self.EmployeeID,
            "Level": self.Level
        }

def getCourses():
    courses = []
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        cursor = connection.cursor()
        query = "SELECT * FROM COURSES"
        cursor.execute(query)
        rows = cursor.fetchall()

        for row in rows:
            newCourse = Course(
                CourseID=row.CourseID,
                CourseName=row.CourseName,
                Quiz1=getQuizByID(row.Quiz1ID) if row.Quiz1ID else None,
                Quiz2=getQuizByID(row.Quiz2ID) if row.Quiz2ID else None,
                Quiz3=getQuizByID(row.Quiz3ID) if row.Quiz3ID else None,
                Description=row.Description
            )
            print(f"Course fetched: {newCourse.CourseName}")
            courses.append(newCourse)
        cursor.close()
        connection.close()
    except pyodbc.Error as e:
        print("Error fetching data: ", e)
    return courses

def getQuizByID(quiz_id):
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        cursor = connection.cursor()
        query = "SELECT * FROM QUIZZES WHERE QuizID = ?"
        cursor.execute(query, (quiz_id,))
        row = cursor.fetchone()

        if row:
            quiz = Quiz(
                QuizID=row.QuizID,
                QuizName=row.QuizName,
                Question1=row.Question1,
                Question2=row.Question2,
                Question3=row.Question3,
                Question4=row.Question4,
                Question5=row.Question5,
                Question6=row.Question6,
                Question7=row.Question7,
                Question8=row.Question8,
                Question9=row.Question9,
                Question10=row.Question10,
                AnswerString=row.AnswerString
            )
            cursor.close()
            connection.close()
            return quiz
        else:
            cursor.close()
            connection.close()
            return None
    except pyodbc.Error as e:
        print("Error fetching data: ", e)
        return None

def getCourseByID(course_id):
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        cursor = connection.cursor()
        query = "SELECT * FROM COURSES WHERE CourseID = ?"
        cursor.execute(query, (course_id,))
        row = cursor.fetchone()

        if row:
            course = Course(
                CourseID=row.CourseID,
                CourseName=row.CourseName,
                Quiz1=getQuizByID(row.Quiz1ID) if row.Quiz1ID else None,
                Quiz2=getQuizByID(row.Quiz2ID) if row.Quiz2ID else None,
                Quiz3=getQuizByID(row.Quiz3ID) if row.Quiz3ID else None,
                Description=row.Description
            )
            cursor.close()
            connection.close()
            return course
        else:
            cursor.close()
            connection.close()
            return None
    except pyodbc.Error as e:
        print("Error fetching data: ", e)
        return None
    
def enrollInCourse(employee_id, course_id, level=0):
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        cursor = connection.cursor()
        query = "INSERT INTO COURSE_ENROLLMENT (CourseID, EmployeeID, Level) VALUES (?, ?, ?)"
        cursor.execute(query, (course_id, employee_id, level))
        connection.commit()
        cursor.close()
        connection.close()
        print("Enrollment successful!")
    except pyodbc.Error as e:
        print("Error enrolling in course: ", e)
        return False
    return True

def updateEnrollmentLevel(enrollment_id, new_level):
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        cursor = connection.cursor()
        query = "UPDATE COURSE_ENROLLMENT SET Level = ? WHERE EnrollmentID = ?"
        cursor.execute(query, (new_level, enrollment_id))
        connection.commit()
        cursor.close()
        connection.close()
        print("Enrollment level updated successfully!")
    except pyodbc.Error as e:
        print("Error updating enrollment level: ", e)
        return False
    return True

def getEnrollmentsByEmployeeId(employee_id):
    enrollments = []
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        cursor = connection.cursor()
        query = "SELECT * FROM COURSE_ENROLLMENT WHERE EmployeeID = ?"
        cursor.execute(query, (employee_id,))
        rows = cursor.fetchall()

        for row in rows:
            newEnrollment = Enrollment(
                EnrollmentID=row.EnrollmentID,
                CourseID=row.CourseID,
                EmployeeID=row.EmployeeID,
                Level=row.Level
            )
            enrollments.append(newEnrollment)
        cursor.close()
        connection.close()
    except pyodbc.Error as e:
        print("Error fetching enrollments by Employee ID: ", e)
    return enrollments

def getCourseEnrollment(employee_id, course_id):
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        cursor = connection.cursor()
        query = "SELECT * FROM COURSE_ENROLLMENT WHERE EmployeeID = ? AND CourseID = ?"
        cursor.execute(query, (employee_id, course_id))
        row = cursor.fetchone()

        if row:
            enrollment = Enrollment(
                EnrollmentID=row.EnrollmentID,
                CourseID=row.CourseID,
                EmployeeID=row.EmployeeID,
                Level=row.Level
            )
            cursor.close()
            connection.close()
            return enrollment
        else:
            cursor.close()
            connection.close()
            return None
    except pyodbc.Error as e:
        print("Error fetching enrollment: ", e)
        return None

def updateQuizProgress(employee_id, course_id, current_level, passed):
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        cursor = connection.cursor()

        if passed:
            new_level = min(current_level + 1, 3)  # Cap at level 3
            query = """
                UPDATE COURSE_ENROLLMENT 
                SET Level = ? 
                WHERE EmployeeID = ? AND CourseID = ?
            """
            cursor.execute(query, (new_level, employee_id, course_id))
            connection.commit()
            
            # Return the new level for front-end update
            result = {"success": True, "newLevel": new_level}
        else:
            # If failed, don't update level but return current level
            result = {"success": False, "newLevel": current_level}

        cursor.close()
        connection.close()
        return result
    except pyodbc.Error as e:
        print("Error updating quiz progress: ", e)
        return {"success": False, "error": str(e)}


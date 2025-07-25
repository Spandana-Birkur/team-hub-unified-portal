from dotenv import load_dotenv
import os
import pyodbc

load_dotenv()

# Connection Details
server = os.getenv('DB_SERVER')
database = os.getenv('DB_DATABASE')
username = os.getenv('DB_USERNAME')
password = os.getenv('DB_PASSWORD')
driver = os.getenv('DB_DRIVER')


class Employee:
    def __init__(self, firstName="", lastName="", ID=-1, department="", role="", gender='', pword = "", email = "", phoneNumber="", bio=""):
        self.firstName = firstName
        self.lastName = lastName
        self.ID = ID
        self.department = department
        self.role = role
        self.gender = gender
        self.pword = pword
        self.email = email
        self.phoneNumber = phoneNumber
        self.bio = bio

    def toDict(self):
        return {
            "firstName": self.firstName,
            "lastName": self.lastName,
            "ID": self.ID,
            "department": self.department,
            "role": self.role,
            "gender": self.gender,
            "pword": self.pword,
            "email": self.email,
            "phoneNumber": self.phoneNumber,
            "bio": self.bio
        }

    def toString(self):
        return f" {self.ID}, {self.firstName}, {self.lastName}, {self.department}, {self.role}"

def parseDB():

    employees = []

    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        print('Connection successful!')
    except pyodbc.Error as e:
        print('Error connecting to the database: ', e)

    try:
        query = "Select * from EMPLOYEES"
        cursor = connection.cursor()
        cursor.execute(query)
        rows = cursor.fetchall()




        # print results
        for row in rows:
            newEmployee = Employee()
            newEmployee.ID, newEmployee.firstName, newEmployee.lastName, newEmployee.department, newEmployee.role, newEmployee.gender, newEmployee.pword, newEmployee.email, newEmployee.phoneNumber, newEmployee.bio = row
            print(row)
            employees.append(newEmployee)

        # close cursor
        cursor.close()
        connection.close()
        print("Connection Closed.")

    except pyodbc.Error as e:
        print("Error fetching data: ", e)

    print("Employees List: ")
    for employee in employees:
        print(employee.toString())

    return employees

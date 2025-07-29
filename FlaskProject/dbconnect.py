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
    def __init__(self, firstName="", lastName="", ID=-1, department="", role="", gender='', pword = "", email = "", phoneNumber="", bio="", ManagerID=None):
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
        self.ManagerID = ManagerID

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
            "bio": self.bio,
            "ManagerID": self.ManagerID
        }

    def toString(self):
        return f" {self.ID}, {self.firstName}, {self.lastName}, {self.department}, {self.role}, {self.ManagerID}"

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
            newEmployee.ID, newEmployee.firstName, newEmployee.lastName, newEmployee.department, newEmployee.role, newEmployee.gender, newEmployee.pword, newEmployee.email, newEmployee.phoneNumber, newEmployee.bio, newEmployee.ManagerID = row
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

def updateBio(email, new_bio):
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        cursor = connection.cursor()
        query = f"UPDATE EMPLOYEES SET Bio = ? WHERE Email = ?"
        cursor.execute(query, (new_bio, email))
        connection.commit()
        cursor.close()
        connection.close()
        print("Bio updated successfully.")
        return True
    except pyodbc.Error as e:
        print("Error updating bio: ", e)
        return False
    
def getSubordinates(id):
    subordinates = []
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        cursor = connection.cursor()
        query = "SELECT * FROM EMPLOYEES WHERE ManagerID = ?"
        cursor.execute(query, (id,))
        rows = cursor.fetchall()

        for row in rows:
            newEmployee = Employee() # getEmployeeByID(row[0])
            (
                newEmployee.ID,
                newEmployee.firstName,
                newEmployee.lastName,
                newEmployee.department,
                newEmployee.role,
                newEmployee.gender,
                newEmployee.pword,
                newEmployee.email,
                newEmployee.phoneNumber,
                newEmployee.bio,
                newEmployee.ManagerID
            ) = row
            print(f"New subordinate added: {newEmployee.toString()}")
            subordinates.append(newEmployee)
        cursor.close()
        connection.close()
    except pyodbc.Error as e:
        print("Error fetching subordinates: ", e)
    return subordinates

def getManager(id):
    if getEmployeeByID(id) == None:
        return None
    manager = getEmployeeByID(getEmployeeByID(id).ManagerID)
    return manager

def getManagers(id):
    managers = []
    if getManager(id) == None:
        return None
    
    managers = getManagersHelper(getManager(id), managers)
    return managers

def getManagersHelper(manager, managers):
    if manager == None:
        return
    managers.append(getManagersHelper(getManager(manager), managers))
    managers.append(manager)
    return managers


def getEmployeeByID(id):
    employee = Employee()
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        cursor = connection.cursor()
        query = "SELECT * FROM EMPLOYEES WHERE EmployeeID = ?"
        cursor.execute(query, (id,))
        row = cursor.fetchone()

        if row:
            employee.ID, employee.firstName, employee.lastName, employee.department, employee.role, employee.gender, employee.pword, employee.email, employee.phoneNumber, employee.bio, employee.ManagerID = row
        cursor.close()
        connection.close()
    except pyodbc.Error as e:
        print("Error fetching employee: ", e)
        return None
    return employee

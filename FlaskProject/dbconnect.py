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
            newEmployee.ID = row[0]
            newEmployee.firstName = row[1]
            newEmployee.lastName = row[2]
            newEmployee.department = row[3]
            newEmployee.role = row[4]
            newEmployee.gender = row[5]
            newEmployee.pword = row[6]
            newEmployee.email = row[7]
            newEmployee.phoneNumber = row[8]
            newEmployee.bio = row[9]
            newEmployee.ManagerID = row[10]
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
            newEmployee.ID = row[0]
            newEmployee.firstName = row[1]
            newEmployee.lastName = row[2]
            newEmployee.department = row[3]
            newEmployee.role = row[4]
            newEmployee.gender = row[5]
            newEmployee.pword = row[6]
            newEmployee.email = row[7]
            newEmployee.phoneNumber = row[8]
            newEmployee.bio = row[9]
            newEmployee.ManagerID = row[10]
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
            employee.ID = row[0]
            employee.firstName = row[1]
            employee.lastName = row[2]
            employee.department = row[3]
            employee.role = row[4]
            employee.gender = row[5]
            employee.pword = row[6]
            employee.email = row[7]
            employee.phoneNumber = row[8]
            employee.bio = row[9]
            employee.ManagerID = row[10]
        cursor.close()
        connection.close()
    except pyodbc.Error as e:
        print("Error fetching employee: ", e)
        return None
    return employee

def getTeammatesByID(id):
    teammates = []
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        cursor = connection.cursor()
        query = "SELECT * FROM EMPLOYEES WHERE Department = (SELECT Department FROM EMPLOYEES WHERE EmployeeID = ? ) AND ManagerID = (SELECT ManagerID FROM EMPLOYEES WHERE EmployeeID = ?)"
        cursor.execute(query, (id, id))
        rows = cursor.fetchall()

        for row in rows:
            if row[0] != id:  # Exclude the employee themselves
                employee = Employee()
                employee.ID = row[0]
                employee.firstName = row[1]
                employee.lastName = row[2]
                employee.department = row[3]
                employee.role = row[4]
                employee.gender = row[5]
                employee.pword = row[6]
                employee.email = row[7]
                employee.phoneNumber = row[8]
                employee.bio = row[9]
                employee.ManagerID = row[10]
                teammates.append(employee)
        cursor.close()
        connection.close()
    except pyodbc.Error as e:
        print("Error fetching teammates: ", e)
    return teammates


if __name__ == "__main__":
    employees = getTeammatesByID(26)
    for emp in employees:
        print(emp.toDict())

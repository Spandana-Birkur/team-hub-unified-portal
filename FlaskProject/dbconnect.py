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
    def __init__(self, firstName="", lastName="", ID=-1, department="", role="", gender='', pword = "", email = "", phoneNumber="", bio="", ManagerID=None, vacationDays=20, sickDays=10, personalDays=5, otherDays=0, salary=0):
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
        self.vacationDays = vacationDays
        self.sickDays = sickDays
        self.personalDays = personalDays
        self.otherDays = otherDays
        self.salary = salary

    def toDict(self):
        return {
            "FirstName": self.firstName,
            "LastName": self.lastName,
            "EmployeeID": self.ID,
            "Department": self.department,
            "Role": self.role,
            "Gender": self.gender,
            "Pword": self.pword,
            "Email": self.email,
            "PhoneNumber": self.phoneNumber,
            "Bio": self.bio,
            "ManagerID": self.ManagerID,
            "VacationDays": self.vacationDays,
            "SickDays": self.sickDays,
            "PersonalDays": self.personalDays,
            "OtherDays": self.otherDays,
            "Salary": self.salary
        }

    def toString(self):
        return f" {self.ID}, {self.firstName}, {self.lastName}, {self.department}, {self.role}, {self.ManagerID}"

def parseDB():

    employees = []

    connection = None  # Initialize connection to None
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        print('Connection successful!')

        query = "SELECT * FROM EMPLOYEES"
        cursor = connection.cursor()
        cursor.execute(query)
        rows = cursor.fetchall()

        for row in rows:
            idpls = row.EmployeeID
            print(f"Employee ID: {idpls}")
            # Create a new Employee object and populate it with the row data
            print(type(row))
            newEmployee = Employee()
            # Handle the case where leave balance columns might not exist yet
            newEmployee.ID = row.EmployeeID
            newEmployee.firstName = row.FirstName
            newEmployee.lastName = row.LastName
            newEmployee.department = row.Department
            newEmployee.role = row.Role
            newEmployee.gender = row.Gender
            newEmployee.pword = row.Pword
            newEmployee.email = row.Email
            newEmployee.phoneNumber = row.PhoneNumber
            newEmployee.bio = row.Bio
            newEmployee.ManagerID = row.ManagerID
            newEmployee.vacationDays = row.VacationDays if hasattr(row, 'VacationDays') else 20
            newEmployee.sickDays = row.SickDays if hasattr(row, 'SickDays') else 10
            newEmployee.personalDays = row.PersonalDays if hasattr(row, 'PersonalDays') else 5
            newEmployee.otherDays = row.OtherDays if hasattr(row, 'OtherDays') else 0
            newEmployee.salary = row.Salary if hasattr(row, 'Salary') else 0
            
            print(row)
            employees.append(newEmployee)

        # close cursor
        cursor.close()

    except pyodbc.Error as e:
        print("Error connecting to or fetching data from the database: ", e)
    
    finally:
        # Make sure to close the connection if it was successfully opened
        if connection:
            connection.close()
            print("Connection Closed.")

    print("Employees List: ")
    for employee in employees:
        print(employee.toString())

    return employees

def updateBio(email, new_bio):
    connection = None
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        cursor = connection.cursor()
        query = f"UPDATE EMPLOYEES SET Bio = ? WHERE Email = ?"
        cursor.execute(query, (new_bio, email))
        connection.commit()
        cursor.close()
        print("Bio updated successfully.")
        return True
    except pyodbc.Error as e:
        print("Error updating bio: ", e)
        return False
    finally:
        if connection:
            connection.close()
    
def getSubordinates(id):
    subordinates = []
    connection = None
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        cursor = connection.cursor()
        query = "SELECT * FROM EMPLOYEES WHERE ManagerID = ?"
        cursor.execute(query, (id,))
        rows = cursor.fetchall()

        for row in rows:
            newEmployee = Employee()
            # Handle the case where leave balance columns might not exist yet
            if len(row) >= 15:  # With leave balance columns
                (newEmployee.ID, newEmployee.firstName, newEmployee.lastName, newEmployee.department, 
                 newEmployee.role, newEmployee.gender, newEmployee.pword, newEmployee.email, 
                 newEmployee.phoneNumber, newEmployee.bio, newEmployee.ManagerID,
                 newEmployee.vacationDays, newEmployee.sickDays, newEmployee.personalDays, newEmployee.otherDays, newEmployee.salary) = row
            else:  # Without leave balance columns (fallback)
                (newEmployee.ID, newEmployee.firstName, newEmployee.lastName, newEmployee.department, 
                 newEmployee.role, newEmployee.gender, newEmployee.pword, newEmployee.email, 
                 newEmployee.phoneNumber, newEmployee.bio, newEmployee.ManagerID) = row
                # Set default values
                newEmployee.vacationDays = 20
                newEmployee.sickDays = 10
                newEmployee.personalDays = 5
                newEmployee.otherDays = 0
            print(row)
            print(f"New subordinate added: {newEmployee.toString()}")
            subordinates.append(newEmployee)
        cursor.close()
    except pyodbc.Error as e:
        print("Error fetching subordinates: ", e)
    finally:
        if connection:
            connection.close()
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
    connection = None
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        cursor = connection.cursor()
        query = "SELECT * FROM EMPLOYEES WHERE EmployeeID = ?"
        cursor.execute(query, (id,))
        row = cursor.fetchone()

        if row:
            # Create a new Employee object and populate it with the row data
            employee.ID = row.EmployeeID
            employee.firstName = row.FirstName
            employee.lastName = row.LastName
            employee.department = row.Department
            employee.role = row.Role
            employee.gender = row.Gender
            employee.pword = row.Pword
            employee.email = row.Email
            employee.phoneNumber = row.PhoneNumber
            employee.bio = row.Bio
            employee.ManagerID = row.ManagerID
            employee.vacationDays = row.VacationDays if hasattr(row, 'VacationDays') else 20
            employee.sickDays = row.SickDays if hasattr(row, 'SickDays') else 10
            employee.personalDays = row.PersonalDays if hasattr(row, 'PersonalDays') else 5
            employee.otherDays = row.OtherDays if hasattr(row, 'OtherDays') else 0
            employee.salary = row.Salary if hasattr(row, 'Salary') else 0
            print(row)
        else:
            # If no employee is found, return None
            return None
        cursor.close()
    except pyodbc.Error as e:
        print("Error fetching employee: ", e)
        return None
    finally:
        if connection:
            connection.close()
    return employee

def getTeammatesByID(id):
    teammates = []
    connection = None
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        cursor = connection.cursor()
        query = "SELECT * FROM EMPLOYEES WHERE Department = (SELECT Department FROM EMPLOYEES WHERE EmployeeID = ? ) AND ManagerID = (SELECT ManagerID FROM EMPLOYEES WHERE EmployeeID = ?)"
        cursor.execute(query, (id, id))
        rows = cursor.fetchall()

        for row in rows:
            if row[0] != id:  # Exclude the employee themselves
                newEmployee = Employee()  # getEmployeeByID(row[0])
                if len(row) >= 15:  # With leave balance columns
                    (newEmployee.ID, newEmployee.firstName, newEmployee.lastName, newEmployee.department, 
                    newEmployee.role, newEmployee.gender, newEmployee.pword, newEmployee.email, 
                    newEmployee.phoneNumber, newEmployee.bio, newEmployee.ManagerID,
                    newEmployee.vacationDays, newEmployee.sickDays, newEmployee.personalDays, newEmployee.otherDays, newEmployee.salary) = row
                else:  # Without leave balance columns (fallback)
                    (newEmployee.ID, newEmployee.firstName, newEmployee.lastName, newEmployee.department, 
                    newEmployee.role, newEmployee.gender, newEmployee.pword, newEmployee.email, 
                    newEmployee.phoneNumber, newEmployee.bio, newEmployee.ManagerID) = row
                    # Set default values
                    newEmployee.vacationDays = 20
                    newEmployee.sickDays = 10
                    newEmployee.personalDays = 5
                    newEmployee.otherDays = 0
                print(row)
                teammates.append(newEmployee)
        cursor.close()
    except pyodbc.Error as e:
        print("Error fetching teammates: ", e)
    finally:
        if connection:
            connection.close()
    return teammates


if __name__ == "__main__":
    employees = getTeammatesByID(26)
    for emp in employees:
        print(emp.toDict())

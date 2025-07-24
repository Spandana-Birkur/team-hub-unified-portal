import pyodbc

# Connection Details
server = 'access-portal-server.database.windows.net'
database = 'access-portal-db'
username = 'ashwin'
password = 'AccessPortal123!'
driver = '{ODBC Driver 17 for SQL Server}'

class Employee:
    def __init__(self, firstName="", lastName="", ID=-1, department="", position="", gender='', pword = "", email = "", phoneNumber="", bio=""):
        self.firstName = firstName
        self.lastName = lastName
        self.ID = ID
        self.department = department
        self.position = position
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
            "position": self.position,
            "gender": self.gender,
            "pword": self.pword,
            "email": self.email,
            "phoneNumber": self.phoneNumber,
            "bio": self.bio
        }

    def toString(self):
        return f" {self.ID}, {self.firstName}, {self.lastName}, {self.department}, {self.position}"

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
            newEmployee.ID, newEmployee.firstName, newEmployee.lastName, newEmployee.department, newEmployee.position, newEmployee.gender, newEmployee.pword, newEmployee.email, newEmployee.phoneNumber, newEmployee.bio = row
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

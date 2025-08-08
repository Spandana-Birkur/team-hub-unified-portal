from dotenv import load_dotenv
import hashlib
import os
import pyodbc

load_dotenv()

# Connection Details
server = os.getenv('DB_SERVER')
database = os.getenv('DB_DATABASE')
username = os.getenv('DB_USERNAME')
password = os.getenv('DB_PASSWORD')
driver = os.getenv('DB_DRIVER')

from dbconnect import Employee


def CreateUser(firstName, lastName, department, position, gender, user_password):

    str = user_password
    result = hashlib.sha256(str.encode())

    print("The hexadecimal equivalent of SHA256 is : ")
    print(result.hexdigest())

    pword = result.hexdigest()

    try:
        connection = pyodbc.connect(f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        print('Connection successful!')
    except pyodbc.Error as e:
        print('Error connecting to the database: ', e)


    # query

    try:
        cursor = connection.cursor()
        # cursor.execute("Select * from EMPLOYEES")
        sql_insert_query = "INSERT INTO EMPLOYEES (FirstName, LastName, Department, Position, Gender, Pword) VALUES (?, ?, ?, ?, ?, ?);"
        cursor.execute(sql_insert_query, firstName, lastName, department, position, gender, pword)
        connection.commit()
        # close cursor
        cursor.close()

        print("Connection Closed.")

    except pyodbc.Error as e:
        print("Error fetching data: ", e)

    connection.close()

# CreateUser('Labubu', 'bubu', 'Jail', 'Warden', 'M', 'Labubu')
def CheckPw(email):
    while True:
        pwordAttempt = input("Enter your password: ")

        pwordEnc = hashlib.sha256(pwordAttempt.encode()).hexdigest()

        print(str(pwordEnc))

        pword = ''

        try:
            connection = pyodbc.connect(
                f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
            print('Connection successful!')
        except pyodbc.Error as e:
            print('Error connecting to the database: ', e)

        # query

        try:
            cursor = connection.cursor()
            # cursor.execute("Select * from EMPLOYEES")
            query = f'SELECT Pword FROM EMPLOYEES WHERE Email = \'{email}\''
            cursor.execute(query)

            row = cursor.fetchone()
            if row:
                pword = row.Pword.strip()  # remove trailing spaces
                print(str(pword))
            else:
                print("No result found.")
            # close cursor
            cursor.close()

            print("Connection Closed.")

        except pyodbc.Error as e:
            print("Error fetching data: ", e)

        connection.close()

        if str(pword) == str(pwordEnc):
            print("Password matches.")
            break;
        else:
            print("Password does not match.")

def AddPw(pw, email):
    str = pw
    result = hashlib.sha256(str.encode())

    print("The hexadecimal equivalent of SHA256 is : ")
    print(result.hexdigest())

    pword = result.hexdigest()

    try:
        connection = pyodbc.connect(f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        print('Connection successful!')
    except pyodbc.Error as e:
        print('Error connecting to the database: ', e)


    # query

    try:
        cursor = connection.cursor()
        # cursor.execute("Select * from EMPLOYEES")
        sql_update_query = "UPDATE EMPLOYEES SET Pword = ? WHERE Email = ?"
        cursor.execute(sql_update_query, pword, email);
        connection.commit()
        # close cursor
        cursor.close()

        print("Connection Closed.")

    except pyodbc.Error as e:
        print("Error fetching data: ", e)

    connection.close()


def Authenticate(email, pw):

    pwordEnc = hashlib.sha256(pw.encode()).hexdigest()
    employee = Employee()
    print(f"Hashed input password: {pwordEnc}")

    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        print('Database connection successful!')
    except pyodbc.Error as e:
        print(f'Error connecting to the database: {e}')
        return False

    try:
        cursor = connection.cursor()
        
        # Use parameterized query to prevent SQL injection
        query = "SELECT * FROM EMPLOYEES WHERE Email = ?"
        cursor.execute(query, (email,))
        
        row = cursor.fetchone()
        if not row:
            print("No user found with this email.")
            cursor.close()
            connection.close()
            return False
        
        # Extract user data
        employee.ID = row.EmployeeID
        employee.firstName = row.FirstName
        employee.lastName = row.LastName
        employee.department = row.Department
        employee.role = row.Role
        employee.gender = row.Gender
        stored_pword = row.Pword
        employee.email = row.Email
        employee.phoneNumber = row.PhoneNumber
        employee.bio = row.Bio
        employee.ManagerID = row.ManagerID
        employee.salary = row.Salary
        
        # Remove trailing spaces from stored password
        stored_pword = stored_pword.strip() if stored_pword else ""
        print(f"Stored password hash: {stored_pword}")
        
        cursor.close()
        connection.close()
        
        # Compare hashed passwords
        if stored_pword == pwordEnc:
            print("Password matches - authentication successful.")
            employee.pword = stored_pword  # Set the password field
            return employee
        else:
            print("Password does not match.")
            return False

    except pyodbc.Error as e:
        print(f"Error fetching data: {e}")
        if 'cursor' in locals():
            cursor.close()
        if 'connection' in locals():
            connection.close()
        return False

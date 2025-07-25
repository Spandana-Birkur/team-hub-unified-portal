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

from dbconnect import Employee


def CreateUser(firstName, lastName, department, position, gender, password):

    str = password
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

def AddPw(password, email):
    str = password
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


def Authenticate(email, password):

    pwordEnc = hashlib.sha256(password.encode()).hexdigest()

    employee = Employee()

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
            return False

        query = f'SELECT * FROM EMPLOYEES WHERE Email = \'{email}\' AND Pword = \'{pword}\';'
        cursor.execute(query)

        row = cursor.fetchone()

        if row:
            employee.ID, employee.firstName, employee.lastName, employee.department, employee.role, employee.gender, employee.pword, employee.email, employee.phoneNumber, employee.bio = row
            print(row)

        # close cursor
        cursor.close()

        print("Connection Closed.")

    except pyodbc.Error as e:
        print("Error fetching data: ", e)
        return False

    connection.close()

    if str(pword) == str(pwordEnc):
        print("Password matches.")
        return employee
    else:
        print("Password does not match.")
        return False


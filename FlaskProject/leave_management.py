from dbconnect import *
from datetime import datetime, date
import pyodbc

class LeaveRequest:
    def __init__(self, requestId=None, employeeId=None, employeeName=None, leaveType=None, startDate=None, endDate=None, days=None, reason=None, status=None, submittedDate=None, approvedBy=None, approvedDate=None):
        self.requestId = requestId
        self.employeeId = employeeId
        self.employeeName = employeeName
        self.leaveType = leaveType
        self.startDate = startDate
        self.endDate = endDate
        self.days = days
        self.reason = reason
        self.status = status  # 'pending', 'approved', 'rejected'
        self.submittedDate = submittedDate
        self.approvedBy = approvedBy
        self.approvedDate = approvedDate

    def toDict(self):
        return {
            "requestId": self.requestId,
            "employeeId": self.employeeId,
            "employeeName": self.employeeName,
            "leaveType": self.leaveType,
            "startDate": self.startDate,
            "endDate": self.endDate,
            "days": self.days,
            "reason": self.reason,
            "status": self.status,
            "submittedDate": self.submittedDate,
            "approvedBy": self.approvedBy,
            "approvedDate": self.approvedDate
        }
    
    def toString(self):
        return f"Leave Request ID: {self.requestId}, Employee: {self.employeeName}, Type: {self.leaveType}, Status: {self.status}"

class LeaveBalance:
    def __init__(self, employeeId=None, vacationDays=None, sickDays=None, personalDays=None, otherDays=None):
        self.employeeId = employeeId
        self.vacationDays = vacationDays or 0
        self.sickDays = sickDays or 0
        self.personalDays = personalDays or 0
        self.otherDays = otherDays or 0

    def toDict(self):
        return {
            "employeeId": self.employeeId,
            "vacationDays": self.vacationDays,
            "sickDays": self.sickDays,
            "personalDays": self.personalDays,
            "otherDays": self.otherDays
        }

def getLeaveRequests():
    """Get all leave requests"""
    leaveRequests = []
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        print('Connection successful!')
    except pyodbc.Error as e:
        print('Error connecting to the database: ', e)
        return leaveRequests

    try:
        query = """
        SELECT lr.RequestID, lr.EmployeeID, 
               e.FirstName + ' ' + e.LastName as EmployeeName,
               lr.LeaveType, lr.StartDate, lr.EndDate, lr.Days, 
               lr.Reason, lr.Status, lr.SubmittedDate, 
               lr.ApprovedBy, lr.ApprovedDate
        FROM LEAVE_REQUESTS lr
        JOIN EMPLOYEES e ON lr.EmployeeID = e.EmployeeID
        ORDER BY lr.SubmittedDate DESC
        """
        cursor = connection.cursor()
        cursor.execute(query)
        rows = cursor.fetchall()

        for row in rows:
            leaveRequest = LeaveRequest()
            (leaveRequest.requestId, leaveRequest.employeeId, leaveRequest.employeeName,
             leaveRequest.leaveType, leaveRequest.startDate, leaveRequest.endDate,
             leaveRequest.days, leaveRequest.reason, leaveRequest.status,
             leaveRequest.submittedDate, leaveRequest.approvedBy, leaveRequest.approvedDate) = row
            leaveRequests.append(leaveRequest)

        cursor.close()
        connection.close()
        print("Connection Closed.")

    except pyodbc.Error as e:
        print("Error fetching leave requests: ", e)

    return leaveRequests

def getLeaveRequestById(requestId):
    """Get a specific leave request by ID"""
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        print('Connection successful!')
    except pyodbc.Error as e:
        print('Error connecting to the database: ', e)
        return None

    try:
        cursor = connection.cursor()
        query = """
        SELECT lr.RequestID, lr.EmployeeID, 
               e.FirstName + ' ' + e.LastName as EmployeeName,
               lr.LeaveType, lr.StartDate, lr.EndDate, lr.Days, 
               lr.Reason, lr.Status, lr.SubmittedDate, 
               lr.ApprovedBy, lr.ApprovedDate
        FROM LEAVE_REQUESTS lr
        JOIN EMPLOYEES e ON lr.EmployeeID = e.EmployeeID
        WHERE lr.RequestID = ?
        """
        cursor.execute(query, requestId)
        row = cursor.fetchone()
        
        if row:
            leaveRequest = LeaveRequest()
            (leaveRequest.requestId, leaveRequest.employeeId, leaveRequest.employeeName,
             leaveRequest.leaveType, leaveRequest.startDate, leaveRequest.endDate,
             leaveRequest.days, leaveRequest.reason, leaveRequest.status,
             leaveRequest.submittedDate, leaveRequest.approvedBy, leaveRequest.approvedDate) = row
            return leaveRequest
        else:
            print("Leave request not found.")
            return None
    except pyodbc.Error as e:
        print("Error fetching leave request: ", e)
        return None
    finally:
        cursor.close()
        connection.close()

def getLeaveRequestsByEmployeeId(employeeId):
    """Get all leave requests for a specific employee"""
    leaveRequests = []
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        print('Connection successful!')
    except pyodbc.Error as e:
        print('Error connecting to the database: ', e)
        return leaveRequests

    try:
        cursor = connection.cursor()
        query = """
        SELECT lr.RequestID, lr.EmployeeID, 
               e.FirstName + ' ' + e.LastName as EmployeeName,
               lr.LeaveType, lr.StartDate, lr.EndDate, lr.Days, 
               lr.Reason, lr.Status, lr.SubmittedDate, 
               lr.ApprovedBy, lr.ApprovedDate
        FROM LEAVE_REQUESTS lr
        JOIN EMPLOYEES e ON lr.EmployeeID = e.EmployeeID
        WHERE lr.EmployeeID = ?
        ORDER BY lr.SubmittedDate DESC
        """
        cursor.execute(query, employeeId)
        rows = cursor.fetchall()

        for row in rows:
            leaveRequest = LeaveRequest()
            (leaveRequest.requestId, leaveRequest.employeeId, leaveRequest.employeeName,
             leaveRequest.leaveType, leaveRequest.startDate, leaveRequest.endDate,
             leaveRequest.days, leaveRequest.reason, leaveRequest.status,
             leaveRequest.submittedDate, leaveRequest.approvedBy, leaveRequest.approvedDate) = row
            leaveRequests.append(leaveRequest)

        cursor.close()
        connection.close()
        print("Connection Closed.")
    except pyodbc.Error as e:
        print("Error fetching leave requests: ", e)

    return leaveRequests

def createLeaveRequest(employeeId, leaveType, startDate, endDate, days, reason):
    """Create a new leave request"""
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        print('Connection successful!')
    except pyodbc.Error as e:
        print('Error connecting to the database: ', e)
        return False

    try:
        cursor = connection.cursor()
        query = """
        INSERT INTO LEAVE_REQUESTS (EmployeeID, LeaveType, StartDate, EndDate, Days, Reason, Status, SubmittedDate)
        VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)
        """
        submittedDate = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        cursor.execute(query, (employeeId, leaveType, startDate, endDate, days, reason, submittedDate))
        connection.commit()
        print("Leave request created successfully.")
        return True
    except pyodbc.Error as e:
        print("Error creating leave request: ", e)
        return False
    finally:
        cursor.close()
        connection.close()

def approveLeaveRequest(requestId, approvedBy):
    """Approve a leave request"""
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        print('Connection successful!')
    except pyodbc.Error as e:
        print('Error connecting to the database: ', e)
        return False

    try:
        cursor = connection.cursor()
        query = """
        UPDATE LEAVE_REQUESTS 
        SET Status = 'approved', ApprovedBy = ?, ApprovedDate = ?
        WHERE RequestID = ?
        """
        approvedDate = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        cursor.execute(query, (approvedBy, approvedDate, requestId))
        connection.commit()
        print("Leave request approved successfully.")
        return True
    except pyodbc.Error as e:
        print("Error approving leave request: ", e)
        return False
    finally:
        cursor.close()
        connection.close()

def rejectLeaveRequest(requestId, approvedBy):
    """Reject a leave request"""
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        print('Connection successful!')
    except pyodbc.Error as e:
        print('Error connecting to the database: ', e)
        return False

    try:
        cursor = connection.cursor()
        query = """
        UPDATE LEAVE_REQUESTS 
        SET Status = 'rejected', ApprovedBy = ?, ApprovedDate = ?
        WHERE RequestID = ?
        """
        approvedDate = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        cursor.execute(query, (approvedBy, approvedDate, requestId))
        connection.commit()
        print("Leave request rejected successfully.")
        return True
    except pyodbc.Error as e:
        print("Error rejecting leave request: ", e)
        return False
    finally:
        cursor.close()
        connection.close()

def getLeaveBalance(employeeId):
    """Get leave balance for an employee"""
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        print('Connection successful!')
    except pyodbc.Error as e:
        print('Error connecting to the database: ', e)
        return None

    try:
        cursor = connection.cursor()
        
        # Get initial leave balance from employee record
        query = "SELECT VacationDays, SickDays, PersonalDays, OtherDays FROM EMPLOYEES WHERE EmployeeID = ?"
        cursor.execute(query, employeeId)
        row = cursor.fetchone()
        
        if not row:
            print("Employee not found.")
            return None
            
        vacationDays, sickDays, personalDays, otherDays = row
        
        # Get used leave days
        usedQuery = """
        SELECT LeaveType, SUM(Days) as UsedDays
        FROM LEAVE_REQUESTS 
        WHERE EmployeeID = ? AND Status = 'approved'
        GROUP BY LeaveType
        """
        cursor.execute(usedQuery, employeeId)
        usedRows = cursor.fetchall()
        
        # Calculate remaining balance
        usedDays = {}
        for usedRow in usedRows:
            usedDays[usedRow[0].lower()] = usedRow[1]
        
        leaveBalance = LeaveBalance(employeeId)
        leaveBalance.vacationDays = max(0, vacationDays - usedDays.get('vacation', 0))
        leaveBalance.sickDays = max(0, sickDays - usedDays.get('sick', 0))
        leaveBalance.personalDays = max(0, personalDays - usedDays.get('personal', 0))
        leaveBalance.otherDays = max(0, otherDays - usedDays.get('other', 0))
        
        cursor.close()
        connection.close()
        return leaveBalance
        
    except pyodbc.Error as e:
        print("Error fetching leave balance: ", e)
        return None

def getPendingLeaveRequests():
    """Get all pending leave requests"""
    leaveRequests = []
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        print('Connection successful!')
    except pyodbc.Error as e:
        print('Error connecting to the database: ', e)
        return leaveRequests

    try:
        cursor = connection.cursor()
        query = """
        SELECT lr.RequestID, lr.EmployeeID, 
               e.FirstName + ' ' + e.LastName as EmployeeName,
               lr.LeaveType, lr.StartDate, lr.EndDate, lr.Days, 
               lr.Reason, lr.Status, lr.SubmittedDate, 
               lr.ApprovedBy, lr.ApprovedDate
        FROM LEAVE_REQUESTS lr
        JOIN EMPLOYEES e ON lr.EmployeeID = e.EmployeeID
        WHERE lr.Status = 'pending'
        ORDER BY lr.SubmittedDate ASC
        """
        cursor.execute(query)
        rows = cursor.fetchall()

        for row in rows:
            leaveRequest = LeaveRequest()
            (leaveRequest.requestId, leaveRequest.employeeId, leaveRequest.employeeName,
             leaveRequest.leaveType, leaveRequest.startDate, leaveRequest.endDate,
             leaveRequest.days, leaveRequest.reason, leaveRequest.status,
             leaveRequest.submittedDate, leaveRequest.approvedBy, leaveRequest.approvedDate) = row
            leaveRequests.append(leaveRequest)

        cursor.close()
        connection.close()
        print("Connection Closed.")
    except pyodbc.Error as e:
        print("Error fetching pending leave requests: ", e)

    return leaveRequests 
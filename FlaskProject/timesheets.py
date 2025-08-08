from dbconnect import *
from dotenv import load_dotenv
from datetime import datetime
import os
import pyodbc

class Timesheet:

    def __init__(self, employeeId=None, weekOf=None, monday=None, tuesday=None, wednesday=None, thursday=None, friday=None, saturday=None, totalHours=None, notes=None):
        self.employeeId = employeeId
        self.weekOf = weekOf
        self.monday = monday
        self.tuesday = tuesday
        self.wednesday = wednesday
        self.thursday = thursday
        self.friday = friday
        self.saturday = saturday
        self.totalHours = totalHours
        self.notes = notes

    def toDict(self):
        return {
            "employeeId": self.employeeId,
            "week": self.weekOf.strftime('%Y-%m-%d') if self.weekOf else None,
            "hours": {
                "monday": self.monday or 0,
                "tuesday": self.tuesday or 0,
                "wednesday": self.wednesday or 0,
                "thursday": self.thursday or 0,
                "friday": self.friday or 0,
                "saturday": self.saturday or 0,
            },
            "totalHours": self.totalHours or sum([
                self.monday or 0,
                self.tuesday or 0,
                self.wednesday or 0,
                self.thursday or 0,
                self.friday or 0,
                self.saturday or 0
            ]),
            "status": "Pending",  # Add status field
            "notes": self.notes
        }
    
def getTimesheets():
    timesheets = []
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        cursor = connection.cursor()
        query = "SELECT * FROM TIMESHEETS"
        cursor.execute(query)
        rows = cursor.fetchall()

        for row in rows:
            newTimesheet = Timesheet(
                employeeId=row.EmployeeID,
                weekOf=row.WeekOf,
                monday=row.HoursWorkedMonday,
                tuesday=row.HoursWorkedTuesday,
                wednesday=row.HoursWorkedWednesday,
                thursday=row.HoursWorkedThursday,
                friday=row.HoursWorkedFriday,
                saturday=row.HoursWorkedSaturday,
                totalHours=row.HoursWorkedTotal,
                notes=row.Notes
            )
            timesheets.append(newTimesheet)
        cursor.close()
        connection.close()
    except pyodbc.Error as e:
        print("Error fetching data: ", e)
    return timesheets

def getTimesheetsByEmployeeId(employeeId):
    timesheets = []
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        cursor = connection.cursor()
        query = "SELECT * FROM TIMESHEETS WHERE EmployeeID = ?"
        cursor.execute(query, employeeId)
        rows = cursor.fetchall()

        for row in rows:
            newTimesheet = Timesheet(
                employeeId=row.EmployeeID,
                weekOf=row.WeekOf,
                monday=row.HoursWorkedMonday,
                tuesday=row.HoursWorkedTuesday,
                wednesday=row.HoursWorkedWednesday,
                thursday=row.HoursWorkedThursday,
                friday=row.HoursWorkedFriday,
                saturday=row.HoursWorkedSaturday,
                totalHours=row.HoursWorkedTotal,
                notes=row.Notes
            )
            timesheets.append(newTimesheet)
        cursor.close()
        connection.close()
    except pyodbc.Error as e:
        print("Error fetching data by Employee ID: ", e)
    return timesheets 

def createTimesheet(employeeId=None, weekOf=None, monday=None, tuesday=None, wednesday=None, thursday=None, friday=None, saturday=None, totalHours=None, notes=None):
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        cursor = connection.cursor()
        query = "INSERT INTO TIMESHEETS (EmployeeID, WeekOf, HoursWorkedMonday, HoursWorkedTuesday, HoursWorkedWednesday, HoursWorkedThursday, HoursWorkedFriday, HoursWorkedSaturday, Notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        cursor.execute(query, employeeId, weekOf, monday, tuesday, wednesday, thursday, friday, saturday, notes)
        connection.commit()
        cursor.close()
        connection.close()
    except pyodbc.Error as e:
        print("Error creating timesheet: ", e)

def getTimesheetById(timesheetId):
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        cursor = connection.cursor()
        query = "SELECT * FROM TIMESHEETS WHERE TimesheetID = ?"
        cursor.execute(query, timesheetId)
        row = cursor.fetchone()
        if row:
            timesheet = Timesheet(
                employeeId=row.EmployeeID,
                weekOf=row.WeekOf,
                monday=row.HoursWorkedMonday,
                tuesday=row.HoursWorkedTuesday,
                wednesday=row.HoursWorkedWednesday,
                thursday=row.HoursWorkedThursday,
                friday=row.HoursWorkedFriday,
                saturday=row.HoursWorkedSaturday,
                totalHours=row.HoursWorkedTotal,
                notes=row.Notes
            )
            return timesheet
        else:
            return None
    except pyodbc.Error as e:
        print("Error fetching timesheet by ID: ", e)
        return None
    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'connection' in locals() and connection:
            connection.close()
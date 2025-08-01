from dbconnect import *

class Ticket:

    def __init__(self, ticketId=None, employeeId=None, title=None, body=None, createdDate=None, priority=None, category=None, status=None):
        self.ticketId = ticketId
        self.employeeId = employeeId
        self.title = title
        self.body = body
        self.createdDate = createdDate
        self.priority = priority
        self.category = category
        self.status = status

    def toDict(self):
        return {
            "ticketId": self.ticketId,
            "employeeId": self.employeeId,
            "title": self.title,
            "body": self.body,
            "createdDate": self.createdDate,
            "priority": self.priority,
            "category": self.category,
            "status": self.status
        }
    
    def toString(self):
        return f"Ticket ID: {self.ticketId}, Employee ID: {self.employeeId}, Title: {self.title}, Body: {self.body}, Created Date: {self.createdDate}, Priority: {self.priority}, Category: {self.category}, Status: {self.status}"


def getTickets():
    tickets = []
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        print('Connection successful!')
    except pyodbc.Error as e:
        print('Error connecting to the database: ', e)
    try:
        query = "Select * from IT_TICKETS"
        cursor = connection.cursor()
        cursor.execute(query)
        rows = cursor.fetchall()




        # print results
        for row in rows:
            newTicket = Ticket()
            newTicket.ticketId = row[0]
            newTicket.employeeId = row[1]
            newTicket.title = row[2]
            newTicket.body = row[3]
            newTicket.createdDate = row[4]
            newTicket.priority = row[5]
            newTicket.status = row[6]
            newTicket.category = row[7]
            print(row)
            tickets.append(newTicket)

        # close cursor
        cursor.close()
        connection.close()
        print("Connection Closed.")

    except pyodbc.Error as e:
        print("Error fetching data: ", e)

    print("Tickets List: ")
    for ticket in tickets:
        print(ticket.toString())

    return tickets

def getTicketById(ticketId):
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        print('Connection successful!')
    except pyodbc.Error as e:
        print('Error connecting to the database: ', e)

    try:
        cursor = connection.cursor()
        query = "SELECT * FROM IT_TICKETS WHERE TicketID = ?"
        cursor.execute(query, ticketId)
        row = cursor.fetchone()
        if row:
            ticket = Ticket()
            ticket.ticketId = row[0]
            ticket.employeeId = row[1]
            ticket.title = row[2]
            ticket.body = row[3]
            ticket.createdDate = row[4]
            ticket.priority = row[5]
            ticket.status = row[6]
            ticket.category = row[7]
            print(ticket.toString())
            return ticket
        else:
            print("Ticket not found.")
            return None
    except pyodbc.Error as e:
        print("Error fetching data: ", e)
    finally:
        cursor.close()
        connection.close()

def getTicketsByEmployeeId(employeeId):
    tickets = []
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        print('Connection successful!')
    except pyodbc.Error as e:
        print('Error connecting to the database: ', e)

    try:
        cursor = connection.cursor()
        query = "SELECT * FROM IT_TICKETS WHERE EmployeeID = ?"
        cursor.execute(query, employeeId)
        rows = cursor.fetchall()

        for row in rows:
            ticket = Ticket()
            ticket.ticketId = row[0]
            ticket.employeeId = row[1]
            ticket.title = row[2]
            ticket.body = row[3]
            ticket.createdDate = row[4]
            ticket.priority = row[5]
            ticket.status = row[6]
            ticket.category = row[7]
            tickets.append(ticket)

        cursor.close()
        connection.close()
        print("Connection Closed.")
    except pyodbc.Error as e:
        print("Error fetching data: ", e)

    return tickets

def createTicket(ticketId=None, employeeId=None, title=None, body=None, createdDate=None, priority=None, category=None, status=None):
    ticket = Ticket(ticketId, employeeId, title, body, createdDate, priority, category, status)
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        print('Connection successful!')
    except pyodbc.Error as e:
        print('Error connecting to the database: ', e)

    try:
        cursor = connection.cursor()
        query = "INSERT INTO IT_TICKETS (EmployeeID, TicketTitle, TicketBody, CreatedDate, TicketPriority, [Status], TicketCategory) VALUES (?, ?, ?, ?, ?, ?, ?)"
        cursor.execute(query, ticket.employeeId, ticket.title, ticket.body, ticket.createdDate, ticket.priority, ticket.status, ticket.category)
        connection.commit()
        print("Ticket created successfully.")
    except pyodbc.Error as e:
        print("Error creating ticket: ", e)
    finally:
        cursor.close()
        connection.close()

def deleteTicket(ticketId):
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        print('Connection successful!')
    except pyodbc.Error as e:
        print('Error connecting to the database: ', e)

    try:
        cursor = connection.cursor()
        query = "DELETE FROM IT_TICKETS WHERE TicketID = ?"
        cursor.execute(query, ticketId)
        connection.commit()
        print("Ticket deleted successfully.")
    except pyodbc.Error as e:
        print("Error deleting ticket: ", e)
    finally:
        cursor.close()
        connection.close()

from dbconnect import *
import pyodbc # Ensure pyodbc is imported

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
            "createdDate": self.createdDate.strftime('%Y-%m-%d') if self.createdDate else None,
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
        cursor = connection.cursor()
        query = "SELECT TicketID, EmployeeID, TicketTitle, TicketBody, CreatedDate, TicketPriority, [Status], TicketCategory FROM IT_TICKETS"
        cursor.execute(query)
        rows = cursor.fetchall()

        for row in rows:
            newTicket = Ticket(
                ticketId=row.TicketID,
                employeeId=row.EmployeeID,
                title=row.TicketTitle,
                body=row.TicketBody,
                createdDate=row.CreatedDate,
                priority=row.TicketPriority,
                status=row.Status,
                category=row.TicketCategory
            )
            tickets.append(newTicket)

        cursor.close()
        connection.close()
    except pyodbc.Error as e:
        print("Error fetching data: ", e)
    return tickets

def getTicketById(ticketId):
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        cursor = connection.cursor()
        query = "SELECT TicketID, EmployeeID, TicketTitle, TicketBody, CreatedDate, TicketPriority, [Status], TicketCategory FROM IT_TICKETS WHERE TicketID = ?"
        cursor.execute(query, ticketId)
        row = cursor.fetchone()
        if row:
            ticket = Ticket(
                ticketId=row.TicketID,
                employeeId=row.EmployeeID,
                title=row.TicketTitle,
                body=row.TicketBody,
                createdDate=row.CreatedDate,
                priority=row.TicketPriority,
                status=row.Status,
                category=row.TicketCategory
            )
            return ticket
        else:
            return None
    except pyodbc.Error as e:
        print("Error fetching data by ID: ", e)
        return None
    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'connection' in locals() and connection:
            connection.close()

def createTicket(employeeId=None, title=None, body=None, createdDate=None, priority=None, status=None, category=None):
    new_ticket_id = None
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        cursor = connection.cursor()
        query = """
            SET NOCOUNT ON;
            INSERT INTO IT_TICKETS (EmployeeID, TicketTitle, TicketBody, CreatedDate, TicketPriority, [Status], TicketCategory) 
            VALUES (?, ?, ?, ?, ?, ?, ?);
            SELECT SCOPE_IDENTITY();
        """
        cursor.execute(query, (employeeId, title, body, createdDate, priority, status, category))
        new_ticket_id = cursor.fetchone()[0]
        connection.commit()
        print(f"Ticket created successfully with ID: {new_ticket_id}")
    except pyodbc.Error as e:
        print("Error creating ticket: ", e)
        return None
    finally:
        # It's good practice to close the cursor and connection in the finally block
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'connection' in locals() and connection:
            connection.close()

    if new_ticket_id:
        return getTicketById(new_ticket_id)
    return None

def updateTicket(ticketId, data):
    if not data:
        return None
        
    set_clauses = []
    params = []
    
    column_mapping = {
        'title': 'TicketTitle',
        'body': 'TicketBody',
        'priority': 'TicketPriority',
        'category': 'TicketCategory',
        'status': '[Status]'
    }

    for key, value in data.items():
        if key in column_mapping:
            set_clauses.append(f"{column_mapping[key]} = ?")
            params.append(value)

    if not set_clauses:
        return None

    params.append(ticketId)
    
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        cursor = connection.cursor()
        query = f"UPDATE IT_TICKETS SET {', '.join(set_clauses)} WHERE TicketID = ?"
        cursor.execute(query, *params)
        connection.commit()
        
        if cursor.rowcount == 0:
            print(f"Update failed. No ticket found with ID: {ticketId}")
            return None
        print(f"Ticket {ticketId} updated successfully.")
    except pyodbc.Error as e:
        print(f"Error updating ticket {ticketId}: ", e)
        return None
    finally:
        cursor.close()
        connection.close()
    
    return getTicketById(ticketId)

def deleteTicket(ticketId):
    try:
        connection = pyodbc.connect(
            f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}')
        cursor = connection.cursor()
        query = "DELETE FROM IT_TICKETS WHERE TicketID = ?"
        cursor.execute(query, ticketId)
        connection.commit()
        if cursor.rowcount > 0:
            print("Ticket deleted successfully.")
            return True
        else:
            print("Ticket to delete not found.")
            return False
    except pyodbc.Error as e:
        print("Error deleting ticket: ", e)
        return False
    finally:
        cursor.close()
        connection.close()


if __name__ == "__main__":
    # Example usage
    tickets = getTickets()
    for ticket in tickets:
        print(ticket.toString())
    
    # Create a new ticket
    new_ticket = createTicket(1, "Test Ticket", "This is a test ticket body.", "2023-10-01", "High", "Open", "General")
    if new_ticket:
        print("New Ticket Created:", new_ticket.toString())

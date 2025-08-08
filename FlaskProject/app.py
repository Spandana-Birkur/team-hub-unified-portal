from urllib import request
import os
import sys
from werkzeug.utils import secure_filename
from azure.storage.blob import BlobServiceClient
from dotenv import load_dotenv
import uuid # Recommended for unique filenames
import datetime
sys.path.append(os.path.join(os.path.dirname(__file__), 'site_packages'))

from dotenv import load_dotenv

from flask import Flask, jsonify, request
from flask_cors import CORS
from dbconnect import *
import aiconnect
from hashtest import *
from tickets import *
from leave_management import *
from timesheets import *


# Load environment variables from .env file
load_dotenv(override=False)

# ✅ Validate required AI/Vector search environment variables
import aiconnect
aiconnect.validate_env_vars()

print("AZURE_CONNECTION_STRING =", os.getenv("AZURE_STORAGE_CONNECTION_STRING"))

app = Flask(__name__)
CORS(app)

# ... (All other routes like /api/login, /api/employees, etc. remain unchanged) ...

@app.route('/api/AIRequest', methods = ['GET', 'POST'])
def ai_request():
    if request.method == 'POST':
        data = request.json
        prompt = data.get('prompt')
        return jsonify({'response': get_rag_response_hybrid(prompt)})
    elif request.method == 'GET':
        return jsonify({'message': 'Send a POST request with a prompt.'})

@app.route('/api/AIRequestHistory', methods = ['GET', 'POST'])
def ai_request_history():
    if request.method == 'POST':
        data = request.json
        prompt = data.get('prompt')
        history = data.get('history', [])
        return jsonify({'response': get_rag_response_hybrid_with_history(prompt, history)})
    elif request.method == 'GET':
        return jsonify({'message': 'Send a POST request with a prompt and history.'})

@app.route('/api/login', methods=['POST'])
def login():
    print("Login endpoint reached")
    if request.method == 'POST':
        try:
            email = request.json.get('email')
            pw = request.json.get('password')
            print(f'Authentication attempt for email: {email}')
            
            if not email or not pw:
                print("Missing email or password")
                return jsonify({'message': 'Email and password are required'}), 400
            
            result = Authenticate(email, pw)
            print(f'Authentication result: {result}')
            
            if isinstance(result, Employee):
                print(f"Login successful for {result.email}")
                print(result.toDict())
                return jsonify(result.toDict())
            else:
                print("Authentication failed - invalid credentials")
                return jsonify({'message': 'Invalid email or password'}), 401
        except Exception as e:
            print(f"Login error: {str(e)}")
            return jsonify({'message': 'Internal server error'}), 500
    else:
        return jsonify({'message': 'POST method required'}), 405

@app.route('/api/test', methods=['GET'])
def test_cors():
    print("CORS test endpoint was reached successfully!")
    return jsonify({"message": "Success! CORS is configured correctly."})

@app.route('/api/employees', methods = ['GET'])
def employees():
    employees = parseDB()
    emps = [employee.toDict() for employee in employees]
    return jsonify({ 'employees' : emps })

@app.route('/api/employees/<int:id>', methods=['GET'])
def get_employee(id):
    employee = getEmployeeById(id)
    if employee:
        return jsonify(employee.toDict())
    return jsonify({'message': 'Employee not found'}), 404

@app.route('/api/employees/count', methods=['GET'])
def get_employee_count():
    employees = parseDB()
    count = len(employees) if employees else 0
    return jsonify({'count': count})

@app.route('/api/update-bio', methods=['POST'])
def update_bio():
    data = request.json
    email = data.get('email')
    new_bio = data.get('bio')
    # Call a function to update the bio in the database
    if updateBio(email, new_bio):
        print(f"Bio for {email} updated successfully.")
    else:
        print(f"Failed to update bio for {email}.")
        return jsonify({'message': 'Failed to update bio.'}), 500
    return jsonify({'message': 'Bio updated successfully.'}), 200

@app.route('/api/get-subordinates/<int:id>', methods=['GET'])
def get_subordinates(id):
    subordinates = getSubordinates(id)
    if not subordinates:
        return jsonify({'message': 'No subordinates found.'}), 404
    return jsonify({[emp.toDict() for emp in subordinates]}), 200

@app.route('/api/get-manager/<int:id>', methods=['GET'])
def get_manager(id):
    manager = getManager(id)
    if not manager:
        return jsonify({'message': 'No manager found.'}), 404
    print(f"Manager found: {manager.toString()}")
    return jsonify({manager.toDict()}), 200

@app.route('/api/profile/<int:id>', methods=['GET'])
def get_profile(id):
    # In a real app, you'd get the user ID from a session or token
    employee = getEmployeeByID(id)
    if employee:
        print(f"Employee object before toDict(): {employee.toDict()}") # Add this line
        return jsonify(employee.toDict())
    return jsonify({'message': 'User not found'}), 404





"""
Ticket Management API
"""
@app.route('/api/tickets', methods=['GET'])
def tickets():
    try:
        tickets_list = getTickets()
        # Sort tickets to show newest first
        if tickets_list:
            sorted_tickets = sorted(tickets_list, key=lambda t: t.createdDate, reverse=True)
            return jsonify({'tickets': [ticket.toDict() for ticket in sorted_tickets]}), 200
        return jsonify({'tickets': []}), 200
    except Exception as e:
        print(f"Error in /api/tickets: {e}")
        return jsonify({'error': 'Internal server error fetching tickets', 'details': str(e)}), 500

@app.route('/api/tickets/create', methods=['POST'])
def create_ticket():
    try:
        data = request.json
        employeeId = int(data.get('employeeId'))  # Convert to integer
        title = data.get('title')
        body = data.get('body')
        createdDate = data.get('createdDate')
        priority = data.get('priority')
        category = data.get('category')
        status = data.get('status')

        if not all([employeeId, title, body, createdDate, priority, category, status]):
            return jsonify({'error': 'All fields are required'}), 400

        new_ticket = createTicket(employeeId, title, body, createdDate, priority, status, category)
        
        if new_ticket:
            return jsonify({'message': 'Ticket created successfully', 'ticket': new_ticket.toDict()}), 201
        return jsonify({'error': 'Failed to create ticket'}), 500

    except ValueError as e:
        return jsonify({'error': 'Invalid employee ID format'}), 400
    except Exception as e:
        print("Error creating ticket:", str(e))
        return jsonify({'error': str(e)}), 500
        
@app.route('/api/tickets/update/<int:ticketId>', methods=['PUT'])
def update_ticket_route(ticketId):
    data = request.json
    if not data:
        return jsonify({'message': 'Request body cannot be empty'}), 400
        
    updated_ticket = updateTicket(ticketId, data)
    
    if updated_ticket:
        return jsonify({'message': 'Ticket updated successfully', 'ticket': updated_ticket.toDict()}), 200
    else:
        return jsonify({'message': 'Failed to update ticket or ticket not found'}), 404

# Leave Management API Routes
@app.route('/api/leave-requests', methods=['GET', 'POST'])
def leave_requests():
    if request.method == 'GET':
        try:
            leave_requests = getLeaveRequests()
            return jsonify({'leaveRequests': [req.toDict() for req in leave_requests]}), 200
        except Exception as e:
            print(f"Error fetching leave requests: {e}")
            return jsonify({'error': 'Failed to fetch leave requests'}), 500
    
    elif request.method == 'POST':
        try:
            data = request.json
            employeeId = data.get('employeeId')
            leaveType = data.get('leaveType')
            startDate = data.get('startDate')
            endDate = data.get('endDate')
            days = data.get('days')
            reason = data.get('reason')
            
            if not all([employeeId, leaveType, startDate, endDate, days, reason]):
                return jsonify({'error': 'All fields are required'}), 400
            
            success = createLeaveRequest(employeeId, leaveType, startDate, endDate, days, reason)
            if success:
                return jsonify({'message': 'Leave request created successfully'}), 201
            else:
                return jsonify({'error': 'Failed to create leave request'}), 500
        except Exception as e:
            print(f"Error creating leave request: {e}")
            return jsonify({'error': 'Failed to create leave request'}), 500

@app.route('/api/leave-requests/pending', methods=['GET'])
def pending_leave_requests():
    try:
        pending_requests = getPendingLeaveRequests()
        return jsonify({'leaveRequests': [req.toDict() for req in pending_requests]}), 200
    except Exception as e:
        print(f"Error fetching pending leave requests: {e}")
        return jsonify({'error': 'Failed to fetch pending leave requests'}), 500

@app.route('/api/leave-requests/employee/<int:employeeId>', methods=['GET'])
def employee_leave_requests(employeeId):
    try:
        employee_requests = getLeaveRequestsByEmployeeId(employeeId)
        return jsonify({'leaveRequests': [req.toDict() for req in employee_requests]}), 200
    except Exception as e:
        print(f"Error fetching employee leave requests: {e}")
        return jsonify({'error': 'Failed to fetch employee leave requests'}), 500

@app.route('/api/leave-requests/<int:requestId>', methods=['GET'])
def get_leave_request(requestId):
    try:
        leave_request = getLeaveRequestById(requestId)
        if leave_request:
            return jsonify(leave_request.toDict()), 200
        else:
            return jsonify({'error': 'Leave request not found'}), 404
    except Exception as e:
        print(f"Error fetching leave request: {e}")
        return jsonify({'error': 'Failed to fetch leave request'}), 500

@app.route('/api/leave-requests/<int:requestId>/approve', methods=['PUT'])
def approve_leave_request_route(requestId):
    try:
        data = request.json
        approvedBy = data.get('approvedBy')
        
        if not approvedBy:
            return jsonify({'error': 'approvedBy is required'}), 400
        
        success = approveLeaveRequest(requestId, approvedBy)
        if success:
            return jsonify({'message': 'Leave request approved successfully'}), 200
        else:
            return jsonify({'error': 'Failed to approve leave request'}), 500
    except Exception as e:
        print(f"Error approving leave request: {e}")
        return jsonify({'error': 'Failed to approve leave request'}), 500

@app.route('/api/leave-requests/<int:requestId>/reject', methods=['PUT'])
def reject_leave_request_route(requestId):
    try:
        data = request.json
        approvedBy = data.get('approvedBy')
        
        if not approvedBy:
            return jsonify({'error': 'approvedBy is required'}), 400
        
        success = rejectLeaveRequest(requestId, approvedBy)
        if success:
            return jsonify({'message': 'Leave request rejected successfully'}), 200
        else:
            return jsonify({'error': 'Failed to reject leave request'}), 500
    except Exception as e:
        print(f"Error rejecting leave request: {e}")
        return jsonify({'error': 'Failed to reject leave request'}), 500

@app.route('/api/leave-balance/<int:employeeId>', methods=['GET'])
def get_leave_balance_route(employeeId):
    try:
        leave_balance = getLeaveBalance(employeeId)
        if leave_balance:
            return jsonify(leave_balance.toDict()), 200
        else:
            return jsonify({'error': 'Employee not found or no leave balance available'}), 404
    except Exception as e:
        print(f"Error fetching leave balance: {e}")
        return jsonify({'error': 'Failed to fetch leave balance'}), 500
    
"""
Timesheet Management API
"""
@app.route('/api/timesheets', methods=['GET'])
def get_timesheets():
    try:
        timesheets = getTimesheets()
        return jsonify({'timesheets': [ts.toDict() for ts in timesheets]}), 200
    except Exception as e:
        print(f"Error fetching timesheets: {e}")
        return jsonify({'error': 'Failed to fetch timesheets'}), 500

@app.route('/api/timesheets/<int:employeeId>', methods=['GET'])
def get_timesheets_by_employee(employeeId):
    try:
        timesheets = getTimesheetsByEmployeeId(employeeId)
        return jsonify({'timesheets': [ts.toDict() for ts in timesheets]}), 200
    except Exception as e:
        print(f"Error fetching timesheets for employee {employeeId}: {e}")
        return jsonify({'error': 'Failed to fetch timesheets for employee'}), 500

@app.route('/api/timesheets/create', methods=['POST'])
def create_timesheet():
    try:
        data = request.json
        employeeId = data.get('employeeId')
        weekOf = data.get('weekOf')
        monday = data.get('monday')
        tuesday = data.get('tuesday')
        wednesday = data.get('wednesday')
        thursday = data.get('thursday')
        friday = data.get('friday')
        saturday = data.get('saturday')
        totalHours = data.get('totalHours')
        notes = data.get('notes')

        createTimesheet(employeeId, weekOf, monday, tuesday, wednesday, thursday, friday, saturday, totalHours, notes)
        return jsonify({'message': 'Timesheet created successfully'}), 201
    except Exception as e:
        print(f"Error creating timesheet: {e}")
        return jsonify({'error': 'Failed to create timesheet'}), 500


# Get Azure Storage connection string and container name from environment
AZURE_CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
AZURE_CONTAINER_NAME = os.getenv("AZURE_CONTAINER_NAME")

# Initialize BlobServiceClient
blob_service_client = BlobServiceClient.from_connection_string(AZURE_CONNECTION_STRING)

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No file selected for uploading"}), 400

    if file:
        # It's good practice to secure the filename
        original_filename = secure_filename(file.filename)
        
        # Create a unique name for the blob to avoid overwrites
        # E.g., using a UUID with the original file extension
        file_extension = os.path.splitext(original_filename)[1]
        unique_blob_name = f"{uuid.uuid4()}{file_extension}"

        try:
            # Get a blob client using the container name and new blob name
            blob_client = blob_service_client.get_blob_client(
                container=AZURE_CONTAINER_NAME, 
                blob=unique_blob_name
            )

            # Upload the file stream directly to the blob
            blob_client.upload_blob(file.stream, overwrite=True)

            # Return a success message with the blob name
            return jsonify({
                "message": "File uploaded successfully!",
                "filename": unique_blob_name
            }), 200

        except Exception as e:
            # Log the error for debugging
            print(f"An error occurred: {e}")
            return jsonify({"error": str(e)}), 500

    return jsonify({"error": "An unknown error occurred"}), 500
    


# ✅ Root health-check route
@app.route('/')
def index():
    return jsonify({
        'message': '✅ The Employee Portal backend is running.',
        'routes': [
            '/api/AIRequest',
            '/api/AIRequestHistory',
            '/api/login',
            '/api/test',
            '/api/employees',
            '/api/employees/count',
            '/api/update-bio',
            '/api/get-subordinates/<int:id>',
            '/api/get-manager/<int:id>',
            '/api/profile',
            '/api/tickets',
            '/api/tickets/<int:ticketId>',
            '/api/leave-requests',
            '/api/leave-requests/<int:requestId>',
            '/api/leave-requests/<int:requestId>/approve',
            '/api/leave-requests/<int:requestId>/reject',
            '/api/leave-requests/employee/<int:employeeId>',
            '/api/leave-requests/pending',
            '/api/leave-balance/<int:employeeId>',
            '/api/timesheets',
            '/api/timesheets/<int:employeeId>',
            '/api/timesheets/create',
        ]
    })


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8000))
    app.run(debug=True, host='0.0.0.0', port=port)

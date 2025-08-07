from urllib import request
import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), 'site_packages'))

from dotenv import load_dotenv

from flask import Flask, jsonify, request
from flask_cors import CORS
from dbconnect import *
from aiconnect import *
from hashtest import *
from tickets import *
from leave_management import *

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/api/AIRequest', methods = ['GET', 'POST'])
def ai_request():
    if request.method == 'POST':
        data = request.json
        prompt = data.get('prompt')
        return jsonify({'response': get_rag_response_keyword(prompt)})
    elif request.method == 'GET':
        return jsonify({'message': 'Send a POST request with a prompt.'})

@app.route('/api/AIRequestHistory', methods = ['GET', 'POST'])
def ai_request_history():
    if request.method == 'POST':
        data = request.json
        prompt = data.get('prompt')
        history = data.get('history', [])
        return jsonify({'response': get_rag_response_with_history(prompt, history)})
    elif request.method == 'GET':
        return jsonify({'message': 'Send a POST request with a prompt and history.'})

@app.route('/api/login', methods = ['GET', 'POST'])
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

"""
Ticket Management API
"""
@app.route('/api/tickets', methods=['GET'])
def tickets():
    tickets = getTickets()
    return jsonify({[ticket.toDict() for ticket in tickets]}), 200

@app.route('/api/tickets/<int:ticketId>', methods=['GET'])
def ticket(ticketId):
    ticket = getTicketById(ticketId)
    if not ticket:
        return jsonify({'message': 'Ticket not found.'}), 404
    return jsonify({ticket.toDict()}), 200

@app.route('/api/tickets/<int:ticketId>', methods=['DELETE'])
def delete_ticket(ticketId):
    deleteTicket(ticketId)
    return jsonify({'message': 'Ticket deleted successfully.'}), 200

"""
Leave Management API
"""
@app.route('/api/leave-requests', methods=['GET', 'POST'])
def leave_requests():
    if request.method == 'GET':
        leaveRequests = getLeaveRequests()
        return jsonify({'leaveRequests': [request.toDict() for request in leaveRequests]}), 200
    elif request.method == 'POST':
        data = request.json
        employeeId = data.get('employeeId')
        leaveType = data.get('leaveType')
        startDate = data.get('startDate')
        endDate = data.get('endDate')
        days = data.get('days')
        reason = data.get('reason')
        
        if not all([employeeId, leaveType, startDate, endDate, days, reason]):
            return jsonify({'message': 'All fields are required'}), 400
        
        if createLeaveRequest(employeeId, leaveType, startDate, endDate, days, reason):
            return jsonify({'message': 'Leave request created successfully'}), 201
        else:
            return jsonify({'message': 'Failed to create leave request'}), 500

@app.route('/api/leave-requests/<int:requestId>', methods=['GET'])
def leave_request(requestId):
    leaveRequest = getLeaveRequestById(requestId)
    if not leaveRequest:
        return jsonify({'message': 'Leave request not found'}), 404
    return jsonify(leaveRequest.toDict()), 200

@app.route('/api/leave-requests/<int:requestId>/approve', methods=['PUT'])
def approve_leave_request(requestId):
    data = request.json
    approvedBy = data.get('approvedBy')
    
    if not approvedBy:
        return jsonify({'message': 'Approver information is required'}), 400
    
    if approveLeaveRequest(requestId, approvedBy):
        return jsonify({'message': 'Leave request approved successfully'}), 200
    else:
        return jsonify({'message': 'Failed to approve leave request'}), 500

@app.route('/api/leave-requests/<int:requestId>/reject', methods=['PUT'])
def reject_leave_request(requestId):
    data = request.json
    approvedBy = data.get('approvedBy')
    
    if not approvedBy:
        return jsonify({'message': 'Approver information is required'}), 400
    
    if rejectLeaveRequest(requestId, approvedBy):
        return jsonify({'message': 'Leave request rejected successfully'}), 200
    else:
        return jsonify({'message': 'Failed to reject leave request'}), 500

@app.route('/api/leave-requests/employee/<int:employeeId>', methods=['GET'])
def employee_leave_requests(employeeId):
    leaveRequests = getLeaveRequestsByEmployeeId(employeeId)
    return jsonify({'leaveRequests': [request.toDict() for request in leaveRequests]}), 200

@app.route('/api/leave-requests/pending', methods=['GET'])
def pending_leave_requests():
    leaveRequests = getPendingLeaveRequests()
    return jsonify({'leaveRequests': [request.toDict() for request in leaveRequests]}), 200

@app.route('/api/leave-balance/<int:employeeId>', methods=['GET'])
def leave_balance(employeeId):
    leaveBalance = getLeaveBalance(employeeId)
    if not leaveBalance:
        return jsonify({'message': 'Employee not found'}), 404
    return jsonify(leaveBalance.toDict()), 200

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
            '/api/tickets',
            '/api/tickets/<int:ticketId>',
            '/api/leave-requests',
            '/api/leave-requests/<int:requestId>',
            '/api/leave-requests/<int:requestId>/approve',
            '/api/leave-requests/<int:requestId>/reject',
            '/api/leave-requests/employee/<int:employeeId>',
            '/api/leave-requests/pending',
            '/api/leave-balance/<int:employeeId>'
        ]
    })

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8000))
    app.run(debug=True, host='0.0.0.0', port=port)

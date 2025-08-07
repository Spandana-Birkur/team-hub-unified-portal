from urllib import request
import os
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
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        user_employee = Authenticate(email, password)

        if user_employee:
            user = user_employee.toDict()
            
            accesses = ['Employee']
            if user['Role'] in ['Manager', 'CEO']:
                accesses.append('Manager')
            if user['Department'] == 'IT':
                accesses.append('IT')
            if user['Department'] == 'Human Resources':
                accesses.append('HR')
            
            return jsonify({
                'message': 'Success',
                'user': user,
                'accesses': accesses
            })
        else:
            return jsonify({'message': 'Error', 'error': 'Invalid credentials'}), 401

    except Exception as e:
        return jsonify({'message': 'Error', 'error': str(e)}), 500


@app.route('/api/test', methods=['GET'])
def test_cors():
    print("CORS test endpoint was reached successfully!")
    return jsonify({"message": "Success! CORS is configured correctly."})


@app.route('/api/employees', methods = ['GET'])
def employees():
    employees = parseDB()
    emps = [employee.toDict() for employee in employees]
    return jsonify({'employees' : emps})


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
    tickets_list = getTickets()
    # Sort tickets to show newest first
    if tickets_list:
        sorted_tickets = sorted(tickets_list, key=lambda t: t.createdDate, reverse=True)
        return jsonify({'tickets': [ticket.toDict() for ticket in sorted_tickets]}), 200
    return jsonify({'tickets': []}), 200

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

# ... (All other routes like /api/leave-requests etc. remain unchanged) ...

if __name__ == '__main__':
    app.run(debug=True, port=8080)

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

# ✅ Root health-check route
@app.route('/health')
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
from flask import send_from_directory

# Serve React static files
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    if path != "" and os.path.exists(os.path.join("dist", path)):
        return send_from_directory('dist', path)
    else:
        return send_from_directory('dist', 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8000))
    app.run(debug=True, host='0.0.0.0', port=port)

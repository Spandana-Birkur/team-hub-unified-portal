from urllib import request
import os
from dotenv import load_dotenv

from flask import Flask, jsonify, request
from flask_cors import CORS
from dbconnect import *
from aiconnect import *
from hashtest import *

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

    return jsonify({
        'employees' : emps
    })



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
    return jsonify({'subordinates': [emp.toDict() for emp in subordinates]}), 200

@app.route('/api/get-manager/<int:id>', methods=['GET'])
def get_manager(id):
    manager = getManager(id)
    if not manager:
        return jsonify({'message': 'No manager found.'}), 404
    return jsonify({'manager': manager.toDict()}), 200

if __name__ == '__main__':
    app.run(debug=True, port=8080)

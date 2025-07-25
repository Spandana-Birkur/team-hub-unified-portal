from urllib import request

from flask import Flask, jsonify, request
from flask_cors import CORS
from dbconnect import *
from aiconnect import *
from hashtest import *

app = Flask(__name__)
CORS(app)

@app.route('/api/AIRequest', methods = ['GET', 'POST'])
def ai_request():
    if request.method == 'POST':
        data = request.json
        prompt = data.get('prompt')
        return jsonify({'response': AIRequest(prompt)})
    elif request.method == 'GET':
        return jsonify({'message': 'Send a POST request with a prompt.'})

@app.route('/api/login', methods = ['GET', 'POST'])
def login():
    print("ASKJDNASLKJDLAKSJNLKASJNDLKSAJNDASD")
    if request.method == 'POST':
        email = request.json.get('email')
        pw = request.json.get('password')
        print(f'pre auth {email}, {pw}')
        result = Authenticate(email, pw)
        print(f'result: {result}')
        if isinstance(result, Employee):
            print(f"Login for {Employee(result).email} successful.")
            return jsonify(result.toDict())
        else:
            print("Womp womp")
            return "Error"
    print("SMTH WRONG")
    return "Error"


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

if __name__ == '__main__':
    app.run(debug=True, port=8080)

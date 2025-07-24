from urllib import request

from flask import Flask, jsonify, request
from flask_cors import CORS
from dbconnect import *
from aiconnect import *
from hashtest import *

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/api/companies', methods = ['GET'])
def get_companies():
    return jsonify({
        'companies': [
            'microsoft',
            'quadrant',
            'nintendo'
        ]
    })

@app.route('/api/age', methods = ['GET'])
def get_age():
    return jsonify({
        'output' : AIRequest("What to do in Dallas, TX?"),
                   })

@app.route('/api/insert', methods = ['GET', 'POST'])
def insert():
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

@app.route('/api/city', methods=['GET'])
def get_city():
    return AIRequest("What to do in Dallas, TX?")


if __name__ == '__main__':
    app.run(debug=True, port=8080)

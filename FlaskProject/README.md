# Flask Backend API

This is the backend API for the Access Portal application.

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Configuration:**
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your actual credentials:
     - `subscription_key`: Your Azure Cognitive Services API key
     - `DB_SERVER`: Your Azure SQL Database server
     - `DB_DATABASE`: Your database name
     - `DB_USERNAME`: Your database username
     - `DB_PASSWORD`: Your database password
     - `DB_DRIVER`: ODBC driver (usually `{ODBC Driver 17 for SQL Server}`)

3. **Run the application:**
   ```bash
   python app.py
   ```

The API will be available at `http://localhost:8080`

## API Endpoints

### Authentication & Employees
- `POST /api/AIRequest` - Send AI requests
- `POST /api/AIRequestHistory` - Send AI requests with conversation history
- `POST /api/login` - User authentication
- `GET /api/employees` - Get all employees
- `GET /api/employees/count` - Get employee count
- `POST /api/update-bio` - Update employee bio
- `GET /api/get-subordinates/<id>` - Get employee subordinates
- `GET /api/get-manager/<id>` - Get employee manager
- `GET /api/test` - CORS test endpoint

### Ticket Management
- `GET /api/tickets` - Get all tickets
- `GET /api/tickets/<id>` - Get specific ticket
- `DELETE /api/tickets/<id>` - Delete ticket

### Leave Management
- `GET /api/leave-requests` - Get all leave requests
- `POST /api/leave-requests` - Create new leave request
- `GET /api/leave-requests/<id>` - Get specific leave request
- `PUT /api/leave-requests/<id>/approve` - Approve leave request
- `PUT /api/leave-requests/<id>/reject` - Reject leave request
- `GET /api/leave-requests/employee/<id>` - Get employee's leave requests
- `GET /api/leave-requests/pending` - Get pending leave requests
- `GET /api/leave-balance/<id>` - Get employee's leave balance

## Security

- Never commit the `.env` file to version control
- The `.env` file contains sensitive credentials and should be kept secure
- Use `.env.example` as a template for other developers

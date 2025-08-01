# Team Hub Unified Portal

A comprehensive employee portal that provides unified access to HR, IT, and management tools with role-based access control.

## Features

### 🔐 User & Access Management
- **Add/Edit/Remove Employees**: Managers can add new employees, edit existing profiles, and manage team members
- **Role & Permission Management**: Assign or change roles (employee, manager, HR, admin) and permissions
- **Password Management**: Reset user passwords and unlock accounts
- **Login Activity Monitoring**: View user sessions and login activity

### 🧾 Employee Records
- **Personal Details Management**: View and edit employee information (name, address, contact info, emergency contacts)
- **Employment Information**: Manage position, department, supervisor, start date, and contract details
- **Document Management**: View and approve/reject uploaded employee documents
- **Comprehensive Employee Profiles**: Detailed employee information with skills, projects, and certifications

### 🕒 Time & Attendance
- **Clock-in/out Records**: Access to employee time tracking data
- **Timesheet Management**: Approve or edit employee timesheets
- **Leave Request Management**: Approve/reject vacation, sick leave, and other leave requests
- **Holiday Schedule Configuration**: Manage company holiday schedules
- **Leave Balance Tracking**: Monitor employee leave balances and usage

### 💰 Payroll & Compensation
- **Salary Information Access**: View team salary information (limited to manager level)
- **Payroll Reports**: Generate and review comprehensive payroll reports
- **Benefits Management**: Manage team benefits and bonuses
- **Pay Stub Management**: Issue or download pay stubs and tax forms
- **Overtime Tracking**: Monitor and approve overtime hours

### 📄 Performance & Evaluation
- **Performance Review Assignment**: Assign and track performance reviews for team members
- **Feedback Management**: Review and manage employee feedback and goal tracking
- **Training & Certification Monitoring**: Track employee training progress and certifications
- **Goal Setting & Tracking**: Set and monitor individual and team goals

### 📢 Communication Tools
- **Company Announcements**: Post company-wide announcements and news
- **Team Messaging**: Send messages to individual users or groups
- **Notification Management**: Manage notifications and alerts for the team
- **Communication Center**: Comprehensive messaging and announcement system

## Role-Based Access

### Manager Access
Managers have access to all the features listed above, specifically designed for team management:

- **Manager Dashboard**: Comprehensive overview with team metrics and quick actions
- **Team Management**: Full control over direct reports and team operations
- **Approval Workflows**: Timesheet approvals, leave requests, and performance reviews
- **Reporting Tools**: Team performance reports, payroll summaries, and analytics
- **Communication Hub**: Team announcements, messaging, and notification management

### Employee Access
- Basic employee portal features
- Personal information management
- Leave request submission
- Timesheet submission
- Benefits viewing

### HR Access
- Full HR management capabilities
- Employee directory management
- Performance management
- Leave management
- Document management

### IT Access
- IT helpdesk management
- Asset management
- Support ticket management
- Knowledge base management

## Technology Stack

- **Frontend**: React with TypeScript
- **UI Components**: Shadcn/ui with Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router
- **Icons**: Lucide React

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Access the application at `http://localhost:5173`

## Role Testing

To test different roles, you can change the user role in the browser's localStorage:
- Set `userRole` to: `'employee'`, `'manager'`, `'hr'`, or `'it'`
- Set `isLoggedIn` to: `'true'`

## Manager Features Overview

The manager role provides comprehensive team management capabilities:

### Dashboard
- Team overview with key metrics
- Quick action buttons for common tasks
- Recent activity feed
- Pending approvals summary

### User Management
- Add new employees with full profile information
- Edit existing employee details
- Manage roles and permissions
- Reset passwords and unlock accounts

### Time & Attendance
- Approve/reject timesheets
- Manage leave requests
- Configure holiday schedules
- Monitor attendance patterns

### Payroll & Compensation
- View team salary information
- Generate payroll reports
- Manage benefits and bonuses
- Process pay stubs and tax forms

### Performance Management
- Assign performance reviews
- Track employee goals
- Monitor training progress
- Manage feedback systems

### Communication
- Post team announcements
- Send individual/group messages
- Manage notification settings
- Archive and organize communications

This comprehensive manager access system provides all the tools needed for effective team management while maintaining appropriate access controls and data security.

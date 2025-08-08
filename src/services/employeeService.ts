import api from '@/utils/api';

export interface ApiEmployee {
  FirstName: string;
  LastName: string;
  EmployeeID: number;
  Department: string;
  Role: string;
  Gender: string;
  Email: string;
  PhoneNumber: string;
  Bio: string;
  ManagerID: number;
  VacationDays: number;
  SickDays: number;
  PersonalDays: number;
  OtherDays: number;
  Salary: number;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  phone: string;
  location: string;
  manager: string;
  salary: string;
  bio: string;
  performance: string;
  skills: string[];
  projects: string[];
  certifications: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export const employeeService = {
  getAllEmployees: async (): Promise<Employee[]> => {
    const response = await api.get<{ employees: ApiEmployee[] }>('/api/employees');
    return response.data.employees.map(apiEmployee => ({
      id: apiEmployee.EmployeeID.toString(),
      name: `${apiEmployee.FirstName} ${apiEmployee.LastName}`,
      email: apiEmployee.Email,
      role: apiEmployee.Role,
      department: apiEmployee.Department,
      phone: apiEmployee.PhoneNumber,
      location: '', // Not available in API
      manager: '', // Need to fetch manager name using ManagerID
      salary: apiEmployee.Salary.toString(),
      bio: apiEmployee.Bio,
      performance: 'Good', // Default value
      skills: [], // Not available in API
      projects: [], // Not available in API
      certifications: [], // Not available in API
      emergencyContact: {
        name: '', // Not available in API
        relationship: '', // Not available in API
        phone: '' // Not available in API
      }
    }));
  },

  getEmployeeById: async (id: string): Promise<Employee> => {
    const response = await api.get<ApiEmployee>(`/api/employees/${id}`);
    const apiEmployee = response.data;
    return {
      id: apiEmployee.EmployeeID.toString(),
      name: `${apiEmployee.FirstName} ${apiEmployee.LastName}`,
      email: apiEmployee.Email,
      role: apiEmployee.Role,
      department: apiEmployee.Department,
      phone: apiEmployee.PhoneNumber,
      location: '', // Not available in API
      manager: '', // Need to fetch manager name using ManagerID
      salary: apiEmployee.Salary.toString(),
      bio: apiEmployee.Bio,
      performance: 'Good', // Default value
      skills: [], // Not available in API
      projects: [], // Not available in API
      certifications: [], // Not available in API
      emergencyContact: {
        name: '', // Not available in API
        relationship: '', // Not available in API
        phone: '' // Not available in API
      }
    };
  },
};

export default employeeService;

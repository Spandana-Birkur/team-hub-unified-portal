import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SearchableDropdown } from '@/components/SearchableDropdown';
import { 
  Users, 
  Search,
  Mail,
  Phone,
  MapPin,
  User,
  Building,
  CalendarDays,
  Star,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import employeeService, { Employee } from '@/services/employeeService';

const EmployeeDirectory = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await employeeService.getAllEmployees();
        setEmployees(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError('Failed to load employees. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleViewProfile = (employee: Employee) => {
    setSelectedEmployee(employee);
    setProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setProfileModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleContact = (employee: Employee) => {
    setSelectedEmployee(employee);
    setContactModalOpen(true);
  };

  const closeContactModal = () => {
    setContactModalOpen(false);
    setSelectedEmployee(null);
  };

  // Filter employees based on search query
  const filteredEmployees = employees.filter(employee => {
    const query = searchQuery.toLowerCase();
    return (
      employee.name.toLowerCase().includes(query) ||
      employee.role.toLowerCase().includes(query) ||
      employee.department.toLowerCase().includes(query) ||
      employee.email.toLowerCase().includes(query) ||
      employee.location.toLowerCase().includes(query)
    );
  });

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Employee Directory</span>
          </CardTitle>
          <div className="flex space-x-2">
            <Input 
              placeholder="Search employees..." 
              className="w-64" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="outline">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Loading employees...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-red-600 mb-2">Error</h3>
              <p className="text-gray-500">{error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{employee.name}</h4>
                      <p className="text-sm text-gray-600">{employee.role} • {employee.department}</p>
                      <p className="text-xs text-gray-500">{employee.email} • {employee.location}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleViewProfile(employee)}>View Profile</Button>
                      <Button size="sm" variant="outline" onClick={() => handleContact(employee)}>Contact</Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
                  <p className="text-gray-500">
                    {searchQuery ? `No employees match "${searchQuery}"` : 'No employees available'}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Employee Profile Modal */}
      <Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Employee Profile</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="space-y-6">
              {/* Header Section */}
              <div className="flex items-start justify-between border-b pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedEmployee.name}</h2>
                  <p className="text-lg text-gray-600">{selectedEmployee.role}</p>
                  <p className="text-sm text-gray-500">{selectedEmployee.department} Department</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-2">{selectedEmployee.performance}</Badge>
                  <p className="text-sm text-gray-500">Employee ID: {selectedEmployee.id}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedEmployee.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedEmployee.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedEmployee.location}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Employment Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CalendarDays className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Hired: {selectedEmployee.hireDate}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Building className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Manager: {selectedEmployee.manager}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Salary: {selectedEmployee.salary}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Skills and Projects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Skills & Expertise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedEmployee.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedEmployee.projects.map((project: string, index: number) => (
                        <div key={index} className="text-sm text-gray-600">• {project}</div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Certifications and Emergency Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Certifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedEmployee.certifications.map((cert: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Emergency Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedEmployee.emergencyContact.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">{selectedEmployee.emergencyContact.relationship}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedEmployee.emergencyContact.phone}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={closeProfileModal}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Contact Modal */}
      <Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Contact Employee</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">{selectedEmployee.name}</h3>
                <p className="text-sm text-gray-600">{selectedEmployee.role}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-gray-600">{selectedEmployee.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Phone className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-gray-600">{selectedEmployee.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-gray-600">{selectedEmployee.location}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full" onClick={() => window.open(`mailto:${selectedEmployee.email}`, '_blank')}>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" className="w-full" onClick={() => window.open(`tel:${selectedEmployee.phone}`, '_blank')}>
                  <Phone className="w-4 h-4 mr-2" />
                  Call Employee
                </Button>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={closeContactModal}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeDirectory;

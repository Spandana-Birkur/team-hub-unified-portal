
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Mail, Phone, MapPin, Calendar, Users, Bell, User, CreditCard, 
  DollarSign, Plane, FileText, PartyPopper, Calculator, 
  GraduationCap, Clock
} from 'lucide-react';

const EmployeePortal = () => {
  const announcements = [
    {
      id: 1,
      title: 'Annual Company Retreat 2024',
      content: 'Join us for our annual company retreat in Lake Tahoe. Registration opens next week.',
      date: '2024-01-15',
      priority: 'high'
    },
    {
      id: 2,
      title: 'New Health Benefits Package',
      content: 'We are excited to announce enhanced health benefits starting February 1st.',
      date: '2024-01-10',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Office Holiday Schedule',
      content: 'Please note the updated holiday schedule for the upcoming months.',
      date: '2024-01-08',
      priority: 'low'
    }
  ];

  const teamMembers = [
    { name: 'Alice Smith', role: 'Team Lead', avatar: 'AS', department: 'Engineering' },
    { name: 'Bob Johnson', role: 'Designer', avatar: 'BJ', department: 'Design' },
    { name: 'Carol White', role: 'Developer', avatar: 'CW', department: 'Engineering' },
    { name: 'David Brown', role: 'Product Manager', avatar: 'DB', department: 'Product' },
  ];

  const payStubs = [
    { period: 'Dec 15 - Dec 31, 2023', grossPay: '$5,200.00', netPay: '$3,890.00', status: 'Available' },
    { period: 'Dec 1 - Dec 14, 2023', grossPay: '$5,200.00', netPay: '$3,890.00', status: 'Available' },
    { period: 'Nov 15 - Nov 30, 2023', grossPay: '$5,200.00', netPay: '$3,890.00', status: 'Available' },
  ];

  const timeOffRequests = [
    { type: 'Vacation', dates: 'Feb 14 - Feb 16, 2024', days: 3, status: 'Approved' },
    { type: 'Sick Leave', dates: 'Jan 10, 2024', days: 1, status: 'Approved' },
    { type: 'Personal', dates: 'Jan 5, 2024', days: 1, status: 'Pending' },
  ];

  const documents = [
    { name: 'Employee Handbook 2024', type: 'PDF', uploadDate: '2024-01-01' },
    { name: 'W-2 Form 2023', type: 'PDF', uploadDate: '2024-01-15' },
    { name: 'Benefits Enrollment', type: 'PDF', uploadDate: '2023-12-01' },
  ];

  const upcomingEvents = [
    { title: 'All Hands Meeting', date: '2024-02-15', time: '10:00 AM', location: 'Conference Room A' },
    { title: 'Team Building Event', date: '2024-02-20', time: '2:00 PM', location: 'Outdoor Park' },
    { title: 'Training Workshop', date: '2024-02-25', time: '9:00 AM', location: 'Training Room' },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Portal</h1>
        <p className="text-gray-600">Manage your profile and access all employee resources.</p>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-9">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="pay">Pay</TabsTrigger>
          <TabsTrigger value="timeoff">Time Off</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="taxes">Taxes</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="timesheets">Timesheets</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>My Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-bold">JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">John Doe</h3>
                    <p className="text-gray-600">Senior Software Engineer</p>
                    <Badge className="mt-1">Engineering</Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>john.doe@company.com</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>San Francisco, CA</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Joined: Jan 15, 2022</span>
                  </div>
                </div>
                
                <Button className="w-full mt-4">Edit Profile</Button>
              </CardContent>
            </Card>

            {/* Announcements */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Company Announcements</span>
                </CardTitle>
                <Button variant="outline" size="sm">View All</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{announcement.title}</h4>
                        <Badge variant={announcement.priority === 'high' ? 'destructive' : announcement.priority === 'medium' ? 'default' : 'secondary'}>
                          {announcement.priority}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{announcement.content}</p>
                      <p className="text-xs text-gray-400">{announcement.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Organization Directory */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Organization</span>
              </CardTitle>
              <Button variant="outline" size="sm">View All Employees</Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:shadow-md transition-shadow">
                    <Avatar>
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-purple-100 text-purple-600">{member.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-gray-600">{member.role}</p>
                      <Badge variant="outline" className="text-xs mt-1">{member.department}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Health Benefits</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p><strong>Medical Plan:</strong> Premium Health Plus</p>
                  <p><strong>Dental Plan:</strong> Comprehensive Dental</p>
                  <p><strong>Vision Plan:</strong> Complete Vision Care</p>
                  <p><strong>Deductible:</strong> $1,500 (Individual)</p>
                </div>
                <Button variant="outline" className="w-full">View Details</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Retirement & Savings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p><strong>401(k) Plan:</strong> Enrolled</p>
                  <p><strong>Contribution:</strong> 8% of salary</p>
                  <p><strong>Company Match:</strong> 4% (100% match)</p>
                  <p><strong>Vesting:</strong> Immediate</p>
                </div>
                <Button variant="outline" className="w-full">Manage Contributions</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Life & Disability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p><strong>Life Insurance:</strong> $250,000</p>
                  <p><strong>Short-term Disability:</strong> 60% salary</p>
                  <p><strong>Long-term Disability:</strong> 60% salary</p>
                </div>
                <Button variant="outline" className="w-full">View Coverage</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p><strong>Flexible Spending Account:</strong> $2,500</p>
                  <p><strong>Employee Assistance Program:</strong> Available</p>
                  <p><strong>Wellness Program:</strong> Active</p>
                </div>
                <Button variant="outline" className="w-full">Enroll in Benefits</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pay">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Pay Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-green-600">$124,800</p>
                    <p className="text-sm text-gray-600">Annual Salary</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">$10,400</p>
                    <p className="text-sm text-gray-600">Monthly Gross</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">$7,780</p>
                    <p className="text-sm text-gray-600">Monthly Net</p>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-4">Recent Pay Stubs</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pay Period</TableHead>
                      <TableHead>Gross Pay</TableHead>
                      <TableHead>Net Pay</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payStubs.map((stub, index) => (
                      <TableRow key={index}>
                        <TableCell>{stub.period}</TableCell>
                        <TableCell>{stub.grossPay}</TableCell>
                        <TableCell>{stub.netPay}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{stub.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Download</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeoff">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plane className="w-5 h-5" />
                    <span>Time Off Balance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Vacation Days</span>
                      <span className="font-semibold">18 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sick Leave</span>
                      <span className="font-semibold">5 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Personal Days</span>
                      <span className="font-semibold">3 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Time Off Requests</CardTitle>
                  <Button>Request Time Off</Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Days</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {timeOffRequests.map((request, index) => (
                        <TableRow key={index}>
                          <TableCell>{request.type}</TableCell>
                          <TableCell>{request.dates}</TableCell>
                          <TableCell>{request.days}</TableCell>
                          <TableCell>
                            <Badge variant={request.status === 'Approved' ? 'default' : 'secondary'}>
                              {request.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>My Documents</span>
              </CardTitle>
              <Button>Upload Document</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc, index) => (
                    <TableRow key={index}>
                      <TableCell>{doc.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.type}</Badge>
                      </TableCell>
                      <TableCell>{doc.uploadDate}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Download</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PartyPopper className="w-5 h-5" />
                <span>Upcoming Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-lg">{event.title}</h4>
                        <p className="text-gray-600 text-sm">{event.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{event.date}</p>
                        <p className="text-sm text-gray-600">{event.time}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Button variant="outline" size="sm">RSVP</Button>
                      <Button variant="outline" size="sm">Add to Calendar</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="taxes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="w-5 h-5" />
                  <span>Tax Documents</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>W-2 Form 2023</span>
                    <Button variant="outline" size="sm">Download</Button>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>1095-C Form 2023</span>
                    <Button variant="outline" size="sm">Download</Button>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>Tax Summary 2023</span>
                    <Button variant="outline" size="sm">Download</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tax Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p><strong>Filing Status:</strong> Single</p>
                  <p><strong>Allowances:</strong> 2</p>
                  <p><strong>Additional Withholding:</strong> $0</p>
                  <p><strong>State:</strong> California</p>
                </div>
                <Button variant="outline" className="w-full">Update Tax Information</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="onboarding">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5" />
                <span>Onboarding Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Complete Profile Information</h4>
                      <p className="text-sm text-gray-600">Update your personal and contact details</p>
                    </div>
                    <Badge>Completed</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">IT Setup & Security Training</h4>
                      <p className="text-sm text-gray-600">Complete mandatory security awareness training</p>
                    </div>
                    <Badge>Completed</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Benefits Enrollment</h4>
                      <p className="text-sm text-gray-600">Select your health and retirement benefits</p>
                    </div>
                    <Badge variant="secondary">In Progress</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Department Orientation</h4>
                      <p className="text-sm text-gray-600">Meet your team and learn about department processes</p>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900">Onboarding Progress: 75%</h4>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timesheets">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Timesheets</span>
              </CardTitle>
              <Button>Submit Timesheet</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-green-600">40.0</p>
                    <p className="text-sm text-gray-600">Hours This Week</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">160.0</p>
                    <p className="text-sm text-gray-600">Hours This Month</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">2.5</p>
                    <p className="text-sm text-gray-600">Overtime Hours</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Timesheets</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Week Ending</TableHead>
                        <TableHead>Regular Hours</TableHead>
                        <TableHead>Overtime Hours</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Jan 12, 2024</TableCell>
                        <TableCell>40.0</TableCell>
                        <TableCell>2.5</TableCell>
                        <TableCell><Badge>Approved</Badge></TableCell>
                        <TableCell><Button variant="outline" size="sm">View</Button></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Jan 5, 2024</TableCell>
                        <TableCell>38.5</TableCell>
                        <TableCell>0.0</TableCell>
                        <TableCell><Badge>Approved</Badge></TableCell>
                        <TableCell><Button variant="outline" size="sm">View</Button></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Dec 29, 2023</TableCell>
                        <TableCell>32.0</TableCell>
                        <TableCell>0.0</TableCell>
                        <TableCell><Badge variant="secondary">Pending</Badge></TableCell>
                        <TableCell><Button variant="outline" size="sm">Edit</Button></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeePortal;

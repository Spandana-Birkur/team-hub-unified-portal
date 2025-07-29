import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Play, Award, Clock, Users, Star } from 'lucide-react';

const Training = () => {
  const courses = [
    {
      id: 1,
      title: 'Cybersecurity Fundamentals',
      description: 'Learn essential cybersecurity principles and best practices.',
      duration: '4 hours',
      difficulty: 'Beginner',
      enrolled: 124,
      rating: 4.8,
      progress: 0,
      category: 'Security',
      instructor: 'John Security',
      status: 'available'
    },
    {
      id: 2,
      title: 'Project Management Basics',
      description: 'Master the fundamentals of effective project management.',
      duration: '6 hours',
      difficulty: 'Intermediate',
      enrolled: 89,
      rating: 4.6,
      progress: 45,
      category: 'Management',
      instructor: 'Sarah PM',
      status: 'in-progress'
    },
    {
      id: 3,
      title: 'Advanced Excel Techniques',
      description: 'Become proficient in advanced Excel functions and analysis.',
      duration: '3 hours',
      difficulty: 'Advanced',
      enrolled: 67,
      rating: 4.9,
      progress: 100,
      category: 'Technical',
      instructor: 'Mike Excel',
      status: 'completed'
    },
    {
      id: 4,
      title: 'Leadership and Communication',
      description: 'Develop essential leadership and communication skills.',
      duration: '5 hours',
      difficulty: 'Intermediate',
      enrolled: 156,
      rating: 4.7,
      progress: 0,
      category: 'Soft Skills',
      instructor: 'Lisa Leader',
      status: 'available'
    }
  ];

  const achievements = [
    { title: 'First Course Completed', date: '2024-01-10', icon: Award, color: 'bg-yellow-500' },
    { title: 'Security Expert', date: '2024-01-08', icon: Star, color: 'bg-blue-500' },
    { title: 'Fast Learner', date: '2024-01-05', icon: Clock, color: 'bg-green-500' },
  ];

  const trainingStats = [
    { title: 'Courses Enrolled', value: '12', icon: BookOpen, color: 'bg-blue-500' },
    { title: 'Completed', value: '8', icon: Award, color: 'bg-green-500' },
    { title: 'Hours Learned', value: '34', icon: Clock, color: 'bg-purple-500' },
    { title: 'Certificates', value: '5', icon: Star, color: 'bg-yellow-500' },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'available': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Training & Learning</h1>
        <p className="text-gray-900 dark:text-white">Enhance your skills with our comprehensive training programs.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {trainingStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="courses">Available Courses</TabsTrigger>
          <TabsTrigger value="progress">My Progress</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="management">Training Management</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 text-gray-900 dark:text-white">{course.title}</CardTitle>
                      <p className="text-sm text-gray-900 dark:text-white mb-3">{course.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-900 dark:text-white">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{course.duration}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{course.enrolled} enrolled</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span>{course.rating}</span>
                        </span>
                      </div>
                    </div>
                    <Badge className={getDifficultyColor(course.difficulty)}>
                      {course.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-900 dark:text-white">
                      <span>Instructor: {course.instructor}</span>
                      <Badge variant="outline">{course.category}</Badge>
                    </div>
                    
                    {course.progress > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-gray-900 dark:text-white">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2">
                      <Badge className={getStatusColor(course.status)}>
                        {course.status === 'in-progress' ? 'In Progress' : 
                         course.status === 'completed' ? 'Completed' : 'Available'}
                      </Badge>
                      <Button size="sm" className="flex items-center space-x-2">
                        <Play className="w-4 h-4" />
                        <span>
                          {course.status === 'completed' ? 'Review' :
                           course.status === 'in-progress' ? 'Continue' : 'Start Course'}
                        </span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Learning Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {courses.filter(course => course.progress > 0).map((course) => (
                  <div key={course.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{course.title}</h4>
                        <p className="text-sm text-gray-900 dark:text-white">Category: {course.category}</p>
                      </div>
                      <Badge className={getStatusColor(course.status)}>
                        {course.status === 'completed' ? 'Completed' : 'In Progress'}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-gray-900 dark:text-white">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-gray-900 dark:text-white">Duration: {course.duration}</span>
                      <Button size="sm" variant="outline">
                        {course.status === 'completed' ? 'View Certificate' : 'Continue'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Achievements & Certificates</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="border rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                    <div className={`w-16 h-16 mx-auto mb-3 rounded-full ${achievement.color} flex items-center justify-center`}>
                      <achievement.icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{achievement.title}</h4>
                    <p className="text-sm text-gray-900 dark:text-white">Earned on {achievement.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="management">
          <div className="space-y-6">
            {/* Training Management Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Users className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">45</p>
                      <p className="text-sm text-gray-900 dark:text-white">Team Members</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-sm text-gray-900 dark:text-white">Required Courses</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Award className="w-8 h-8 text-yellow-600" />
                    <div>
                      <p className="text-2xl font-bold">78%</p>
                      <p className="text-sm text-gray-900 dark:text-white">Completion Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-8 h-8 text-red-600" />
                    <div>
                      <p className="text-2xl font-bold">8</p>
                      <p className="text-sm text-gray-900 dark:text-white">Overdue Training</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Team Training Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Team Training Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: 'Alice Smith', progress: 85, courses: 8, completed: 6 },
                      { name: 'Bob Johnson', progress: 92, courses: 10, completed: 9 },
                      { name: 'Carol White', progress: 67, courses: 6, completed: 4 },
                      { name: 'David Brown', progress: 100, courses: 12, completed: 12 },
                      { name: 'Eva Garcia', progress: 45, courses: 5, completed: 2 },
                      { name: 'Frank Miller', progress: 78, courses: 7, completed: 5 }
                    ].map((member, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{member.name}</h4>
                          <Badge variant={member.progress === 100 ? 'default' : 'secondary'}>
                            {member.progress}%
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-gray-900 dark:text-white">
                            <span>Progress</span>
                            <span>{member.progress}%</span>
                          </div>
                          <Progress value={member.progress} className="h-2" />
                          <div className="flex justify-between text-xs text-gray-900 dark:text-white">
                            <span>{member.completed}/{member.courses} completed</span>
                            <span>{member.courses - member.completed} remaining</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Training Management Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Training Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <Users className="w-6 h-6" />
                    <span>Assign Training</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <Award className="w-6 h-6" />
                    <span>Track Certifications</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <Clock className="w-6 h-6" />
                    <span>Set Deadlines</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <Star className="w-6 h-6" />
                    <span>Performance Reviews</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <BookOpen className="w-6 h-6" />
                    <span>Create Courses</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <Users className="w-6 h-6" />
                    <span>Team Reports</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Required Training Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Required Training Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Eva Garcia', course: 'Cybersecurity Fundamentals', dueDate: '2024-02-01', status: 'overdue' },
                    { name: 'Frank Miller', course: 'Project Management Basics', dueDate: '2024-02-15', status: 'due-soon' },
                    { name: 'Carol White', course: 'Leadership and Communication', dueDate: '2024-02-20', status: 'due-soon' }
                  ].map((alert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm text-gray-900 dark:text-white">{alert.name}</p>
                        <p className="text-xs text-gray-900 dark:text-white">{alert.course}</p>
                        <p className="text-xs text-gray-900 dark:text-white">Due: {alert.dueDate}</p>
                      </div>
                      <Badge variant={alert.status === 'overdue' ? 'destructive' : 'secondary'}>
                        {alert.status === 'overdue' ? 'Overdue' : 'Due Soon'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Training;


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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Training & Learning</h1>
        <p className="text-gray-600">Enhance your skills with our comprehensive training programs.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {trainingStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses">Available Courses</TabsTrigger>
          <TabsTrigger value="progress">My Progress</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                      <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
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
                    <div className="flex items-center justify-between text-sm">
                      <span>Instructor: {course.instructor}</span>
                      <Badge variant="outline">{course.category}</Badge>
                    </div>
                    
                    {course.progress > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
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
                        <h4 className="font-semibold text-gray-900">{course.title}</h4>
                        <p className="text-sm text-gray-600">Category: {course.category}</p>
                      </div>
                      <Badge className={getStatusColor(course.status)}>
                        {course.status === 'completed' ? 'Completed' : 'In Progress'}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-gray-500">Duration: {course.duration}</span>
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
                    <h4 className="font-semibold text-gray-900 mb-1">{achievement.title}</h4>
                    <p className="text-sm text-gray-500">Earned on {achievement.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Training;

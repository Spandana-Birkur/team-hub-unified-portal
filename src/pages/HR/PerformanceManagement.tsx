import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SearchableDropdown } from '@/components/SearchableDropdown';
import { employees } from '@/data/employees';
import { 
  TrendingUp, 
  Award, 
  GraduationCap, 
  MessageSquare,
  Calendar
} from 'lucide-react';

const PerformanceManagement = () => {
  const [performanceReviews, setPerformanceReviews] = useState([
    { id: 1, employee: 'John Doe', status: 'pending', dueDate: '2024-02-15', manager: 'Jane Smith', rating: null },
    { id: 2, employee: 'Sarah Johnson', status: 'completed', dueDate: '2024-02-10', manager: 'David Wilson', rating: 'Exceeds Expectations' },
    { id: 3, employee: 'Mike Chen', status: 'in-progress', dueDate: '2024-02-20', manager: 'Lisa Chen', rating: null },
  ]);
  const [employeeGoals, setEmployeeGoals] = useState([
    { id: 1, employee: 'John Doe', goal: 'Complete AWS certification', status: 'in-progress', progress: 75, dueDate: '2024-03-15' },
    { id: 2, employee: 'Sarah Johnson', goal: 'Increase team productivity by 20%', status: 'on-track', progress: 60, dueDate: '2024-06-30' },
    { id: 3, employee: 'Mike Chen', goal: 'Redesign company website', status: 'completed', progress: 100, dueDate: '2024-01-31' },
  ]);
  const [feedbackEntries, setFeedbackEntries] = useState([
    { id: 1, from: 'Jane Smith', to: 'John Doe', type: 'positive', content: 'Excellent work on the recent project', date: '2024-01-15' },
    { id: 2, from: 'David Wilson', to: 'Sarah Johnson', type: 'constructive', content: 'Great leadership shown in team meetings', date: '2024-01-14' },
  ]);

  const [performanceModalOpen, setPerformanceModalOpen] = useState(false);
  const [goalsModalOpen, setGoalsModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedPerformanceData, setSelectedPerformanceData] = useState<any>(null);
  const [newFeedbackModalOpen, setNewFeedbackModalOpen] = useState(false);
  const [newReviewModalOpen, setNewReviewModalOpen] = useState(false);
  const [newGoalModalOpen, setNewGoalModalOpen] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    from: '',
    to: '',
    type: 'positive',
    content: ''
  });
  const [newReview, setNewReview] = useState({
    employee: '',
    manager: '',
    dueDate: ''
  });
  const [newGoal, setNewGoal] = useState({
    employee: '',
    goal: '',
    dueDate: '',
    progress: 0
  });

  const handleViewReviews = () => {
    setSelectedPerformanceData({ type: 'reviews', data: performanceReviews });
    setPerformanceModalOpen(true);
  };

  const handleManageGoals = () => {
    setSelectedPerformanceData({ type: 'goals', data: employeeGoals });
    setGoalsModalOpen(true);
  };

  const handleGiveFeedback = () => {
    setSelectedPerformanceData({ type: 'feedback', data: feedbackEntries });
    setFeedbackModalOpen(true);
  };

  const closePerformanceModal = () => {
    setPerformanceModalOpen(false);
    setSelectedPerformanceData(null);
  };

  const closeGoalsModal = () => {
    setGoalsModalOpen(false);
    setSelectedPerformanceData(null);
  };

  const closeFeedbackModal = () => {
    setFeedbackModalOpen(false);
    setSelectedPerformanceData(null);
  };

  // New feedback functions
  const handleGiveNewFeedback = () => {
    setNewFeedbackModalOpen(true);
  };

  const handleSubmitNewFeedback = () => {
    const newId = Math.max(...feedbackEntries.map(f => f.id)) + 1;
    const newFeedbackEntry = {
      id: newId,
      from: newFeedback.from,
      to: newFeedback.to,
      type: newFeedback.type,
      content: newFeedback.content,
      date: new Date().toISOString().split('T')[0]
    };
    setFeedbackEntries(prev => [newFeedbackEntry, ...prev]);
    setNewFeedback({ from: '', to: '', type: 'positive', content: '' });
    setNewFeedbackModalOpen(false);
  };

  const closeNewFeedbackModal = () => {
    setNewFeedbackModalOpen(false);
    setNewFeedback({ from: '', to: '', type: 'positive', content: '' });
  };

  // New review functions
  const handleScheduleNewReview = () => {
    setNewReviewModalOpen(true);
  };

  const handleSubmitNewReview = () => {
    const newId = Math.max(...performanceReviews.map(r => r.id)) + 1;
    const newReviewEntry = {
      id: newId,
      employee: newReview.employee,
      manager: newReview.manager,
      status: 'pending',
      dueDate: newReview.dueDate,
      rating: null
    };
    setPerformanceReviews(prev => [...prev, newReviewEntry]);
    setNewReview({ employee: '', manager: '', dueDate: '' });
    setNewReviewModalOpen(false);
  };

  const closeNewReviewModal = () => {
    setNewReviewModalOpen(false);
    setNewReview({ employee: '', manager: '', dueDate: '' });
  };

  // New goal functions
  const handleAddNewGoal = () => {
    setNewGoalModalOpen(true);
  };

  const handleSubmitNewGoal = () => {
    const newId = Math.max(...employeeGoals.map(g => g.id)) + 1;
    const newGoalEntry = {
      id: newId,
      employee: newGoal.employee,
      goal: newGoal.goal,
      status: 'in-progress',
      progress: newGoal.progress,
      dueDate: newGoal.dueDate
    };
    setEmployeeGoals(prev => [...prev, newGoalEntry]);
    setNewGoal({ employee: '', goal: '', dueDate: '', progress: 0 });
    setNewGoalModalOpen(false);
  };

  const closeNewGoalModal = () => {
    setNewGoalModalOpen(false);
    setNewGoal({ employee: '', goal: '', dueDate: '', progress: 0 });
  };

  // Helper function to convert employees to dropdown options
  const employeeOptions = employees.map(employee => ({
    value: employee.name,
    label: `${employee.name} - ${employee.role} (${employee.department})`
  }));

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Performance Management</span>
          </CardTitle>
          <Button onClick={handleScheduleNewReview}>Schedule Review</Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Award className="w-8 h-8 text-yellow-500" />
                <div>
                  <h3 className="font-semibold">Performance Reviews</h3>
                  <p className="text-sm text-gray-600">Manage employee evaluations</p>
                </div>
              </div>
              <Button size="sm" className="w-full" onClick={handleViewReviews}>View Reviews</Button>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <GraduationCap className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className="font-semibold">Goal Tracking</h3>
                  <p className="text-sm text-gray-600">Monitor individual & team goals</p>
                </div>
              </div>
              <Button size="sm" className="w-full" onClick={handleManageGoals}>Manage Goals</Button>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <MessageSquare className="w-8 h-8 text-green-500" />
                <div>
                  <h3 className="font-semibold">Feedback</h3>
                  <p className="text-sm text-gray-600">Peer & manager feedback</p>
                </div>
              </div>
              <Button size="sm" className="w-full" onClick={handleGiveFeedback}>Give Feedback</Button>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Performance Reviews Modal */}
      <Dialog open={performanceModalOpen} onOpenChange={setPerformanceModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Performance Reviews</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedPerformanceData && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Review Status</h3>
                <Button onClick={handleScheduleNewReview}>Schedule Review</Button>
              </div>
              
              <div className="space-y-3">
                {selectedPerformanceData.data.map((review: any) => (
                  <div key={review.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{review.employee}</h4>
                      <p className="text-sm text-gray-600">Manager: {review.manager}</p>
                      <p className="text-xs text-gray-500">Due: {review.dueDate}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={
                        review.status === 'completed' ? 'default' : 
                        review.status === 'in-progress' ? 'secondary' : 'outline'
                      }>
                        {review.status}
                      </Badge>
                      {review.rating && (
                        <Badge variant="outline">{review.rating}</Badge>
                      )}
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={closePerformanceModal}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Goals Management Modal */}
      <Dialog open={goalsModalOpen} onOpenChange={setGoalsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5" />
              <span>Goal Management</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedPerformanceData && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Employee Goals</h3>
                <Button onClick={handleAddNewGoal}>Add Goal</Button>
              </div>
              
              <div className="space-y-3">
                {selectedPerformanceData.data.map((goal: any) => (
                  <div key={goal.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{goal.employee}</h4>
                      <Badge variant={
                        goal.status === 'completed' ? 'default' : 
                        goal.status === 'on-track' ? 'secondary' : 'outline'
                      }>
                        {goal.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{goal.goal}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Due: {goal.dueDate}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={closeGoalsModal}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Feedback Modal */}
      <Dialog open={newFeedbackModalOpen} onOpenChange={setNewFeedbackModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>New Feedback Entry</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">From</label>
              <SearchableDropdown
                options={employeeOptions}
                placeholder="Select employee"
                value={newFeedback.from}
                onValueChange={(value) => setNewFeedback(prev => ({ ...prev, from: value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">To</label>
              <SearchableDropdown
                options={employeeOptions}
                placeholder="Select employee"
                value={newFeedback.to}
                onValueChange={(value) => setNewFeedback(prev => ({ ...prev, to: value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Type</label>
              <select 
                className="w-full mt-1 p-2 border rounded-md"
                value={newFeedback.type}
                onChange={(e) => setNewFeedback(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="positive">Positive</option>
                <option value="constructive">Constructive</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Content</label>
              <textarea 
                className="w-full mt-1 p-2 border rounded-md"
                rows={4}
                placeholder="Enter feedback content..."
                value={newFeedback.content}
                onChange={(e) => setNewFeedback(prev => ({ ...prev, content: e.target.value }))}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={closeNewFeedbackModal}>
                Cancel
              </Button>
              <Button onClick={handleSubmitNewFeedback} disabled={!newFeedback.from || !newFeedback.to || !newFeedback.content}>
                Submit Feedback
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Review Modal */}
      <Dialog open={newReviewModalOpen} onOpenChange={setNewReviewModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Schedule New Performance Review</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Employee</label>
              <SearchableDropdown
                options={employeeOptions}
                placeholder="Select employee"
                value={newReview.employee}
                onValueChange={(value) => setNewReview(prev => ({ ...prev, employee: value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Manager</label>
              <SearchableDropdown
                options={employeeOptions}
                placeholder="Select manager"
                value={newReview.manager}
                onValueChange={(value) => setNewReview(prev => ({ ...prev, manager: value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Due Date</label>
              <Input 
                type="date"
                value={newReview.dueDate}
                onChange={(e) => setNewReview(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={closeNewReviewModal}>
                Cancel
              </Button>
              <Button onClick={handleSubmitNewReview} disabled={!newReview.employee || !newReview.manager || !newReview.dueDate}>
                Schedule Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Goal Modal */}
      <Dialog open={newGoalModalOpen} onOpenChange={setNewGoalModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5" />
              <span>Add New Employee Goal</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Employee</label>
              <SearchableDropdown
                options={employeeOptions}
                placeholder="Select employee"
                value={newGoal.employee}
                onValueChange={(value) => setNewGoal(prev => ({ ...prev, employee: value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Goal</label>
              <Input 
                placeholder="e.g., Increase sales by 10% in Q2"
                value={newGoal.goal}
                onChange={(e) => setNewGoal(prev => ({ ...prev, goal: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Due Date</label>
              <Input 
                type="date"
                value={newGoal.dueDate}
                onChange={(e) => setNewGoal(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Progress</label>
              <Input 
                type="number"
                min="0"
                max="100"
                value={newGoal.progress}
                onChange={(e) => setNewGoal(prev => ({ ...prev, progress: parseInt(e.target.value, 10) }))}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={closeNewGoalModal}>
                Cancel
              </Button>
              <Button onClick={handleSubmitNewGoal} disabled={!newGoal.employee || !newGoal.goal || !newGoal.dueDate || newGoal.progress === 0}>
                Add Goal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PerformanceManagement;

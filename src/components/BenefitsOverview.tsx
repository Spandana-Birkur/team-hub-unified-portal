import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  Heart, 
  Eye, 
  Smile, 
  PiggyBank, 
  Shield, 
  Calendar,
  DollarSign,
  FileText,
  Settings
} from 'lucide-react';

const BenefitsOverview = () => {
  const healthPlans = [
    { 
      name: 'Premium Health Plan', 
      type: 'Medical', 
      premium: '$180/month', 
      deductible: '$500',
      coverage: '90%',
      status: 'enrolled'
    },
    { 
      name: 'Standard Dental Plan', 
      type: 'Dental', 
      premium: '$25/month', 
      deductible: '$50',
      coverage: '80%',
      status: 'enrolled'
    },
    { 
      name: 'Vision Plus', 
      type: 'Vision', 
      premium: '$12/month', 
      deductible: '$0',
      coverage: '100%',
      status: 'enrolled'
    },
  ];

  const retirementInfo = {
    currentContribution: '6%',
    companyMatch: '4%',
    vestingSchedule: '4 years',
    currentBalance: '$45,230',
    yearToDateContribution: '$3,240'
  };

  const flexibleBenefits = [
    { name: 'Health Savings Account (HSA)', contribution: '$2,500/year', available: '$1,850' },
    { name: 'Flexible Spending Account (FSA)', contribution: '$1,200/year', available: '$800' },
    { name: 'Dependent Care FSA', contribution: '$5,000/year', available: '$3,200' },
  ];

  const additionalBenefits = [
    { name: 'Life Insurance', coverage: '2x Annual Salary', premium: 'Company Paid' },
    { name: 'Disability Insurance', coverage: '60% of Salary', premium: 'Company Paid' },
    { name: 'Employee Assistance Program', coverage: 'Counseling & Support', premium: 'Company Paid' },
    { name: 'Wellness Program', coverage: 'Gym Membership Discount', premium: '$20/month' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'enrolled': return <Badge variant="default">Enrolled</Badge>;
      case 'pending': return <Badge variant="secondary">Pending</Badge>;
      case 'declined': return <Badge variant="outline">Declined</Badge>;
      default: return <Badge variant="outline">Available</Badge>;
    }
  };

  const [openDialog, setOpenDialog] = React.useState<{type: 'health'|'additional'|'retirement'|'flexible', index?: number}|null>(null);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Benefits</h1>
        <p className="text-gray-600">Manage your benefits and view coverage details.</p>
      </div>

      {/* Benefits Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Health Plans</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-xs text-green-600">All Enrolled</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">401(k) Match</p>
                <p className="text-2xl font-bold text-gray-900">4%</p>
                <p className="text-xs text-blue-600">Company Match</p>
              </div>
              <div className="p-3 rounded-lg bg-green-500">
                <PiggyBank className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">HSA Balance</p>
                <p className="text-2xl font-bold text-gray-900">$1,850</p>
                <p className="text-xs text-gray-600">Available</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-500">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Life Insurance</p>
                <p className="text-2xl font-bold text-gray-900">2x</p>
                <p className="text-xs text-gray-600">Annual Salary</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-500">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="health" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="health">Health Plans</TabsTrigger>
          <TabsTrigger value="retirement">Retirement</TabsTrigger>
          <TabsTrigger value="flexible">Flexible Benefits</TabsTrigger>
          <TabsTrigger value="additional">Additional Benefits</TabsTrigger>
        </TabsList>

        <TabsContent value="health">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Health Insurance Plans</span>
              </CardTitle>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Manage Plans
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthPlans.map((plan, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {plan.type === 'Medical' && <Heart className="w-5 h-5 text-red-500" />}
                        {plan.type === 'Dental' && <Smile className="w-5 h-5 text-blue-500" />}
                        {plan.type === 'Vision' && <Eye className="w-5 h-5 text-green-500" />}
                        <div>
                          <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                          <p className="text-sm text-gray-600">{plan.type} Coverage</p>
                        </div>
                      </div>
                      {getStatusBadge(plan.status)}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Monthly Premium</p>
                        <p className="font-medium">{plan.premium}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Deductible</p>
                        <p className="font-medium">{plan.deductible}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Coverage</p>
                        <p className="font-medium">{plan.coverage}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => setOpenDialog({type: 'health', index})}>View Details</Button>
                      <Button size="sm" variant="outline">Download Card</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Health Plan Details Dialog */}
          <Dialog open={openDialog?.type === 'health'} onOpenChange={open => !open && setOpenDialog(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Health Plan Details</DialogTitle>
              </DialogHeader>
              {openDialog?.type === 'health' && healthPlans[openDialog.index] && (
                <div className="space-y-2">
                  <p><strong>Name:</strong> {healthPlans[openDialog.index].name}</p>
                  <p><strong>Type:</strong> {healthPlans[openDialog.index].type}</p>
                  <p><strong>Premium:</strong> {healthPlans[openDialog.index].premium}</p>
                  <p><strong>Deductible:</strong> {healthPlans[openDialog.index].deductible}</p>
                  <p><strong>Coverage:</strong> {healthPlans[openDialog.index].coverage}</p>
                  <p><strong>Status:</strong> {healthPlans[openDialog.index].status}</p>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="retirement">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <PiggyBank className="w-5 h-5" />
                <span>401(k) Retirement Plan</span>
              </CardTitle>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Manage Contributions
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Contribution Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Your Contribution</span>
                      <span className="font-medium">{retirementInfo.currentContribution}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Company Match</span>
                      <span className="font-medium">{retirementInfo.companyMatch}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vesting Schedule</span>
                      <span className="font-medium">{retirementInfo.vestingSchedule}</span>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Account Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Balance</span>
                      <span className="font-medium text-green-600">{retirementInfo.currentBalance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">YTD Contribution</span>
                      <span className="font-medium">{retirementInfo.yearToDateContribution}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline" onClick={() => setOpenDialog({type: 'retirement'})}>View Full Statement</Button>
                </Card>
              </div>
            </CardContent>
          </Card>
          {/* Retirement Full Statement Dialog */}
          <Dialog open={openDialog?.type === 'retirement'} onOpenChange={open => !open && setOpenDialog(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>401(k) Full Statement</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                <p><strong>Current Balance:</strong> {retirementInfo.currentBalance}</p>
                <p><strong>Year-to-Date Contribution:</strong> {retirementInfo.yearToDateContribution}</p>
                <p><strong>Company Match:</strong> {retirementInfo.companyMatch}</p>
                <p><strong>Vesting Schedule:</strong> {retirementInfo.vestingSchedule}</p>
                <p><strong>Recent Transactions:</strong></p>
                <ul className="list-disc ml-6 text-sm">
                  <li>2024-04-01: Contribution $400</li>
                  <li>2024-03-01: Contribution $400</li>
                  <li>2024-02-01: Contribution $400</li>
                  <li>2024-01-01: Company Match $200</li>
                </ul>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="flexible">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Flexible Spending Accounts</span>
              </CardTitle>
              <Button variant="outline">Submit Claim</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {flexibleBenefits.map((benefit, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{benefit.name}</h3>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Annual Contribution</p>
                        <p className="font-medium">{benefit.contribution}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Available Balance</p>
                        <p className="font-medium text-green-600">{benefit.available}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => setOpenDialog({type: 'flexible', index})}>View Transactions</Button>
                      <Button size="sm" variant="outline">Submit Claim</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Flexible Benefit Transactions Dialog */}
          <Dialog open={openDialog?.type === 'flexible'} onOpenChange={open => !open && setOpenDialog(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Benefit Transactions</DialogTitle>
              </DialogHeader>
              {openDialog?.type === 'flexible' && typeof openDialog.index === 'number' && flexibleBenefits[openDialog.index] && (
                <div className="space-y-2">
                  <p><strong>Name:</strong> {flexibleBenefits[openDialog.index].name}</p>
                  <p><strong>Contribution:</strong> {flexibleBenefits[openDialog.index].contribution}</p>
                  <p><strong>Available:</strong> {flexibleBenefits[openDialog.index].available}</p>
                  <p><strong>Recent Transactions:</strong></p>
                  <ul className="list-disc ml-6 text-sm">
                    <li>2024-04-10: Expense -$120 (Medical)</li>
                    <li>2024-03-15: Contribution +$100</li>
                    <li>2024-02-20: Expense -$80 (Dental)</li>
                  </ul>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="additional">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Additional Benefits</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {additionalBenefits.map((benefit, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{benefit.name}</h3>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Coverage</span>
                        <span className="font-medium">{benefit.coverage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Premium</span>
                        <span className="font-medium">{benefit.premium}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => setOpenDialog({type: 'additional', index})}>
                      View Details
                    </Button>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Additional Benefit Details Dialog */}
          <Dialog open={openDialog?.type === 'additional'} onOpenChange={open => !open && setOpenDialog(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Benefit Details</DialogTitle>
              </DialogHeader>
              {openDialog?.type === 'additional' && additionalBenefits[openDialog.index] && (
                <div className="space-y-2">
                  <p><strong>Name:</strong> {additionalBenefits[openDialog.index].name}</p>
                  <p><strong>Coverage:</strong> {additionalBenefits[openDialog.index].coverage}</p>
                  <p><strong>Premium:</strong> {additionalBenefits[openDialog.index].premium}</p>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BenefitsOverview;

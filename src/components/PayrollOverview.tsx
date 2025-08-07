
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  Download, 
  FileText, 
  TrendingUp,
  Calendar,
  PieChart,
  Calculator
} from 'lucide-react';

const PayrollOverview = () => {
  const currentPayStub = {
    payPeriod: 'December 1-15, 2024',
    grossPay: '$4,167.00',
    netPay: '$3,125.50',
    payDate: 'December 20, 2024',
    deductions: {
      federalTax: '$625.00',
      stateTax: '$187.50',
      socialSecurity: '$258.35',
      medicare: '$60.42',
      healthInsurance: '$180.00',
      retirement401k: '$250.00'
    }
  };

  const payHistory = [
    { date: '12/20/2024', period: 'Dec 1-15', gross: '$4,167.00', net: '$3,125.50', status: 'processed' },
    { date: '12/05/2024', period: 'Nov 16-30', gross: '$4,167.00', net: '$3,140.25', status: 'processed' },
    { date: '11/20/2024', period: 'Nov 1-15', gross: '$4,167.00', net: '$3,118.75', status: 'processed' },
    { date: '11/05/2024', period: 'Oct 16-31', gross: '$4,167.00', net: '$3,135.80', status: 'processed' },
  ];

  const taxDocuments = [
    { name: 'W-2 Form 2023', type: 'Tax Document', date: '01/31/2024', status: 'available' },
    { name: 'W-2 Form 2022', type: 'Tax Document', date: '01/31/2023', status: 'available' },
    { name: '1099-MISC 2023', type: 'Tax Document', date: '01/31/2024', status: 'available' },
  ];

  const compensationSummary = {
    annualSalary: '$100,000.00',
    hourlyRate: '$48.08',
    ytdGross: '$48,750.00',
    ytdNet: '$36,890.25',
    ytdTaxes: '$8,924.75',
    ytdDeductions: '$2,935.00'
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processed': return <Badge variant="default">Processed</Badge>;
      case 'pending': return <Badge variant="secondary">Pending</Badge>;
      case 'available': return <Badge variant="outline">Available</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payroll & Compensation</h1>
        <p className="text-gray-600">View your salary details, pay stubs, and tax documents.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Annual Salary</p>
                <p className="text-2xl font-bold text-gray-900">$100K</p>
                <p className="text-xs text-gray-500">Base Salary</p>
              </div>
              <div className="p-3 rounded-lg bg-green-500">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last Pay</p>
                <p className="text-2xl font-bold text-gray-900">$3,126</p>
                <p className="text-xs text-green-600">Dec 20, 2024</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">YTD Gross</p>
                <p className="text-2xl font-bold text-gray-900">$48.8K</p>
                <p className="text-xs text-gray-600">This Year</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-500">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tax Documents</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-xs text-blue-600">Available</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-500">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="current" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="current">Current Pay Stub</TabsTrigger>
          <TabsTrigger value="history">Pay History</TabsTrigger>
          <TabsTrigger value="tax">Tax Documents</TabsTrigger>
          <TabsTrigger value="summary">Annual Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="w-5 h-5" />
                  <span>Current Pay Stub</span>
                </CardTitle>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Pay Period</span>
                    <span className="font-medium">{currentPayStub.payPeriod}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Pay Date</span>
                    <span className="font-medium">{currentPayStub.payDate}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Gross Pay</span>
                    <span className="font-medium text-green-600">{currentPayStub.grossPay}</span>
                  </div>
                  <div className="flex justify-between py-2 text-lg font-semibold">
                    <span>Net Pay</span>
                    <span className="text-green-600">{currentPayStub.netPay}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5" />
                  <span>Deductions Breakdown</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(currentPayStub.deductions).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1">
                      <span className="text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                      <span className="font-medium text-red-600">-{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Pay History</span>
              </CardTitle>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payHistory.map((pay, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{pay.period}</h4>
                      <p className="text-sm text-gray-600">Pay Date: {pay.date}</p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="font-medium text-gray-900">Gross: {pay.gross}</p>
                      <p className="text-sm text-green-600">Net: {pay.net}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(pay.status)}
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Tax Documents</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {taxDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{doc.name}</h4>
                      <p className="text-sm text-gray-600">{doc.type} • Available since {doc.date}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(doc.status)}
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Annual Compensation Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Base Compensation</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Annual Salary</span>
                      <span className="font-medium">{compensationSummary.annualSalary}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Hourly Rate</span>
                      <span className="font-medium">{compensationSummary.hourlyRate}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Year-to-Date Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Gross Pay</span>
                      <span className="font-medium text-green-600">{compensationSummary.ytdGross}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Total Taxes</span>
                      <span className="font-medium text-red-600">-{compensationSummary.ytdTaxes}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Total Deductions</span>
                      <span className="font-medium text-red-600">-{compensationSummary.ytdDeductions}</span>
                    </div>
                    <div className="flex justify-between py-2 text-lg font-semibold">
                      <span>Net Pay</span>
                      <span className="text-green-600">{compensationSummary.ytdNet}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PayrollOverview;

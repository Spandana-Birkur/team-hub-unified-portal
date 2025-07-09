import React, { useState, useEffect } from 'react';
import { employeesApi, EmployeesResponse } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Users } from 'lucide-react';

const EmployeeList = () => {
  const [employees, setEmployees] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data: EmployeesResponse = await employeesApi.getEmployees();
      setEmployees(data.employees);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Direct API Call Example
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchEmployees}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading employees...</span>
          </div>
        )}
        
        {error && (
          <div className="text-red-600 py-4">
            Error: {error}
          </div>
        )}
        
        {!loading && !error && (
          <div className="flex flex-wrap gap-2">
            {employees.map((employee, index) => (
              <Badge key={index} variant="outline">
                {employee}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeeList; 
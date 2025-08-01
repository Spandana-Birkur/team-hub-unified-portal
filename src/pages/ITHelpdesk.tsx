import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Headphones, Laptop, Wifi, Shield, AlertTriangle, CheckCircle, Clock, Users, Calendar, History, TrendingUp, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import SupportTickets from './IT/SupportTickets';
import SLAEscalation from './IT/SLAEscalation';
import TeamAssignment from './IT/TeamAssignment';
import AssetManagement from './IT/AssetManagement';
import KnowledgeBase from './IT/KnowledgeBase';
import AssetLifecyclePage from './IT/AssetLifecycle';

const ITHelpdesk = () => {
  const { userRole } = useRole();
  const { profile } = useUserProfile();

  return (
    <div className="p-6">
      <Routes>
        <Route path="/tickets" element={<SupportTickets />} />
        <Route path="/escalation" element={<SLAEscalation />} />
        <Route path="/assignment" element={<TeamAssignment />} />
        <Route path="/assets" element={<AssetManagement />} />
        <Route path="/lifecycle" element={<AssetLifecyclePage />} />
        <Route path="/knowledge" element={<KnowledgeBase />} />
        <Route path="*" element={<Navigate to="/ithelpdesk/tickets" replace />} />
      </Routes>
    </div>
  );
};

export default ITHelpdesk;

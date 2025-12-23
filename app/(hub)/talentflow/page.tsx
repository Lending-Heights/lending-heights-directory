'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { UserPlus, Users, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const onboardingStats = [
  { label: 'Active Onboardings', value: 3, icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { label: 'Completed This Month', value: 2, icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-50' },
  { label: 'Pending Review', value: 1, icon: AlertCircle, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
];

const activeOnboardings = [
  { id: 1, name: 'Sarah Johnson', role: 'Loan Officer', startDate: 'Jan 5, 2026', progress: 65, status: 'In Progress' },
  { id: 2, name: 'Michael Chen', role: 'Processor', startDate: 'Jan 10, 2026', progress: 40, status: 'In Progress' },
  { id: 3, name: 'Emily Davis', role: 'Account Executive', startDate: 'Jan 15, 2026', progress: 15, status: 'Just Started' },
];

const tasks = [
  { id: 1, task: 'Complete I-9 Form', assignee: 'Sarah Johnson', dueDate: 'Jan 20', status: 'pending' },
  { id: 2, task: 'IT Equipment Setup', assignee: 'Michael Chen', dueDate: 'Jan 18', status: 'in_progress' },
  { id: 3, task: 'NMLS Registration', assignee: 'Sarah Johnson', dueDate: 'Jan 25', status: 'pending' },
  { id: 4, task: 'Welcome Meeting', assignee: 'Emily Davis', dueDate: 'Jan 16', status: 'completed' },
];

export default function TalentFlowPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="TalentFlow"
        description="Employee onboarding and lifecycle management"
        icon={UserPlus}
        iconColor="text-cyan-600"
        iconBgColor="bg-cyan-50"
        badge="Coming Soon"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {onboardingStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Onboardings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Active Onboardings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeOnboardings.map((person) => (
              <div key={person.id} className="p-4 rounded-lg border">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{person.name}</p>
                    <p className="text-sm text-muted-foreground">{person.role}</p>
                  </div>
                  <Badge variant="secondary">{person.status}</Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{person.progress}%</span>
                  </div>
                  <Progress value={person.progress} className="h-2" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Started: {person.startDate}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Task Queue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Onboarding Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    task.status === 'completed' ? 'bg-green-50 border-green-200' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        task.status === 'completed'
                          ? 'bg-green-500'
                          : task.status === 'in_progress'
                          ? 'bg-blue-500'
                          : 'bg-gray-300'
                      }`}
                    />
                    <div>
                      <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                        {task.task}
                      </p>
                      <p className="text-xs text-muted-foreground">{task.assignee}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

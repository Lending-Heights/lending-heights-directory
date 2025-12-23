'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckSquare, Circle, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const projects = [
  {
    id: 1,
    name: 'New Branch Launch - Philadelphia',
    status: 'in_progress',
    progress: 72,
    dueDate: 'Feb 15, 2026',
    tasks: { completed: 18, total: 25 },
  },
  {
    id: 2,
    name: 'Q1 Compliance Audit',
    status: 'in_progress',
    progress: 45,
    dueDate: 'Mar 1, 2026',
    tasks: { completed: 9, total: 20 },
  },
  {
    id: 3,
    name: 'Website Redesign',
    status: 'planning',
    progress: 10,
    dueDate: 'Apr 1, 2026',
    tasks: { completed: 2, total: 15 },
  },
  {
    id: 4,
    name: 'LO Onboarding Program Update',
    status: 'completed',
    progress: 100,
    dueDate: 'Jan 10, 2026',
    tasks: { completed: 12, total: 12 },
  },
];

const recentTasks = [
  { id: 1, task: 'Order office furniture', project: 'Philadelphia Launch', status: 'completed' },
  { id: 2, task: 'Set up phone system', project: 'Philadelphia Launch', status: 'in_progress' },
  { id: 3, task: 'Review compliance documents', project: 'Q1 Audit', status: 'pending' },
  { id: 4, task: 'Create training materials', project: 'LO Onboarding', status: 'completed' },
  { id: 5, task: 'Schedule kickoff meeting', project: 'Website Redesign', status: 'pending' },
];

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
  in_progress: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress' },
  planning: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Planning' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
};

export default function ChecklistsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Checklists"
        description="Track launch readiness and project milestones"
        icon={CheckSquare}
        iconColor="text-emerald-600"
        iconBgColor="bg-emerald-50"
        badge="Coming Soon"
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-blue-600">2</p>
            <p className="text-sm text-muted-foreground">Active Projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-green-600">41</p>
            <p className="text-sm text-muted-foreground">Tasks Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-yellow-600">31</p>
            <p className="text-sm text-muted-foreground">Tasks Remaining</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-purple-600">57%</p>
            <p className="text-sm text-muted-foreground">Overall Progress</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold">Projects</h2>
          {projects.map((project) => (
            <Card key={project.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">Due: {project.dueDate}</p>
                  </div>
                  <Badge className={`${statusColors[project.status].bg} ${statusColors[project.status].text}`}>
                    {statusColors[project.status].label}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{project.tasks.completed} of {project.tasks.total} tasks</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3">
                {task.status === 'completed' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                ) : task.status === 'in_progress' ? (
                  <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-300 mt-0.5" />
                )}
                <div>
                  <p className={`text-sm ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                    {task.task}
                  </p>
                  <p className="text-xs text-muted-foreground">{task.project}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

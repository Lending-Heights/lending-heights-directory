"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  User,
  CheckCircle2,
  Circle,
  Clock,
  Edit,
  Trash2,
  Play,
  Pause,
  AlertCircle,
  BookOpen,
  ListTodo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { onboardings, tasks as tasksApi } from "@/lib/api/talentflow";
import { format, parseISO, differenceInDays, isPast } from "date-fns";
import Link from "next/link";
import EditOnboardingModal from "@/components/EditOnboardingModal";

type Task = {
  id: string;
  onboarding_id: string;
  title: string;
  description?: string;
  milestone?: string;
  category?: string;
  priority?: string;
  status?: string;
  due_date?: string;
  completed: boolean;
  completed_date?: string;
  assigned_to?: string;
  day_number?: number;
};

type Onboarding = {
  id: string;
  employee_id: string;
  playbook_id: string;
  status: string;
  start_date?: string;
  target_completion_date?: string;
  actual_completion_date?: string;
  progress_percentage: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  employees?: {
    id: string;
    name: string;
    email: string;
    position?: string;
    department?: string;
  };
  playbooks?: {
    id: string;
    title: string;
    description?: string;
  };
};

export default function OnboardingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const onboardingId = params.id as string;

  const [onboarding, setOnboarding] = useState<Onboarding | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [onboardingId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [onboardingData, tasksData] = await Promise.all([
        onboardings.getById(onboardingId),
        tasksApi.getByOnboardingId(onboardingId),
      ]);
      setOnboarding(onboardingData as Onboarding);
      setTasks(tasksData as Task[]);
    } catch (error) {
      console.error("Error loading onboarding:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    try {
      await tasksApi.toggleComplete(taskId, completed);
      await loadData(); // Reload to get updated progress
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!onboarding) return;

    try {
      setUpdatingStatus(true);
      const updates: any = { status: newStatus };

      // If marking as completed, set actual completion date
      if (newStatus === "completed") {
        updates.actual_completion_date = new Date().toISOString();
        updates.progress_percentage = 100;
      }

      await onboardings.update(onboarding.id, updates);
      await loadData();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const tasksByMilestone = useMemo(() => {
    const grouped: { [key: string]: Task[] } = {};

    tasks.forEach((task) => {
      const milestone = task.milestone || "Other Tasks";
      if (!grouped[milestone]) {
        grouped[milestone] = [];
      }
      grouped[milestone].push(task);
    });

    // Sort tasks within each milestone by day_number
    Object.keys(grouped).forEach((milestone) => {
      grouped[milestone].sort((a, b) => (a.day_number || 999) - (b.day_number || 999));
    });

    return grouped;
  }, [tasks]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const overdue = tasks.filter(
      (t) => !t.completed && t.due_date && isPast(parseISO(t.due_date))
    ).length;
    const blocked = tasks.filter((t) => t.status === "blocked").length;
    const pendingApproval = tasks.filter((t) => t.status === "pending-approval").length;

    return { total, completed, overdue, blocked, pendingApproval };
  }, [tasks]);

  const getStatusConfig = (status: string) => {
    const configs: { [key: string]: { label: string; color: string; icon: any } } = {
      "not-started": { label: "Not Started", color: "bg-gray-100 text-gray-700 border-gray-300", icon: Clock },
      "in-progress": { label: "In Progress", color: "bg-blue-100 text-blue-700 border-blue-300", icon: Play },
      "on-hold": { label: "On Hold", color: "bg-yellow-100 text-yellow-700 border-yellow-300", icon: Pause },
      "completed": { label: "Completed", color: "bg-green-100 text-green-700 border-green-300", icon: CheckCircle2 },
    };
    return configs[status] || configs["not-started"];
  };

  const getPriorityColor = (priority?: string) => {
    const colors: { [key: string]: string } = {
      critical: "text-red-600 font-semibold",
      high: "text-orange-600 font-medium",
      medium: "text-yellow-600",
      low: "text-gray-500",
    };
    return colors[priority || "medium"] || colors.medium;
  };

  if (loading) {
    return (
      <div className="p-8">
        <Skeleton className="h-10 w-64 mb-8" />
        <Skeleton className="h-64 mb-6" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!onboarding) {
    return (
      <div className="p-8">
        <Card className="p-12 text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Onboarding Not Found</h2>
          <p className="text-gray-600 mb-6">This onboarding doesn't exist or has been deleted.</p>
          <Button onClick={() => router.push("/talentflow/onboardings")}>
            Back to Onboardings
          </Button>
        </Card>
      </div>
    );
  }

  const statusConfig = getStatusConfig(onboarding.status);
  const StatusIcon = statusConfig.icon;
  const daysRemaining =
    onboarding.target_completion_date && onboarding.status !== "completed"
      ? differenceInDays(parseISO(onboarding.target_completion_date), new Date())
      : null;
  const isOverdue = daysRemaining !== null && daysRemaining < 0;

  return (
    <div className="p-8">
      {/* Back Button */}
      <Link href="/talentflow/onboardings">
        <Button variant="outline" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Onboardings
        </Button>
      </Link>

      {/* Onboarding Header */}
      <Card className="p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {onboarding.employees?.name}
              </h1>
              <Badge className={`${statusConfig.color} border`}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {statusConfig.label}
              </Badge>
            </div>
            <p className="text-gray-600 mb-1">{onboarding.employees?.position}</p>
            <p className="text-sm text-gray-500">{onboarding.employees?.email}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditModal(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div>
            <div className="flex items-center text-gray-600 mb-2">
              <BookOpen className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Playbook</span>
            </div>
            <p className="text-gray-900 font-medium">{onboarding.playbooks?.title}</p>
          </div>

          {onboarding.start_date && (
            <div>
              <div className="flex items-center text-gray-600 mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Start Date</span>
              </div>
              <p className="text-gray-900">{format(parseISO(onboarding.start_date), "MMM d, yyyy")}</p>
            </div>
          )}

          {onboarding.target_completion_date && onboarding.status !== "completed" && (
            <div>
              <div className="flex items-center text-gray-600 mb-2">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Target Completion</span>
              </div>
              <p className={isOverdue ? "text-red-600 font-medium" : "text-gray-900"}>
                {format(parseISO(onboarding.target_completion_date), "MMM d, yyyy")}
                {isOverdue && ` (${Math.abs(daysRemaining!)} days overdue)`}
                {!isOverdue && daysRemaining !== null && ` (${daysRemaining} days left)`}
              </p>
            </div>
          )}

          {onboarding.actual_completion_date && (
            <div>
              <div className="flex items-center text-green-600 mb-2">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Completed</span>
              </div>
              <p className="text-gray-900">
                {format(parseISO(onboarding.actual_completion_date), "MMM d, yyyy")}
              </p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-semibold text-gray-900">
              {onboarding.progress_percentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-[#0058A9] h-3 rounded-full transition-all"
              style={{ width: `${onboarding.progress_percentage}%` }}
            />
          </div>
        </div>

        {/* Status Change */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Update Status</Label>
          <Select
            value={onboarding.status}
            onValueChange={handleStatusChange}
            disabled={updatingStatus}
          >
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not-started">Not Started</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notes */}
        {onboarding.notes && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Notes</p>
            <p className="text-gray-600">{onboarding.notes}</p>
          </div>
        )}
      </Card>

      {/* Task Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Tasks</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-700">{stats.overdue}</div>
          <div className="text-sm text-gray-600">Overdue</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-700">{stats.blocked}</div>
          <div className="text-sm text-gray-600">Blocked</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{stats.pendingApproval}</div>
          <div className="text-sm text-gray-600">Need Approval</div>
        </Card>
      </div>

      {/* Tasks by Milestone */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <ListTodo className="w-6 h-6 mr-2" />
          Tasks
        </h2>

        {Object.entries(tasksByMilestone).map(([milestone, milestoneTasks]) => (
          <Card key={milestone} className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{milestone}</h3>
            <div className="space-y-3">
              {milestoneTasks.map((task) => {
                const taskIsOverdue = !task.completed && task.due_date && isPast(parseISO(task.due_date));

                return (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={(checked) => handleToggleTask(task.id, checked as boolean)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4
                            className={`font-medium ${
                              task.completed ? "line-through text-gray-400" : "text-gray-900"
                            }`}
                          >
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {task.priority && (
                            <Badge variant="outline" className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          )}
                          {task.category && (
                            <Badge variant="outline" className="text-gray-600">
                              {task.category}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        {task.day_number && <span>Day {task.day_number}</span>}
                        {task.due_date && (
                          <span className={taskIsOverdue ? "text-red-600 font-medium" : ""}>
                            Due: {format(parseISO(task.due_date), "MMM d, yyyy")}
                          </span>
                        )}
                        {task.status === "blocked" && (
                          <Badge className="bg-red-100 text-red-700 border-red-300">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Blocked
                          </Badge>
                        )}
                        {task.status === "pending-approval" && (
                          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
                            <Clock className="w-3 h-3 mr-1" />
                            Needs Approval
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Onboarding Modal */}
      {onboarding && (
        <EditOnboardingModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            loadData();
            setShowEditModal(false);
          }}
          onboarding={onboarding}
        />
      )}
    </div>
  );
}

function Label({ children, className, ...props }: any) {
  return (
    <label className={className} {...props}>
      {children}
    </label>
  );
}

"use client";

import { useState, useEffect } from "react";
import { User, CheckCircle2, Clock, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { onboardings, tasks as tasksApi } from "@/lib/api/talentflow";
import { format, parseISO, isPast } from "date-fns";

type Task = {
  id: string;
  title: string;
  description?: string;
  milestone?: string;
  category?: string;
  priority?: string;
  due_date?: string;
  completed: boolean;
  day_number?: number;
};

type Onboarding = {
  id: string;
  status: string;
  start_date?: string;
  target_completion_date?: string;
  progress_percentage: number;
  playbooks?: {
    title: string;
  };
};

export default function PortalPage() {
  const [onboarding, setOnboarding] = useState<Onboarding | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock current user email - in production this would come from auth
  const currentUserEmail = "sarah.johnson@lhloans.com";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // In production, this would filter by current user
      // For now, we'll just get the first onboarding
      const allOnboardings = await onboardings.list();
      const userOnboarding = allOnboardings[0]; // Mock - get first one

      if (userOnboarding) {
        setOnboarding(userOnboarding as any);
        const userTasks = await tasksApi.getByOnboardingId(userOnboarding.id);
        setTasks(userTasks as Task[]);
      }
    } catch (error) {
      console.error("Error loading portal data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    try {
      await tasksApi.toggleComplete(taskId, completed);
      await loadData();
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  const completedTasks = tasks.filter((t) => t.completed).length;
  const overdueTasks = tasks.filter(
    (t) => !t.completed && t.due_date && isPast(parseISO(t.due_date))
  ).length;

  if (loading) {
    return (
      <div className="p-8">
        <Skeleton className="h-10 w-64 mb-8" />
        <Skeleton className="h-48 mb-6" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!onboarding) {
    return (
      <div className="p-8">
        <Card className="p-12 text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Active Onboarding</h2>
          <p className="text-gray-600">
            You don't have an active onboarding process at the moment.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Your Onboarding</h1>
        <p className="text-gray-600">Track your progress and complete your onboarding tasks</p>
      </div>

      {/* Progress Card */}
      <Card className="p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-[#0058A9]" />
              <h2 className="text-xl font-semibold text-gray-900">
                {onboarding.playbooks?.title || "Your Onboarding"}
              </h2>
            </div>
            {onboarding.start_date && (
              <p className="text-sm text-gray-600">
                Started: {format(parseISO(onboarding.start_date), "MMMM d, yyyy")}
              </p>
            )}
          </div>
          <Badge
            variant="outline"
            className={
              onboarding.status === "completed"
                ? "bg-green-100 text-green-700 border-green-300"
                : "bg-blue-100 text-blue-700 border-blue-300"
            }
          >
            {onboarding.status === "completed" ? "Completed" : "In Progress"}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
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

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-700">{completedTasks}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-700">{overdueTasks}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
        </div>
      </Card>

      {/* Tasks by Milestone */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Tasks</h2>

        {tasks.length === 0 ? (
          <Card className="p-12 text-center">
            <CheckCircle2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900">No tasks yet</p>
            <p className="text-sm text-gray-600">Your tasks will appear here soon</p>
          </Card>
        ) : (
          <Card className="p-6">
            <div className="space-y-3">
              {tasks.map((task) => {
                const isOverdue = !task.completed && task.due_date && isPast(parseISO(task.due_date));

                return (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
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
                          {task.milestone && (
                            <Badge variant="outline" className="text-gray-600">
                              {task.milestone}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        {task.day_number && <span>Day {task.day_number}</span>}
                        {task.due_date && (
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            <span className={isOverdue ? "text-red-600 font-medium" : ""}>
                              Due: {format(parseISO(task.due_date), "MMM d, yyyy")}
                            </span>
                          </div>
                        )}
                        {task.category && <span>• {task.category}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

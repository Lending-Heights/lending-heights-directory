"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { metrics } from "@/lib/api/talentflow";
import {
  Users,
  Calendar,
  AlertTriangle,
  ClipboardCheck,
  FileText,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function TalentFlowDashboard() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [dashboardMetrics, setDashboardMetrics] = useState({
    activeOnboardings: 0,
    dueThisWeek: 0,
    overdue: 0,
    pendingApprovals: 0,
    newApplications: 0,
    teamVelocity: 0,
  });

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const [
        activeOnboardings,
        dueThisWeek,
        overdue,
        pendingApprovals,
        newApplications,
        teamVelocity,
      ] = await Promise.all([
        metrics.getActiveOnboardingsCount(),
        metrics.getTasksDueThisWeekCount(),
        metrics.getOverdueTasksCount(),
        metrics.getPendingApprovalsCount(),
        metrics.getNewApplicationsCount(),
        metrics.getTeamVelocity(),
      ]);

      setDashboardMetrics({
        activeOnboardings,
        dueThisWeek,
        overdue,
        pendingApprovals,
        newApplications,
        teamVelocity,
      });
    } catch (error) {
      console.error("Failed to load metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  const metricCards = [
    {
      title: "Active Onboardings",
      value: dashboardMetrics.activeOnboardings,
      subtitle: "In progress",
      icon: Users,
      color: "bg-blue-50 text-blue-600",
      borderColor: "border-blue-200",
      link: "/talentflow/onboardings",
      linkText: "View Pipeline",
    },
    {
      title: "Due This Week",
      value: dashboardMetrics.dueThisWeek,
      subtitle: "Tasks coming up",
      icon: Calendar,
      color: "bg-yellow-50 text-yellow-600",
      borderColor: "border-yellow-200",
      link: "/talentflow/tasks?filter=due-this-week",
      linkText: "View Tasks",
    },
    {
      title: "Overdue",
      value: dashboardMetrics.overdue,
      subtitle: "Needs immediate attention",
      icon: AlertTriangle,
      color: "bg-red-50 text-red-600",
      borderColor: "border-red-200",
      link: "/talentflow/tasks?filter=overdue",
      linkText: "Fix Now",
    },
    {
      title: "Pending Approvals",
      value: dashboardMetrics.pendingApprovals,
      subtitle: "Waiting for your review",
      icon: ClipboardCheck,
      color: "bg-purple-50 text-purple-600",
      borderColor: "border-purple-200",
      link: "/talentflow/approvals",
      linkText: "Review",
    },
    {
      title: "New Applications",
      value: dashboardMetrics.newApplications,
      subtitle: "Need review",
      icon: FileText,
      color: "bg-cyan-50 text-cyan-600",
      borderColor: "border-cyan-200",
      link: "/talentflow/applications",
      linkText: "View Applications",
    },
    {
      title: "Team Velocity",
      value: `${dashboardMetrics.teamVelocity}%`,
      subtitle: "Tasks completed on time",
      icon: Zap,
      color: "bg-green-50 text-green-600",
      borderColor: "border-green-200",
      link: "/talentflow/tasks",
      linkText: "View All Tasks",
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">TalentFlow</h1>
        <p className="text-gray-500 mt-1">
          Employee onboarding and task management
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metricCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card
              key={index}
              className={`border-2 ${card.borderColor} hover:shadow-lg transition-shadow`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl ${card.color}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <div className="space-y-1 mb-4">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {card.value}
                  </p>
                  <p className="text-sm text-gray-500">{card.subtitle}</p>
                </div>

                <Link href={card.link}>
                  <Button
                    variant="ghost"
                    className="w-full justify-between group"
                  >
                    <span className="text-sm font-medium">{card.linkText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/talentflow/onboardings/new">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Start New Onboarding</h3>
                <p className="text-sm text-gray-500">
                  Create an onboarding for a new hire
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/talentflow/playbooks">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Manage Playbooks</h3>
                <p className="text-sm text-gray-500">
                  Edit onboarding templates and workflows
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/directory">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Employee Database</h3>
                <p className="text-sm text-gray-500">
                  View and manage all employees
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}

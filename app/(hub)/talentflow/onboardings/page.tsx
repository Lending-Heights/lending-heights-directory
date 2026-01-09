"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Search, Calendar, User, CheckCircle2, Clock, AlertCircle, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { onboardings, employees as employeesApi } from "@/lib/api/talentflow";
import { format, parseISO, differenceInDays, isPast, isFuture } from "date-fns";
import Link from "next/link";
import CreateOnboardingModal from "@/components/CreateOnboardingModal";

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
  };
  playbooks?: {
    id: string;
    title: string;
    description?: string;
  };
};

type Employee = {
  id: string;
  name: string;
  email: string;
  position?: string;
};

export default function OnboardingsPage() {
  const [onboardingsList, setOnboardingsList] = useState<Onboarding[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [onboardingsData, employeesData] = await Promise.all([
        onboardings.list(),
        employeesApi.list(),
      ]);
      setOnboardingsList(onboardingsData as Onboarding[]);
      setEmployees(employeesData as Employee[]);
    } catch (error) {
      console.error("Error loading onboardings:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = onboardingsList.length;
    const notStarted = onboardingsList.filter(o => o.status === "not-started").length;
    const inProgress = onboardingsList.filter(o => o.status === "in-progress").length;
    const completed = onboardingsList.filter(o => o.status === "completed").length;
    const onHold = onboardingsList.filter(o => o.status === "on-hold").length;
    const overdue = onboardingsList.filter(o =>
      o.status !== "completed" &&
      o.target_completion_date &&
      isPast(parseISO(o.target_completion_date))
    ).length;

    return { total, notStarted, inProgress, completed, onHold, overdue };
  }, [onboardingsList]);

  const filteredOnboardings = useMemo(() => {
    let filtered = [...onboardingsList];

    if (searchQuery) {
      filtered = filtered.filter(
        (o) =>
          o.employees?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.employees?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.playbooks?.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      if (statusFilter === "overdue") {
        filtered = filtered.filter(
          o => o.status !== "completed" &&
          o.target_completion_date &&
          isPast(parseISO(o.target_completion_date))
        );
      } else {
        filtered = filtered.filter((o) => o.status === statusFilter);
      }
    }

    if (employeeFilter !== "all") {
      filtered = filtered.filter((o) => o.employee_id === employeeFilter);
    }

    return filtered.sort((a, b) => {
      // Sort by status priority, then by start date
      const statusPriority: { [key: string]: number } = {
        "in-progress": 1,
        "not-started": 2,
        "on-hold": 3,
        "completed": 4,
      };
      const aPriority = statusPriority[a.status] || 5;
      const bPriority = statusPriority[b.status] || 5;

      if (aPriority !== bPriority) return aPriority - bPriority;

      const aDate = a.start_date ? parseISO(a.start_date) : new Date(0);
      const bDate = b.start_date ? parseISO(b.start_date) : new Date(0);
      return bDate.getTime() - aDate.getTime();
    });
  }, [onboardingsList, searchQuery, statusFilter, employeeFilter]);

  const getStatusConfig = (status: string) => {
    const configs: { [key: string]: { label: string; color: string; icon: any } } = {
      "not-started": { label: "Not Started", color: "bg-gray-100 text-gray-700 border-gray-300", icon: Clock },
      "in-progress": { label: "In Progress", color: "bg-blue-100 text-blue-700 border-blue-300", icon: Play },
      "on-hold": { label: "On Hold", color: "bg-yellow-100 text-yellow-700 border-yellow-300", icon: Pause },
      "completed": { label: "Completed", color: "bg-green-100 text-green-700 border-green-300", icon: CheckCircle2 },
    };
    return configs[status] || configs["not-started"];
  };

  const getDaysRemaining = (targetDate?: string, status?: string) => {
    if (!targetDate || status === "completed") return null;
    const days = differenceInDays(parseISO(targetDate), new Date());
    return days;
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Onboarding Pipeline</h1>
          <p className="text-gray-600">
            Manage employee onboardings and track progress
          </p>
        </div>
        <Button
          className="bg-[#0058A9] hover:bg-[#004080]"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Onboarding
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <Card className="p-4 border-l-4 border-l-gray-400">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-gray-400">
          <div className="text-2xl font-bold text-gray-700">{stats.notStarted}</div>
          <div className="text-sm text-gray-600">Not Started</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="text-2xl font-bold text-blue-700">{stats.inProgress}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-yellow-500">
          <div className="text-2xl font-bold text-yellow-700">{stats.onHold}</div>
          <div className="text-sm text-gray-600">On Hold</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="text-2xl font-bold text-red-700">{stats.overdue}</div>
          <div className="text-sm text-gray-600">Overdue</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search employees or playbooks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="not-started">Not Started</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
          <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Employees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              {employees.map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setEmployeeFilter("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Onboardings Grid */}
      {filteredOnboardings.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center justify-center text-gray-500">
            <User className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No onboardings found</p>
            <p className="text-sm">
              {searchQuery || statusFilter !== "all" || employeeFilter !== "all"
                ? "Try adjusting your filters"
                : "Get started by creating your first onboarding"}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOnboardings.map((onboarding) => {
            const statusConfig = getStatusConfig(onboarding.status);
            const StatusIcon = statusConfig.icon;
            const daysRemaining = getDaysRemaining(onboarding.target_completion_date, onboarding.status);
            const isOverdue = daysRemaining !== null && daysRemaining < 0;

            return (
              <Link href={`/talentflow/onboardings/${onboarding.id}`} key={onboarding.id}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full border-l-4" style={{
                  borderLeftColor: statusConfig.color.includes('blue') ? '#3B82F6' :
                                   statusConfig.color.includes('green') ? '#10B981' :
                                   statusConfig.color.includes('yellow') ? '#F59E0B' :
                                   statusConfig.color.includes('red') ? '#EF4444' : '#6B7280'
                }}>
                  {/* Employee Info */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        {onboarding.employees?.name || "Unknown Employee"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {onboarding.employees?.position || "No position"}
                      </p>
                    </div>
                    <Badge className={`${statusConfig.color} border`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                  </div>

                  {/* Playbook */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Playbook</p>
                    <p className="text-sm font-medium text-gray-900">
                      {onboarding.playbooks?.title || "No playbook"}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {onboarding.progress_percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#0058A9] h-2 rounded-full transition-all"
                        style={{ width: `${onboarding.progress_percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="space-y-2 text-sm">
                    {onboarding.start_date && (
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Started: {format(parseISO(onboarding.start_date), "MMM d, yyyy")}</span>
                      </div>
                    )}
                    {onboarding.target_completion_date && onboarding.status !== "completed" && (
                      <div className={`flex items-center ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                        <Clock className="w-4 h-4 mr-2" />
                        <span>
                          {isOverdue
                            ? `Overdue by ${Math.abs(daysRemaining!)} days`
                            : daysRemaining === 0
                            ? "Due today"
                            : `${daysRemaining} days remaining`
                          }
                        </span>
                      </div>
                    )}
                    {onboarding.actual_completion_date && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        <span>Completed: {format(parseISO(onboarding.actual_completion_date), "MMM d, yyyy")}</span>
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* Create Onboarding Modal */}
      <CreateOnboardingModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadData}
      />
    </div>
  );
}

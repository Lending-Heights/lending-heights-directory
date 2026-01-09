"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { tasks as tasksApi, employees as employeesApi, onboardings as onboardingsApi } from "@/lib/api/talentflow";
import {
  Search,
  Filter,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  Tag,
  ChevronDown,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isPast, isThisWeek, parseISO } from "date-fns";

type TaskWithDetails = any; // Full type from API

export default function AllTasksPage() {
  const searchParams = useSearchParams();
  const filterParam = searchParams?.get("filter");

  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<TaskWithDetails[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(filterParam || "all");
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("due_date");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (filterParam) {
      setStatusFilter(filterParam);
    }
  }, [filterParam]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, employeesData] = await Promise.all([
        tasksApi.list(),
        employeesApi.list(),
      ]);
      setTasks(tasksData);
      setEmployees(employeesData);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (taskId: string, currentStatus: boolean) => {
    try {
      await tasksApi.toggleComplete(taskId, !currentStatus);
      await loadData();
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  };

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (task) =>
          task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.onboardings?.employees?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filters
    if (statusFilter === "completed") {
      filtered = filtered.filter((task) => task.completed);
    } else if (statusFilter === "incomplete") {
      filtered = filtered.filter((task) => !task.completed);
    } else if (statusFilter === "overdue") {
      filtered = filtered.filter(
        (task) => !task.completed && task.due_date && isPast(parseISO(task.due_date))
      );
    } else if (statusFilter === "due-this-week") {
      filtered = filtered.filter(
        (task) => !task.completed && task.due_date && isThisWeek(parseISO(task.due_date))
      );
    } else if (statusFilter === "blocked") {
      filtered = filtered.filter((task) => task.blocked);
    } else if (statusFilter === "pending-approval") {
      filtered = filtered.filter(
        (task) => task.requires_approval && task.completed && task.approval_status === "pending"
      );
    }

    // Employee filter
    if (employeeFilter !== "all") {
      filtered = filtered.filter(
        (task) => task.onboardings?.employee_id === employeeFilter
      );
    }

    // Assignee filter
    if (assigneeFilter !== "all") {
      filtered = filtered.filter((task) => task.assigned_to === assigneeFilter);
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((task) => task.priority === priorityFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((task) => task.category === categoryFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "due_date") {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      } else if (sortBy === "employee") {
        const nameA = a.onboardings?.employees?.name || "";
        const nameB = b.onboardings?.employees?.name || "";
        return nameA.localeCompare(nameB);
      } else if (sortBy === "priority") {
        const priorityOrder: any = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority || "low"] - priorityOrder[b.priority || "low"];
      }
      return 0;
    });

    return filtered;
  }, [tasks, searchQuery, statusFilter, employeeFilter, assigneeFilter, priorityFilter, categoryFilter, sortBy]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(tasks.map((t) => t.category).filter(Boolean));
    return Array.from(cats);
  }, [tasks]);

  // Stats
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const overdue = tasks.filter((t) => !t.completed && t.due_date && isPast(parseISO(t.due_date))).length;
    const dueThisWeek = tasks.filter((t) => !t.completed && t.due_date && isThisWeek(parseISO(t.due_date))).length;
    const blocked = tasks.filter((t) => t.blocked).length;
    const pendingApproval = tasks.filter(
      (t) => t.requires_approval && t.completed && (!t.approval_status || t.approval_status === "pending")
    ).length;

    return { total, completed, overdue, dueThisWeek, blocked, pendingApproval };
  }, [tasks]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setEmployeeFilter("all");
    setAssigneeFilter("all");
    setPriorityFilter("all");
    setCategoryFilter("all");
  };

  const getTaskStatusIcon = (task: TaskWithDetails) => {
    if (task.completed) {
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    }
    if (task.blocked) {
      return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    }
    if (task.due_date && isPast(parseISO(task.due_date))) {
      return <Clock className="w-5 h-5 text-red-600" />;
    }
    return <Circle className="w-5 h-5 text-gray-400" />;
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">All Tasks</h1>
        <p className="text-gray-500 mt-1">
          Manage all onboarding tasks across your team
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-gray-500">Total Tasks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-xs text-gray-500">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-xs text-gray-500">Overdue</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.dueThisWeek}</div>
            <div className="text-xs text-gray-500">Due This Week</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.blocked}</div>
            <div className="text-xs text-gray-500">Blocked</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.pendingApproval}</div>
            <div className="text-xs text-gray-500">Need Approval</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </span>
            {(searchQuery || statusFilter !== "all" || employeeFilter !== "all" || assigneeFilter !== "all" || priorityFilter !== "all" || categoryFilter !== "all") && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="incomplete">Incomplete</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="due-this-week">Due This Week</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="pending-approval">Pending Approval</SelectItem>
              </SelectContent>
            </Select>

            {/* Employee */}
            <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Employee" />
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

            {/* Assignee */}
            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Assigned To" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
              </SelectContent>
            </Select>

            {/* Priority */}
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            {/* Category */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="due_date">Due Date</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {filteredTasks.length} Task{filteredTasks.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No tasks found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTasks.map((task) => (
                  <TableRow key={task.id} className={task.completed ? "opacity-60" : ""}>
                    <TableCell>
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => handleToggleComplete(task.id, task.completed)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-2">
                        {getTaskStatusIcon(task)}
                        <div>
                          <div className={`font-medium ${task.completed ? "line-through" : ""}`}>
                            {task.title}
                          </div>
                          {task.description && (
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {task.description}
                            </div>
                          )}
                          {task.blocked && task.blocked_reason && (
                            <div className="text-xs text-yellow-600 mt-1">
                              Blocked: {task.blocked_reason}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        {task.onboardings?.employees?.name || "Unknown"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {task.assigned_to}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {task.due_date ? (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span
                            className={
                              !task.completed && isPast(parseISO(task.due_date))
                                ? "text-red-600 font-medium"
                                : ""
                            }
                          >
                            {format(parseISO(task.due_date), "MMM d, yyyy")}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">No date</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {task.priority && (
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {task.category && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {task.category}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {task.requires_approval && task.completed && (
                        <Badge className="bg-purple-100 text-purple-800">
                          Needs Approval
                        </Badge>
                      )}
                      {task.blocked && (
                        <Badge className="bg-yellow-100 text-yellow-800">Blocked</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

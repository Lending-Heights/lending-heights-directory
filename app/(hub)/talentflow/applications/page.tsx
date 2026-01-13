"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Search, User, Mail, Phone, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { applicants } from "@/lib/api/talentflow";
import { format, parseISO } from "date-fns";

type Applicant = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position_applied?: string;
  status: string;
  application_date: string;
  resume_url?: string;
  notes?: string;
};

export default function ApplicationsPage() {
  const [applicantsList, setApplicantsList] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await applicants.list();
      setApplicantsList(data as Applicant[]);
    } catch (error) {
      console.error("Error loading applicants:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = applicantsList.length;
    const applied = applicantsList.filter((a) => a.status === "applied").length;
    const screening = applicantsList.filter((a) => a.status === "screening").length;
    const interviewing = applicantsList.filter((a) => a.status === "interviewing").length;
    const offered = applicantsList.filter((a) => a.status === "offered").length;
    const hired = applicantsList.filter((a) => a.status === "hired").length;
    const rejected = applicantsList.filter((a) => a.status === "rejected").length;

    return { total, applied, screening, interviewing, offered, hired, rejected };
  }, [applicantsList]);

  const filteredApplicants = useMemo(() => {
    let filtered = [...applicantsList];

    if (searchQuery) {
      filtered = filtered.filter(
        (a) =>
          a.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.position_applied?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }

    return filtered.sort((a, b) => new Date(b.application_date).getTime() - new Date(a.application_date).getTime());
  }, [applicantsList, searchQuery, statusFilter]);

  const getStatusConfig = (status: string) => {
    const configs: { [key: string]: string } = {
      applied: "bg-blue-100 text-blue-700 border-blue-300",
      screening: "bg-purple-100 text-purple-700 border-purple-300",
      interviewing: "bg-yellow-100 text-yellow-700 border-yellow-300",
      offered: "bg-green-100 text-green-700 border-green-300",
      hired: "bg-green-100 text-green-700 border-green-300",
      rejected: "bg-red-100 text-red-700 border-red-300",
      withdrawn: "bg-gray-100 text-gray-700 border-gray-300",
    };
    return configs[status] || configs.applied;
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Applications</h1>
          <p className="text-gray-600">Manage job applications and candidate pipeline</p>
        </div>
        <Button className="bg-[#0058A9] hover:bg-[#004080]">
          <Plus className="w-4 h-4 mr-2" />
          Add Applicant
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Card className="p-4 text-center border-l-4 border-l-gray-400">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-blue-500">
          <div className="text-2xl font-bold text-blue-700">{stats.applied}</div>
          <div className="text-sm text-gray-600">Applied</div>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-purple-500">
          <div className="text-2xl font-bold text-purple-700">{stats.screening}</div>
          <div className="text-sm text-gray-600">Screening</div>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-yellow-500">
          <div className="text-2xl font-bold text-yellow-700">{stats.interviewing}</div>
          <div className="text-sm text-gray-600">Interviewing</div>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-green-500">
          <div className="text-2xl font-bold text-green-700">{stats.offered}</div>
          <div className="text-sm text-gray-600">Offered</div>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-green-600">
          <div className="text-2xl font-bold text-green-800">{stats.hired}</div>
          <div className="text-sm text-gray-600">Hired</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name, email, or position..."
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
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="screening">Screening</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="offered">Offered</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="withdrawn">Withdrawn</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Applicants List */}
      {filteredApplicants.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center justify-center text-gray-500">
            <User className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No applicants found</p>
            <p className="text-sm">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Add your first applicant to get started"}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplicants.map((applicant) => (
            <Card key={applicant.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-[#0058A9] rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{applicant.name}</h3>
                      <p className="text-sm text-gray-600">{applicant.position_applied || "No position specified"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      <a href={`mailto:${applicant.email}`} className="hover:text-[#0058A9]">
                        {applicant.email}
                      </a>
                    </div>
                    {applicant.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        <a href={`tel:${applicant.phone}`} className="hover:text-[#0058A9]">
                          {applicant.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Applied {format(parseISO(applicant.application_date), "MMM d, yyyy")}</span>
                    </div>
                  </div>

                  {applicant.notes && (
                    <p className="text-sm text-gray-600 mt-3 line-clamp-2">{applicant.notes}</p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-3">
                  <Badge variant="outline" className={`${getStatusConfig(applicant.status)} border`}>
                    {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                  </Badge>
                  {applicant.resume_url && (
                    <a
                      href={applicant.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#0058A9] hover:underline flex items-center"
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      View Resume
                    </a>
                  )}
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Search, BookOpen, Clock, CheckCircle2, Archive, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { playbooks as playbooksApi } from "@/lib/api/talentflow";
import Link from "next/link";
import CreatePlaybookModal from "@/components/CreatePlaybookModal";

type Playbook = {
  id: string;
  title: string;
  description?: string;
  status: string;
  estimated_days?: number;
  created_at: string;
  updated_at: string;
};

export default function PlaybooksPage() {
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"active" | "archived">("active");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await playbooksApi.list();
      setPlaybooks(data as Playbook[]);
    } catch (error) {
      console.error("Error loading playbooks:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlaybooks = useMemo(() => {
    let filtered = playbooks.filter((p) => p.status === activeTab);

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [playbooks, searchQuery, activeTab]);

  const stats = useMemo(() => {
    const active = playbooks.filter((p) => p.status === "active").length;
    const archived = playbooks.filter((p) => p.status === "archived").length;
    return { active, archived, total: playbooks.length };
  }, [playbooks]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Playbook Templates</h1>
          <p className="text-gray-600">
            Manage onboarding templates and task sequences
          </p>
        </div>
        <Button
          className="bg-[#0058A9] hover:bg-[#004080]"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Playbook
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Playbooks</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{stats.active}</div>
          <div className="text-sm text-gray-600">Active</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-500">{stats.archived}</div>
          <div className="text-sm text-gray-600">Archived</div>
        </Card>
      </div>

      {/* Tabs & Search */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <Button
              variant={activeTab === "active" ? "default" : "outline"}
              onClick={() => setActiveTab("active")}
              className={activeTab === "active" ? "bg-[#0058A9] hover:bg-[#004080]" : ""}
            >
              <Play className="w-4 h-4 mr-2" />
              Active ({stats.active})
            </Button>
            <Button
              variant={activeTab === "archived" ? "default" : "outline"}
              onClick={() => setActiveTab("archived")}
              className={activeTab === "archived" ? "bg-[#0058A9] hover:bg-[#004080]" : ""}
            >
              <Archive className="w-4 h-4 mr-2" />
              Archived ({stats.archived})
            </Button>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search playbooks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </Card>

      {/* Playbooks Grid */}
      {filteredPlaybooks.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center justify-center text-gray-500">
            <BookOpen className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No playbooks found</p>
            <p className="text-sm">
              {searchQuery
                ? "Try adjusting your search"
                : activeTab === "active"
                ? "Create your first playbook template"
                : "No archived playbooks"}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaybooks.map((playbook) => (
            <Link href={`/talentflow/playbooks/${playbook.id}`} key={playbook.id}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#0058A9]" />
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                      {playbook.title}
                    </h3>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      playbook.status === "active"
                        ? "bg-green-100 text-green-700 border-green-300"
                        : "bg-gray-100 text-gray-700 border-gray-300"
                    }
                  >
                    {playbook.status === "active" ? (
                      <>
                        <Play className="w-3 h-3 mr-1" />
                        Active
                      </>
                    ) : (
                      <>
                        <Archive className="w-3 h-3 mr-1" />
                        Archived
                      </>
                    )}
                  </Badge>
                </div>

                {playbook.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {playbook.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {playbook.estimated_days && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{playbook.estimated_days} days</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    <span>0 tasks</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Create Playbook Modal */}
      <CreatePlaybookModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadData}
      />
    </div>
  );
}

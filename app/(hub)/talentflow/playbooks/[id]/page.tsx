"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Edit, Trash2, Clock, AlertCircle, Archive, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { playbooks } from "@/lib/api/talentflow";
import Link from "next/link";

type Playbook = {
  id: string;
  title: string;
  description?: string;
  status: string;
  estimated_days?: number;
  created_at: string;
  updated_at: string;
};

export default function PlaybookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const playbookId = params.id as string;

  const [playbook, setPlaybook] = useState<Playbook | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [playbookId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await playbooks.getById(playbookId);
      setPlaybook(data as Playbook);
    } catch (error) {
      console.error("Error loading playbook:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!playbook) return;

    const newStatus = playbook.status === "active" ? "archived" : "active";
    try {
      await playbooks.update(playbook.id, { status: newStatus });
      await loadData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <Skeleton className="h-10 w-64 mb-8" />
        <Skeleton className="h-64 mb-6" />
      </div>
    );
  }

  if (!playbook) {
    return (
      <div className="p-8">
        <Card className="p-12 text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Playbook Not Found</h2>
          <p className="text-gray-600 mb-6">This playbook doesn't exist or has been deleted.</p>
          <Button onClick={() => router.push("/talentflow/playbooks")}>
            Back to Playbooks
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Back Button */}
      <Link href="/talentflow/playbooks">
        <Button variant="outline" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Playbooks
        </Button>
      </Link>

      {/* Header Card */}
      <Card className="p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{playbook.title}</h1>
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
              <p className="text-gray-600 mb-4">{playbook.description}</p>
            )}
            {playbook.estimated_days && (
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">Estimated duration: {playbook.estimated_days} days</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleStatus}
              className={playbook.status === "archived" ? "text-green-600 border-green-300" : ""}
            >
              {playbook.status === "active" ? (
                <>
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Activate
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Tasks Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Tasks & Milestones</h2>
          <Button className="bg-[#0058A9] hover:bg-[#004080]">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        <Card className="p-12 text-center">
          <div className="flex flex-col items-center justify-center text-gray-500">
            <AlertCircle className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No tasks yet</p>
            <p className="text-sm mb-4">
              Add tasks to this playbook template to create a complete onboarding sequence
            </p>
            <Button className="bg-[#0058A9] hover:bg-[#004080]">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Task
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { playbooks } from "@/lib/api/talentflow";

type CreatePlaybookModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function CreatePlaybookModal({
  isOpen,
  onClose,
  onSuccess,
}: CreatePlaybookModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    estimated_days: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter a playbook title");
      return;
    }

    try {
      setLoading(true);

      await playbooks.create({
        title: formData.title,
        description: formData.description || undefined,
        estimated_days: formData.estimated_days ? parseInt(formData.estimated_days) : undefined,
        status: "active",
      });

      setFormData({ title: "", description: "", estimated_days: "" });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating playbook:", error);
      alert("Failed to create playbook. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <h2 className="text-2xl font-bold text-gray-900">Create New Playbook</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2 block">
              Playbook Title <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Standard Employee Onboarding"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
              Description
            </Label>
            <textarea
              id="description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0058A9] focus:border-transparent resize-none"
              placeholder="Describe what this playbook is for and when to use it..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="estimated_days" className="text-sm font-medium text-gray-700 mb-2 block">
              Estimated Duration (days)
            </Label>
            <Input
              type="number"
              id="estimated_days"
              value={formData.estimated_days}
              onChange={(e) => setFormData({ ...formData, estimated_days: e.target.value })}
              placeholder="30"
              min="1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Default target completion timeline for onboardings using this playbook
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#0058A9] hover:bg-[#004080]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Playbook"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

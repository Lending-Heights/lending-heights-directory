"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { onboardings } from "@/lib/api/talentflow";
import { format, parseISO } from "date-fns";

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
  employees?: {
    name: string;
    email: string;
    position?: string;
  };
  playbooks?: {
    title: string;
  };
};

type EditOnboardingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onboarding: Onboarding;
};

export default function EditOnboardingModal({
  isOpen,
  onClose,
  onSuccess,
  onboarding,
}: EditOnboardingModalProps) {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    status: onboarding.status,
    start_date: onboarding.start_date
      ? format(parseISO(onboarding.start_date), "yyyy-MM-dd")
      : "",
    target_completion_date: onboarding.target_completion_date
      ? format(parseISO(onboarding.target_completion_date), "yyyy-MM-dd")
      : "",
    notes: onboarding.notes || "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        status: onboarding.status,
        start_date: onboarding.start_date
          ? format(parseISO(onboarding.start_date), "yyyy-MM-dd")
          : "",
        target_completion_date: onboarding.target_completion_date
          ? format(parseISO(onboarding.target_completion_date), "yyyy-MM-dd")
          : "",
        notes: onboarding.notes || "",
      });
      setShowDeleteConfirm(false);
    }
  }, [isOpen, onboarding]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const updates: any = {
        status: formData.status,
        start_date: formData.start_date || undefined,
        target_completion_date: formData.target_completion_date || undefined,
        notes: formData.notes || undefined,
      };

      // If marking as completed and no actual completion date, set it
      if (formData.status === "completed" && !onboarding.actual_completion_date) {
        updates.actual_completion_date = new Date().toISOString();
        updates.progress_percentage = 100;
      }

      // If un-marking as completed, remove actual completion date
      if (formData.status !== "completed" && onboarding.actual_completion_date) {
        updates.actual_completion_date = undefined;
      }

      await onboardings.update(onboarding.id, updates);

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating onboarding:", error);
      alert("Failed to update onboarding. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await onboardings.delete(onboarding.id);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting onboarding:", error);
      alert("Failed to delete onboarding. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Edit Onboarding</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Employee & Playbook Info (Read-only) */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Employee</p>
                <p className="text-gray-900 font-medium">{onboarding.employees?.name}</p>
                <p className="text-sm text-gray-600">{onboarding.employees?.position}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Playbook</p>
                <p className="text-gray-900 font-medium">{onboarding.playbooks?.title}</p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status" className="text-sm font-medium text-gray-700 mb-2 block">
              Status
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger id="status">
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

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date" className="text-sm font-medium text-gray-700 mb-2 block">
                Start Date
              </Label>
              <Input
                type="date"
                id="start_date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="target_completion_date" className="text-sm font-medium text-gray-700 mb-2 block">
                Target Completion
              </Label>
              <Input
                type="date"
                id="target_completion_date"
                value={formData.target_completion_date}
                onChange={(e) =>
                  setFormData({ ...formData, target_completion_date: e.target.value })
                }
              />
            </div>
          </div>

          {/* Completion Date (if completed) */}
          {onboarding.actual_completion_date && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm font-medium text-green-900 mb-1">Completed On</p>
              <p className="text-green-700">
                {format(parseISO(onboarding.actual_completion_date), "MMMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          )}

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="text-sm font-medium text-gray-700 mb-2 block">
              Notes
            </Label>
            <textarea
              id="notes"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0058A9] focus:border-transparent resize-none"
              placeholder="Add any additional notes or special instructions..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              {!showDeleteConfirm ? (
                <Button
                  type="button"
                  variant="outline"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={loading || deleting}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Onboarding
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-red-700">Delete this onboarding?</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Confirm Delete"
                    )}
                  </Button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading || deleting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#0058A9] hover:bg-[#004080]"
                disabled={loading || deleting}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}

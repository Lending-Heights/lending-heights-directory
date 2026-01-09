"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { onboardings, employees as employeesApi, playbooks as playbooksApi } from "@/lib/api/talentflow";
import { format, addDays } from "date-fns";

type Employee = {
  id: string;
  name: string;
  email: string;
  position?: string;
};

type Playbook = {
  id: string;
  title: string;
  description?: string;
  estimated_days?: number;
};

type CreateOnboardingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function CreateOnboardingModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateOnboardingModalProps) {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [formData, setFormData] = useState({
    employee_id: "",
    playbook_id: "",
    start_date: format(new Date(), "yyyy-MM-dd"),
    target_completion_date: format(addDays(new Date(), 30), "yyyy-MM-dd"),
    notes: "",
  });

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      const [employeesData, playbooksData] = await Promise.all([
        employeesApi.list(),
        playbooksApi.list(),
      ]);
      setEmployees(employeesData as Employee[]);
      setPlaybooks(playbooksData.filter((p: any) => p.status === 'active') as Playbook[]);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handlePlaybookChange = (playbookId: string) => {
    setFormData((prev) => ({ ...prev, playbook_id: playbookId }));

    // Auto-calculate target completion date based on playbook estimated days
    const selectedPlaybook = playbooks.find((p) => p.id === playbookId);
    if (selectedPlaybook?.estimated_days && formData.start_date) {
      const targetDate = addDays(new Date(formData.start_date), selectedPlaybook.estimated_days);
      setFormData((prev) => ({
        ...prev,
        target_completion_date: format(targetDate, "yyyy-MM-dd"),
      }));
    }
  };

  const handleStartDateChange = (date: string) => {
    setFormData((prev) => ({ ...prev, start_date: date }));

    // Recalculate target completion date
    const selectedPlaybook = playbooks.find((p) => p.id === formData.playbook_id);
    if (selectedPlaybook?.estimated_days) {
      const targetDate = addDays(new Date(date), selectedPlaybook.estimated_days);
      setFormData((prev) => ({
        ...prev,
        target_completion_date: format(targetDate, "yyyy-MM-dd"),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.employee_id || !formData.playbook_id) {
      alert("Please select both an employee and a playbook");
      return;
    }

    try {
      setLoading(true);

      // Create the onboarding
      await onboardings.create({
        employee_id: formData.employee_id,
        playbook_id: formData.playbook_id,
        status: "not-started",
        start_date: formData.start_date,
        target_completion_date: formData.target_completion_date,
        progress_percentage: 0,
        notes: formData.notes || undefined,
      });

      // Reset form
      setFormData({
        employee_id: "",
        playbook_id: "",
        start_date: format(new Date(), "yyyy-MM-dd"),
        target_completion_date: format(addDays(new Date(), 30), "yyyy-MM-dd"),
        notes: "",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating onboarding:", error);
      alert("Failed to create onboarding. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Create New Onboarding</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Employee Selection */}
          <div>
            <Label htmlFor="employee_id" className="text-sm font-medium text-gray-700 mb-2 block">
              Employee <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.employee_id}
              onValueChange={(value) => setFormData({ ...formData, employee_id: value })}
            >
              <SelectTrigger id="employee_id">
                <SelectValue placeholder="Select an employee..." />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    <div>
                      <div className="font-medium">{emp.name}</div>
                      <div className="text-sm text-gray-500">
                        {emp.position || "No position"} • {emp.email}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Playbook Selection */}
          <div>
            <Label htmlFor="playbook_id" className="text-sm font-medium text-gray-700 mb-2 block">
              Playbook Template <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.playbook_id} onValueChange={handlePlaybookChange}>
              <SelectTrigger id="playbook_id">
                <SelectValue placeholder="Select a playbook..." />
              </SelectTrigger>
              <SelectContent>
                {playbooks.map((playbook) => (
                  <SelectItem key={playbook.id} value={playbook.id}>
                    <div>
                      <div className="font-medium">{playbook.title}</div>
                      {playbook.description && (
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {playbook.description}
                        </div>
                      )}
                      {playbook.estimated_days && (
                        <div className="text-xs text-gray-400 mt-1">
                          Estimated: {playbook.estimated_days} days
                        </div>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              This will create tasks based on the playbook template
            </p>
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
                onChange={(e) => handleStartDateChange(e.target.value)}
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
                onChange={(e) => setFormData({ ...formData, target_completion_date: e.target.value })}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="text-sm font-medium text-gray-700 mb-2 block">
              Notes (Optional)
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
                "Create Onboarding"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

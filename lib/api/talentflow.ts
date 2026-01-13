/**
 * TalentFlow API Layer
 * All Supabase queries for TalentFlow entities
 */

import { supabase as supabaseClient } from '@/lib/supabase';

// Cast to any to avoid TypeScript errors with dynamic table schemas
const supabase = supabaseClient as any;

// =====================================================
// TYPES
// =====================================================

export type Role = {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
};

export type UserRole = {
  id: string;
  user_email: string;
  role_id: string;
  created_at: string;
  updated_at: string;
};

export type Application = {
  id: string;
  name: string;
  slug: string;
  category?: string;
  description?: string;
  created_at: string;
};

export type Permission = {
  id: string;
  role_id: string;
  application_id: string;
  permission_level: 'none' | 'view' | 'edit' | 'admin';
  created_at: string;
  updated_at: string;
};

export type Applicant = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position_applied: string;
  application_date: string;
  status: 'new' | 'reviewing' | 'approved' | 'rejected';
  reviewed_date?: string;
  resume_url?: string;
  cover_letter?: string;
  notes?: string;
  source?: string;
  jotform_submission_id?: string;
  created_at: string;
  updated_at: string;
};

export type Employee = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profile_picture_url?: string;
  bio?: string;
  work_email?: string;
  personal_email?: string;
  position: string;
  department?: string;
  manager?: string;
  hire_date?: string;
  status: 'active' | 'inactive' | 'terminated';
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  created_at: string;
  updated_at: string;
};

export type MilestoneTask = {
  id: string;
  title: string;
  description?: string;
  assigned_to: 'admin' | 'employee' | 'manager';
  requires_approval: boolean;
  due_offset_days: number;
  category?: string;
  dependencies?: string[];
  priority?: 'low' | 'medium' | 'high';
};

export type Milestone = {
  id: string;
  title: string;
  description?: string;
  duration_days: number;
  stage: string;
  tasks: MilestoneTask[];
};

export type Playbook = {
  id: string;
  title: string;
  description?: string;
  owner?: string;
  status: 'draft' | 'active' | 'archived';
  estimated_days?: number;
  milestones: Milestone[];
  created_at: string;
  updated_at: string;
};

export type Onboarding = {
  id: string;
  employee_id: string;
  playbook_id: string;
  status: 'not-started' | 'in-progress' | 'on-hold' | 'completed';
  start_date?: string;
  target_completion_date?: string;
  actual_completion_date?: string;
  progress_percentage: number;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type Task = {
  id: string;
  onboarding_id: string;
  milestone_id?: string;
  title: string;
  description?: string;
  assigned_to: 'admin' | 'employee' | 'manager';
  assigned_to_name?: string;
  due_date?: string;
  completed: boolean;
  completed_date?: string;
  completed_by?: string;
  requires_approval: boolean;
  approval_status?: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_date?: string;
  blocked: boolean;
  blocked_reason?: string;
  dependencies?: string[];
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type Notification = {
  id: string;
  user_email: string;
  title: string;
  message: string;
  type: 'info' | 'task' | 'approval' | 'milestone' | 'system';
  read: boolean;
  read_date?: string;
  action_url?: string;
  created_at: string;
};

// =====================================================
// RBAC & PERMISSIONS
// =====================================================

export const roles = {
  async list() {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('name');

    if (error) throw error;
    return data as Role[];
  },

  async getByName(name: string) {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .eq('name', name)
      .single();

    if (error) throw error;
    return data as Role;
  },
};

export const userRoles = {
  async getByEmail(email: string) {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*, roles(*)')
      .eq('user_email', email)
      .single();

    if (error) throw error;
    return data;
  },

  async list() {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*, roles(*)')
      .order('user_email');

    if (error) throw error;
    return data;
  },

  async assign(email: string, roleId: string) {
    const { data, error } = await supabase
      .from('user_roles')
      .upsert({ user_email: email, role_id: roleId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async remove(email: string) {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_email', email);

    if (error) throw error;
  },
};

export const applications = {
  async list() {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('name');

    if (error) throw error;
    return data as Application[];
  },
};

export const permissions = {
  async list() {
    const { data, error } = await supabase
      .from('permissions')
      .select('*, roles(*), applications(*)');

    if (error) throw error;
    return data;
  },

  async getByRole(roleId: string) {
    const { data, error } = await supabase
      .from('permissions')
      .select('*, applications(*)')
      .eq('role_id', roleId);

    if (error) throw error;
    return data;
  },

  async upsert(roleId: string, applicationId: string, permissionLevel: string) {
    const { data, error } = await supabase
      .from('permissions')
      .upsert({
        role_id: roleId,
        application_id: applicationId,
        permission_level: permissionLevel,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async check(email: string, appSlug: string, requiredLevel: 'view' | 'edit' | 'admin') {
    const { data, error} = await supabase
      .rpc('has_permission', {
        user_email_param: email,
        app_slug_param: appSlug,
        required_level: requiredLevel,
      });

    if (error) throw error;
    return data as boolean;
  },
};

// =====================================================
// APPLICANTS
// =====================================================

export const applicants = {
  async list() {
    const { data, error } = await supabase
      .from('applicants')
      .select('*')
      .order('application_date', { ascending: false });

    if (error) throw error;
    return data as Applicant[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('applicants')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Applicant;
  },

  async create(applicant: Partial<Applicant>) {
    const { data, error } = await supabase
      .from('applicants')
      .insert(applicant)
      .select()
      .single();

    if (error) throw error;
    return data as Applicant;
  },

  async update(id: string, updates: Partial<Applicant>) {
    const { data, error } = await supabase
      .from('applicants')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Applicant;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('applicants')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// =====================================================
// EMPLOYEES
// =====================================================

export const employees = {
  async list() {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('name');

    if (error) throw error;
    return data as Employee[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Employee;
  },

  async getByEmail(email: string) {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .or(`email.eq.${email},work_email.eq.${email},personal_email.eq.${email}`)
      .single();

    if (error) throw error;
    return data as Employee;
  },

  async create(employee: Partial<Employee>) {
    const { data, error } = await supabase
      .from('employees')
      .insert(employee)
      .select()
      .single();

    if (error) throw error;
    return data as Employee;
  },

  async update(id: string, updates: Partial<Employee>) {
    const { data, error } = await supabase
      .from('employees')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Employee;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// =====================================================
// PLAYBOOKS
// =====================================================

export const playbooks = {
  async list() {
    const { data, error } = await supabase
      .from('playbooks')
      .select('*')
      .order('title');

    if (error) throw error;
    return data as Playbook[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('playbooks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Playbook;
  },

  async create(playbook: Partial<Playbook>) {
    const { data, error } = await supabase
      .from('playbooks')
      .insert(playbook)
      .select()
      .single();

    if (error) throw error;
    return data as Playbook;
  },

  async update(id: string, updates: Partial<Playbook>) {
    const { data, error } = await supabase
      .from('playbooks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Playbook;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('playbooks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// =====================================================
// ONBOARDINGS
// =====================================================

export const onboardings = {
  async list() {
    const { data, error } = await supabase
      .from('onboardings')
      .select('*, employees(*), playbooks(*)')
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('onboardings')
      .select('*, employees(*), playbooks(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getByEmployeeId(employeeId: string) {
    const { data, error } = await supabase
      .from('onboardings')
      .select('*, employees(*), playbooks(*)')
      .eq('employee_id', employeeId)
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(onboarding: Partial<Onboarding>) {
    const { data, error } = await supabase
      .from('onboardings')
      .insert(onboarding)
      .select()
      .single();

    if (error) throw error;
    return data as Onboarding;
  },

  async update(id: string, updates: Partial<Onboarding>) {
    const { data, error } = await supabase
      .from('onboardings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Onboarding;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('onboardings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// =====================================================
// TASKS
// =====================================================

export const tasks = {
  async list() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*, onboardings(*, employees(*))')
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*, onboardings(*, employees(*))')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getByOnboardingId(onboardingId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('onboarding_id', onboardingId)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data as Task[];
  },

  async create(task: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  async update(id: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async toggleComplete(id: string, completed: boolean) {
    const updates: Partial<Task> = { completed };
    if (completed) {
      updates.completed_date = new Date().toISOString();
    } else {
      updates.completed_date = undefined;
    }

    return this.update(id, updates);
  },
};

// =====================================================
// NOTIFICATIONS
// =====================================================

export const notifications = {
  async listForUser(email: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_email', email)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Notification[];
  },

  async getUnreadCount(email: string) {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_email', email)
      .eq('read', false);

    if (error) throw error;
    return count || 0;
  },

  async create(notification: Partial<Notification>) {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();

    if (error) throw error;
    return data as Notification;
  },

  async markAsRead(id: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true, read_date: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Notification;
  },

  async markAllAsRead(email: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true, read_date: new Date().toISOString() })
      .eq('user_email', email)
      .eq('read', false);

    if (error) throw error;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// =====================================================
// DASHBOARD METRICS
// =====================================================

export const metrics = {
  async getOverdueTasksCount() {
    const { data, error } = await supabase.rpc('get_overdue_tasks_count');
    if (error) throw error;
    return data as number;
  },

  async getTasksDueThisWeekCount() {
    const { data, error } = await supabase.rpc('get_tasks_due_this_week_count');
    if (error) throw error;
    return data as number;
  },

  async getActiveOnboardingsCount() {
    const { count, error } = await supabase
      .from('onboardings')
      .select('*', { count: 'exact', head: true })
      .neq('status', 'completed');

    if (error) throw error;
    return count || 0;
  },

  async getPendingApprovalsCount() {
    const { count, error } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('requires_approval', true)
      .eq('completed', true)
      .or('approval_status.is.null,approval_status.eq.pending');

    if (error) throw error;
    return count || 0;
  },

  async getNewApplicationsCount() {
    const { count, error } = await supabase
      .from('applicants')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new');

    if (error) throw error;
    return count || 0;
  },

  async getTeamVelocity() {
    // Calculate % of tasks completed on time
    const { data, error } = await supabase
      .from('tasks')
      .select('completed, due_date, completed_date')
      .eq('completed', true)
      .not('due_date', 'is', null)
      .not('completed_date', 'is', null);

    if (error) throw error;

    if (!data || data.length === 0) return 0;

    const onTimeCount = data.filter(task => {
      const dueDate = new Date(task.due_date!);
      const completedDate = new Date(task.completed_date!);
      return completedDate <= dueDate;
    }).length;

    return Math.round((onTimeCount / data.length) * 100);
  },
};

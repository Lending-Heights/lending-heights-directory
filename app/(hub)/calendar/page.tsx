'use client';

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight, Clock, Plus, X, Trash2, Loader2 } from 'lucide-react';
import {
  fetchEventsByMonth,
  fetchUpcomingEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from '@/lib/api/calendar';
import type { Database } from '@/types/database';

type CalendarEvent = Database['public']['Tables']['calendar_events']['Row'];
type EventType = CalendarEvent['event_type'];

const eventColors: Record<EventType, string> = {
  meeting: 'bg-blue-100 text-blue-700 border-blue-200',
  payroll: 'bg-green-100 text-green-700 border-green-200',
  holiday: 'bg-red-100 text-red-700 border-red-200',
  event: 'bg-purple-100 text-purple-700 border-purple-200',
  training: 'bg-orange-100 text-orange-700 border-orange-200',
  deadline: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

const eventDotColors: Record<EventType, string> = {
  meeting: 'bg-blue-500',
  payroll: 'bg-green-500',
  holiday: 'bg-red-500',
  event: 'bg-purple-500',
  training: 'bg-orange-500',
  deadline: 'bg-yellow-500',
};

interface FormData {
  title: string;
  description: string;
  event_date: string;
  start_time: string;
  end_time: string;
  event_type: EventType;
  location: string;
  is_all_day: boolean;
}

const initialFormData: FormData = {
  title: '',
  description: '',
  event_date: '',
  start_time: '',
  end_time: '',
  event_type: 'event',
  location: '',
  is_all_day: false,
};

export default function CalendarPage() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [saving, setSaving] = useState(false);

  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Current month/year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Load events
  useEffect(() => {
    loadEvents();
  }, [currentMonth, currentYear]);

  useEffect(() => {
    loadUpcomingEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);
    setError(null);
    const { data, error } = await fetchEventsByMonth(currentMonth, currentYear);
    if (error) {
      setError(error);
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  }

  async function loadUpcomingEvents() {
    const { data } = await fetchUpcomingEvents(5);
    setUpcomingEvents(data || []);
  }

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const days: (number | null)[] = [];

    // Add empty slots for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    // Pad to complete the last week
    while (days.length % 7 !== 0) {
      days.push(null);
    }

    return days;
  }, [currentMonth, currentYear]);

  // Get events for a specific day
  function getEventsForDay(day: number): CalendarEvent[] {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter((e) => e.event_date === dateStr);
  }

  // Check if a day is today
  function isToday(day: number): boolean {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  }

  // Navigation
  function goToPreviousMonth() {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  }

  function goToNextMonth() {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  }

  function goToToday() {
    setCurrentDate(new Date());
  }

  // Modal handlers
  function openCreateModal(day?: number) {
    setEditingEvent(null);
    const date = day
      ? `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      : '';
    setFormData({ ...initialFormData, event_date: date });
    setIsModalOpen(true);
  }

  function openEditModal(event: CalendarEvent) {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      event_date: event.event_date,
      start_time: event.start_time || '',
      end_time: event.end_time || '',
      event_type: event.event_type,
      location: event.location || '',
      is_all_day: event.is_all_day,
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingEvent(null);
    setFormData(initialFormData);
  }

  // Form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const eventData = {
      title: formData.title,
      description: formData.description || null,
      event_date: formData.event_date,
      start_time: formData.is_all_day ? null : formData.start_time || null,
      end_time: formData.is_all_day ? null : formData.end_time || null,
      event_type: formData.event_type,
      location: formData.location || null,
      is_all_day: formData.is_all_day,
    };

    let result;
    if (editingEvent) {
      result = await updateEvent(editingEvent.id, eventData);
    } else {
      result = await createEvent(eventData);
    }

    if (result.error) {
      alert(`Error ${editingEvent ? 'updating' : 'creating'} event: ${result.error}`);
    } else {
      closeModal();
      loadEvents();
      loadUpcomingEvents();
    }

    setSaving(false);
  }

  // Delete handlers
  function confirmDelete(event: CalendarEvent) {
    setEventToDelete(event);
    setShowDeleteConfirm(true);
  }

  async function handleDelete() {
    if (!eventToDelete) return;

    setDeleting(true);
    const { error } = await deleteEvent(eventToDelete.id);

    if (error) {
      alert('Error deleting event: ' + error);
    } else {
      setShowDeleteConfirm(false);
      setEventToDelete(null);
      loadEvents();
      loadUpcomingEvents();
    }

    setDeleting(false);
  }

  // Format time for display
  function formatTime(time: string | null): string {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Calendar"
        description="Events, holidays, payroll dates, and team activities"
        icon={Calendar}
        iconColor="text-red-600"
        iconBgColor="bg-red-50"
        actions={
          <Button onClick={() => openCreateModal()} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        }
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold">{monthName}</CardTitle>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-1">
                {days.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
                {calendarDays.map((day, i) => {
                  const dayEvents = day ? getEventsForDay(day) : [];
                  return (
                    <div
                      key={i}
                      onClick={() => day && openCreateModal(day)}
                      className={`min-h-[80px] p-1 text-sm rounded-lg border cursor-pointer transition-colors ${
                        day ? 'hover:bg-muted' : 'bg-muted/30'
                      } ${isToday(day || 0) ? 'ring-2 ring-primary' : 'border-transparent'}`}
                    >
                      {day && (
                        <>
                          <div className={`font-medium mb-1 ${isToday(day) ? 'text-primary' : ''}`}>
                            {day}
                          </div>
                          <div className="space-y-0.5">
                            {dayEvents.slice(0, 3).map((event) => (
                              <div
                                key={event.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditModal(event);
                                }}
                                className={`text-xs px-1 py-0.5 rounded truncate ${eventColors[event.event_type]}`}
                                title={event.title}
                              >
                                {event.title}
                              </div>
                            ))}
                            {dayEvents.length > 3 && (
                              <div className="text-xs text-muted-foreground px-1">
                                +{dayEvents.length - 3} more
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No upcoming events</p>
            ) : (
              upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => openEditModal(event)}
                  className={`p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-shadow ${eventColors[event.event_type]}`}
                >
                  <p className="font-medium text-sm">{event.title}</p>
                  <p className="text-xs mt-1">
                    {new Date(event.event_date + 'T00:00:00').toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                    {event.is_all_day
                      ? ' - All Day'
                      : event.start_time
                      ? ` - ${formatTime(event.start_time)}`
                      : ''}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {Object.entries(eventDotColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${color}`} />
                <span className="text-sm text-muted-foreground capitalize">{type}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative w-full max-w-lg bg-white rounded-xl shadow-xl animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-lh-gradient rounded-t-xl px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Event title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.event_date}
                      onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Event Type *</label>
                    <select
                      required
                      value={formData.event_type}
                      onChange={(e) =>
                        setFormData({ ...formData, event_type: e.target.value as EventType })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="event">Event</option>
                      <option value="meeting">Meeting</option>
                      <option value="payroll">Payroll</option>
                      <option value="holiday">Holiday</option>
                      <option value="training">Training</option>
                      <option value="deadline">Deadline</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_all_day"
                    checked={formData.is_all_day}
                    onChange={(e) => setFormData({ ...formData, is_all_day: e.target.checked })}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="is_all_day" className="text-sm">
                    All day event
                  </label>
                </div>

                {!formData.is_all_day && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Time</label>
                      <input
                        type="time"
                        value={formData.start_time}
                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">End Time</label>
                      <input
                        type="time"
                        value={formData.end_time}
                        onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Event location (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Event description (optional)"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  {editingEvent && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => confirmDelete(editingEvent)}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  )}
                  <div className="flex-1" />
                  <Button type="button" variant="outline" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : editingEvent ? (
                      'Save Changes'
                    ) : (
                      'Create Event'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && eventToDelete && (
        <div className="fixed inset-0 z-[200] overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <Card
              className="relative w-full max-w-md animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader>
                <CardTitle className="text-lg">Delete Event</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Are you sure you want to delete <strong>{eventToDelete.title}</strong>? This
                  action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleting}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                    {deleting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Deleting...
                      </>
                    ) : (
                      'Delete'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

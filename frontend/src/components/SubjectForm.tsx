import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { SUBJECT_COLORS } from '@/lib/mockData';

const API_BASE = "http://127.0.0.1:8000";

interface Subject {
  id?: number;
  name: string;
  code: string;
  instructor: string;
  schedule: string;
  color: string;
  notes?: string;
}

interface SubjectFormProps {
  subject?: Subject | null;
  onClose: () => void;
}

export const SubjectForm = ({ subject, onClose }: SubjectFormProps) => {
  const [formData, setFormData] = useState<Subject>({
    name: subject?.name || '',
    code: subject?.code || '',
    color: subject?.color || SUBJECT_COLORS[0],
    instructor: subject?.instructor || '',
    schedule: subject?.schedule || '',
    notes: subject?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Subject name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const token = localStorage.getItem("accessToken");

    try {
      if (subject?.id) {
        // ✅ UPDATE (PUT)
        const res = await fetch(`${API_BASE}/api/subjects/${subject.id}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (!res.ok) throw new Error("Update failed");

        toast.success("Subject updated successfully");
      } else {
        // ✅ CREATE (POST)
        const res = await fetch(`${API_BASE}/api/subjects/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (!res.ok) throw new Error("Create failed");

        toast.success("Subject added successfully");
      }

      onClose();
    } catch (err) {
      toast.error("Failed to save subject");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Subject Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Data Structures"
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">Subject Code</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="e.g., CS 201"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex gap-2 flex-wrap">
          {SUBJECT_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                formData.color === color ? 'border-foreground scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setFormData({ ...formData, color })}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="instructor">Instructor</Label>
          <Input
            id="instructor"
            value={formData.instructor}
            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
            placeholder="e.g., Dr. Smith"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="schedule">Class Schedule</Label>
          <Input
            id="schedule"
            value={formData.schedule}
            onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
            placeholder="e.g., Mon/Wed 10:00 AM"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Add any additional notes..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {subject ? 'Update' : 'Add'} Subject
        </Button>
      </div>
    </form>
  );
};

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { addSubject, updateSubject } from '@/lib/storage';
import { Subject, SUBJECT_COLORS } from '@/lib/mockData';
import { toast } from 'sonner';

interface SubjectFormProps {
  subject?: Subject | null;
  onClose: () => void;
}

export const SubjectForm = ({ subject, onClose }: SubjectFormProps) => {
  const [formData, setFormData] = useState({
    name: subject?.name || '',
    code: subject?.code || '',
    color: subject?.color || SUBJECT_COLORS[0],
    semester: subject?.semester || '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    if (subject) {
      updateSubject(subject.id, formData);
      toast.success('Subject updated successfully');
    } else {
      addSubject(formData);
      toast.success('Subject added successfully');
    }

    onClose();
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
          <Label htmlFor="semester">Semester/Term</Label>
          <Input
            id="semester"
            value={formData.semester}
            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
            placeholder="e.g., Fall 2024"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instructor">Instructor</Label>
          <Input
            id="instructor"
            value={formData.instructor}
            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
            placeholder="e.g., Dr. Smith"
          />
        </div>
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

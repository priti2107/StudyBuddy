import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { addTask, updateTask, getSubjects } from '@/lib/storage';
import { Task } from '@/lib/mockData';
import { toast } from 'sonner';

interface TaskFormProps {
  task?: Task | null;
  onClose: () => void;
}

export const TaskForm = ({ task, onClose }: TaskFormProps) => {
  const subjects = getSubjects();
  const [formData, setFormData] = useState({
    subjectId: task?.subjectId || subjects[0]?.id || 0,
    title: task?.title || '',
    description: task?.description || '',
    deadline: task?.deadline?.slice(0, 16) || '',
    priority: task?.priority || 'medium',
    status: task?.status || 'todo',
    estimatedTime: task?.estimatedTime || 1,
    actualTime: task?.actualTime || 0,
    tags: task?.tags?.join(', ') || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    }

    if (!formData.subjectId) {
      newErrors.subjectId = 'Please select a subject';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const taskData = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    if (task) {
      updateTask(task.id, taskData);
      toast.success('Task updated successfully');
    } else {
      addTask(taskData);
      toast.success('Task added successfully');
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Complete Binary Tree Assignment"
          className={errors.title ? 'border-destructive' : ''}
        />
        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Add details about the task..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="subject">Subject *</Label>
          <Select
            value={formData.subjectId.toString()}
            onValueChange={(value) => setFormData({ ...formData, subjectId: parseInt(value) })}
          >
            <SelectTrigger className={errors.subjectId ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map(subject => (
                <SelectItem key={subject.id} value={subject.id.toString()}>
                  {subject.name} ({subject.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.subjectId && <p className="text-sm text-destructive">{errors.subjectId}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="deadline">Deadline *</Label>
          <Input
            id="deadline"
            type="datetime-local"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            className={errors.deadline ? 'border-destructive' : ''}
          />
          {errors.deadline && <p className="text-sm text-destructive">{errors.deadline}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: any) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="estimatedTime">Estimated Time (hours)</Label>
          <Input
            id="estimatedTime"
            type="number"
            min="0"
            step="0.5"
            value={formData.estimatedTime}
            onChange={(e) => setFormData({ ...formData, estimatedTime: parseFloat(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="actualTime">Actual Time (hours)</Label>
          <Input
            id="actualTime"
            type="number"
            min="0"
            step="0.5"
            value={formData.actualTime}
            onChange={(e) => setFormData({ ...formData, actualTime: parseFloat(e.target.value) })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="e.g., assignment, coding, urgent"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {task ? 'Update' : 'Add'} Task
        </Button>
      </div>
    </form>
  );
};

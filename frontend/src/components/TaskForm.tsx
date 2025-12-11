import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchSubjects, createTaskAPI, updateTaskAPI } from "@/lib/api";
import { toast } from "sonner";

interface TaskFormProps {
  task?: any;
  onClose: () => void;
}

export const TaskForm = ({ task, onClose }: TaskFormProps) => {
  const [subjects, setSubjects] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    deadline: task?.deadline?.slice(0, 16) || "",
    subject: task?.subject || "",
    priority: task?.priority || "medium",
    status: task?.status || "todo",
    estimatedTime: task?.estimatedTime || 1,
    actualTime: task?.actualTime || 0,
    tags: task?.tags?.join(", ") || "",
  });

  useEffect(() => {
    fetchSubjects().then(setSubjects);
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      description: formData.description,
      deadline: formData.deadline,
      priority: formData.priority,
      status: formData.status,
      subject: formData.subject,
    };

    try {
      if (task) {
        await updateTaskAPI(task.id, payload);
        toast.success("Task updated");
      } else {
        await createTaskAPI(payload);
        toast.success("Task added");
      }
      onClose();
    } catch (err) {
      toast.error("Failed to save task");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* TITLE */}
      <div className="space-y-2">
        <Label>Title *</Label>
        <Input
          placeholder="e.g., Complete Binary Tree Assignment"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          placeholder="Add details about the task..."
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      {/* SUBJECT + DEADLINE */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Subject *</Label>
          <Select
            value={formData.subject?.toString()}
            onValueChange={(v) =>
              setFormData({ ...formData, subject: parseInt(v) })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((s) => (
                <SelectItem key={s.id} value={s.id.toString()}>
                  {s.name} ({s.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Deadline *</Label>
          <Input
            type="datetime-local"
            value={formData.deadline}
            onChange={(e) =>
              setFormData({ ...formData, deadline: e.target.value })
            }
          />
        </div>
      </div>

      {/* PRIORITY + STATUS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(v) =>
              setFormData({ ...formData, priority: v })
            }
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
          <Label>Status</Label>
          <Select
            value={formData.status}
            onValueChange={(v) =>
              setFormData({ ...formData, status: v })
            }
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

      {/* TIME FIELDS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Estimated Time (hours)</Label>
          <Input
            type="number"
            min="0"
            step="0.5"
            value={formData.estimatedTime}
            onChange={(e) =>
              setFormData({
                ...formData,
                estimatedTime: parseFloat(e.target.value),
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Actual Time (hours)</Label>
          <Input
            type="number"
            min="0"
            step="0.5"
            value={formData.actualTime}
            onChange={(e) =>
              setFormData({
                ...formData,
                actualTime: parseFloat(e.target.value),
              })
            }
          />
        </div>
      </div>

      {/* TAGS */}
      <div className="space-y-2">
        <Label>Tags (comma-separated)</Label>
        <Input
          placeholder="e.g., assignment, coding, urgent"
          value={formData.tags}
          onChange={(e) =>
            setFormData({ ...formData, tags: e.target.value })
          }
        />
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">{task ? "Update Task" : "Add Task"}</Button>
      </div>
    </form>
  );
};

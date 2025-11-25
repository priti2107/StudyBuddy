import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Trash2, CheckCircle2, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { Task, Subject } from '@/lib/mockData';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';
import { format } from 'date-fns';
import { getResources } from '@/lib/storage';
import { ResourceList } from './ResourceList';

interface TaskDetailDialogProps {
  task: Task;
  subject?: Subject;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (taskId: number, status: Task['status']) => void;
}

export const TaskDetailDialog = ({
  task,
  subject,
  open,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskDetailDialogProps) => {
  const resources = getResources().filter(r => r.taskId === task.id);
  const isCompleted = task.status === 'completed';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between pr-8">
            <span>{task.title}</span>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" onClick={onEdit}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Priority */}
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            {subject && (
              <Badge
                variant="outline"
                style={{ borderColor: subject.color, color: subject.color }}
              >
                {subject.name}
              </Badge>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{task.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Task Details */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Deadline:</span>
                <span className="text-sm">
                  {format(new Date(task.deadline), 'PPP p')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Estimated Time:</span>
                <span className="text-sm">{task.estimatedTime} hours</span>
              </div>

              {task.actualTime > 0 && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Actual Time:</span>
                  <span className="text-sm">{task.actualTime} hours</span>
                </div>
              )}

              {task.tags.length > 0 && (
                <div className="flex items-start gap-2">
                  <span className="text-sm font-medium">Tags:</span>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Resources</h3>
              <ResourceList taskId={task.id} resources={resources} />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              className="flex-1"
              variant={isCompleted ? 'outline' : 'default'}
              onClick={() => onStatusChange(task.id, isCompleted ? 'todo' : 'completed')}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

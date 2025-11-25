import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Clock } from 'lucide-react';
import { Task, Subject } from '@/lib/mockData';
import { PriorityBadge } from './PriorityBadge';
import { formatDistanceToNow } from 'date-fns';

interface TaskCardProps {
  task: Task;
  subject?: Subject;
  onStatusChange: (taskId: number, status: Task['status']) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onClick: () => void;
}

export const TaskCard = ({ task, subject, onStatusChange, onEdit, onDelete, onClick }: TaskCardProps) => {
  const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'completed';
  
  const handleCheckboxChange = (checked: boolean) => {
    onStatusChange(task.id, checked ? 'completed' : 'todo');
  };

  return (
    <Card
      className="hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.status === 'completed'}
            onCheckedChange={handleCheckboxChange}
            onClick={(e) => e.stopPropagation()}
            className="mt-1"
          />
          
          <div className="flex-1 min-w-0">
            <h4 className={`font-medium mb-2 ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h4>
            
            <div className="flex flex-wrap items-center gap-2 text-sm mb-2">
              {subject && (
                <Badge
                  variant="outline"
                  style={{ borderColor: subject.color, color: subject.color }}
                >
                  {subject.code}
                </Badge>
              )}
              <PriorityBadge priority={task.priority} />
              <div className={`flex items-center gap-1 ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
                <Clock className="h-3 w-3" />
                <span>
                  {isOverdue ? 'Overdue' : formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onEdit(task)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

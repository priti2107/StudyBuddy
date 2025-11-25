import { Badge } from '@/components/ui/badge';
import { Circle, Clock, CheckCircle2 } from 'lucide-react';

interface StatusBadgeProps {
  status: 'todo' | 'in-progress' | 'completed';
}

const statusConfig = {
  'todo': {
    label: 'To Do',
    icon: Circle,
    className: 'bg-muted text-muted-foreground',
  },
  'in-progress': {
    label: 'In Progress',
    icon: Clock,
    className: 'bg-primary/10 text-primary',
  },
  'completed': {
    label: 'Completed',
    icon: CheckCircle2,
    className: 'bg-success/10 text-success',
  },
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <Badge variant="outline" className={config.className}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
};

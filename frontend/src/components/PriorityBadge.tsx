import { Badge } from '@/components/ui/badge';
import { Flag } from 'lucide-react';

interface PriorityBadgeProps {
  priority: 'high' | 'medium' | 'low';
}

const priorityConfig = {
  high: {
    label: 'High',
    className: 'bg-destructive/10 text-destructive hover:bg-destructive/20',
  },
  medium: {
    label: 'Medium',
    className: 'bg-secondary/10 text-secondary hover:bg-secondary/20',
  },
  low: {
    label: 'Low',
    className: 'bg-success/10 text-success hover:bg-success/20',
  },
};

export const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const config = priorityConfig[priority];
  
  return (
    <Badge variant="outline" className={config.className}>
      <Flag className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
};

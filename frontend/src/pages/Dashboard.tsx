import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, CheckSquare, Clock, Flame, Plus } from 'lucide-react';
import { getTasks, getSubjects } from '@/lib/storage';
import { Task, Subject } from '@/lib/mockData';
import { formatDistanceToNow } from 'date-fns';
import { PriorityBadge } from '@/components/PriorityBadge';
import { StatusBadge } from '@/components/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    setTasks(getTasks());
    setSubjects(getSubjects());
  }, []);

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status !== 'completed').length;

  const todayTasks = tasks.filter(t => {
    const deadline = new Date(t.deadline);
    const today = new Date();
    return deadline.toDateString() === today.toDateString() && t.status !== 'completed';
  });

  const upcomingTasks = tasks
    .filter(t => {
      const deadline = new Date(t.deadline);
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return deadline > today && deadline <= nextWeek && t.status !== 'completed';
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5);

  const getSubjectById = (id: number) => subjects.find(s => s.id === id);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
        <p className="text-muted-foreground">Here's what's happening with your studies today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Subjects"
          value={subjects.length}
          icon={BookOpen}
          iconColor="text-primary"
        />
        <StatCard
          title="Pending Tasks"
          value={pendingTasks}
          icon={Clock}
          iconColor="text-secondary"
        />
        <StatCard
          title="Completed Tasks"
          value={completedTasks}
          icon={CheckSquare}
          iconColor="text-success"
        />
        <StatCard
          title="Study Streak"
          value="7 days"
          icon={Flame}
          iconColor="text-destructive"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Today's Tasks</CardTitle>
              <Button size="sm" variant="ghost" onClick={() => navigate('/tasks')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {todayTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No tasks due today! 🎉</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayTasks.map(task => {
                  const subject = getSubjectById(task.subjectId);
                  return (
                    <div
                      key={task.id}
                      className="p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => navigate('/tasks')}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{task.title}</h4>
                        <PriorityBadge priority={task.priority} />
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {subject && (
                          <Badge
                            variant="outline"
                            style={{ borderColor: subject.color, color: subject.color }}
                          >
                            {subject.code}
                          </Badge>
                        )}
                        <span className="text-muted-foreground">
                          Due {formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Deadlines</CardTitle>
              <Button size="sm" variant="ghost" onClick={() => navigate('/calendar')}>
                View Calendar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No upcoming deadlines this week</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map(task => {
                  const subject = getSubjectById(task.subjectId);
                  return (
                    <div
                      key={task.id}
                      className="p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => navigate('/tasks')}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{task.title}</h4>
                        <StatusBadge status={task.status} />
                      </div>
                      <div className="flex items-center gap-2 text-sm flex-wrap">
                        {subject && (
                          <Badge
                            variant="outline"
                            style={{ borderColor: subject.color, color: subject.color }}
                          >
                            {subject.code}
                          </Badge>
                        )}
                        <span className="text-muted-foreground">
                          {formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Button */}
      <Button
        size="lg"
        className="fixed bottom-6 right-6 rounded-full shadow-glow"
        onClick={() => navigate('/tasks')}
      >
        <Plus className="h-5 w-5 mr-2" />
        Add Task
      </Button>
    </div>
  );
};

export default Dashboard;

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckSquare, Clock, Flame, Plus } from "lucide-react";
import { fetchTasks, fetchSubjects } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { PriorityBadge } from "@/components/PriorityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

/* MATCH Backend Types */
interface Subject {
  id: number;
  name: string;
  code: string;
  color: string;
  semester: string;
  instructor: string;
  schedule: string;
}

interface Task {
  id: number;
  subjectId: number;
  title: string;
  description: string;
  deadline: string;
  priority: "high" | "medium" | "low";
  status: "todo" | "in-progress" | "completed";
}

interface BackendTask {
  id: number;
  subject: number;
  title: string;
  description: string;
  deadline: string;
  priority: "high" | "medium" | "low";
  status: "todo" | "in-progress" | "completed";
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  /* Load everything from backend */
  const loadData = async () => {
    try {
      const rawTasks: BackendTask[] = await fetchTasks();
      const subjectData: Subject[] = await fetchSubjects();

      const convertedTasks: Task[] = rawTasks.map((t) => ({
        id: t.id,
        subjectId: t.subject,
        title: t.title,
        description: t.description,
        deadline: t.deadline,
        priority: t.priority,
        status: t.status,
      }));

      setTasks(convertedTasks);
      setSubjects(subjectData);
    } catch (err) {
      console.error("Dashboard load error:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* Stats */
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const pendingTasks = tasks.filter((t) => t.status !== "completed").length;

  const getSubject = (id: number) => subjects.find((s) => s.id === id);

  const todayTasks = tasks.filter((t) => {
    const deadline = new Date(t.deadline);
    const today = new Date();
    return deadline.toDateString() === today.toDateString() && t.status !== "completed";
  });

  const upcomingTasks = tasks
    .filter((t) => {
      const d = new Date(t.deadline);
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return d > today && d <= nextWeek && t.status !== "completed";
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
        <p className="text-muted-foreground">Here’s your study overview for today</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Subjects" value={subjects.length} icon={BookOpen} />

        <StatCard title="Pending Tasks" value={pendingTasks} icon={Clock} />

        <StatCard title="Completed Tasks" value={completedTasks} icon={CheckSquare} />

        <StatCard title="Study Streak" value="7 days" icon={Flame} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Today's Tasks</CardTitle>
              <Button size="sm" variant="ghost" onClick={() => navigate("/tasks")}>
                View All
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {todayTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No tasks due today 🎉</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayTasks.map((task) => {
                  const subject = getSubject(task.subjectId);
                  return (
                    <div
                      key={task.id}
                      className="p-3 border rounded-lg hover:bg-accent/50 cursor-pointer"
                      onClick={() => navigate("/tasks")}
                    >
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">{task.title}</h4>
                        <PriorityBadge priority={task.priority} />
                      </div>

                      <div className="flex gap-2 items-center text-sm">
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
            <div className="flex justify-between items-center">
              <CardTitle>Upcoming Deadlines</CardTitle>
              <Button size="sm" variant="ghost" onClick={() => navigate("/calendar")}>
                View Calendar
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {upcomingTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No upcoming deadlines</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task) => {
                  const subject = getSubject(task.subjectId);
                  return (
                    <div
                      key={task.id}
                      className="p-3 border rounded-lg hover:bg-accent/50 cursor-pointer"
                      onClick={() => navigate("/tasks")}
                    >
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">{task.title}</h4>
                        <StatusBadge status={task.status} />
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

      {/* Quick Action */}
      <Button
        size="lg"
        className="fixed bottom-6 right-6 rounded-full shadow-lg"
        onClick={() => navigate("/tasks")}
      >
        <Plus className="h-5 w-5 mr-2" />
        Add Task
      </Button>
    </div>
  );
};

export default Dashboard;

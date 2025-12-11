import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, ListFilter } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { TaskCard } from "@/components/TaskCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TaskForm } from "@/components/TaskForm";
import { TaskDetailDialog } from "@/components/TaskDetailDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Confetti from "react-confetti";

import {
  fetchTasks,
  fetchSubjects,
  deleteTaskAPI,
  updateTaskStatusAPI,
} from "@/lib/api";

/* ✅ SUBJECT TYPE — MUST MATCH TaskCard & TaskDetailDialog */
interface Subject {
  id: number;
  name: string;
  code: string;
  color: string;
  semester: string;
  instructor: string;
  schedule: string;
}

/* ✅ UI TASK TYPE */
interface Task {
  id: number;
  subjectId: number;
  title: string;
  description: string;
  deadline: string;
  priority: "high" | "medium" | "low";
  status: "todo" | "in-progress" | "completed";
  estimatedTime: number;
  actualTime: number;
  tags: string[];
  createdAt: string;
}

/* ✅ BACKEND RAW TASK FORMAT */
interface BackendTask {
  id: number;
  subject: number;
  title: string;
  description: string;
  deadline: string;
  priority: "high" | "medium" | "low";
  status: "todo" | "in-progress" | "completed";
}

const Tasks = () => {
  const location = useLocation();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  const [showDialog, setShowDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [showConfetti, setShowConfetti] = useState(false);

  /* ✅ LOAD DATA FROM BACKEND */
  const loadData = async () => {
    try {
      const rawTasks: BackendTask[] = await fetchTasks();
      const subjectData: Subject[] = await fetchSubjects();

      const convertedTasks: Task[] = rawTasks.map((task) => ({
        id: task.id,
        subjectId: task.subject,
        title: task.title,
        description: task.description,
        deadline: task.deadline,
        priority: task.priority,
        status: task.status,
        estimatedTime: 1,
        actualTime: 0,
        tags: [],
        createdAt: new Date().toISOString(),
      }));

      setTasks(convertedTasks);
      setSubjects(subjectData);

      if (location.state?.subjectId) {
        setSubjectFilter(location.state.subjectId.toString());
      }
    } catch {
      toast.error("Failed to load tasks");
    }
  };

  useEffect(() => {
    loadData();
  }, [location]);

  /* ✅ FILTER LOGIC */
  useEffect(() => {
    let filtered = tasks;

    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (subjectFilter !== "all") {
      filtered = filtered.filter(
        (t) => t.subjectId === parseInt(subjectFilter)
      );
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((t) => t.priority === priorityFilter);
    }

    setFilteredTasks(filtered);
  }, [tasks, searchQuery, subjectFilter, priorityFilter]);

  /* ✅ STATUS CHANGE */
  const handleStatusChange = async (
    taskId: number,
    newStatus: Task["status"]
  ) => {
    const task = tasks.find((t) => t.id === taskId);

    if (task && task.status !== "completed" && newStatus === "completed") {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      toast.success("Task completed! 🎉");
    }

    await updateTaskStatusAPI(taskId, newStatus);
    loadData();
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowDialog(true);
  };

  const handleDelete = async (taskId: number) => {
    await deleteTaskAPI(taskId);
    toast.success("Task deleted");
    loadData();
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setEditingTask(null);
    loadData();
  };

  const todoTasks = filteredTasks.filter((t) => t.status === "todo");
  const inProgressTasks = filteredTasks.filter((t) => t.status === "in-progress");
  const completedTasks = filteredTasks.filter((t) => t.status === "completed");

  return (
    <>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

      <div className="space-y-6 animate-fade-in">
        {/* ✅ HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tasks</h1>
            <p className="text-muted-foreground">
              Manage your assignments and deadlines
            </p>
          </div>
          <Button onClick={() => setShowDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* ✅ FILTERS */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <ListFilter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id.toString()}>
                  {subject.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ✅ KANBAN VIEW */}
        <Tabs defaultValue="kanban">
          <TabsList>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>

          <TabsContent value="kanban" className="mt-6">
            <div className="grid md:grid-cols-3 gap-6">
              {tasks.length === 0 ? (
                <div className="col-span-3">
                  <EmptyState
                    icon={Plus}
                    title="No tasks yet"
                    description="Add your first task to get started"
                    actionLabel="Add Task"
                    onAction={() => setShowDialog(true)}
                  />
                </div>
              ) : (
                <>
                  {[todoTasks, inProgressTasks, completedTasks].map((group, i) => (
                    <div key={i} className="space-y-3">
                      {group.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          subject={subjects.find((s) => s.id === task.subjectId)}
                          onStatusChange={handleStatusChange}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onClick={() => setDetailTask(task)}
                        />
                      ))}
                    </div>
                  ))}
                </>
              )}
            </div>
          </TabsContent>

          {/* ✅ LIST VIEW */}
          <TabsContent value="list" className="mt-6">
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  subject={subjects.find((s) => s.id === task.subjectId)}
                  onStatusChange={handleStatusChange}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onClick={() => setDetailTask(task)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* ✅ TASK FORM */}
        <Dialog open={showDialog} onOpenChange={handleDialogClose}>
          <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-xl p-8">
            <DialogHeader>
              <DialogTitle>
                {editingTask ? "Edit Task" : "Add New Task"}
              </DialogTitle>
            </DialogHeader>
            <TaskForm task={editingTask} onClose={handleDialogClose} />
          </DialogContent>
        </Dialog>

        {/* ✅ TASK DETAIL */}
        {detailTask && (
          <TaskDetailDialog
            task={detailTask}
            subject={subjects.find((s) => s.id === detailTask.subjectId)}
            open={!!detailTask}
            onClose={() => setDetailTask(null)}
            onEdit={() => handleEdit(detailTask)}
            onDelete={() => handleDelete(detailTask.id)}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </>
  );
};

export default Tasks;

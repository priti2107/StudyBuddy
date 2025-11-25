import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, ListFilter } from 'lucide-react';
import { getTasks, getSubjects, updateTask, deleteTask } from '@/lib/storage';
import { Task, Subject } from '@/lib/mockData';
import { EmptyState } from '@/components/EmptyState';
import { TaskCard } from '@/components/TaskCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TaskForm } from '@/components/TaskForm';
import { TaskDetailDialog } from '@/components/TaskDetailDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Confetti from 'react-confetti';

const Tasks = () => {
  const location = useLocation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showConfetti, setShowConfetti] = useState(false);

  const loadData = () => {
    setTasks(getTasks());
    setSubjects(getSubjects());
  };

  useEffect(() => {
    loadData();
    
    // Check if we came from subjects page with a filter
    if (location.state?.subjectId) {
      setSubjectFilter(location.state.subjectId.toString());
    }
  }, [location]);

  useEffect(() => {
    let filtered = tasks;

    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (subjectFilter !== 'all') {
      filtered = filtered.filter(t => t.subjectId === parseInt(subjectFilter));
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(t => t.priority === priorityFilter);
    }

    setFilteredTasks(filtered);
  }, [tasks, searchQuery, subjectFilter, priorityFilter]);

  const handleStatusChange = (taskId: number, newStatus: Task['status']) => {
    const task = tasks.find(t => t.id === taskId);
    
    if (task && task.status !== 'completed' && newStatus === 'completed') {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      toast.success('Task completed! 🎉');
    }
    
    updateTask(taskId, { status: newStatus });
    loadData();
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowDialog(true);
  };

  const handleDelete = (taskId: number) => {
    deleteTask(taskId);
    toast.success('Task deleted successfully');
    loadData();
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setEditingTask(null);
    loadData();
  };

  const todoTasks = filteredTasks.filter(t => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in-progress');
  const completedTasks = filteredTasks.filter(t => t.status === 'completed');

  return (
    <>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tasks</h1>
            <p className="text-muted-foreground">Manage your assignments and deadlines</p>
          </div>
          <Button onClick={() => setShowDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Filters */}
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
              {subjects.map(subject => (
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

        {/* Task Views */}
        <Tabs defaultValue="kanban" className="w-full">
          <TabsList>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>

          <TabsContent value="kanban" className="mt-6">
            {filteredTasks.length === 0 ? (
              <EmptyState
                icon={Plus}
                title="No tasks found"
                description="Create your first task to get started"
                actionLabel="Add Task"
                onAction={() => setShowDialog(true)}
              />
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">To Do</h3>
                    <span className="text-sm text-muted-foreground">{todoTasks.length}</span>
                  </div>
                  <div className="space-y-3">
                    {todoTasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        subject={subjects.find(s => s.id === task.subjectId)}
                        onStatusChange={handleStatusChange}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onClick={() => setDetailTask(task)}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">In Progress</h3>
                    <span className="text-sm text-muted-foreground">{inProgressTasks.length}</span>
                  </div>
                  <div className="space-y-3">
                    {inProgressTasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        subject={subjects.find(s => s.id === task.subjectId)}
                        onStatusChange={handleStatusChange}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onClick={() => setDetailTask(task)}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Completed</h3>
                    <span className="text-sm text-muted-foreground">{completedTasks.length}</span>
                  </div>
                  <div className="space-y-3">
                    {completedTasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        subject={subjects.find(s => s.id === task.subjectId)}
                        onStatusChange={handleStatusChange}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onClick={() => setDetailTask(task)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            {filteredTasks.length === 0 ? (
              <EmptyState
                icon={Plus}
                title="No tasks found"
                description="Create your first task to get started"
                actionLabel="Add Task"
                onAction={() => setShowDialog(true)}
              />
            ) : (
              <div className="space-y-3">
                {filteredTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    subject={subjects.find(s => s.id === task.subjectId)}
                    onStatusChange={handleStatusChange}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onClick={() => setDetailTask(task)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={showDialog} onOpenChange={handleDialogClose}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
            </DialogHeader>
            <TaskForm task={editingTask} onClose={handleDialogClose} />
          </DialogContent>
        </Dialog>

        {detailTask && (
          <TaskDetailDialog
            task={detailTask}
            subject={subjects.find(s => s.id === detailTask.subjectId)}
            open={!!detailTask}
            onClose={() => setDetailTask(null)}
            onEdit={() => {
              handleEdit(detailTask);
              setDetailTask(null);
            }}
            onDelete={() => {
              handleDelete(detailTask.id);
              setDetailTask(null);
            }}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </>
  );
};

export default Tasks;

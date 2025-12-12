import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchTasks, fetchSubjects } from "@/lib/api";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { PriorityBadge } from "@/components/PriorityBadge";
import { toast } from "sonner";

interface Subject {
  id: number;
  name: string;
  code: string;
  color: string;
}

interface BackendTask {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  subject: number; // backend uses "subject"
  deadline: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  subjectId: number; // Calendar needs subjectId
  deadline: string;
}

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  /* LOAD BACKEND DATA */
  const loadData = async () => {
    try {
      const rawTasks: BackendTask[] = await fetchTasks();
      const subjectsData: Subject[] = await fetchSubjects();

      const convertedTasks: Task[] = rawTasks.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        priority: t.priority?.toLowerCase() as "high" | "medium" | "low",
        status: t.status?.toLowerCase() as "todo" | "in-progress" | "completed",
        subjectId: t.subject,
        deadline: t.deadline,
      }));

      setTasks(convertedTasks);
      setSubjects(subjectsData);
    } catch (err) {
      toast.error("Failed to load calendar data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* DATE VARIABLES */
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  /* TASKS FOR A SPECIFIC DATE */
  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      const day = format(date, "yyyy-MM-dd");
      const taskDay = task.deadline.split("T")[0];
      return day === taskDay;
    });
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getSubjectById = (id: number) => subjects.find((s) => s.id === id);

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Calendar</h1>
        <p className="text-muted-foreground">View all your deadlines at a glance</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* CALENDAR */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{format(currentMonth, "MMMM yyyy")}</CardTitle>

              <div className="flex gap-2">
                <Button size="icon" variant="outline" onClick={previousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setCurrentMonth(new Date());
                    setSelectedDate(new Date());
                  }}
                >
                  Today
                </Button>

                <Button size="icon" variant="outline" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* WEEKDAY HEADERS */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            {/* DAYS GRID */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, idx) => {
                const dayTasks = getTasksForDate(day);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isToday = isSameDay(day, new Date());
                const isSelected = selectedDate && isSameDay(day, selectedDate);

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      min-h-[80px] p-2 rounded-lg border text-left transition-all
                      ${!isCurrentMonth ? "text-muted-foreground bg-muted/20" : "hover:bg-accent"}
                      ${isToday ? "border-primary border-2" : ""}
                      ${isSelected ? "bg-accent ring-2 ring-primary" : ""}
                    `}
                  >
                    <div className="text-sm font-medium mb-1">{format(day, "d")}</div>

                    <div className="space-y-1">
                      {dayTasks.slice(0, 2).map((task) => {
                        const subject = getSubjectById(task.subjectId);

                        return (
                          <div
                            key={task.id}
                            className="text-xs p-1 rounded truncate"
                            style={{
                              backgroundColor: subject ? `${subject.color}20` : "#eee",
                              borderLeft: `2px solid ${subject?.color || "#ccc"}`,
                            }}
                          >
                            {task.title}
                          </div>
                        );
                      })}

                      {dayTasks.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayTasks.length - 2} more
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* RIGHT SIDE TASK LIST */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {selectedDate ? format(selectedDate, "MMM d, yyyy") : "Select a date"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {selectedDate ? (
              selectedDateTasks.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateTasks.map((task) => {
                    const subject = getSubjectById(task.subjectId);

                    return (
                      <Card key={task.id} className="hover:bg-accent/50 transition-colors">
                        <CardContent className="p-3">
                          <h4 className="font-medium mb-2">{task.title}</h4>

                          <div className="flex flex-wrap items-center gap-2">
                            {subject && (
                              <Badge
                                variant="outline"
                                style={{ borderColor: subject.color, color: subject.color }}
                              >
                                {subject.code}
                              </Badge>
                            )}

                           <PriorityBadge priority={task.priority.toLowerCase() as "high" | "medium" | "low"} />
                          </div>

                          <p className="text-sm text-muted-foreground mt-2">
                            Due at {format(new Date(task.deadline), "p")}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No tasks on this date</p>
                </div>
              )
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Click any date to see tasks
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* SUBJECT LEGEND */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Colors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {subjects.map((subject) => (
              <div key={subject.id} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: subject.color }}
                />
                <span className="text-sm">{subject.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;

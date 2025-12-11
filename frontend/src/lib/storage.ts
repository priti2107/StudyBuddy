import {
  Subject,
  Task,
  Resource,
  INITIAL_SUBJECTS,
  INITIAL_TASKS,
  INITIAL_RESOURCES,
} from "./mockData";

const SUBJECTS_KEY = "studybuddy_subjects";
const TASKS_KEY = "studybuddy_tasks";
const RESOURCES_KEY = "studybuddy_resources";

// ✅ INITIALIZE WITH MOCK DATA (VERY IMPORTANT)
export const initializeStorage = () => {
  if (!localStorage.getItem(SUBJECTS_KEY)) {
    localStorage.setItem(SUBJECTS_KEY, JSON.stringify(INITIAL_SUBJECTS));
  }

  if (!localStorage.getItem(TASKS_KEY)) {
    localStorage.setItem(TASKS_KEY, JSON.stringify(INITIAL_TASKS));
  }

  if (!localStorage.getItem(RESOURCES_KEY)) {
    localStorage.setItem(RESOURCES_KEY, JSON.stringify(INITIAL_RESOURCES));
  }
};

/* ================= SUBJECTS ================= */

export const getSubjects = (): Subject[] => {
  const data = localStorage.getItem(SUBJECTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveSubjects = (subjects: Subject[]) => {
  localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
};

export const addSubject = (subject: Omit<Subject, "id">): Subject => {
  const subjects = getSubjects();
  const newSubject: Subject = { ...subject, id: Date.now() };
  subjects.push(newSubject);
  saveSubjects(subjects);
  return newSubject;
};

export const updateSubject = (id: number, updates: Partial<Subject>) => {
  const subjects = getSubjects().map((s) =>
    s.id === id ? { ...s, ...updates } : s
  );
  saveSubjects(subjects);
};

export const deleteSubject = (id: number) => {
  const subjects = getSubjects().filter((s) => s.id !== id);
  saveSubjects(subjects);

  const tasks = getTasks().filter((t) => t.subjectId !== id);
  saveTasks(tasks);
};

/* ================= TASKS ================= */

export const getTasks = (): Task[] => {
  const data = localStorage.getItem(TASKS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const addTask = (task: Omit<Task, "id" | "createdAt">): Task => {
  const tasks = getTasks();

  const newTask: Task = {
    ...task,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
};

export const updateTask = (id: number, updates: Partial<Task>) => {
  const tasks = getTasks().map((t) =>
    t.id === id ? { ...t, ...updates } : t
  );
  saveTasks(tasks);
};

export const deleteTask = (id: number) => {
  const tasks = getTasks().filter((t) => t.id !== id);
  saveTasks(tasks);

  const resources = getResources().filter((r) => r.taskId !== id);
  saveResources(resources);
};

/* ================= RESOURCES ================= */

export const getResources = (): Resource[] => {
  const data = localStorage.getItem(RESOURCES_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveResources = (resources: Resource[]) => {
  localStorage.setItem(RESOURCES_KEY, JSON.stringify(resources));
};

export const addResource = (
  resource: Omit<Resource, "id" | "addedAt">
): Resource => {
  const resources = getResources();

  const newResource: Resource = {
    ...resource,
    id: Date.now(),
    addedAt: new Date().toISOString(),
  };

  resources.push(newResource);
  saveResources(resources);
  return newResource;
};

export const deleteResource = (id: number) => {
  const resources = getResources().filter((r) => r.id !== id);
  saveResources(resources);
};

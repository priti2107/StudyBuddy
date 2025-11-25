export interface Subject {
  id: number;
  name: string;
  code: string;
  color: string;
  semester: string;
  instructor: string;
  schedule: string;
  notes?: string;
}

export interface Task {
  id: number;
  subjectId: number;
  title: string;
  description: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in-progress' | 'completed';
  estimatedTime: number;
  actualTime: number;
  tags: string[];
  createdAt: string;
}

export interface Resource {
  id: number;
  taskId: number;
  type: 'video' | 'pdf' | 'link' | 'notes';
  title: string;
  url: string;
  addedAt: string;
}

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 1,
    name: 'Data Structures',
    code: 'CS 201',
    color: '#3B82F6',
    semester: 'Fall 2024',
    instructor: 'Dr. Smith',
    schedule: 'Mon/Wed 10:00 AM',
  },
  {
    id: 2,
    name: 'Web Development',
    code: 'CS 350',
    color: '#8B5CF6',
    semester: 'Fall 2024',
    instructor: 'Prof. Johnson',
    schedule: 'Tue/Thu 2:00 PM',
  },
  {
    id: 3,
    name: 'Database Systems',
    code: 'CS 305',
    color: '#10B981',
    semester: 'Fall 2024',
    instructor: 'Dr. Williams',
    schedule: 'Mon/Wed 1:00 PM',
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    subjectId: 1,
    title: 'Complete Binary Tree Assignment',
    description: 'Implement AVL tree with rotation methods and balance factor calculation',
    deadline: '2024-12-15T23:59',
    priority: 'high',
    status: 'in-progress',
    estimatedTime: 3,
    actualTime: 0,
    tags: ['assignment', 'coding'],
    createdAt: '2024-11-20',
  },
  {
    id: 2,
    subjectId: 2,
    title: 'Build Portfolio Website',
    description: 'Create a responsive portfolio website using React and Tailwind CSS',
    deadline: '2024-12-20T23:59',
    priority: 'medium',
    status: 'todo',
    estimatedTime: 5,
    actualTime: 0,
    tags: ['project', 'web'],
    createdAt: '2024-11-21',
  },
  {
    id: 3,
    subjectId: 3,
    title: 'Database Design Document',
    description: 'Design ER diagram and normalization for library management system',
    deadline: '2024-12-10T23:59',
    priority: 'high',
    status: 'todo',
    estimatedTime: 2,
    actualTime: 0,
    tags: ['assignment', 'design'],
    createdAt: '2024-11-19',
  },
  {
    id: 4,
    subjectId: 1,
    title: 'Study for Midterm',
    description: 'Review chapters 1-5, practice problems, and previous assignments',
    deadline: '2024-12-05T09:00',
    priority: 'high',
    status: 'in-progress',
    estimatedTime: 8,
    actualTime: 3,
    tags: ['exam', 'review'],
    createdAt: '2024-11-18',
  },
  {
    id: 5,
    subjectId: 2,
    title: 'JavaScript Tutorial Videos',
    description: 'Watch and complete exercises for async/await and promises',
    deadline: '2024-12-08T23:59',
    priority: 'low',
    status: 'completed',
    estimatedTime: 2,
    actualTime: 2,
    tags: ['learning', 'video'],
    createdAt: '2024-11-15',
  },
  {
    id: 6,
    subjectId: 3,
    title: 'SQL Query Practice',
    description: 'Complete 20 SQL practice problems on joins and subqueries',
    deadline: '2024-12-12T23:59',
    priority: 'medium',
    status: 'todo',
    estimatedTime: 3,
    actualTime: 0,
    tags: ['practice', 'sql'],
    createdAt: '2024-11-22',
  },
];

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: 1,
    taskId: 1,
    type: 'video',
    title: 'AVL Tree Tutorial',
    url: 'https://youtube.com/watch?v=example',
    addedAt: '2024-11-20',
  },
  {
    id: 2,
    taskId: 1,
    type: 'pdf',
    title: 'AVL Tree Reference Guide',
    url: 'https://example.com/avl-guide.pdf',
    addedAt: '2024-11-20',
  },
  {
    id: 3,
    taskId: 2,
    type: 'link',
    title: 'React Documentation',
    url: 'https://react.dev',
    addedAt: '2024-11-21',
  },
  {
    id: 4,
    taskId: 4,
    type: 'notes',
    title: 'Midterm Study Notes',
    url: 'https://example.com/notes',
    addedAt: '2024-11-18',
  },
];

export const SUBJECT_COLORS = [
  '#3B82F6', // blue
  '#8B5CF6', // purple
  '#10B981', // green
  '#F59E0B', // amber
  '#EF4444', // red
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316', // orange
];

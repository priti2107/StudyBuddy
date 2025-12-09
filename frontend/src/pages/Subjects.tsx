import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, BookOpen, Edit, Trash2 } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SubjectForm } from '@/components/SubjectForm';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { fetchSubjects, deleteSubjectAPI } from '@/lib/api';

// ✅ backend-compatible subject type
interface Subject {
  id: number;
  name: string;
  code: string;
  instructor: string;
  schedule: string;
  color: string;
}

const Subjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Subject | null>(null);
  const navigate = useNavigate();

  // ✅ LOAD FROM BACKEND
  const loadSubjects = async () => {
    try {
      const data = await fetchSubjects();
      setSubjects(data);
    } catch (err) {
      toast.error("Failed to load subjects");
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setShowDialog(true);
  };

  const handleDelete = (subject: Subject) => {
    setDeleteConfirm(subject);
  };

  // ✅ DELETE FROM BACKEND
  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await deleteSubjectAPI(deleteConfirm.id);
      toast.success("Subject deleted");
      loadSubjects();
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setEditingSubject(null);
    loadSubjects(); // ✅ reload after add/edit
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subjects</h1>
          <p className="text-muted-foreground">Manage your courses and classes</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Subject
        </Button>
      </div>

      {subjects.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No subjects yet"
          description="Add your first subject to start organizing your studies"
          actionLabel="Add Subject"
          onAction={() => setShowDialog(true)}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject, index) => (
            <Card
              key={subject.id}
              className="hover:shadow-md transition-all animate-scale-in cursor-pointer"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => navigate('/tasks', { state: { subjectId: subject.id } })}
            >
              <div
                className="h-2 rounded-t-lg"
                style={{ backgroundColor: subject.color }}
              />
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{subject.name}</h3>
                    <p className="text-sm text-muted-foreground font-normal">{subject.code}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(subject);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(subject);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <p className="text-muted-foreground mb-1">Instructor</p>
                  <p className="font-medium">{subject.instructor}</p>
                </div>
                <div className="text-sm">
                  <p className="text-muted-foreground mb-1">Schedule</p>
                  <p>{subject.schedule}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</DialogTitle>
          </DialogHeader>

          {/* ✅ YOU WILL CONNECT THIS NEXT */}
          <SubjectForm subject={editingSubject} onClose={handleDialogClose} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the subject "{deleteConfirm?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Subjects;

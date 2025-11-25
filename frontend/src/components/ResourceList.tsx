import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, ExternalLink, FileText, Video, Link as LinkIcon, Trash2 } from 'lucide-react';
import { Resource } from '@/lib/mockData';
import { addResource, deleteResource } from '@/lib/storage';
import { toast } from 'sonner';
import { EmptyState } from './EmptyState';

interface ResourceListProps {
  taskId: number;
  resources: Resource[];
}

const resourceIcons = {
  video: Video,
  pdf: FileText,
  link: LinkIcon,
  notes: FileText,
};

export const ResourceList = ({ taskId, resources }: ResourceListProps) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'link' as Resource['type'],
    title: '',
    url: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.url.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    addResource({
      taskId,
      ...formData,
    });

    toast.success('Resource added successfully');
    setFormData({ type: 'link', title: '', url: '' });
    setShowForm(false);
    window.location.reload(); // Simple refresh to show new resource
  };

  const handleDelete = (id: number) => {
    deleteResource(id);
    toast.success('Resource deleted');
    window.location.reload();
  };

  if (resources.length === 0 && !showForm) {
    return (
      <EmptyState
        icon={Plus}
        title="No resources yet"
        description="Add study materials, videos, or links related to this task"
        actionLabel="Add Resource"
        onAction={() => setShowForm(true)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {resources.map((resource) => {
        const Icon = resourceIcons[resource.type];
        return (
          <Card key={resource.id} className="hover:bg-accent/50 transition-colors">
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{resource.title}</h4>
                  <p className="text-sm text-muted-foreground capitalize">{resource.type}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" asChild>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDelete(resource.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {!showForm && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: any) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="link">Link</SelectItem>
                <SelectItem value="notes">Notes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Tutorial Video"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Resource</Button>
          </div>
        </form>
      )}
    </div>
  );
};

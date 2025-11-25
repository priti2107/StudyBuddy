import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, ExternalLink, FileText, Video, Link as LinkIcon, FolderOpen } from 'lucide-react';
import { getResources, getTasks, getSubjects } from '@/lib/storage';
import { Resource } from '@/lib/mockData';
import { EmptyState } from '@/components/EmptyState';

const resourceIcons = {
  video: Video,
  pdf: FileText,
  link: LinkIcon,
  notes: FileText,
};

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    setResources(getResources());
  }, []);

  useEffect(() => {
    let filtered = resources;

    if (searchQuery) {
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(r => r.type === typeFilter);
    }

    setFilteredResources(filtered);
  }, [resources, searchQuery, typeFilter]);

  const tasks = getTasks();
  const subjects = getSubjects();

  const getTaskById = (id: number) => tasks.find(t => t.id === id);
  const getSubjectById = (id: number) => subjects.find(s => s.id === id);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Resources</h1>
        <p className="text-muted-foreground">All your study materials in one place</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="pdf">PDFs</SelectItem>
            <SelectItem value="link">Links</SelectItem>
            <SelectItem value="notes">Notes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No resources found"
          description="Resources you add to tasks will appear here"
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((resource, index) => {
            const Icon = resourceIcons[resource.type];
            const task = getTaskById(resource.taskId);
            const subject = task ? getSubjectById(task.subjectId) : null;

            return (
              <Card
                key={resource.id}
                className="hover:shadow-md transition-all animate-scale-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <Button size="icon" variant="ghost" asChild>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>

                  <h3 className="font-semibold mb-2">{resource.title}</h3>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary" className="capitalize">
                      {resource.type}
                    </Badge>
                    {subject && (
                      <Badge
                        variant="outline"
                        style={{ borderColor: subject.color, color: subject.color }}
                      >
                        {subject.code}
                      </Badge>
                    )}
                  </div>

                  {task && (
                    <p className="text-sm text-muted-foreground">
                      From: {task.title}
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground mt-2">
                    Added {new Date(resource.addedAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Resources;

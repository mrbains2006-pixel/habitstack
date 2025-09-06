import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Clock, Tag, AlertCircle } from 'lucide-react';
import { Task } from '@/pages/Index';

interface TaskCreatorProps {
  onAddTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt' | 'actualTime'>) => void;
  onCancel: () => void;
}

export const TaskCreator = ({ onAddTask, onCancel }: TaskCreatorProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(25);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask({
        title: title.trim(),
        description: description.trim() || undefined,
        estimatedTime,
        priority,
        category: category || undefined,
      });
      setTitle('');
      setDescription('');
      setEstimatedTime(25);
      setPriority('medium');
      setCategory('');
    }
  };

  const presetTimes = [15, 25, 30, 45, 60, 90];
  const categories = ['Work', 'Personal', 'Learning', 'Health', 'Creativity'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6 bg-card shadow-elegant">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Create New Task</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you want to accomplish?"
              className="bg-background border-border focus:ring-focus"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any additional details..."
              className="bg-background border-border focus:ring-focus resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority" className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span>Priority</span>
            </Label>
            <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
              <SelectTrigger className="bg-background border-border focus:ring-focus">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Estimated Time (minutes)</span>
            </Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {presetTimes.map((time) => (
                <Button
                  key={time}
                  type="button"
                  variant={estimatedTime === time ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEstimatedTime(time)}
                  className="text-xs"
                >
                  {time}m
                </Button>
              ))}
            </div>
            <Input
              id="time"
              type="number"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(Number(e.target.value))}
              min="1"
              max="180"
              className="bg-background border-border focus:ring-focus"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="flex items-center space-x-2">
              <Tag className="h-4 w-4" />
              <span>Category (optional)</span>
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-background border-border focus:ring-focus">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant"
            >
              Create Task
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
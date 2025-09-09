import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Check, Trash2, Clock, Tag, ChevronUp, ChevronDown, Calendar, X } from 'lucide-react';
import { Task } from '@/pages/Index';

interface TaskListProps {
  tasks: Task[];
  onStartTask: (task: Task) => void;
  onCompleteTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  activeTaskId?: string;
  onAssignToToday?: (taskId: string) => void;
  onRemoveFromToday?: (taskId: string) => void;
  onMoveUp?: (taskId: string) => void;
  onMoveDown?: (taskId: string) => void;
  showTodayActions?: boolean;
}

export const TaskList = ({ 
  tasks, 
  onStartTask, 
  onCompleteTask, 
  onDeleteTask, 
  activeTaskId,
  onAssignToToday,
  onRemoveFromToday,
  onMoveUp,
  onMoveDown,
  showTodayActions = false
}: TaskListProps) => {
  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  if (tasks.length === 0) {
    return (
      <Card className="p-8 text-center border-dashed">
        <div className="space-y-2">
          <p className="text-muted-foreground">No tasks yet</p>
          <p className="text-sm text-muted-foreground">
            Create your first task to start building your habit stack!
          </p>
        </div>
      </Card>
    );
  }

  const TaskItem = ({ task }: { task: Task }) => (
    <Card className={`p-4 transition-all duration-200 hover:shadow-soft ${
      task.completed ? 'bg-completed-bg border-completed/30' : 
      activeTaskId === task.id ? 'bg-timer-bg border-timer-active/30' : 'bg-card'
    }`}>
      <div className="flex items-center justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-3">
              <h3 className={`font-medium ${
                task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
              }`}>
                {task.title}
              </h3>
              {activeTaskId === task.id && (
                <Badge variant="secondary" className="bg-timer-active text-warning-foreground">
                  Active
                </Badge>
              )}
            </div>
            
            {task.description && (
              <p className={`text-sm ${
                task.completed ? 'text-muted-foreground/70' : 'text-muted-foreground'
              }`}>
                {task.description}
              </p>
            )}
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{task.estimatedTime}m</span>
            </div>
            {task.category && (
              <div className="flex items-center space-x-1">
                <Tag className="h-3 w-3" />
                <span>{task.category}</span>
              </div>
            )}
            {task.completedAt && (
              <span>
                Completed {task.completedAt.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          {showTodayActions && onMoveUp && onMoveDown && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onMoveUp(task.id)}
                className="hover:bg-muted"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onMoveDown(task.id)}
                className="hover:bg-muted"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </>
          )}
          
          {!task.completed && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStartTask(task)}
                disabled={activeTaskId === task.id}
                className="hover:bg-primary hover:text-primary-foreground"
              >
                <Play className="h-4 w-4" />
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => onCompleteTask(task.id)}
                className="hover:bg-success hover:text-success-foreground"
              >
                <Check className="h-4 w-4" />
              </Button>
            </>
          )}
          
          {!showTodayActions && onAssignToToday && !task.assignedToToday && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAssignToToday(task.id)}
              className="hover:bg-primary hover:text-primary-foreground"
            >
              <Calendar className="h-4 w-4" />
            </Button>
          )}
          
          {showTodayActions && onRemoveFromToday && task.assignedToToday && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRemoveFromToday(task.id)}
              className="hover:bg-destructive hover:text-destructive-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDeleteTask(task.id)}
            className="hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Pending Tasks */}
      {pendingTasks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <span>Pending Tasks</span>
            <Badge variant="secondary">{pendingTasks.length}</Badge>
          </h3>
          <div className="space-y-2">
            {pendingTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <span>Completed Today</span>
            <Badge variant="outline" className="bg-completed-bg text-completed border-completed/30">
              {completedTasks.length}
            </Badge>
          </h3>
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
import { useState, useEffect } from 'react';
import { TaskCreator } from '@/components/TaskCreator';
import { TaskList } from '@/components/TaskList';
import { PomodoroTimer } from '@/components/PomodoroTimer';
import { Analytics } from '@/components/Analytics';
import { DailyReflection } from '@/components/DailyReflection';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, BarChart3, MessageSquare, Plus } from 'lucide-react';

export interface Task {
  id: string;
  title: string;
  estimatedTime: number; // in minutes
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  category?: string;
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showTaskCreator, setShowTaskCreator] = useState(false);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('habitstack-tasks');
    if (savedTasks) {
      const parsed = JSON.parse(savedTasks);
      setTasks(parsed.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
      })));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('habitstack-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
    setShowTaskCreator(false);
  };

  const completeTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: true, completedAt: new Date() }
        : task
    ));
    if (activeTask?.id === taskId) {
      setActiveTask(null);
    }
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    if (activeTask?.id === taskId) {
      setActiveTask(null);
    }
  };

  const startTask = (task: Task) => {
    setActiveTask(task);
  };

  const startNextTask = () => {
    const pendingTasks = tasks.filter(task => !task.completed);
    if (pendingTasks.length > 0) {
      setActiveTask(pendingTasks[0]);
    } else {
      setActiveTask(null);
    }
  };

  const startFocusSession = () => {
    const pendingTasks = getTodaysTasks().filter(task => !task.completed);
    if (pendingTasks.length > 0) {
      setActiveTask(pendingTasks[0]);
    }
  };

  const getTodaysTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return tasks.filter(task => task.createdAt >= today);
  };

  const getCompletedTasksToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return tasks.filter(task => 
      task.completed && 
      task.completedAt && 
      task.completedAt >= today
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">HabitStack</h1>
            </div>
            <Button 
              onClick={() => setShowTaskCreator(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tasks & Timer */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Start Section */}
            {!activeTask && getTodaysTasks().filter(task => !task.completed).length > 0 && (
              <Card className="p-6 text-center bg-gradient-to-r from-primary/10 to-background border-primary/30">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">Ready to Focus?</h3>
                    <p className="text-sm text-muted-foreground">
                      Start your focus session with the next pending task
                    </p>
                  </div>
                  <Button
                    onClick={startFocusSession}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant px-8"
                  >
                    🎯 Start Focus Session
                  </Button>
                </div>
              </Card>
            )}

            {/* Active Pomodoro Timer */}
            {activeTask && (
              <Card className="p-6 bg-gradient-to-r from-timer-bg to-background border-timer-active/30">
                <PomodoroTimer 
                  task={activeTask}
                  onComplete={() => completeTask(activeTask.id)}
                  onStop={() => setActiveTask(null)}
                  onStartNext={startNextTask}
                  availableTasks={tasks.filter(task => !task.completed)}
                />
              </Card>
            )}

            {/* Task Management */}
            <Tabs defaultValue="today" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="today">Today's Stack</TabsTrigger>
                <TabsTrigger value="all">All Tasks</TabsTrigger>
              </TabsList>
              
              <TabsContent value="today" className="mt-4">
                <TaskList 
                  tasks={getTodaysTasks()} 
                  onStartTask={startTask}
                  onCompleteTask={completeTask}
                  onDeleteTask={deleteTask}
                  activeTaskId={activeTask?.id}
                />
              </TabsContent>
              
              <TabsContent value="all" className="mt-4">
                <TaskList 
                  tasks={tasks} 
                  onStartTask={startTask}
                  onCompleteTask={completeTask}
                  onDeleteTask={deleteTask}
                  activeTaskId={activeTask?.id}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Analytics & Reflection */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Today's Progress</h3>
              </div>
              <Analytics tasks={getCompletedTasksToday()} totalTasks={getTodaysTasks().length} />
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Daily Reflection</h3>
              </div>
              <DailyReflection completedTasks={getCompletedTasksToday()} />
            </Card>
          </div>
        </div>
      </main>

      {/* Task Creator Modal */}
      {showTaskCreator && (
        <TaskCreator 
          onAddTask={addTask}
          onCancel={() => setShowTaskCreator(false)}
        />
      )}
    </div>
  );
};

export default Index;
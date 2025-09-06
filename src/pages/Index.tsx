import { useState, useEffect } from 'react';
import { TaskCreator } from '@/components/TaskCreator';
import { TaskList } from '@/components/TaskList';
import { PomodoroTimer } from '@/components/PomodoroTimer';
import { StandalonePomodoroTimer } from '@/components/StandalonePomodoroTimer';
import { Analytics } from '@/components/Analytics';
import { DailyReflection } from '@/components/DailyReflection';
import { IntroSlides } from '@/components/IntroSlides';
import { Settings } from '@/components/Settings';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UserMenu } from '@/components/UserMenu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, BarChart3, MessageSquare, Plus, HelpCircle, Timer } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { PomodoroTheme } from '@/components/PomodoroThemeSelector';

export interface Task {
  id: string;
  title: string;
  description?: string;
  estimatedTime: number; // in minutes
  actualTime?: number;
  completed: boolean;
  completedAt?: Date;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  category?: string;
}

const Index = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showTaskCreator, setShowTaskCreator] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [showStandaloneTimer, setShowStandaloneTimer] = useState(false);
  const [isTaskTimerRunning, setIsTaskTimerRunning] = useState(false);
  const [isStandaloneTimerRunning, setIsStandaloneTimerRunning] = useState(false);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(
    localStorage.getItem('habitstack-background')
  );
  const [pomodoroTheme, setPomodoroTheme] = useState<PomodoroTheme>(() => {
    const saved = localStorage.getItem('habitstack-pomodoro-theme');
    return saved ? JSON.parse(saved) : {
      id: 'default',
      name: 'Ocean',
      colors: {
        background: 'from-blue-500/20 to-cyan-500/20',
        text: 'text-blue-900 dark:text-blue-100',
        accent: 'border-blue-500/30',
        gradient: 'from-blue-500 to-cyan-500'
      },
      preview: {
        background: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
        timer: 'text-blue-900',
        button: 'bg-blue-500'
      }
    };
  });

  // Load tasks from Supabase
  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  // Check if user has seen intro on mount
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('habitstack-intro-seen');
    if (!hasSeenIntro) {
      setShowIntro(true);
    }
  }, []);

  const loadTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading tasks:', error);
        toast({
          title: "Error",
          description: "Failed to load tasks. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const formattedTasks: Task[] = data.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        estimatedTime: task.estimated_time,
        actualTime: task.actual_time,
        completed: task.completed,
        completedAt: task.completed_at ? new Date(task.completed_at) : undefined,
        priority: task.priority as 'low' | 'medium' | 'high',
        createdAt: new Date(task.created_at)
      }));

      setTasks(formattedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'completed' | 'createdAt' | 'actualTime'>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: taskData.title,
          description: taskData.description,
          estimated_time: taskData.estimatedTime,
          priority: taskData.priority,
          user_id: user?.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding task:', error);
        toast({
          title: "Error",
          description: "Failed to add task. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const formattedTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description,
        estimatedTime: data.estimated_time,
        actualTime: data.actual_time,
        completed: data.completed,
        completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
        priority: data.priority as 'low' | 'medium' | 'high',
        createdAt: new Date(data.created_at)
      };

      setTasks(prev => [formattedTask, ...prev]);
      setShowTaskCreator(false);
      
      toast({
        title: "Task Added! ✨",
        description: `"${taskData.title}" has been added to your list.`,
      });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const completeTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) {
        console.error('Error completing task:', error);
        toast({
          title: "Error",
          description: "Failed to complete task. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, completed: true, completedAt: new Date() }
          : task
      ));
      
      if (activeTask?.id === taskId) {
        setActiveTask(null);
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) {
        console.error('Error deleting task:', error);
        toast({
          title: "Error",
          description: "Failed to delete task. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setTasks(prev => prev.filter(task => task.id !== taskId));
      if (activeTask?.id === taskId) {
        setActiveTask(null);
      }

      toast({
        title: "Task Deleted",
        description: "Task has been removed from your list.",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const startTask = (task: Task) => {
    // Stop standalone timer if running
    if (isStandaloneTimerRunning) {
      setShowStandaloneTimer(false);
      setIsStandaloneTimerRunning(false);
    }
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
    <ProtectedRoute>
      <div 
        className="min-h-screen bg-background relative"
        style={{
          backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Background Overlay */}
        {backgroundUrl && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-0" />
        )}
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <header className="border-b bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Brain className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">HabitStack</h1>
              </div>
              <div className="flex items-center space-x-3">
                <Settings 
                  onBackgroundChange={setBackgroundUrl} 
                  pomodoroTheme={pomodoroTheme}
                  onPomodoroThemeChange={(theme) => {
                    setPomodoroTheme(theme);
                    localStorage.setItem('habitstack-pomodoro-theme', JSON.stringify(theme));
                  }}
                />
                <ThemeToggle />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowIntro(true)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help
                </Button>
                <Button 
                  onClick={() => {
                    // Stop task timer if running
                    if (activeTask) {
                      setActiveTask(null);
                      setIsTaskTimerRunning(false);
                    }
                    setShowStandaloneTimer(true);
                  }}
                  variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary/10"
                >
                  <Timer className="h-4 w-4 mr-2" />
                  Pomodoro
                </Button>
                <Button 
                  onClick={() => setShowTaskCreator(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
                <UserMenu />
              </div>
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
                <Card className={`p-6 bg-gradient-to-r ${pomodoroTheme.colors.background} ${pomodoroTheme.colors.accent}`}>
                  <PomodoroTimer 
                    task={activeTask}
                    onComplete={() => completeTask(activeTask.id)}
                    onStop={() => {
                      setActiveTask(null);
                      setIsTaskTimerRunning(false);
                    }}
                    onStartNext={startNextTask}
                    availableTasks={tasks.filter(task => !task.completed)}
                    onTimerStateChange={setIsTaskTimerRunning}
                    theme={pomodoroTheme}
                  />
                </Card>
              )}

              {/* Standalone Pomodoro Timer */}
              {showStandaloneTimer && (
                <StandalonePomodoroTimer 
                  onClose={() => {
                    setShowStandaloneTimer(false);
                    setIsStandaloneTimerRunning(false);
                  }} 
                  onTimerStateChange={setIsStandaloneTimerRunning}
                  theme={pomodoroTheme}
                />
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
        </div>

        {/* Task Creator Modal */}
        {showTaskCreator && (
          <TaskCreator 
            onAddTask={addTask}
            onCancel={() => setShowTaskCreator(false)}
          />
        )}

        {/* Intro Slides */}
        <IntroSlides 
          isOpen={showIntro}
          onClose={() => setShowIntro(false)}
          onBackgroundChange={setBackgroundUrl}
          pomodoroTheme={pomodoroTheme}
          onPomodoroThemeChange={(theme) => {
            setPomodoroTheme(theme);
            localStorage.setItem('habitstack-pomodoro-theme', JSON.stringify(theme));
          }}
        />
      </div>
    </ProtectedRoute>
  );
};

export default Index;
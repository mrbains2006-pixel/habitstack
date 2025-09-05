import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { Task } from '@/pages/Index';
import { useToast } from '@/hooks/use-toast';
import type { PomodoroTheme } from '@/components/PomodoroThemeSelector';

interface PomodoroTimerProps {
  task: Task;
  onComplete: () => void;
  onStop: () => void;
  onStartNext?: () => void;
  availableTasks?: Task[];
  onTimerStateChange?: (isRunning: boolean) => void;
  theme?: PomodoroTheme;
}

export const PomodoroTimer = ({ task, onComplete, onStop, onStartNext, availableTasks, onTimerStateChange, theme }: PomodoroTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(task.estimatedTime * 60); // Convert to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isBreakTime, setIsBreakTime] = useState(false);
  const [breakTime, setBreakTime] = useState(5 * 60); // 5 minute default break
  const { toast } = useToast();

  const totalTime = isBreakTime ? breakTime : task.estimatedTime * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsRunning(false);
            if (isBreakTime) {
              toast({
                title: "✨ Break Complete!",
                description: "Ready to get back to work?",
                className: "bg-success text-success-foreground",
              });
              setIsBreakTime(false);
              setIsCompleted(false);
              if (onStartNext && availableTasks && availableTasks.length > 0) {
                // Auto start next task after break
                setTimeout(() => onStartNext(), 1000);
              } else {
                setTimeout(() => onStop(), 1000);
              }
            } else {
              toast({
                title: "🎉 Task Completed!",
                description: `Great job completing "${task.title}"!`,
                className: "bg-success text-success-foreground",
              });
              setIsCompleted(true);
            }
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, task.title, onComplete, onStartNext, availableTasks, isBreakTime, toast]);

  const handleTakeBreak = () => {
    setIsBreakTime(true);
    setTimeLeft(breakTime);
    setIsCompleted(false);
    setIsRunning(true);
    onComplete(); // Mark the task as complete
  };

  const handleStartNextTask = () => {
    onComplete(); // Mark current task as complete
    if (onStartNext) {
      onStartNext();
    }
  };

  const handleFinishSession = () => {
    onComplete();
    onStop();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
    onTimerStateChange?.(true);
  };

  const handlePause = () => {
    setIsRunning(false);
    setIsPaused(true);
    onTimerStateChange?.(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(totalTime);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    onTimerStateChange?.(false);
    onStop();
  };

  return (
    <div className="text-center space-y-6">
      <div className="space-y-2">
        <h2 className={`text-2xl font-bold ${theme?.colors.text || 'text-foreground'}`}>
          {isBreakTime ? '☕ Break Time' : task.title}
        </h2>
        <p className={`${theme?.colors.text || 'text-muted-foreground'}`}>
          {isBreakTime ? `Break Session • ${breakTime / 60} minutes` : `Focus Session • ${task.estimatedTime} minutes`}
        </p>
      </div>

      {/* Timer Display */}
      <div className="relative">
        <div className={`text-6xl font-mono font-bold transition-colors duration-300 ${
          theme?.colors.text || (isRunning ? 'text-timer-active' : 'text-foreground')
        }`}>
          {formatTime(timeLeft)}
        </div>
        
        <div className="mt-4">
          <Progress 
            value={progress} 
            className="w-full h-3 bg-muted"
          />
        </div>
        
        <div className="mt-2 text-sm text-muted-foreground">
          {Math.round(progress)}% Complete
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-3">
        {!isRunning && !isPaused && (
          <Button
            onClick={handleStart}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant px-8"
          >
            <Play className="h-5 w-5 mr-2" />
            Start Focus
          </Button>
        )}

        {isRunning && (
          <Button
            onClick={handlePause}
            size="lg"
            variant="outline"
            className="border-timer-active text-timer-active hover:bg-timer-bg px-8"
          >
            <Pause className="h-5 w-5 mr-2" />
            Pause
          </Button>
        )}

        {isPaused && (
          <Button
            onClick={handleStart}
            size="lg"
            className="bg-timer-active hover:bg-timer-active/90 text-warning-foreground px-8"
          >
            <Play className="h-5 w-5 mr-2" />
            Resume
          </Button>
        )}

        {(isRunning || isPaused) && (
          <>
            <Button
              onClick={handleReset}
              size="lg"
              variant="outline"
              className="px-6"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </Button>
            
            <Button
              onClick={handleStop}
              size="lg"
              variant="destructive"
              className="px-6"
            >
              <Square className="h-5 w-5 mr-2" />
              Stop
            </Button>
          </>
        )}
      </div>

      {/* Completion Options */}
      {isCompleted && !isBreakTime && (
        <div className="text-center p-6 bg-success/10 rounded-lg border border-success/30">
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-success font-medium text-lg">🎉 Task Complete!</p>
              <p className="text-sm text-muted-foreground">
                What would you like to do next?
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleTakeBreak}
                size="lg"
                variant="outline"
                className="bg-warning/10 border-warning text-warning-foreground hover:bg-warning/20"
              >
                ☕ Take a Break (5 min)
              </Button>
              
              {onStartNext && availableTasks && availableTasks.length > 0 && (
                <Button
                  onClick={handleStartNextTask}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  ▶️ Next Task
                </Button>
              )}
              
              <Button
                onClick={handleFinishSession}
                size="lg"
                variant="outline"
                className="hover:bg-muted"
              >
                ✅ Finish Session
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {isRunning && !isCompleted && (
        <div className={`text-center p-4 rounded-lg border ${
          isBreakTime 
            ? 'bg-warning/10 border-warning/30' 
            : 'bg-timer-bg border-timer-active/30'
        }`}>
          <p className={`font-medium ${
            isBreakTime ? 'text-warning' : 'text-timer-active'
          }`}>
            {isBreakTime ? '☕ Break Time Active' : '🔥 Focus Mode Active'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {isBreakTime ? 'Relax and recharge!' : 'Stay focused and complete this task!'}
          </p>
        </div>
      )}
    </div>
  );
};
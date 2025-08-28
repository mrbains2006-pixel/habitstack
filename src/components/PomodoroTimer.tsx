import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { Task } from '@/pages/Index';
import { useToast } from '@/hooks/use-toast';

interface PomodoroTimerProps {
  task: Task;
  onComplete: () => void;
  onStop: () => void;
}

export const PomodoroTimer = ({ task, onComplete, onStop }: PomodoroTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(task.estimatedTime * 60); // Convert to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { toast } = useToast();

  const totalTime = task.estimatedTime * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsRunning(false);
            toast({
              title: "🎉 Task Completed!",
              description: `Great job completing "${task.title}"!`,
              className: "bg-success text-success-foreground",
            });
            setTimeout(onComplete, 1000);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, task.title, onComplete, toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsRunning(false);
    setIsPaused(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(totalTime);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    onStop();
  };

  return (
    <div className="text-center space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          {task.title}
        </h2>
        <p className="text-muted-foreground">
          Focus Session • {task.estimatedTime} minutes
        </p>
      </div>

      {/* Timer Display */}
      <div className="relative">
        <div className={`text-6xl font-mono font-bold transition-colors duration-300 ${
          isRunning ? 'text-timer-active' : 'text-foreground'
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

      {/* Status Messages */}
      {isRunning && (
        <div className="text-center p-4 bg-timer-bg rounded-lg border border-timer-active/30">
          <p className="text-timer-active font-medium">🔥 Focus Mode Active</p>
          <p className="text-sm text-muted-foreground mt-1">
            Stay focused and complete this task!
          </p>
        </div>
      )}
    </div>
  );
};
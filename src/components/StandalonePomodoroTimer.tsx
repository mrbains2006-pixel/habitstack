import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Play, Pause, Square, RotateCcw, Settings, Maximize, Minimize } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { PomodoroTheme } from '@/components/PomodoroThemeSelector';

interface StandalonePomodoroTimerProps {
  onClose: () => void;
  onTimerStateChange?: (isRunning: boolean) => void;
  theme?: PomodoroTheme;
}

export const StandalonePomodoroTimer = ({ onClose, onTimerStateChange, theme }: StandalonePomodoroTimerProps) => {
  const [workTime, setWorkTime] = useState(25); // minutes
  const [breakTime, setBreakTime] = useState(5); // minutes
  const [timeLeft, setTimeLeft] = useState(workTime * 60); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isBreakTime, setIsBreakTime] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            if (isBreakTime) {
              toast({
                title: "Break Complete! 🎯",
                description: "Ready to get back to work?",
              });
              setIsBreakTime(false);
              setTimeLeft(workTime * 60);
            } else {
              toast({
                title: "Focus Session Complete! 🎉",
                description: "Time for a well-deserved break.",
              });
              setIsBreakTime(true);
              setTimeLeft(breakTime * 60);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreakTime, workTime, breakTime, toast]);

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
    setTimeLeft(isBreakTime ? breakTime * 60 : workTime * 60);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    setIsBreakTime(false);
    setTimeLeft(workTime * 60);
    setIsFullscreen(false);
    onTimerStateChange?.(false);
    onClose();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const updateSettings = () => {
    if (!isRunning) {
      setTimeLeft(isBreakTime ? breakTime * 60 : workTime * 60);
    }
    setShowSettings(false);
  };

  const totalTime = isBreakTime ? breakTime * 60 : workTime * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  if (showSettings) {
    return (
      <Card className={`p-6 bg-gradient-to-r ${theme?.colors.background || 'from-timer-bg to-background'} ${theme?.colors.accent || 'border-timer-active/30'}`}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-semibold ${theme?.colors.text || 'text-foreground'}`}>Pomodoro Settings</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
              Back
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="work-time">Focus Time (minutes)</Label>
              <Input
                id="work-time"
                type="number"
                min="1"
                max="60"
                value={workTime}
                onChange={(e) => setWorkTime(Number(e.target.value))}
                disabled={isRunning}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="break-time">Break Time (minutes)</Label>
              <Input
                id="break-time"
                type="number"
                min="1"
                max="30"
                value={breakTime}
                onChange={(e) => setBreakTime(Number(e.target.value))}
                disabled={isRunning}
              />
            </div>
          </div>
          
          <Button onClick={updateSettings} className="w-full">
            Save Settings
          </Button>
        </div>
      </Card>
    );
  }

  const timerContent = (
    <Card className={`p-6 bg-gradient-to-r ${theme?.colors.background || 'from-timer-bg to-background'} ${theme?.colors.accent || 'border-timer-active/30'} ${isFullscreen ? 'bg-transparent border-none' : ''}`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className={`${isFullscreen ? 'text-3xl' : 'text-lg'} font-semibold ${theme?.colors.text || 'text-foreground'}`}>
              {isBreakTime ? "🌱 Break Time" : "🎯 Focus Session"}
            </h3>
            <p className={`${isFullscreen ? 'text-lg' : 'text-sm'} ${theme?.colors.text || 'text-muted-foreground'}`}>
              {isBreakTime ? "Take a moment to recharge" : "Deep work time"}
            </p>
          </div>
          <div className="flex space-x-2">
            {(isRunning || isPaused) && (
              <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => setShowSettings(true)}>
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleStop}>
              <Square className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className={`${isFullscreen ? 'text-9xl' : 'text-6xl'} font-mono font-bold ${theme?.colors.text || 'text-foreground'}`}>
            {formatTime(timeLeft)}
          </div>
          
          <Progress 
            value={progress} 
            className="w-full h-3 bg-timer-progress" 
          />
          
          <div className="flex justify-center space-x-3">
            {!isRunning ? (
              <Button 
                onClick={handleStart}
                size="lg"
                className="bg-secondary/80 hover:bg-secondary text-secondary-foreground shadow-elegant px-8"
              >
                <Play className="h-5 w-5 mr-2" />
                {isPaused ? 'Resume' : 'Start'}
              </Button>
            ) : (
              <Button 
                onClick={handlePause}
                size="lg"
                className="bg-destructive/80 hover:bg-destructive text-destructive-foreground px-8"
              >
                <Pause className="h-5 w-5 mr-2" />
                Pause
              </Button>
            )}
            
            <Button 
              onClick={handleReset}
              variant="ghost"
              size="lg"
              className="text-muted-foreground hover:text-foreground px-8"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {isBreakTime ? (
              <>Break mode • {breakTime} minutes</>
            ) : (
              <>Focus mode • {workTime} minutes</>
            )}
          </p>
        </div>
      </div>
    </Card>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto px-8">
          <div className="absolute top-6 right-6">
            <Button
              onClick={toggleFullscreen}
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Minimize className="h-5 w-5 mr-2" />
              Exit Fullscreen
            </Button>
          </div>
          {timerContent}
        </div>
      </div>
    );
  }

  return timerContent;
};
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Brain, Smile, Meh, Frown } from 'lucide-react';
import { Task } from '@/pages/Index';
import { useToast } from '@/hooks/use-toast';

interface DailyReflection {
  date: string;
  mood: 'great' | 'good' | 'okay' | 'difficult' | 'challenging';
  reflection: string;
  completedTasks: number;
  totalFocusTime: number;
}

interface DailyReflectionProps {
  completedTasks: Task[];
}

export const DailyReflection = ({ completedTasks }: DailyReflectionProps) => {
  const [todaysReflection, setTodaysReflection] = useState<DailyReflection | null>(null);
  const [mood, setMood] = useState<DailyReflection['mood']>('good');
  const [reflection, setReflection] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const today = new Date().toISOString().split('T')[0];
  const totalFocusTime = completedTasks.reduce((acc, task) => acc + task.estimatedTime, 0);

  useEffect(() => {
    const savedReflections = localStorage.getItem('habitstack-reflections');
    if (savedReflections) {
      const reflections = JSON.parse(savedReflections);
      const todayReflection = reflections[today];
      if (todayReflection) {
        setTodaysReflection(todayReflection);
        setMood(todayReflection.mood);
        setReflection(todayReflection.reflection);
      }
    }
  }, [today]);

  const handleSaveReflection = () => {
    const newReflection: DailyReflection = {
      date: today,
      mood,
      reflection,
      completedTasks: completedTasks.length,
      totalFocusTime,
    };

    const savedReflections = localStorage.getItem('habitstack-reflections');
    const reflections = savedReflections ? JSON.parse(savedReflections) : {};
    reflections[today] = newReflection;
    localStorage.setItem('habitstack-reflections', JSON.stringify(reflections));

    setTodaysReflection(newReflection);
    setIsEditing(false);

    toast({
      title: "Reflection Saved! 🌟",
      description: "Your daily insights have been recorded.",
      className: "bg-success text-success-foreground",
    });
  };

  const moodOptions = [
    { value: 'great', label: 'Great', icon: Smile, color: 'text-success' },
    { value: 'good', label: 'Good', icon: Smile, color: 'text-primary' },
    { value: 'okay', label: 'Okay', icon: Meh, color: 'text-warning' },
    { value: 'difficult', label: 'Difficult', icon: Frown, color: 'text-orange-500' },
    { value: 'challenging', label: 'Challenging', icon: Frown, color: 'text-destructive' },
  ];

  const selectedMoodOption = moodOptions.find(option => option.value === mood);
  const MoodIcon = selectedMoodOption?.icon || Meh;

  const getReflectionPrompts = () => {
    const prompts = [
      "What went well with your focus today?",
      "Which task felt most rewarding to complete?",
      "What would you do differently tomorrow?",
      "How did the pomodoro technique help you?",
      "What challenges did you overcome today?"
    ];
    
    if (completedTasks.length === 0) {
      return ["How are you feeling about today?", "What can you learn from today's experience?"];
    }
    
    return prompts;
  };

  const prompts = getReflectionPrompts();

  return (
    <div className="space-y-4">
      {/* Daily Summary */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Card className="p-3 bg-completed-bg/20 border-completed/20">
          <div className="text-center">
            <div className="text-lg font-bold text-completed">{completedTasks.length}</div>
            <div className="text-xs text-muted-foreground">Tasks Done</div>
          </div>
        </Card>
        <Card className="p-3 bg-focus-light/20 border-focus/20">
          <div className="text-center">
            <div className="text-lg font-bold text-focus">{totalFocusTime}m</div>
            <div className="text-xs text-muted-foreground">Focus Time</div>
          </div>
        </Card>
      </div>

      {/* Mood Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center space-x-2">
          <Heart className="h-4 w-4 text-primary" />
          <span>How was your day?</span>
        </label>
        <Select value={mood} onValueChange={(value) => setMood(value as DailyReflection['mood'])}>
          <SelectTrigger className="bg-background border-border">
            <SelectValue>
              <div className="flex items-center space-x-2">
                <MoodIcon className={`h-4 w-4 ${selectedMoodOption?.color}`} />
                <span>{selectedMoodOption?.label}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {moodOptions.map((option) => {
              const Icon = option.icon;
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center space-x-2">
                    <Icon className={`h-4 w-4 ${option.color}`} />
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Reflection Text */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center space-x-2">
          <Brain className="h-4 w-4 text-primary" />
          <span>Daily Reflection</span>
        </label>
        
        {!todaysReflection || isEditing ? (
          <>
            <Textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder={prompts[Math.floor(Math.random() * prompts.length)]}
              className="bg-background border-border focus:ring-focus min-h-[100px] resize-none"
            />
            <div className="flex space-x-2">
              <Button 
                onClick={handleSaveReflection}
                disabled={!reflection.trim()}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Save Reflection
              </Button>
              {todaysReflection && (
                <Button 
                  onClick={() => {
                    setIsEditing(false);
                    setReflection(todaysReflection.reflection);
                    setMood(todaysReflection.mood);
                  }}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
              )}
            </div>
          </>
        ) : (
          <Card className="p-4 bg-muted/30">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  {selectedMoodOption?.label}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {todaysReflection.reflection}
              </p>
              <Button 
                onClick={() => setIsEditing(true)}
                variant="ghost"
                size="sm"
                className="mt-2 text-xs"
              >
                Edit Reflection
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Prompt Suggestions */}
      {(!todaysReflection || isEditing) && (
        <Card className="p-3 bg-accent/5 border-accent/20">
          <div className="space-y-2">
            <div className="text-xs font-medium text-accent">Reflection Prompts:</div>
            <div className="space-y-1">
              {prompts.slice(0, 2).map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setReflection(prompt + ' ')}
                  className="text-xs text-muted-foreground hover:text-accent text-left block w-full"
                >
                  • {prompt}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X, Brain, Timer, BarChart3, MessageSquare, CheckCircle } from 'lucide-react';

interface IntroSlidesProps {
  isOpen: boolean;
  onClose: () => void;
}

const slides = [
  {
    icon: Brain,
    title: "Welcome to HabitStack!",
    description: "Your personal productivity companion that helps you stack habits and achieve your goals with focused work sessions.",
    content: "HabitStack combines the power of habit stacking with the Pomodoro Technique to boost your productivity and track your progress.",
    tip: "Ready to transform your productivity? Let's get started!"
  },
  {
    icon: CheckCircle,
    title: "Create Your Tasks",
    description: "Start by adding tasks you want to complete. Set realistic time estimates for each task.",
    content: "Click the 'Add Task' button to create new tasks. You can categorize them and set custom time estimates based on your needs.",
    tip: "Pro tip: Break larger tasks into smaller, manageable chunks of 25-90 minutes."
  },
  {
    icon: Timer,
    title: "Focus with Pomodoro Timer",
    description: "Use the built-in Pomodoro timer to maintain focus and complete your tasks efficiently.",
    content: "Click 'Start Focus Session' to begin working on your next pending task. The timer will track your progress and automatically mark tasks as complete.",
    tip: "Stay focused during the timer - no distractions allowed!"
  },
  {
    icon: BarChart3,
    title: "Track Your Progress",
    description: "Monitor your daily productivity with real-time analytics and performance metrics.",
    content: "View your completion rate, total focus time, and productivity trends. The analytics help you understand your work patterns.",
    tip: "Consistency is key - try to complete at least a few tasks each day."
  },
  {
    icon: MessageSquare,
    title: "Daily Reflection",
    description: "End each day with reflection to improve your productivity and celebrate your achievements.",
    content: "Answer simple questions about your day to track your mood, energy levels, and what you learned. This helps optimize future performance.",
    tip: "Honest reflection leads to better self-awareness and improved productivity."
  }
];

export const IntroSlides = ({ isOpen, onClose }: IntroSlidesProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    localStorage.setItem('habitstack-intro-seen', 'true');
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('habitstack-intro-seen', 'true');
    onClose();
  };

  const current = slides[currentSlide];
  const IconComponent = current.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 gap-0 bg-background border-primary/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary/5 to-background">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{current.title}</h2>
              <p className="text-sm text-muted-foreground">
                Step {currentSlide + 1} of {slides.length}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-elegant">
              <IconComponent className="h-10 w-10 text-white" />
            </div>
            
            <div className="space-y-2">
              <p className="text-lg font-medium text-foreground">
                {current.description}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {current.content}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-r from-success/10 to-primary/5 border border-success/20">
              <p className="text-sm text-success-foreground font-medium">
                💡 {current.tip}
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center space-x-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'w-8 bg-primary'
                    : index < currentSlide
                    ? 'w-2 bg-primary/60'
                    : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-muted/20">
          <Button
            variant="ghost"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>

          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-muted-foreground hover:text-foreground"
          >
            Skip Tutorial
          </Button>

          <Button
            onClick={nextSlide}
            className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center space-x-2"
          >
            <span>{currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}</span>
            {currentSlide < slides.length - 1 && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
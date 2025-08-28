import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, TrendingUp, Award } from 'lucide-react';
import { Task } from '@/pages/Index';

interface AnalyticsProps {
  tasks: Task[];
  totalTasks: number;
}

export const Analytics = ({ tasks, totalTasks }: AnalyticsProps) => {
  const completedTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const totalTimeSpent = tasks.reduce((acc, task) => acc + task.estimatedTime, 0);
  const averageTaskTime = completedTasks > 0 ? totalTimeSpent / completedTasks : 0;

  // Category breakdown
  const categoryStats = tasks.reduce((acc, task) => {
    const category = task.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryStats).sort(([,a], [,b]) => b - a)[0];

  // Performance insights
  const getPerformanceMessage = () => {
    if (completionRate >= 80) return { message: "Excellent productivity!", emoji: "🚀", color: "text-success" };
    if (completionRate >= 60) return { message: "Good progress!", emoji: "💪", color: "text-success" };
    if (completionRate >= 40) return { message: "Keep it up!", emoji: "⭐", color: "text-warning" };
    return { message: "Let's build momentum!", emoji: "🌱", color: "text-muted-foreground" };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="space-y-4">
      {/* Overall Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Daily Completion</span>
          <span className="text-sm text-muted-foreground">
            {completedTasks} / {totalTasks}
          </span>
        </div>
        <Progress value={completionRate} className="h-2" />
        <div className={`text-sm ${performance.color}`}>
          {performance.emoji} {performance.message}
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3 bg-focus-light/20 border-focus/20">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-focus" />
            <div>
              <div className="text-lg font-semibold text-focus">{totalTimeSpent}m</div>
              <div className="text-xs text-muted-foreground">Time Invested</div>
            </div>
          </div>
        </Card>

        <Card className="p-3 bg-completed-bg/20 border-completed/20">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-completed" />
            <div>
              <div className="text-lg font-semibold text-completed">{Math.round(completionRate)}%</div>
              <div className="text-xs text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Average Task Time */}
      {averageTaskTime > 0 && (
        <Card className="p-3 bg-muted/50">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <div>
              <div className="text-sm font-medium">
                Avg. {Math.round(averageTaskTime)}m per task
              </div>
              <div className="text-xs text-muted-foreground">
                Your focus duration
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Top Category */}
      {topCategory && (
        <Card className="p-3 bg-accent/10 border-accent/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-accent" />
              <div>
                <div className="text-sm font-medium">Top Category</div>
                <div className="text-xs text-muted-foreground">{topCategory[0]}</div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-accent/20 text-accent">
              {topCategory[1]} tasks
            </Badge>
          </div>
        </Card>
      )}

      {/* Weekly Streak Placeholder */}
      <Card className="p-3 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <div className="flex items-center space-x-2">
          <div className="text-2xl">🔥</div>
          <div>
            <div className="text-sm font-medium">Keep Building!</div>
            <div className="text-xs text-muted-foreground">
              Complete more tasks to unlock insights
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
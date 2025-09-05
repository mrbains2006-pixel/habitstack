import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BackgroundSettings } from '@/components/BackgroundSettings';
import { Settings as SettingsIcon, Palette, Timer, Bell } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PomodoroThemeSelector, type PomodoroTheme } from '@/components/PomodoroThemeSelector';

interface SettingsProps {
  onBackgroundChange?: (backgroundUrl: string | null) => void;
  pomodoroTheme: PomodoroTheme;
  onPomodoroThemeChange: (theme: PomodoroTheme) => void;
}

export const Settings = ({ onBackgroundChange, pomodoroTheme, onPomodoroThemeChange }: SettingsProps) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(
    localStorage.getItem('habitstack-notifications') !== 'false'
  );

  const handleNotificationToggle = (enabled: boolean) => {
    setNotifications(enabled);
    localStorage.setItem('habitstack-notifications', enabled.toString());
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <SettingsIcon className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <SettingsIcon className="h-5 w-5" />
            <span>Settings</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appearance" className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span>Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="pomodoro" className="flex items-center space-x-2">
              <Timer className="h-4 w-4" />
              <span>Pomodoro</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="mt-6">
            <BackgroundSettings onBackgroundChange={onBackgroundChange} />
          </TabsContent>

          <TabsContent value="pomodoro" className="mt-6">
            <PomodoroThemeSelector 
              selectedTheme={pomodoroTheme.id}
              onThemeChange={onPomodoroThemeChange}
            />
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card className="p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">Notification Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Control when and how you receive notifications
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Task Completion Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Get notified when tasks and breaks are completed
                    </p>
                  </div>
                  <Switch
                    checked={notifications}
                    onCheckedChange={handleNotificationToggle}
                  />
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    💡 Notifications help you stay on track with your productivity goals.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Check, Palette } from 'lucide-react'

export interface PomodoroTheme {
  id: string
  name: string
  colors: {
    background: string
    text: string
    accent: string
    gradient: string
  }
  preview: {
    background: string
    timer: string
    button: string
  }
  customStyles?: {
    primaryColor: string
    secondaryColor: string
  }
}

const themes: PomodoroTheme[] = [
  {
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
  },
  {
    id: 'sunset',
    name: 'Sunset',
    colors: {
      background: 'from-orange-500/20 to-pink-500/20',
      text: 'text-orange-900 dark:text-orange-100',
      accent: 'border-orange-500/30',
      gradient: 'from-orange-500 to-pink-500'
    },
    preview: {
      background: 'bg-gradient-to-br from-orange-500/20 to-pink-500/20',
      timer: 'text-orange-900',
      button: 'bg-gradient-to-r from-orange-500 to-pink-500'
    }
  },
  {
    id: 'forest',
    name: 'Forest',
    colors: {
      background: 'from-green-500/20 to-emerald-500/20',
      text: 'text-green-900 dark:text-green-100',
      accent: 'border-green-500/30',
      gradient: 'from-green-500 to-emerald-500'
    },
    preview: {
      background: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
      timer: 'text-green-900',
      button: 'bg-gradient-to-r from-green-500 to-emerald-500'
    }
  },
  {
    id: 'pomofocus',
    name: 'PomoFocus',
    colors: {
      background: 'from-red-400/30 to-pink-400/30',
      text: 'text-white dark:text-white',
      accent: 'border-red-400/40',
      gradient: 'from-red-400 to-pink-400'
    },
    preview: {
      background: 'bg-gradient-to-br from-red-400/30 to-pink-400/30',
      timer: 'text-white',
      button: 'bg-gradient-to-r from-red-400 to-pink-400'
    }
  }
]

interface PomodoroThemeSelectorProps {
  selectedTheme: string
  onThemeChange: (theme: PomodoroTheme) => void
}

interface CustomColors {
  primary: string
  secondary: string
}

export const PomodoroThemeSelector = ({ selectedTheme, onThemeChange }: PomodoroThemeSelectorProps) => {
  const [showCustom, setShowCustom] = useState(false)
  const [customColors, setCustomColors] = useState<CustomColors>({
    primary: '#3b82f6',
    secondary: '#1e40af'
  })

  const handleCustomThemeCreate = () => {
    const customTheme: PomodoroTheme = {
      id: 'custom',
      name: 'Custom',
      colors: {
        background: 'custom-bg',
        text: 'text-foreground',
        accent: 'custom-accent',
        gradient: 'custom-gradient'
      },
      preview: {
        background: 'custom-bg',
        timer: 'text-foreground', 
        button: 'custom-gradient'
      },
      // Add custom style properties for inline styles
      customStyles: {
        primaryColor: customColors.primary,
        secondaryColor: customColors.secondary
      }
    }
    onThemeChange(customTheme)
    setShowCustom(false)
  }

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-semibold mb-1">Pomodoro Timer Theme</h3>
        <p className="text-xs text-muted-foreground">Choose a visual theme for your Pomodoro timer</p>
      </div>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
        {themes.map((theme) => {
          const isSelected = selectedTheme === theme.id
          
          return (
            <Card
              key={theme.id}
              className={`relative cursor-pointer transition-all hover:scale-105 ${
                isSelected ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => onThemeChange(theme)}
            >
              <div 
                className={theme.customStyles ? 'p-3 rounded-lg relative' : `p-3 rounded-lg ${theme.preview.background} relative`}
                style={theme.customStyles ? {
                  background: `linear-gradient(135deg, ${theme.customStyles.primaryColor}20, ${theme.customStyles.secondaryColor}20)`
                } : undefined}
              >
                {isSelected && (
                  <div className="absolute top-1 right-1">
                    <Badge className="bg-primary text-primary-foreground text-xs">
                      <Check className="h-2 w-2" />
                    </Badge>
                  </div>
                )}
                
                <div className="text-center space-y-2">
                  {/* Mini timer preview */}
                  <div className={`text-lg font-mono font-bold ${theme.preview.timer}`}>
                    25:00
                  </div>
                  
                  {/* Mini button preview */}
                  <div 
                    className={theme.customStyles ? "h-4 rounded-full mx-2" : `h-4 rounded-full ${theme.preview.button} mx-2`}
                    style={theme.customStyles ? {
                      background: `linear-gradient(90deg, ${theme.customStyles.primaryColor}, ${theme.customStyles.secondaryColor})`
                    } : undefined}
                  />
                  
                  {/* Theme name */}
                  <p className="text-xs font-medium text-foreground">{theme.name}</p>
                </div>
              </div>
            </Card>
          )
        })}
        </div>

        {/* Custom Color Picker */}
        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowCustom(!showCustom)}
            className="w-full flex items-center space-x-2 text-xs"
          >
            <Palette className="h-3 w-3" />
            <span>Create Custom Theme</span>
          </Button>
          
          {showCustom && (
            <Card className="p-3 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="primary-color" className="text-xs">Primary Color</Label>
                  <Input
                    id="primary-color"
                    type="color"
                    value={customColors.primary}
                    onChange={(e) => setCustomColors(prev => ({ ...prev, primary: e.target.value }))}
                    className="h-8 w-full"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="secondary-color" className="text-xs">Secondary Color</Label>
                  <Input
                    id="secondary-color"
                    type="color"
                    value={customColors.secondary}
                    onChange={(e) => setCustomColors(prev => ({ ...prev, secondary: e.target.value }))}
                    className="h-8 w-full"
                  />
                </div>
              </div>
              
              {/* Preview */}
              <div 
                className="p-2 rounded-lg text-center"
                style={{
                  background: `linear-gradient(135deg, ${customColors.primary}20, ${customColors.secondary}20)`
                }}
              >
                <div className="text-sm font-mono font-bold text-foreground mb-1">25:00</div>
                <div 
                  className="h-2 rounded-full mx-2"
                  style={{
                    background: `linear-gradient(90deg, ${customColors.primary}, ${customColors.secondary})`
                  }}
                />
              </div>
              
              <Button
                onClick={handleCustomThemeCreate}
                size="sm"
                className="w-full text-xs"
              >
                Apply Custom Theme
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
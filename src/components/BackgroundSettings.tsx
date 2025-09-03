import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Upload, Trash2, Eye, EyeOff } from 'lucide-react';

interface BackgroundSettingsProps {
  onBackgroundChange?: (backgroundUrl: string | null) => void;
}

export const BackgroundSettings = ({ onBackgroundChange }: BackgroundSettingsProps) => {
  const [currentBackground, setCurrentBackground] = useState<string | null>(
    localStorage.getItem('habitstack-background') || null
  );
  const [previewMode, setPreviewMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setCurrentBackground(result);
      localStorage.setItem('habitstack-background', result);
      onBackgroundChange?.(result);
      
      toast({
        title: "Background Updated",
        description: "Your background template has been set successfully!",
      });
    };
    reader.readAsDataURL(file);
  };

  const removeBackground = () => {
    setCurrentBackground(null);
    localStorage.removeItem('habitstack-background');
    onBackgroundChange?.(null);
    
    toast({
      title: "Background Removed",
      description: "Background template has been removed.",
    });
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">Background Template</h3>
          <p className="text-sm text-muted-foreground">
            Upload your favorite background image to personalize your workspace
          </p>
        </div>

        {/* Current Background Preview */}
        {currentBackground && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Current Background</Label>
            <div className="relative rounded-lg overflow-hidden border border-border">
              <img
                src={currentBackground}
                alt="Current background"
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={togglePreview}
                    className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                  >
                    {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={removeBackground}
                    className="bg-destructive/80 backdrop-blur-sm border-destructive/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            {currentBackground ? 'Change Background' : 'Upload Background'}
          </Label>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="w-full border-dashed border-2 h-20 hover:bg-muted/50"
          >
            <div className="flex flex-col items-center space-y-2">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Click to upload image
              </span>
            </div>
          </Button>
        </div>

        {/* Tips */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground mb-2">Tips for best results:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Use high-quality images for better appearance</li>
            <li>• Landscape orientation works best</li>
            <li>• Subtle patterns or gradients are recommended</li>
            <li>• Maximum file size: 5MB</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};
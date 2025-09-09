-- Add columns for task ordering and daily assignment
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS assigned_to_today BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS task_order INTEGER DEFAULT 0;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_today ON public.tasks (user_id, assigned_to_today, task_order);
CREATE INDEX IF NOT EXISTS idx_tasks_order ON public.tasks (user_id, task_order);
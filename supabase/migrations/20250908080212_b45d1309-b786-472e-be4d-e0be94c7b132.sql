-- Add DELETE policy for pomodoro_sessions table to allow users to delete their own sessions
CREATE POLICY "Users can delete their own sessions" 
ON public.pomodoro_sessions 
FOR DELETE 
USING (auth.uid() = user_id);
-- Drop existing feedback policies and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Admins can delete feedback" ON public.feedback;
DROP POLICY IF EXISTS "Admins can update feedback" ON public.feedback;
DROP POLICY IF EXISTS "Admins can view all feedback" ON public.feedback;
DROP POLICY IF EXISTS "Users can insert their own feedback" ON public.feedback;
DROP POLICY IF EXISTS "Users can view their own feedback" ON public.feedback;

-- Recreate feedback policies as PERMISSIVE (default)
CREATE POLICY "Admins can delete feedback" 
ON public.feedback 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update feedback" 
ON public.feedback 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view all feedback" 
ON public.feedback 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can insert their own feedback" 
ON public.feedback 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback" 
ON public.feedback 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Drop existing user_reminders policies and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Admins can manage all reminders" ON public.user_reminders;
DROP POLICY IF EXISTS "Admins can view all reminders" ON public.user_reminders;
DROP POLICY IF EXISTS "Users can delete their own reminders" ON public.user_reminders;
DROP POLICY IF EXISTS "Users can insert their own reminders" ON public.user_reminders;
DROP POLICY IF EXISTS "Users can update their own reminders" ON public.user_reminders;
DROP POLICY IF EXISTS "Users can view their own reminders" ON public.user_reminders;

-- Recreate user_reminders policies as PERMISSIVE
CREATE POLICY "Admins can manage all reminders" 
ON public.user_reminders 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can delete their own reminders" 
ON public.user_reminders 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reminders" 
ON public.user_reminders 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders" 
ON public.user_reminders 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own reminders" 
ON public.user_reminders 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);
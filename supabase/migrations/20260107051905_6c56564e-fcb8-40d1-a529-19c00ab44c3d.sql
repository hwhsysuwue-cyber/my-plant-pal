-- 1. PROFILES TABLE: Update policies to authenticated users only
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. USER REMINDERS: Remove broad ALL policy and create separate policies
DROP POLICY IF EXISTS "Admins can manage all reminders" ON public.user_reminders;
DROP POLICY IF EXISTS "Admins can view all reminders" ON public.user_reminders;

CREATE POLICY "Admins can select all reminders" 
ON public.user_reminders 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all reminders" 
ON public.user_reminders 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete all reminders" 
ON public.user_reminders 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert reminders for users" 
ON public.user_reminders 
FOR INSERT 
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 3. REMINDER TEMPLATES: Restrict SELECT to authenticated users only
DROP POLICY IF EXISTS "Anyone can view reminder templates" ON public.reminder_templates;

CREATE POLICY "Authenticated users can view reminder templates" 
ON public.reminder_templates 
FOR SELECT 
TO authenticated
USING (true);

-- 4. Ensure other admin policies use TO authenticated
DROP POLICY IF EXISTS "Admins can insert reminder templates" ON public.reminder_templates;
DROP POLICY IF EXISTS "Admins can update reminder templates" ON public.reminder_templates;
DROP POLICY IF EXISTS "Admins can delete reminder templates" ON public.reminder_templates;

CREATE POLICY "Admins can insert reminder templates" 
ON public.reminder_templates 
FOR INSERT 
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update reminder templates" 
ON public.reminder_templates 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete reminder templates" 
ON public.reminder_templates 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
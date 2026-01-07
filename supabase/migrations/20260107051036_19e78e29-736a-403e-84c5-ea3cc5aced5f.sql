-- Add foreign key from user_reminders to profiles
ALTER TABLE public.user_reminders
ADD CONSTRAINT user_reminders_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Allow admins to view all profiles (needed to assign reminders)
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
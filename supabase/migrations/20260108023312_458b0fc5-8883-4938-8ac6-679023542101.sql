-- Delete feedback entries where user_id doesn't exist in profiles
DELETE FROM public.feedback 
WHERE user_id NOT IN (SELECT user_id FROM public.profiles);

-- Add foreign key relationship from feedback.user_id to profiles.user_id
ALTER TABLE public.feedback
ADD CONSTRAINT feedback_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
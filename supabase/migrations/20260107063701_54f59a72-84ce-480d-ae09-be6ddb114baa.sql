-- Add column to track if first login email was sent
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS first_login_email_sent BOOLEAN DEFAULT FALSE;
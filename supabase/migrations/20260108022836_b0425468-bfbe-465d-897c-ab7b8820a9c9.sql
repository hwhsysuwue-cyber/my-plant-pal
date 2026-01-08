-- Add admin_reply column to feedback table
ALTER TABLE public.feedback 
ADD COLUMN admin_reply text,
ADD COLUMN replied_at timestamp with time zone;
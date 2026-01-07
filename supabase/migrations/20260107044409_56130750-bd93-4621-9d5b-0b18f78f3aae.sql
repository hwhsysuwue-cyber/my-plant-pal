-- Create feedback status enum
CREATE TYPE public.feedback_status AS ENUM ('new', 'reviewed', 'resolved');

-- Create feedback type enum
CREATE TYPE public.feedback_type AS ENUM ('feedback', 'suggestion', 'issue');

-- Create feedback table
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type feedback_type NOT NULL DEFAULT 'feedback',
  message TEXT NOT NULL,
  status feedback_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Users can submit their own feedback
CREATE POLICY "Users can insert their own feedback"
ON public.feedback
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view their own feedback
CREATE POLICY "Users can view their own feedback"
ON public.feedback
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all feedback
CREATE POLICY "Admins can view all feedback"
ON public.feedback
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update feedback
CREATE POLICY "Admins can update feedback"
ON public.feedback
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete feedback
CREATE POLICY "Admins can delete feedback"
ON public.feedback
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_feedback_updated_at
BEFORE UPDATE ON public.feedback
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create reminder_templates table
CREATE TABLE public.reminder_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plant_id UUID REFERENCES public.plants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  reminder_type TEXT NOT NULL,
  frequency_days INTEGER NOT NULL DEFAULT 7,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reminder_templates ENABLE ROW LEVEL SECURITY;

-- Anyone can view reminder templates
CREATE POLICY "Anyone can view reminder templates"
ON public.reminder_templates
FOR SELECT
USING (true);

-- Admins can insert reminder templates
CREATE POLICY "Admins can insert reminder templates"
ON public.reminder_templates
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update reminder templates
CREATE POLICY "Admins can update reminder templates"
ON public.reminder_templates
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete reminder templates
CREATE POLICY "Admins can delete reminder templates"
ON public.reminder_templates
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_reminder_templates_updated_at
BEFORE UPDATE ON public.reminder_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create user_reminders table to track individual user reminders
CREATE TABLE public.user_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plant_id UUID REFERENCES public.plants(id) ON DELETE CASCADE NOT NULL,
  reminder_template_id UUID REFERENCES public.reminder_templates(id) ON DELETE CASCADE,
  next_reminder_date DATE NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_reminders ENABLE ROW LEVEL SECURITY;

-- Users can view their own reminders
CREATE POLICY "Users can view their own reminders"
ON public.user_reminders
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own reminders
CREATE POLICY "Users can insert their own reminders"
ON public.user_reminders
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own reminders
CREATE POLICY "Users can update their own reminders"
ON public.user_reminders
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own reminders
CREATE POLICY "Users can delete their own reminders"
ON public.user_reminders
FOR DELETE
USING (auth.uid() = user_id);

-- Admins can view all reminders
CREATE POLICY "Admins can view all reminders"
ON public.user_reminders
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can manage all reminders
CREATE POLICY "Admins can manage all reminders"
ON public.user_reminders
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));
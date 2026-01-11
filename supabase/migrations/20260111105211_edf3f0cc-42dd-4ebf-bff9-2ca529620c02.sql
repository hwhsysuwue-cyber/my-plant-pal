-- Create table for plant dropdown options
CREATE TABLE public.plant_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  field_name text NOT NULL,
  value text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  UNIQUE(field_name, value)
);

-- Enable RLS
ALTER TABLE public.plant_options ENABLE ROW LEVEL SECURITY;

-- Everyone can view options
CREATE POLICY "Anyone can view plant options"
ON public.plant_options
FOR SELECT
USING (true);

-- Only admins can insert options
CREATE POLICY "Admins can insert plant options"
ON public.plant_options
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update options
CREATE POLICY "Admins can update plant options"
ON public.plant_options
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete options
CREATE POLICY "Admins can delete plant options"
ON public.plant_options
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default options
INSERT INTO public.plant_options (field_name, value) VALUES
-- Categories
('category', 'Indoor'),
('category', 'Outdoor'),
('category', 'Tropical'),
('category', 'Succulent'),
('category', 'Flowering'),
('category', 'Herb'),
('category', 'Vegetable'),
-- Types
('type', 'Aroid'),
('type', 'Fern'),
('type', 'Palm'),
('type', 'Cactus'),
('type', 'Vine'),
('type', 'Shrub'),
('type', 'Tree'),
-- Watering schedules
('watering_schedule', 'Daily'),
('watering_schedule', 'Every 2-3 days'),
('watering_schedule', 'Weekly'),
('watering_schedule', 'Every 2 weeks'),
('watering_schedule', 'Monthly'),
-- Sunlight requirements
('sunlight_requirement', 'Full Sun'),
('sunlight_requirement', 'Partial Sun'),
('sunlight_requirement', 'Partial Shade'),
('sunlight_requirement', 'Full Shade'),
('sunlight_requirement', 'Indirect Light'),
-- Soil types
('soil_type', 'Well-draining'),
('soil_type', 'Sandy'),
('soil_type', 'Loamy'),
('soil_type', 'Clay'),
('soil_type', 'Peat-based'),
('soil_type', 'Cactus mix');

-- Create storage bucket for plant images
INSERT INTO storage.buckets (id, name, public) VALUES ('plant-images', 'plant-images', true);

-- Storage policies for plant images
CREATE POLICY "Anyone can view plant images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'plant-images');

CREATE POLICY "Admins can upload plant images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'plant-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update plant images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'plant-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete plant images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'plant-images' AND has_role(auth.uid(), 'admin'::app_role));
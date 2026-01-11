import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type PlantFieldName = 
  | 'category' 
  | 'type' 
  | 'watering_schedule' 
  | 'sunlight_requirement' 
  | 'soil_type';

interface PlantOption {
  id: string;
  field_name: string;
  value: string;
  created_at: string;
}

export function usePlantOptions(fieldName: PlantFieldName) {
  const queryClient = useQueryClient();

  const { data: options = [], isLoading } = useQuery({
    queryKey: ['plant-options', fieldName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plant_options')
        .select('*')
        .eq('field_name', fieldName)
        .order('value', { ascending: true });
      
      if (error) throw error;
      return data as PlantOption[];
    },
  });

  const createOption = useMutation({
    mutationFn: async (value: string) => {
      const trimmedValue = value.trim();
      
      // Validation
      if (!trimmedValue) {
        throw new Error('Value cannot be empty');
      }
      
      if (/^\d+$/.test(trimmedValue)) {
        throw new Error('Value cannot be numeric only');
      }
      
      // Case-insensitive duplicate check
      const existing = options.find(
        opt => opt.value.toLowerCase() === trimmedValue.toLowerCase()
      );
      if (existing) {
        return existing;
      }
      
      const { data, error } = await supabase
        .from('plant_options')
        .insert([{ field_name: fieldName, value: trimmedValue }])
        .select()
        .single();
      
      if (error) throw error;
      return data as PlantOption;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plant-options', fieldName] });
    },
  });

  return {
    options: options.map(opt => opt.value),
    isLoading,
    createOption,
  };
}

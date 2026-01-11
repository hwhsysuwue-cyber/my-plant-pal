import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CreatableCombobox } from './CreatableCombobox';
import { ImageUpload } from './ImageUpload';
import { usePlantOptions, PlantFieldName } from '@/hooks/usePlantOptions';
import { toast } from 'sonner';

const plantSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  type: z.string().min(1, 'Type is required'),
  watering_schedule: z.string().min(1, 'Watering schedule is required'),
  sunlight_requirement: z.string().min(1, 'Sunlight requirement is required'),
  soil_type: z.string().min(1, 'Soil type is required'),
  description: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal('')),
});

type PlantFormValues = z.infer<typeof plantSchema>;

interface PlantFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: PlantFormValues) => void;
  initialValues?: Partial<PlantFormValues>;
  isLoading?: boolean;
}

interface FieldConfig {
  name: PlantFieldName;
  label: string;
}

const DROPDOWN_FIELDS: FieldConfig[] = [
  { name: 'category', label: 'Category' },
  { name: 'type', label: 'Type' },
  { name: 'watering_schedule', label: 'Watering Schedule' },
  { name: 'sunlight_requirement', label: 'Sunlight Requirement' },
  { name: 'soil_type', label: 'Soil Type' },
];

function PlantOptionField({
  fieldName,
  label,
  value,
  onChange,
  disabled,
}: {
  fieldName: PlantFieldName;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const { options, isLoading, createOption } = usePlantOptions(fieldName);

  const handleCreate = async (newValue: string) => {
    try {
      await createOption.mutateAsync(newValue);
    } catch (error) {
      toast.error(`Failed to add ${label.toLowerCase()}: ${(error as Error).message}`);
      throw error;
    }
  };

  return (
    <CreatableCombobox
      options={options}
      value={value}
      onChange={onChange}
      onCreateOption={handleCreate}
      placeholder={`Select or type to add new`}
      isLoading={isLoading}
      isCreating={createOption.isPending}
      disabled={disabled}
      canCreate={true}
    />
  );
}

export function PlantFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
  isLoading,
}: PlantFormDialogProps) {
  const form = useForm<PlantFormValues>({
    resolver: zodResolver(plantSchema),
    defaultValues: {
      name: '',
      category: '',
      type: '',
      watering_schedule: '',
      sunlight_requirement: '',
      soil_type: '',
      description: '',
      image_url: '',
      ...initialValues,
    },
  });

  const handleSubmit = (values: PlantFormValues) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {initialValues ? 'Edit Plant' : 'Add New Plant'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plant Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Monstera Deliciosa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plant Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value || ''}
                      onChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dropdown Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DROPDOWN_FIELDS.slice(0, 2).map((config) => (
                <FormField
                  key={config.name}
                  control={form.control}
                  name={config.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{config.label}</FormLabel>
                      <FormControl>
                        <PlantOptionField
                          fieldName={config.name}
                          label={config.label}
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {/* Remaining Dropdown Fields */}
            {DROPDOWN_FIELDS.slice(2).map((config) => (
              <FormField
                key={config.name}
                control={form.control}
                name={config.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{config.label}</FormLabel>
                    <FormControl>
                      <PlantOptionField
                        fieldName={config.name}
                        label={config.label}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the plant..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? 'Saving...' : initialValues ? 'Update Plant' : 'Add Plant'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

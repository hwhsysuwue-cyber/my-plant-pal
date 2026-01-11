import { useState, useRef, useEffect } from 'react';
import { Check, ChevronsUpDown, Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

interface CreatableComboboxProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  onCreateOption?: (value: string) => Promise<void>;
  placeholder?: string;
  isLoading?: boolean;
  isCreating?: boolean;
  disabled?: boolean;
  canCreate?: boolean;
}

export function CreatableCombobox({
  options,
  value,
  onChange,
  onCreateOption,
  placeholder = 'Select or type to add new',
  isLoading = false,
  isCreating = false,
  disabled = false,
  canCreate = true,
}: CreatableComboboxProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [recentlyCreated, setRecentlyCreated] = useState<string[]>([]);

  const trimmedInput = inputValue.trim();
  const isExactMatch = options.some(
    opt => opt.toLowerCase() === trimmedInput.toLowerCase()
  );
  const canCreateNew = canCreate && trimmedInput && !isExactMatch && !/^\d+$/.test(trimmedInput);

  const handleCreate = async () => {
    if (!onCreateOption || !canCreateNew) return;
    
    try {
      await onCreateOption(trimmedInput);
      setRecentlyCreated(prev => [...prev, trimmedInput]);
      onChange(trimmedInput);
      setInputValue('');
      setOpen(false);
    } catch (error) {
      console.error('Failed to create option:', error);
    }
  };

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setInputValue('');
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canCreateNew && !isCreating) {
      e.preventDefault();
      handleCreate();
    }
  };

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(trimmedInput.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
          disabled={disabled || isLoading}
        >
          {isLoading ? (
            <span className="text-muted-foreground">Loading...</span>
          ) : value ? (
            <span className="flex items-center gap-2">
              {value}
              {recentlyCreated.includes(value) && (
                <Badge variant="secondary" className="text-xs py-0 px-1">
                  New
                </Badge>
              )}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 z-50" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={inputValue}
            onValueChange={setInputValue}
            onKeyDown={handleKeyDown}
          />
          <CommandList>
            {filteredOptions.length === 0 && !canCreateNew && (
              <CommandEmpty>No options found.</CommandEmpty>
            )}
            
            {canCreateNew && (
              <CommandGroup>
                <CommandItem
                  onSelect={handleCreate}
                  className="text-primary cursor-pointer"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  Add "{trimmedInput}"
                </CommandItem>
              </CommandGroup>
            )}
            
            {filteredOptions.length > 0 && (
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => handleSelect(option)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === option ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <span className="flex items-center gap-2">
                      {option}
                      {recentlyCreated.includes(option) && (
                        <Badge variant="secondary" className="text-xs py-0 px-1">
                          New
                        </Badge>
                      )}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

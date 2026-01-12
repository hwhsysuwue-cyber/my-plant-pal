import { useState, useRef, useEffect, useCallback } from 'react';
import { Check, Loader2, ChevronDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

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
  placeholder = 'Type or select value',
  isLoading = false,
  isCreating = false,
  disabled = false,
  canCreate = true,
}: CreatableComboboxProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [recentlyCreated, setRecentlyCreated] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync input value with prop value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const trimmedInput = inputValue.trim();
  
  // Case-insensitive match check
  const findExactMatch = useCallback((searchValue: string) => {
    return options.find(opt => opt.toLowerCase() === searchValue.toLowerCase());
  }, [options]);

  const isExactMatch = findExactMatch(trimmedInput);
  const canCreateNew = canCreate && trimmedInput && !isExactMatch && !/^\d+$/.test(trimmedInput);

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(trimmedInput.toLowerCase())
  );

  const handleCreateOrSelect = async () => {
    if (!trimmedInput) return;

    // Check for existing match (case-insensitive)
    const existingMatch = findExactMatch(trimmedInput);
    
    if (existingMatch) {
      // Select existing option
      onChange(existingMatch);
      setInputValue(existingMatch);
    } else if (canCreateNew && onCreateOption) {
      // Create new option
      try {
        await onCreateOption(trimmedInput);
        setRecentlyCreated(prev => [...prev, trimmedInput]);
        onChange(trimmedInput);
        toast({
          title: "Option created",
          description: `"${trimmedInput}" has been added and selected.`,
        });
      } catch (error) {
        console.error('Failed to create option:', error);
        toast({
          title: "Failed to create option",
          description: "Please try again.",
          variant: "destructive",
        });
        // Revert to previous value on error
        setInputValue(value);
      }
    }
    
    setOpen(false);
  };

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setInputValue(selectedValue);
    setOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreateOrSelect();
    } else if (e.key === 'Escape') {
      setInputValue(value);
      setOpen(false);
      inputRef.current?.blur();
    } else if (e.key === 'ArrowDown' && !open) {
      setOpen(true);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Check if focus is moving within the container
    if (containerRef.current?.contains(e.relatedTarget as Node)) {
      return;
    }
    
    // Delay to allow click events on dropdown items
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        handleCreateOrSelect();
      }
    }, 150);
  };

  const handleFocus = () => {
    setOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (!open) setOpen(true);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          className={cn(
            "pr-8",
            isCreating && "opacity-70"
          )}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isCreating ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <ChevronDown 
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform cursor-pointer",
                open && "rotate-180"
              )}
              onClick={() => {
                setOpen(!open);
                if (!open) inputRef.current?.focus();
              }}
            />
          )}
        </div>
      </div>

      {open && (filteredOptions.length > 0 || canCreateNew) && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
          <div className="max-h-60 overflow-auto p-1">
            {canCreateNew && (
              <div
                className={cn(
                  "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent font-medium",
                  isCreating ? "text-muted-foreground" : "text-primary"
                )}
                onMouseDown={(e) => {
                  e.preventDefault();
                  if (!isCreating) handleCreateOrSelect();
                }}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating "{trimmedInput}"...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Create "{trimmedInput}"</span>
                    <Badge variant="secondary" className="text-xs py-0 px-1 ml-auto">
                      Enter
                    </Badge>
                  </>
                )}
              </div>
            )}
            
            {filteredOptions.map((option) => (
              <div
                key={option}
                className={cn(
                  "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent",
                  value === option && "bg-accent"
                )}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(option);
                }}
              >
                <Check
                  className={cn(
                    'h-4 w-4 shrink-0',
                    value === option ? 'opacity-100' : 'opacity-0'
                  )}
                />
                <span className="flex items-center gap-2 flex-1">
                  {option}
                  {recentlyCreated.includes(option) && (
                    <Badge variant="secondary" className="text-xs py-0 px-1">
                      New
                    </Badge>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

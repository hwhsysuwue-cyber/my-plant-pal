import { Search as SearchIcon, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PlantFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  categories: string[];
  types: string[];
  onClear: () => void;
}

export function PlantFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedType,
  onTypeChange,
  categories,
  types,
  onClear,
}: PlantFiltersProps) {
  const hasFilters = searchTerm || selectedCategory !== 'all' || selectedType !== 'all';

  return (
    <div className="space-y-4 p-6 bg-card border border-border/40 rounded-2xl shadow-soft animate-fade-in">
      {/* Search Input */}
      <div className="relative group">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Search plants by name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 h-12 text-base bg-background border-border/50 rounded-xl focus:ring-2 focus:ring-primary/15 focus:border-primary/30 transition-all duration-200"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-secondary transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground sm:hidden mb-1">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="font-medium">Filters</span>
        </div>
        
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full sm:w-[180px] h-11 bg-background border-border/50 rounded-xl hover:border-primary/30 transition-colors">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border/50 shadow-elevated">
            <SelectItem value="all" className="rounded-lg">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category} className="rounded-lg">
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className="w-full sm:w-[180px] h-11 bg-background border-border/50 rounded-xl hover:border-primary/30 transition-colors">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border/50 shadow-elevated">
            <SelectItem value="all" className="rounded-lg">All Types</SelectItem>
            {types.map((type) => (
              <SelectItem key={type} value={type} className="rounded-lg">
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClear} 
            className="h-11 px-5 w-full sm:w-auto text-muted-foreground hover:text-foreground rounded-xl"
          >
            <X className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
}
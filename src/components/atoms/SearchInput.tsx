import React from 'react';
import { Search, X } from 'lucide-react';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search cards, symbols, or terms...',
  className = '',
}) => {
  return (
    <div className={`relative flex items-center w-full group ${className}`}>
      <Search className="w-4 h-4 text-[#c5a059] absolute left-3.5 pointer-events-none transition-colors duration-200 group-focus-within:text-[#f0d8a4]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#0a0a0e]/90 text-stone-100 placeholder-stone-500 pl-10 pr-9 py-2.5 rounded-lg border border-[#c5a059]/25 hover:border-[#c5a059]/50 focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059]/40 text-xs sm:text-sm font-sans tracking-wide shadow-inner focus:outline-none transition-all duration-200 backdrop-blur-md"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 text-stone-400 hover:text-[#c5a059] p-0.5 rounded-full hover:bg-white/5 cursor-pointer transition-colors"
          title="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};


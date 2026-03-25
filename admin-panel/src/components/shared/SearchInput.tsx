import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounce?: number;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  debounce = 400,
}: SearchInputProps) {
  const [internal, setInternal] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setInternal(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternal(e.target.value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onChange(e.target.value), debounce);
  };

  const clear = () => {
    setInternal('');
    onChange('');
  };

  return (
    <div className="relative">
      <Search
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none"
      />
      <input
        value={internal}
        onChange={handleChange}
        placeholder={placeholder}
        className="h-9 w-64 rounded-lg border border-white/[0.08] bg-white/[0.04] pl-8 pr-8 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-colors"
      />
      {internal && (
        <button
          onClick={clear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}

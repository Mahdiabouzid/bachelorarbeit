interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  'data-testid'?: string;
  'aria-label'?: string;
}

const Toggle = ({ label, checked, onChange, 'data-testid': testId, 'aria-label': ariaLabel }: ToggleProps) => {
  return (
    <label className="flex items-center cursor-pointer">
      <span className="mr-3 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          data-testid={testId}
          aria-label={ariaLabel || label}
        />

        <div className={`block w-10 h-6 rounded-full transition-colors ${checked ? 'bg-[var(--color-accent-primary)]' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'transform translate-x-4' : ''}`}></div>
      </div>
    </label>
  );
};

export default Toggle;
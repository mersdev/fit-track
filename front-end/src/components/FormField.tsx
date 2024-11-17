interface FormFieldProps {
  label: string;
  type: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
}

export function FormField({
  label,
  type,
  value,
  onChange,
  min,
  max,
  step,
  required,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-secondary-700">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        required={required}
        className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-colors"
      />
    </div>
  );
}

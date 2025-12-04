import React from 'react';

interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  className?: string;
  icon?: React.ReactNode;
}

export const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  maxLength,
  className = '',
  icon
}: InputProps) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        className={`w-full h-14 px-4 ${icon ? 'pl-12' : ''} bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00FF94] transition-colors ${className}`}
      />
    </div>
  );
};

interface OTPInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
}

export const OTPInput = ({ length, value, onChange }: OTPInputProps) => {
  const inputs = Array.from({ length }, (_, i) => i);
  
  return (
    <div className="flex gap-3 justify-center">
      {inputs.map((index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => {
            const newValue = value.split('');
            newValue[index] = e.target.value;
            onChange(newValue.join(''));
            
            if (e.target.value && index < length - 1) {
              const nextInput = e.target.nextElementSibling as HTMLInputElement;
              nextInput?.focus();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !value[index] && index > 0) {
              const prevInput = e.currentTarget.previousElementSibling as HTMLInputElement;
              prevInput?.focus();
            }
          }}
          className="w-14 h-14 bg-white/5 border-2 border-white/10 rounded-2xl text-white text-center focus:outline-none focus:border-[#00FF94] transition-colors"
        />
      ))}
    </div>
  );
};

import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  error?: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  isTextArea?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({ 
  label, 
  name, 
  type = 'text', 
  error, 
  placeholder, 
  register, 
  isTextArea = false 
}) => {
  const id = `input-${name}`;
  const errorId = `${name}-error`;
  const inputClasses = `w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${error ? 'border-red-500' : 'border-gray-300'}`;


  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {isTextArea ? (
        <textarea
          id={id}
          placeholder={placeholder}
          className={inputClasses}
          rows={4}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          {...register}
        />
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          {...register}
        />
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;
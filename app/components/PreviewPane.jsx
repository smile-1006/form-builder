import { useFormStore } from '../state/useFormStore';
import { useState } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function PreviewPane() {
  const { fields, currentStep, totalSteps, setCurrentStep, validateField } = useFormStore();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const currentFields = fields.filter(f => f.step === currentStep);

  const handleFieldChange = (fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    // Clear error when field is modified
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: null }));
    }
  };

  const validateCurrentStep = () => {
    const newErrors = {};
    let isValid = true;

    currentFields.forEach(field => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = () => {
    if (validateCurrentStep()) {
      // Handle form submission
      console.log('Form submitted:', formData);
    }
  };

  const renderField = (field) => {
    const commonProps = {
      id: field.id,
      name: field.id,
      value: formData[field.id] || '',
      onChange: (e) => handleFieldChange(field.id, e.target.value),
      placeholder: field.placeholder,
      required: field.required,
      className: `mt-1 block w-full rounded-md shadow-sm transition duration-150 ease-in-out ${
        errors[field.id] 
          ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:focus:border-red-500' 
          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:focus:border-blue-500'
      } dark:bg-gray-700 dark:text-white`,
      "aria-describedby": errors[field.id] ? `${field.id}-error` : undefined
    };

    switch (field.type) {
      case 'text':
        return <input type="text" {...commonProps} />;
      case 'textarea':
        return <textarea {...commonProps} rows={4} />;
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              {...commonProps}
              checked={formData[field.id] || false}
              onChange={(e) => handleFieldChange(field.id, e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={field.id} className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
              {field.label}
            </label>
          </div>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option} className="flex items-center">
                <input
                  type="radio"
                  id={`${field.id}-${option}`}
                  name={field.id}
                  value={option}
                  checked={formData[field.id] === option}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className="h-4 w-4 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={`${field.id}-${option}`} className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-[600px]">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          <span>Progress</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300 ease-in-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
          Step {currentStep} of {totalSteps}
        </p>
      </div>

      {/* Form Fields */}
      <div className="flex-1 space-y-6">
        {currentFields.map((field) => (
          <div 
            key={field.id} 
            className="group bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
          >
            {field.type !== 'checkbox' && (
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            {renderField(field)}
            {field.helpText && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {field.helpText}
              </p>
            )}
            {errors[field.id] && (
              <div className="mt-2 flex items-center space-x-2 text-red-600 dark:text-red-400">
                <XMarkIcon className="h-4 w-4" />
                <p className="text-sm" id={`${field.id}-error`}>
                  {errors[field.id]}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setCurrentStep(currentStep - 1)}
          type="button"
          disabled={currentStep === 1}
          className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
            ${currentStep > 1
              ? 'text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              : 'invisible'
            }`}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>
        
        <button
          onClick={currentStep < totalSteps ? handleNext : handleSubmit}
          type="button"
          className="flex items-center space-x-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <span>{currentStep < totalSteps ? 'Next' : 'Submit'}</span>
          {currentStep < totalSteps ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          ) : (
            <CheckIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
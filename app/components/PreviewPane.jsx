import { useFormStore } from '../state/useFormStore';

export default function PreviewPane() {
  const { fields, currentStep } = useFormStore();
  const currentFields = fields.filter(f => f.step === currentStep);

  const renderField = (field) => {
    const commonProps = {
      id: field.id,
      name: field.id,
      placeholder: field.placeholder,
      required: field.required,
      className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500",
      "aria-describedby": field.helpText ? `${field.id}-description` : undefined
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
          <input
            type="checkbox"
            {...commonProps}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
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
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={`${field.id}-${option}`} className="ml-2 block text-sm text-gray-900">
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
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Form Preview - Step {currentStep}</h2>
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {currentFields.map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderField(field)}
            {field.helpText && (
              <p className="mt-2 text-sm text-gray-500" id={`${field.id}-description`}>
                {field.helpText}
              </p>
            )}
          </div>
        ))}
      </form>
    </div>
  );
}
import { useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useFormStore } from "../state/useFormStore";

export default function FormPreview() {
  const { id } = useParams();
  const loadForm = useFormStore(state => state.loadForm);
  const fields = useFormStore(state => state.fields);
  const currentStep = useFormStore(state => state.currentStep);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      loadForm(id);
    }
  }, [id, loadForm]);

  const validateField = (field, value) => {
    if (field.required && !value) {
      return 'This field is required';
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    let hasErrors = false;

    fields.forEach(field => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (!hasErrors) {
      // Here you would typically submit the form data to your backend
      console.log('Form submitted:', formData);
      alert('Form submitted successfully!');
    }
  };

  const handleChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: null
      }));
    }
  };

  const renderField = (field) => {
    const commonProps = {
      id: field.id,
      name: field.id,
      value: formData[field.id] || '',
      onChange: (e) => handleChange(field.id, e.target.value),
      placeholder: field.placeholder,
      required: field.required,
      className: `mt-1 block w-full rounded-md ${
        errors[field.id] 
          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
      }`,
      "aria-describedby": `${field.id}-error`
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
            checked={formData[field.id] || false}
            onChange={(e) => handleChange(field.id, e.target.checked)}
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
                  checked={formData[field.id] === option}
                  onChange={(e) => handleChange(field.id, e.target.value)}
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

  const currentFields = fields.filter(f => f.step === currentStep);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Form Preview</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {currentFields.map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field)}
                {field.helpText && (
                  <p className="mt-2 text-sm text-gray-500">
                    {field.helpText}
                  </p>
                )}
                {errors[field.id] && (
                  <p className="mt-2 text-sm text-red-600" id={`${field.id}-error`}>
                    {errors[field.id]}
                  </p>
                )}
              </div>
            ))}
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Builder
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
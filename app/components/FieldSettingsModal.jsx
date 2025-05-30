import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useFormStore } from '../state/useFormStore';

export default function FieldSettingsModal({ field, onClose }) {
  const { updateField, totalSteps } = useFormStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updates = {
      label: formData.get('label'),
      placeholder: formData.get('placeholder'),
      required: formData.get('required') === 'on',
      helpText: formData.get('helpText'),
      step: parseInt(formData.get('step'), 10),
      validation: {
        minLength: formData.get('minLength') ? parseInt(formData.get('minLength'), 10) : null,
        maxLength: formData.get('maxLength') ? parseInt(formData.get('maxLength'), 10) : null,
        pattern: formData.get('pattern') || null,
        message: formData.get('validationMessage') || null
      }
    };
    
    if (field.type === 'select' || field.type === 'radio') {
      updates.options = formData.get('options')
        .split('\n')
        .map(opt => opt.trim())
        .filter(Boolean);
    }
    
    updateField(field.id, updates);
    onClose();
  };

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium mb-4">
                  Edit {field.type} Field
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Label
                      <input
                        type="text"
                        name="label"
                        defaultValue={field.label}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Placeholder
                      <input
                        type="text"
                        name="placeholder"
                        defaultValue={field.placeholder}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Step
                      <select
                        name="step"
                        defaultValue={field.step}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                          <option key={step} value={step}>
                            Step {step}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  {(field.type === 'select' || field.type === 'radio') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Options (one per line)
                        <textarea
                          name="options"
                          defaultValue={field.options?.join('\n')}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          rows={4}
                        />
                      </label>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Help Text
                      <input
                        type="text"
                        name="helpText"
                        defaultValue={field.helpText}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </label>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700">Validation</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Min Length
                          <input
                            type="number"
                            name="minLength"
                            defaultValue={field.validation?.minLength}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Max Length
                          <input
                            type="number"
                            name="maxLength"
                            defaultValue={field.validation?.maxLength}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Pattern (regex)
                        <input
                          type="text"
                          name="pattern"
                          defaultValue={field.validation?.pattern}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Validation Message
                        <input
                          type="text"
                          name="validationMessage"
                          defaultValue={field.validation?.message}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="required"
                      defaultChecked={field.required}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Required field
                    </label>
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
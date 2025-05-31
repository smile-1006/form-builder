import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Transition } from '@headlessui/react';
import { useFormStore } from '../state/useFormStore';

FieldSettingsModal.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    helpText: PropTypes.string,
    required: PropTypes.bool,
    step: PropTypes.number,
    validation: PropTypes.shape({
      minLength: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      maxLength: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      pattern: PropTypes.string,
      message: PropTypes.string
    }),
    options: PropTypes.arrayOf(PropTypes.string)
  }),
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func
};

export default function FieldSettingsModal({ field = {}, isOpen = false, onClose = () => {}, onSave = () => {} }) {
  const { totalSteps } = useFormStore();

  if (!isOpen) {
    return null;
  }

  const {
    type = '',
    label = '',
    placeholder = '',
    helpText = '',
    required = false,
    step = 1,
    validation = {
      minLength: '',
      maxLength: '',
      pattern: '',
      message: ''
    },
    options = []
  } = field;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updates = {
      ...field,
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
    
    if (type === 'select' || type === 'radio') {
      updates.options = formData.get('options')
        .split('\n')
        .map(opt => opt.trim())
        .filter(Boolean);
    }
    
    onSave(updates);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
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
          <div className="fixed inset-0 bg-black bg-opacity-25 dark:bg-opacity-50" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
                  Edit {type} Field
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="label" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Label
                    </label>
                    <input
                      id="label"
                      type="text"
                      name="label"
                      defaultValue={label}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="placeholder" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Placeholder
                    </label>
                    <input
                      id="placeholder"
                      type="text"
                      name="placeholder"
                      defaultValue={placeholder}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="step" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Step
                    </label>
                    <select
                      id="step"
                      name="step"
                      defaultValue={step}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {(type === 'select' || type === 'radio') && (
                    <div>
                      <label htmlFor="options" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Options (one per line)
                      </label>
                      <textarea
                        id="options"
                        name="options"
                        defaultValue={options.join('\n')}
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor="required" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      <input
                        id="required"
                        type="checkbox"
                        name="required"
                        defaultChecked={required}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                      />
                      <span className="ml-2">Required</span>
                    </label>
                  </div>

                  <div>
                    <label htmlFor="helpText" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Help Text
                    </label>
                    <input
                      id="helpText"
                      type="text"
                      name="helpText"
                      defaultValue={helpText}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-gray-900 dark:text-white">Validation</h4>
                    
                    <div>
                      <label htmlFor="minLength" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Minimum Length
                      </label>
                      <input
                        id="minLength"
                        type="number"
                        name="minLength"
                        defaultValue={validation.minLength}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="maxLength" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Maximum Length
                      </label>
                      <input
                        id="maxLength"
                        type="number"
                        name="maxLength"
                        defaultValue={validation.maxLength}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="pattern" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Pattern (Regular Expression)
                      </label>
                      <input
                        id="pattern"
                        type="text"
                        name="pattern"
                        defaultValue={validation.pattern}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="validationMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Validation Message
                      </label>
                      <input
                        id="validationMessage"
                        type="text"
                        name="validationMessage"
                        defaultValue={validation.message}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Save Changes
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
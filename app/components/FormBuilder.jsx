import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { useFormStore } from '../state/useFormStore';
import { Dialog, Transition } from '@headlessui/react';
import FieldBlock from './FieldBlock';
import FieldSettingsModal from './FieldSettingsModal';
import PreviewPane from './PreviewPane';
import DevicePreviewToggler from './DevicePreviewToggler';
import { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { PlusIcon, ArrowUturnLeftIcon, ArrowUturnRightIcon, DocumentArrowDownIcon, EyeIcon } from '@heroicons/react/24/outline';

// Field type definitions
const FIELD_TYPES = [
  { type: 'text', label: 'Text Input', icon: '📝', description: 'Single line text input' },
  { type: 'textarea', label: 'Text Area', icon: '📄', description: 'Multi-line text input' },
  { type: 'select', label: 'Dropdown', icon: '▼', description: 'Select from options' },
  { type: 'checkbox', label: 'Checkbox', icon: '☑️', description: 'Yes/no choice' },
  { type: 'radio', label: 'Radio Group', icon: '⭕', description: 'Multiple choice' },
  { type: 'date', label: 'Date Input', icon: '📅', description: 'Date selection' }
];

// Sortable item component
const SortableItem = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

SortableItem.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default function FormBuilder() {
  const [selectedField, setSelectedField] = useState(null);
  const { 
    fields, 
    addField, 
    removeField,
    updateField: updateFieldInStore,
    duplicateField,
    reorderFields, 
    saveForm,
    currentStep,
    totalSteps,
    setCurrentStep,
    undo,
    redo,
    history,
    currentHistoryIndex,
    formTitle,
    setFormTitle
  } = useFormStore();
  
  const [showFieldMenu, setShowFieldMenu] = useState(false);

  const handleAddField = (type) => {
    const newField = {
      id: crypto.randomUUID(),
      type,
      label: `New ${type} field`,
      placeholder: '',
      required: false,
      step: currentStep,
      validation: {},
      options: type === 'select' || type === 'radio' ? ['Option 1', 'Option 2'] : undefined
    };
    addField(newField);
    setShowFieldMenu(false);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    
    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);
    
    const newFields = [...fields];
    const [movedField] = newFields.splice(oldIndex, 1);
    newFields.splice(newIndex, 0, movedField);
    
    reorderFields(newFields);
  };
  const handleDeleteField = (fieldId) => {
    // The fieldId might come directly or from a field object
    const id = typeof fieldId === 'object' ? fieldId.id : fieldId;
    console.log('handleDeleteField called with id:', id);
    removeField(id);
    if (selectedField?.id === id) {
      setSelectedField(null);
    }
  };

  const handleEditField = (field) => {
    // The field might come as an ID or as a field object
    const fieldToEdit = typeof field === 'string' ? fields.find(f => f.id === field) : field;
    console.log('handleEditField called with field:', fieldToEdit);
    if (fieldToEdit) {
      setSelectedField(fieldToEdit);
    }
  };

  const handleUpdateField = (updatedField) => {
    updateFieldInStore(updatedField.id, updatedField);
    setSelectedField(null);
  };

  const currentFields = fields.filter(f => f.step === currentStep);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-6">
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <div className="w-72 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              {/* Form Title */}
              <div className="mb-4">
                <label htmlFor="formTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Form Title
                </label>
                <input
                  id="formTitle"
                  type="text"
                  value={formTitle || ''}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Enter form title"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Field Controls */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add Fields</h2>
                <button
                  onClick={() => setShowFieldMenu(true)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Templates */}
              <div className="space-y-2">
                {FIELD_TYPES.map((fieldType) => (
                  <button
                    key={fieldType.type}
                    onClick={() => handleAddField(fieldType.type)}
                    className="w-full p-3 text-left rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{fieldType.icon}</span>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{fieldType.label}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{fieldType.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Settings & Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions</h2>
              <div className="space-y-2">
                <button
                  onClick={() => saveForm()}
                  className="w-full flex items-center justify-center space-x-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <DocumentArrowDownIcon className="w-5 h-5" />
                  <span>Save Form</span>
                </button>
                <button
                  onClick={() => {
                    const formId = saveForm();
                    window.open(`/preview/${formId}`, '_blank');
                  }}
                  className="w-full flex items-center justify-center space-x-2 p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <EyeIcon className="w-5 h-5" />
                  <span>Preview</span>
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={undo}
                    disabled={currentHistoryIndex <= 0}
                    className="flex-1 p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
                  >
                    <ArrowUturnLeftIcon className="w-5 h-5 mx-auto" />
                  </button>
                  <button
                    onClick={redo}
                    disabled={currentHistoryIndex >= history.length - 1}
                    className="flex-1 p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
                  >
                    <ArrowUturnRightIcon className="w-5 h-5 mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Form Area */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              {/* Step Navigation */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Step {currentStep} of {totalSteps}
                  </h2>
                  <div className="flex space-x-2">
                    {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                      <button
                        key={step}
                        onClick={() => setCurrentStep(step)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step === currentStep
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {step}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <SortableContext items={currentFields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {currentFields.length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <div className="text-6xl mb-4">👋</div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Start Building Your Form</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">Add fields from the sidebar to create your form</p>
                      <button
                        onClick={() => setShowFieldMenu(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Add Your First Field
                      </button>
                    </div>
                  ) : (
                    currentFields.map((field) => (
                      <SortableItem key={field.id} id={field.id}>                        <FieldBlock
                          field={field}
                          onDelete={handleDeleteField}
                          onEdit={handleEditField}
                        />
                      </SortableItem>
                    ))
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* Preview Panel */}
          <div className="w-1/3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
              <DevicePreviewToggler />
            </div>
            <PreviewPane />
          </div>
        </div>
      </div>

      {/* Field Settings Modal */}
      <FieldSettingsModal
        field={selectedField}
        isOpen={!!selectedField}
        onClose={() => setSelectedField(null)}
        onSave={handleUpdateField}
      />

      {/* Field Type Selection Modal */}
      <Transition appear show={showFieldMenu} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setShowFieldMenu(false)}>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
                    Add New Field
                  </Dialog.Title>
                  <div className="grid grid-cols-2 gap-4">
                    {FIELD_TYPES.map((fieldType) => (
                      <button
                        key={fieldType.type}
                        onClick={() => handleAddField(fieldType.type)}
                        className="flex items-center p-3 border rounded-md hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700"
                      >
                        <span className="text-2xl mr-2">{fieldType.icon}</span>
                        <div className="text-left">
                          <div className="font-medium dark:text-white">{fieldType.label}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export { FormBuilder };

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useFormStore } from '../state/useFormStore';
import FieldBlock from './FieldBlock';
import FieldSettingsModal from './FieldSettingsModal';
import PreviewPane from './PreviewPane';
import DevicePreviewToggler from './DevicePreviewToggler';
import { useState } from 'react';
import { PlusIcon, ShareIcon, SaveIcon } from '@heroicons/react/24/outline';

const FIELD_TYPES = [
  { 
    id: 'text', 
    label: 'Text Input',
    icon: '📝',
    description: 'Single line text input for short answers'
  },
  { 
    id: 'textarea', 
    label: 'Text Area',
    icon: '📄',
    description: 'Multi-line text input for longer responses'
  },
  { 
    id: 'select', 
    label: 'Dropdown',
    icon: '▼',
    description: 'Select from predefined options'
  },
  { 
    id: 'checkbox', 
    label: 'Checkbox',
    icon: '☑️',
    description: 'Single checkbox for yes/no answers'
  },
  { 
    id: 'radio', 
    label: 'Radio Group',
    icon: '⭕',
    description: 'Choose one option from multiple choices'
  }
];

export default function FormBuilder() {
  const [selectedField, setSelectedField] = useState(null);
  const { fields, addField, reorderFields, device, saveForm } = useFormStore();
  const [showFieldMenu, setShowFieldMenu] = useState(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      
      const newFields = [...fields];
      const [movedField] = newFields.splice(oldIndex, 1);
      newFields.splice(newIndex, 0, movedField);
      
      reorderFields(newFields);
    }
  };

  const handleAddField = (type) => {
    const newField = {
      type: type.id,
      label: `New ${type.label}`,
      placeholder: '',
      required: false,
      step: 1
    };
    addField(newField);
    setShowFieldMenu(false);
  };

  const handleSaveForm = () => {
    const formId = saveForm();
    const shareUrl = `${window.location.origin}/preview/${formId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Form saved! Share URL copied to clipboard.');
  };

  const getPreviewWidth = () => {
    switch (device) {
      case 'mobile':
        return 'max-w-sm';
      case 'tablet':
        return 'max-w-2xl';
      default:
        return 'max-w-4xl';
    }
  };

  return (
    <div className="flex gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Left Sidebar */}
      <div className="w-72 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Add Fields</h2>
            <button
              onClick={() => setShowFieldMenu(!showFieldMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className={`space-y-2 transition-all duration-200 ${showFieldMenu ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
            {FIELD_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => handleAddField(type)}
                className="w-full p-3 text-left rounded-lg bg-white border border-gray-200 hover:border-blue-500 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl group-hover:scale-110 transition-transform">
                    {type.icon}
                  </span>
                  <div>
                    <h3 className="font-medium text-gray-900">{type.label}</h3>
                    <p className="text-xs text-gray-500">{type.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
          <div className="space-y-2">
            <button
              onClick={handleSaveForm}
              className="w-full flex items-center justify-center space-x-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <SaveIcon className="w-5 h-5" />
              <span>Save Form</span>
            </button>
            <button
              onClick={() => {
                const formId = saveForm();
                window.open(`/preview/${formId}`, '_blank');
              }}
              className="w-full flex items-center justify-center space-x-2 p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ShareIcon className="w-5 h-5" />
              <span>Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {fields.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="text-6xl mb-4">👋</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Start Building Your Form</h3>
                  <p className="text-gray-500 mb-4">Add fields from the sidebar to create your form</p>
                  <button
                    onClick={() => setShowFieldMenu(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Add Your First Field
                  </button>
                </div>
              ) : (
                fields.map((field) => (
                  <FieldBlock
                    key={field.id}
                    field={field}
                    onEdit={() => setSelectedField(field)}
                  />
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Right Sidebar - Preview */}
      <div className={`${getPreviewWidth()} bg-white rounded-xl shadow-sm border border-gray-200 p-4`}>
        <DevicePreviewToggler />
        <div className="bg-gray-50 rounded-lg p-4">
          <PreviewPane />
        </div>
      </div>

      {selectedField && (
        <FieldSettingsModal
          field={selectedField}
          onClose={() => setSelectedField(null)}
        />
      )}
    </div>
  );
}

export { FormBuilder };
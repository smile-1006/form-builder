import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useFormStore } from '../state/useFormStore';
import FieldBlock from './FieldBlock';
import FieldSettingsModal from './FieldSettingsModal';
import PreviewPane from './PreviewPane';
import DevicePreviewToggler from './DevicePreviewToggler';
import { useState } from 'react';

const FIELD_TYPES = [
  { id: 'text', label: 'Text Input' },
  { id: 'textarea', label: 'Text Area' },
  { id: 'select', label: 'Dropdown' },
  { id: 'checkbox', label: 'Checkbox' },
  { id: 'radio', label: 'Radio Group' }
];

export default function FormBuilder() {
  const [selectedField, setSelectedField] = useState(null);
  const { fields, addField, reorderFields, device } = useFormStore();
  
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
    <div className="flex gap-4 p-4">
      <div className="w-64 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Field Types</h2>
        <div className="space-y-2">
          {FIELD_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => handleAddField(type)}
              className="w-full p-2 text-left rounded bg-white border border-gray-200 hover:border-blue-500 transition-colors"
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 space-y-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {fields.map((field) => (
                <FieldBlock
                  key={field.id}
                  field={field}
                  onEdit={() => setSelectedField(field)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <div className={`w-full ${getPreviewWidth()} bg-gray-50 p-4 rounded-lg`}>
        <DevicePreviewToggler />
        <PreviewPane />
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

export { FormBuilder }
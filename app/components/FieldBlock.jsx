import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PencilIcon, TrashIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { useFormStore } from '../state/useFormStore';

export default function FieldBlock({ field, onEdit }) {
  const removeField = useFormStore(state => state.removeField);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group bg-white rounded-lg border ${
        isDragging ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
      } transition-all duration-200`}
      {...attributes}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 flex items-center space-x-4">
            <div 
              className="cursor-move p-2 rounded-lg hover:bg-gray-100 transition-colors"
              {...listeners}
            >
              <ChevronUpDownIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-900 flex items-center">
                {field.label}
                {field.required && (
                  <span className="ml-2 text-red-500 text-xs">*</span>
                )}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-600">
                  {field.type}
                </span>
                {field.helpText && (
                  <span className="text-xs text-gray-500">
                    {field.helpText}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(field)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit field"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => removeField(field.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete field"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
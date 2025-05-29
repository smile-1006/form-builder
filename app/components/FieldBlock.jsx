import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
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
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4"
      {...attributes}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1" {...listeners}>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 flex items-center justify-center text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">{field.label}</h3>
              <p className="text-xs text-gray-500">{field.type}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(field)}
            className="p-1 text-gray-400 hover:text-gray-500"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => removeField(field.id)}
            className="p-1 text-gray-400 hover:text-red-500"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
} 
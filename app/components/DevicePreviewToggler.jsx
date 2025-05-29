import { useFormStore } from '../state/useFormStore';

export default function DevicePreviewToggler() {
  const { device, setDevice } = useFormStore();

  return (
    <div className="flex items-center space-x-2 mb-4">
      <button
        onClick={() => setDevice('desktop')}
        className={`px-3 py-1 rounded ${
          device === 'desktop'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Desktop
      </button>
      <button
        onClick={() => setDevice('tablet')}
        className={`px-3 py-1 rounded ${
          device === 'tablet'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Tablet
      </button>
      <button
        onClick={() => setDevice('mobile')}
        className={`px-3 py-1 rounded ${
          device === 'mobile'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Mobile
      </button>
    </div>
  );
}
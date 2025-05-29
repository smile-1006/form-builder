import { useFormStore } from '../state/useFormStore';
import { DevicePhoneMobileIcon, DeviceTabletIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

export default function DevicePreviewToggler() {
  const { device, setDevice } = useFormStore();

  const devices = [
    {
      id: 'desktop',
      label: 'Desktop',
      icon: ComputerDesktopIcon
    },
    {
      id: 'tablet',
      label: 'Tablet',
      icon: DeviceTabletIcon
    },
    {
      id: 'mobile',
      label: 'Mobile',
      icon: DevicePhoneMobileIcon
    }
  ];

  return (
    <div className="flex items-center justify-center space-x-2 mb-6">
      {devices.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setDevice(id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
            device === id
              ? 'bg-blue-600 text-white shadow-md scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          title={`Switch to ${label} view`}
        >
          <Icon className="w-5 h-5" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
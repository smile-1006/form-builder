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
    <div className="flex items-center justify-center gap-1">
      {devices.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setDevice(id)}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-all ${
            device === id
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          title={label}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden md:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
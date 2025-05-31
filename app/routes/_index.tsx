import { FormBuilder } from '../components/FormBuilder';
import ThemeToggler from '../components/ThemeToggler';
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Builder.Draw" },
    { name: "description", content: "Create dynamic forms with drag and drop" },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Builder.Draw</h1>
            <div className="flex items-center space-x-4">
              <ThemeToggler />
            </div>
          </div>
        </div>
      </header>
      <main>
        <FormBuilder />
      </main>
    </div>
  );
}
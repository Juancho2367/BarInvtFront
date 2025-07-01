import React from 'react';
import { Tab } from '@headlessui/react';

interface TabItem {
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  defaultIndex?: number;
  onChange?: (index: number) => void;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  items,
  defaultIndex = 0,
  onChange,
  className = '',
}) => {
  return (
    <Tab.Group defaultIndex={defaultIndex} onChange={onChange}>
      <Tab.List className={`flex space-x-1 rounded-xl bg-gray-100 p-1 ${className}`}>
        {items.map((item, index) => (
          <Tab
            key={index}
            disabled={item.disabled}
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5
              ${
                selected
                  ? 'bg-white text-primary-600 shadow'
                  : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
              }
              ${
                item.disabled
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer'
              }`
            }
          >
            {item.label}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="mt-4">
        {items.map((item, index) => (
          <Tab.Panel
            key={index}
            className={`rounded-xl bg-white p-3
              ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2`}
          >
            {item.content}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

export default Tabs; 
'use client'
import { useState } from "react";

interface TabsItem {
    key: string
    title: string
    content: React.ReactNode
}

interface Props {
    tabs: TabsItem[]
}

const Tabs = ({ tabs }: Props) => {
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  return (
     <div className="w-full">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 -mb-px text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-blue-600'
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4 mt-5">
        {tabs.map((tab) =>
          tab.key === activeTab ? (
            <div key={tab.key}>{tab.content}</div>
          ) : null
        )}
      </div>
    </div>
  );
}

export default Tabs;
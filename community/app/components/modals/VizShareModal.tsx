'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';

interface VizShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
}

type TabType = 'link' | 'embed' | 'collaborators';

export default function VizShareModal({ isOpen, onClose, shareUrl }: VizShareModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('link');
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      // Could add toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <Dialog.Title className="text-xl font-semibold text-gray-900 mb-4">
            Share
          </Dialog.Title>

          <div className="border-b border-gray-200 mb-4">
            <nav className="-mb-px flex space-x-8">
              {['link', 'embed', 'collaborators'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as TabType)}
                  className={`
                    py-2 px-1 border-b-2 text-sm font-medium
                    ${activeTab === tab 
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Copy
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Sharing this link on social media will automatically create a preview.
            </p>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

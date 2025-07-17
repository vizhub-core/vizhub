import { SmartHeader } from '../../smartComponents/SmartHeader';
import { useLanguage } from '../../../../components/src/components/LanguageContext';

import React from 'react';
import {
  Code2,
  BarChart3,
  Blocks,
  BrainCircuit,
} from 'lucide-react';

interface Template {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const VisualizationTemplates: React.FC = () => {
  const { t } = useLanguage();

  const templates: Template[] = [
    {
      id: 'html',
      title: 'HTML Starter',
      description:
        'Start with a basic HTML template for simple visualizations. Perfect for beginners.',
      icon: <Code2 className="w-8 h-8" />,
      color: 'bg-orange-500',
    },
    {
      id: 'd3',
      title: 'D3.js Starter',
      description:
        'Build powerful data visualizations with D3.js. Includes basic chart setup.',
      icon: <BarChart3 className="w-8 h-8" />,
      color: 'bg-purple-500',
    },
    {
      id: 'react',
      title: 'React Starter',
      description:
        'Create interactive visualizations with React components and hooks.',
      icon: <Blocks className="w-8 h-8" />,
      color: 'bg-blue-500',
    },
    {
      id: 'ai',
      title: 'AI-Enhanced Template',
      description:
        'Start with AI-powered visualization suggestions and code generation.',
      icon: <BrainCircuit className="w-8 h-8" />,
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t('create.page.title')}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {t('create.page.choose.template')}
              </p>
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              {t('create.page.custom.template')}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer border border-gray-100"
            >
              <div className={`${template.color} p-6`}>
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-white">
                  {template.icon}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {template.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {template.description}
                </p>
                <button className="mt-4 w-full px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Recent Templates
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Bar Chart Template
                      </h3>
                      <p className="text-xs text-gray-500">
                        Modified 2 days ago
                      </p>
                    </div>
                  </div>
                  <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                    Use Again
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export const Body = () => {
  return (
    <div className="vh-page overflow-auto">
      <SmartHeader />
      <VisualizationTemplates />
    </div>
  );
};

import React, { useState, useCallback } from 'react';
import { VizKit } from 'api/src/VizKit';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  SendHorizontal,
  LineChart,
  Sparkles,
  FileSpreadsheet,
} from 'lucide-react';
import { User } from 'entities';

function PromptPage({
  authenticatedUser,
}: {
  authenticatedUser: User | null;
}) {
  const [prompt, setPrompt] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    },
    [],
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    },
    [],
  );

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'text/csv') {
      setFile(files[0]);
    }
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        setFile(files[0]);
      }
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      console.log('User prompt:', prompt);
      if (file) {
        console.log('Uploaded file:', {
          name: file.name,
          size: file.size,
          type: file.type,
        });
      }

      if (!file) {
        console.error('No file selected');
        return;
      }

      try {
        const vizKit = VizKit();
        const result =
          await vizKit.rest.createVizFromPromptAndFile({
            prompt,
            file,
          });

        if (result.success) {
          // Navigate to the new visualization
          navigate(`/viz/${result.data.vizId}`);
        } else {
          console.error(
            'Failed to create visualization:',
            result.error,
          );
        }
      } catch (error) {
        console.error(
          'Error creating visualization:',
          error,
        );
      }
    },
    [navigate, prompt, file],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center mb-12">
          <div className="relative">
            <LineChart className="w-16 h-16 text-indigo-600" />
            <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div className="ml-4">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              VizHub
            </h1>
            <p className="text-gray-600 mt-1">
              AI-Powered Data Visualization Platform
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
            <div className="flex items-center mb-4">
              <Sparkles className="w-5 h-5 text-indigo-600 mr-2" />
              <label
                htmlFor="prompt"
                className="text-xl font-semibold text-gray-800"
              >
                Describe Your Visualization
              </label>
            </div>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-48 p-6 border-2 border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/50 backdrop-blur-sm text-lg"
              placeholder="Example: Create a dynamic bar chart showing sales trends over time, with monthly comparisons and growth indicators..."
            />
          </div>

          <div
            className={`bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border-2 transition-all duration-300 ${
              isDragging
                ? 'border-indigo-400 bg-indigo-50/50'
                : 'border-dashed border-gray-300 hover:border-indigo-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <FileSpreadsheet className="w-16 h-16 text-indigo-400" />
                <Upload className="w-6 h-6 text-indigo-600 absolute -top-1 -right-1" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-xl font-semibold text-gray-800">
                  Upload Your Dataset
                </p>
                <p className="text-gray-600">
                  Drag and drop your CSV file here, or
                </p>
                <label className="inline-flex items-center px-6 py-3 border-2 border-indigo-600 text-base font-medium rounded-xl text-indigo-600 bg-transparent hover:bg-indigo-600 hover:text-white transition-colors duration-300 cursor-pointer group">
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv"
                    onChange={handleFileInput}
                  />
                  <Upload className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                  Select File
                </label>
              </div>
              {file && (
                <div className="flex items-center space-x-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg">
                  <FileSpreadsheet className="w-5 h-5" />
                  <p className="font-medium">{file.name}</p>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center px-8 py-6 text-xl font-medium rounded-2xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Sparkles className="w-6 h-6 mr-3" />
            Generate Visualization
            <SendHorizontal className="w-6 h-6 ml-3" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default PromptPage;

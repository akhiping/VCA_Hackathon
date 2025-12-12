import React from 'react';
import { Plus, Trash2, Wand2, Loader2, Sparkles } from 'lucide-react';
import { PromptConfig, ServiceDefinition } from '../types';

interface ConfigurationFormProps {
  config: PromptConfig;
  onChange: (newConfig: PromptConfig) => void;
  vagueIdea: string;
  setVagueIdea: (idea: string) => void;
  onMagicFill: () => void;
  isLoadingMagicFill: boolean;
}

const ConfigurationForm: React.FC<ConfigurationFormProps> = ({ 
  config, 
  onChange,
  vagueIdea,
  setVagueIdea,
  onMagicFill,
  isLoadingMagicFill
}) => {

  const updateService = (id: string, field: keyof ServiceDefinition, value: string) => {
    const updated = config.services.map(s => s.id === id ? { ...s, [field]: value } : s);
    onChange({ ...config, services: updated });
  };

  const removeService = (id: string) => {
    onChange({ ...config, services: config.services.filter(s => s.id !== id) });
  };

  const addService = () => {
    onChange({
      ...config,
      services: [...config.services, { id: Math.random().toString(36).substr(2, 9), name: 'NewService', description: '' }]
    });
  };

  return (
    <div className="space-y-8 p-1">
      {/* Magic Fill Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-5 rounded-xl border border-gray-700 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Sparkles className="w-24 h-24 text-primary-400" />
        </div>
        
        <label className="block text-sm font-medium text-primary-400 mb-3 flex items-center gap-2">
          <Wand2 className="w-4 h-4" />
          AI Magic Architect
        </label>
        
        <div className="space-y-3 relative z-10">
          <textarea
            value={vagueIdea}
            onChange={(e) => setVagueIdea(e.target.value)}
            placeholder="Describe your vague idea... (e.g., 'A social media app for dogs that uses facial recognition')"
            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none h-24 placeholder:text-gray-600"
          />
          <button
            onClick={onMagicFill}
            disabled={isLoadingMagicFill || !vagueIdea.trim()}
            className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-900/20"
          >
            {isLoadingMagicFill ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Hallucinating Architecture...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                ✨ Magic Fill Architecture
              </>
            )}
          </button>
        </div>
      </div>

      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">Core Persona</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Agent Role Name</label>
            <input
              type="text"
              value={config.roleName}
              onChange={(e) => onChange({ ...config, roleName: e.target.value })}
              className="w-full bg-gray-850 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-primary-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Context & Vision */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">Context & Vision</h3>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Legacy Context (Input)</label>
          <textarea
            value={config.legacyDescription}
            onChange={(e) => onChange({ ...config, legacyDescription: e.target.value })}
            rows={3}
            className="w-full bg-gray-850 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-primary-500 outline-none resize-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Target Vision (Output)</label>
          <textarea
            value={config.targetDescription}
            onChange={(e) => onChange({ ...config, targetDescription: e.target.value })}
            rows={3}
            className="w-full bg-gray-850 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-primary-500 outline-none resize-none"
          />
        </div>
      </div>

      {/* Tech Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">Technical Strategy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Tech Stack</label>
            <input
              type="text"
              value={config.techStack}
              onChange={(e) => onChange({ ...config, techStack: e.target.value })}
              placeholder="e.g. Python FastAPI, React"
              className="w-full bg-gray-850 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Deployment Strategy</label>
            <input
              type="text"
              value={config.deploymentStrategy}
              onChange={(e) => onChange({ ...config, deploymentStrategy: e.target.value })}
              placeholder="e.g. K8s, Helm, AWS"
              className="w-full bg-gray-850 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-primary-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-gray-800 pb-2">
          <h3 className="text-lg font-semibold text-white">Microservices</h3>
          <button
            onClick={addService}
            className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add Service
          </button>
        </div>
        <div className="space-y-3">
          {config.services.map((service) => (
            <div key={service.id} className="flex gap-2 items-start bg-gray-850 p-2 rounded-lg border border-gray-800">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={service.name}
                  onChange={(e) => updateService(service.id, 'name', e.target.value)}
                  placeholder="Service Name"
                  className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:border-primary-500 outline-none"
                />
              </div>
              <button
                onClick={() => removeService(service.id)}
                className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-gray-800 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {config.services.length === 0 && (
            <p className="text-sm text-gray-500 italic">No services defined. Add one manually or use Magic Assist.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfigurationForm;
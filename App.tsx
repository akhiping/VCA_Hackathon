import React, { useState, useEffect } from 'react';
import { Bot, Terminal, Sparkles, LayoutTemplate } from 'lucide-react';
import ConfigurationForm from './components/ConfigurationForm';
import PromptPreview from './components/PromptPreview';
import ArchitectureDisplay from './components/ExplanationSection';
import { PromptConfig, ArchitecturalSuggestion } from './types';
import { hallucinateArchitecture } from './services/geminiService';

const INITIAL_CONFIG: PromptConfig = {
  roleName: 'Deep Reasoning Lead Architect',
  contextType: 'Legacy Codebase',
  targetType: 'Microservice Architecture',
  legacyDescription: 'An entire, compressed legacy codebase containing a monolithic application.',
  targetDescription: 'A hand-drawn sketch outlining the new service boundaries.',
  services: [
    { id: '1', name: 'AuthService', description: 'Handles user authentication' },
    { id: '2', name: 'BillingService', description: 'Manages payments' },
    { id: '3', name: 'APIGateway', description: 'Routes requests' }
  ],
  techStack: 'Python FastAPI',
  deploymentStrategy: 'Kubernetes (Deployment, Service, Ingress)'
};

const App: React.FC = () => {
  const [config, setConfig] = useState<PromptConfig>(INITIAL_CONFIG);
  
  // Magic Fill State
  const [vagueIdea, setVagueIdea] = useState('');
  const [generatedArchitecture, setGeneratedArchitecture] = useState<ArchitecturalSuggestion | null>(null);
  const [isLoadingMagicFill, setIsLoadingMagicFill] = useState(false);

  // Clear state on load to ensure a clean slate
  useEffect(() => {
    setVagueIdea('');
    setGeneratedArchitecture(null);
    setConfig(prev => ({
      ...prev,
      legacyDescription: '',
      targetDescription: '',
      services: [],
      techStack: '',
      deploymentStrategy: ''
    }));
  }, []);

  const handleMagicFill = async () => {
    if (!vagueIdea.trim()) return;
    
    setIsLoadingMagicFill(true);
    try {
      const suggestion = await hallucinateArchitecture(vagueIdea);
      setGeneratedArchitecture(suggestion);
      
      // Update the config with the suggested details to sync the form
      const newServices = suggestion.serviceName.map(name => ({
        id: Math.random().toString(36).substr(2, 9),
        name: name,
        description: ''
      }));

      setConfig(prev => ({
        ...prev,
        techStack: `${suggestion.techStack.frontend} + ${suggestion.techStack.backend}`,
        deploymentStrategy: suggestion.k8sStrategy,
        services: newServices,
        // Optional: inferred descriptions if not provided
        legacyDescription: prev.legacyDescription || `Legacy system requiring migration to ${suggestion.techStack.backend}.`,
        targetDescription: prev.targetDescription || `Scalable ${suggestion.techStack.backend} microservices architecture on Kubernetes.`
      }));

    } catch (error) {
      console.error("Failed to hallucinate architecture:", error);
      alert("Failed to generate architecture. Please check your API key.");
    } finally {
      setIsLoadingMagicFill(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary-500/30">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary-600 to-primary-400 p-2 rounded-lg shadow-lg shadow-primary-500/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Vibe Code <span className="text-primary-400">Architect</span>
              </h1>
              <p className="text-xs text-gray-400">Gemini-Powered Prompt Generator</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <a href="https://ai.google.dev" target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:text-primary-400 transition-colors hidden sm:block">
               Powered by Gemini 2.5
             </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          
          {/* Left Column: Configuration */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-800 bg-gray-900/50 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-primary-400" />
                  Configuration
                </h2>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-primary-500/10 rounded-full border border-primary-500/20">
                  <Sparkles className="w-3 h-3 text-primary-400" />
                  <span className="text-[10px] font-medium text-primary-400 uppercase tracking-wide">AI Enabled</span>
                </div>
              </div>
              <div className="p-6">
                 <ConfigurationForm 
                    config={config} 
                    onChange={setConfig} 
                    vagueIdea={vagueIdea}
                    setVagueIdea={setVagueIdea}
                    onMagicFill={handleMagicFill}
                    isLoadingMagicFill={isLoadingMagicFill}
                 />
              </div>
            </div>
          </div>

          {/* Right Column: Preview & Display */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {generatedArchitecture ? (
              <>
                <ArchitectureDisplay suggestion={generatedArchitecture} />
                <PromptPreview config={config} />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-gray-900/50 rounded-xl border border-gray-800 border-dashed text-center p-8">
                <div className="bg-gray-800 p-4 rounded-full mb-4">
                  <LayoutTemplate className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">Ready to Architect</h3>
                <p className="text-gray-500 max-w-md">
                  The generated Master Prompt and architectural analysis will appear here after Magic Fill is executed.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800 py-8 mt-auto bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Vibe Code Architect. Designed for the Cognitive Code Analyst workflow.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
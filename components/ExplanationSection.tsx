import React from 'react';
import { Lightbulb, Layers, BrainCircuit, Target, FileJson, Server, Database, Code2, Box } from 'lucide-react';
import { ArchitecturalSuggestion } from '../types';

interface ArchitectureDisplayProps {
  suggestion: ArchitecturalSuggestion | null;
}

const ArchitectureDisplay: React.FC<ArchitectureDisplayProps> = ({ suggestion }) => {
  if (suggestion) {
    return (
      <div className="bg-gray-900 rounded-xl border border-primary-500/30 p-6 space-y-6 shadow-2xl shadow-primary-900/10 ring-1 ring-primary-500/20">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-primary-400" />
            Generated Architecture
          </h3>
          <span className="px-2 py-1 bg-primary-500/20 text-primary-300 text-xs font-mono rounded border border-primary-500/30">Gemini 3 Pro</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Services */}
          <div className="p-4 bg-gray-950 rounded-lg border border-gray-800 col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3 text-primary-400 font-semibold">
              <Box className="w-4 h-4" />
              <span>Core Microservices</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestion.serviceName.map((service, idx) => (
                <span key={idx} className="px-3 py-1 bg-gray-800 text-gray-200 text-sm rounded-full border border-gray-700">
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="p-4 bg-gray-950 rounded-lg border border-gray-800">
            <div className="flex items-center gap-2 mb-3 text-primary-400 font-semibold">
              <Code2 className="w-4 h-4" />
              <span>Tech Stack</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Frontend:</span>
                <span className="text-gray-200 text-right">{suggestion.techStack.frontend}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Backend:</span>
                <span className="text-gray-200 text-right">{suggestion.techStack.backend}</span>
              </div>
            </div>
          </div>

          {/* Database */}
          <div className="p-4 bg-gray-950 rounded-lg border border-gray-800">
            <div className="flex items-center gap-2 mb-3 text-primary-400 font-semibold">
              <Database className="w-4 h-4" />
              <span>Data Strategy</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {suggestion.databaseStrategy}
            </p>
          </div>
          
           {/* K8s */}
           <div className="p-4 bg-gray-950 rounded-lg border border-gray-800 col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3 text-primary-400 font-semibold">
              <Server className="w-4 h-4" />
              <span>Kubernetes & Deployment</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed font-mono text-xs">
              {suggestion.k8sStrategy}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Fallback to original explanation if no suggestion yet
  return (
    <div className="bg-gray-850 rounded-xl border border-gray-700 p-6 space-y-6">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-yellow-400" />
        Why This Prompt Works
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-950 rounded-lg border border-gray-800">
          <div className="flex items-center gap-2 mb-2 text-primary-400 font-semibold">
            <Target className="w-4 h-4" />
            <span>Role & Persona</span>
          </div>
          <p className="text-sm text-gray-400">
            Setting a specific, high-level persona (e.g., "Deep Reasoning Lead Architect") forces the model to adopt a professional tone and prioritize architectural correctness over generic code generation.
          </p>
        </div>

        <div className="p-4 bg-gray-950 rounded-lg border border-gray-800">
          <div className="flex items-center gap-2 mb-2 text-primary-400 font-semibold">
            <BrainCircuit className="w-4 h-4" />
            <span>Chain-of-Thought</span>
          </div>
          <p className="text-sm text-gray-400">
            The "Agentic Execution Plan" forces the model to <i>think</i> before it codes. By listing dependencies and interfaces first, the generated code becomes internally consistent and less prone to hallucinations.
          </p>
        </div>

        <div className="p-4 bg-gray-950 rounded-lg border border-gray-800">
          <div className="flex items-center gap-2 mb-2 text-primary-400 font-semibold">
            <Layers className="w-4 h-4" />
            <span>Multimodal Context</span>
          </div>
          <p className="text-sm text-gray-400">
            Explicitly referencing input types (ZIP files, Diagrams) primes the model to utilize its long-context window and vision capabilities, treating them as primary sources of truth.
          </p>
        </div>

        <div className="p-4 bg-gray-950 rounded-lg border border-gray-800">
          <div className="flex items-center gap-2 mb-2 text-primary-400 font-semibold">
            <FileJson className="w-4 h-4" />
            <span>Structured Output</span>
          </div>
          <p className="text-sm text-gray-400">
            Demanding a specific file tree (ZIP structure) transforms the output from a "chat response" into a "deployable artifact", significantly reducing the friction for the human developer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureDisplay;
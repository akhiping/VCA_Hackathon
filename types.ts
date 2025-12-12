export interface ServiceDefinition {
  id: string;
  name: string;
  description: string;
}

export interface PromptConfig {
  roleName: string;
  contextType: 'Legacy Codebase' | 'Documentation' | 'Raw Data';
  targetType: 'Microservice Architecture' | 'Serverless Architecture' | 'Event-Driven System';
  legacyDescription: string;
  targetDescription: string;
  services: ServiceDefinition[];
  techStack: string;
  deploymentStrategy: string;
}

export interface MagicFillResponse {
  roleName: string;
  legacyDescription: string;
  targetDescription: string;
  services: { name: string; description: string }[];
  techStack: string;
  deploymentStrategy: string;
}

export interface ArchitecturalSuggestion {
  serviceName: string[];
  techStack: {
    frontend: string;
    backend: string;
  };
  databaseStrategy: string;
  k8sStrategy: string;
}

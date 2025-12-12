import React, { useState, useEffect } from 'react';
import { Copy, Check, Download, FileCode } from 'lucide-react';
import { PromptConfig } from '../types';

interface PromptPreviewProps {
  config: PromptConfig;
}

const PromptPreview: React.FC<PromptPreviewProps> = ({ config }) => {
  const [markdown, setMarkdown] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fileTree = config.services.map(s => `├── ${s.name}/
│   ├── main.py        # Logic for ${s.name}
│   ├── requirements.txt
│   └── Dockerfile`).join('\n');

    const generated = `# 🔱 AGENT ROLE: ${config.roleName.toUpperCase()} (GEMINI 3 PRO)

## 🎯 OBJECTIVE
You are tasked with a **critical enterprise modernization project**. Your sole goal is to fully refactor the **${config.contextType}** provided in the input into a new, containerized **${config.targetType}**. This must be a zero-shot, complete, and runnable solution.

## 📝 INPUTS (Long Context Analysis Required)
1.  **Legacy Context:** ${config.legacyDescription}
2.  **Target Vision:** ${config.targetDescription}
3.  **Defined Services:** The architecture MUST include: ${config.services.map(s => `**${s.name}**`).join(', ')}.

## ⚙️ AGENTIC EXECUTION PLAN (Mandatory Chain-of-Thought)
Before generating any code, state your plan in a dedicated section:
1.  **Dependency Mapping:** Analyze the legacy inputs to identify critical dependencies and how they map to the new ${config.targetType}.
2.  **Interface Definition:** Define the core APIs and data schemas for: ${config.services.map(s => s.name).join(', ')}.
3.  **Refactoring Strategy:** Confirm use of **${config.techStack}** and associated best practices.
4.  **Deployment Strategy:** Implement **${config.deploymentStrategy}**.

## 📦 MANDATORY FINAL OUTPUT STRUCTURE
**The entire result MUST be delivered as a single, fully encapsulated, and runnable ZIP file.** The structure must be strictly as follows:

\`\`\`
/REFACTOR_PROJECT.zip
${fileTree}
├── deployment/
│   ├── infrastructure.yaml # Config for ${config.deploymentStrategy}
│   └── README.md
└── MIGRATION_GUIDE.md # A 5-step guide for deployment.
\`\`\`

## 📜 CONSTRAINTS & REQUIREMENTS
* **Zero-Shot Generation:** Do not ask clarifying questions.
* **Code Quality:** Clean, modular, **${config.techStack}** code.
* **Token Efficiency:** Prioritize runnable code over verbose text.
`;
    setMarkdown(generated);
  }, [config]);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vibe-code-prompt.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-850 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <FileCode className="w-5 h-5 text-primary-400" />
          <span className="font-mono text-sm font-semibold text-gray-300">MASTER_PROMPT.md</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
            title="Copy to Clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
            title="Download .md"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-gray-950 p-4">
        <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap">{markdown}</pre>
      </div>
    </div>
  );
};

export default PromptPreview;

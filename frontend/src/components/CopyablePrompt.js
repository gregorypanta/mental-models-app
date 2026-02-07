import { useState, useCallback } from "react";
import { Check, Copy } from "lucide-react";

export const CopyablePrompt = ({ prompt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [prompt]);

  return (
    <div className="prompt-box p-4 md:p-5 relative group" data-testid="copyable-prompt">
      <div className="flex items-start justify-between gap-4">
        <p className="font-mono text-sm leading-relaxed text-white/70 flex-1">
          {prompt}
        </p>
        <button
          data-testid="copy-prompt-btn"
          onClick={handleCopy}
          className="flex-shrink-0 p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200"
          title="Copy prompt"
        >
          {copied ? (
            <Check size={14} className="text-green-400" />
          ) : (
            <Copy size={14} className="text-white/50" />
          )}
        </button>
      </div>
      {copied && (
        <span className="absolute -top-8 right-0 text-xs text-green-400 font-mono animate-fade-in">
          Copied
        </span>
      )}
    </div>
  );
};

export default CopyablePrompt;

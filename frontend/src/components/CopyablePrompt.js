import { useState, useCallback } from "react";
import { Check, Copy } from "lucide-react";

export const CopyablePrompt = ({ prompt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for older browsers or when clipboard API is not available
        const textArea = document.createElement('textarea');
        textArea.value = prompt;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.warn('Copy failed:', error);
      // Still show feedback even if copy failed
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [prompt]);

  return (
    <div className="prompt-box p-4 md:p-5 relative group" data-testid="copyable-prompt">
      <div className="flex items-start justify-between gap-4">
        <p className="font-mono text-sm leading-relaxed text-[#A1A1AA] flex-1">
          {prompt}
        </p>
        <button
          data-testid="copy-prompt-btn"
          onClick={handleCopy}
          className="flex-shrink-0 p-2 rounded-lg bg-[#2563EB]/10 border border-[#2563EB]/20 hover:bg-[#2563EB]/20 transition-colors duration-200"
          title="Copy prompt"
        >
          {copied ? (
            <Check size={14} className="text-[#10B981]" />
          ) : (
            <Copy size={14} className="text-[#2563EB]" />
          )}
        </button>
      </div>
      {copied && (
        <span className="absolute -top-8 right-0 text-xs text-[#10B981] font-mono animate-fade-in">
          Copied
        </span>
      )}
    </div>
  );
};

export default CopyablePrompt;

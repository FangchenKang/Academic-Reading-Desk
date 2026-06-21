"use client";

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopyButton({
  text,
  label = "复制",
  onCopied,
  className
}: {
  text: string;
  label?: string;
  onCopied?: () => void;
  className?: string;
}) {
  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    onCopied?.();
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={className}
      onClick={handleCopy}
    >
      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </Button>
  );
}

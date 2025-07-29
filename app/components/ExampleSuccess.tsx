"use client";

export default function ExampleSuccess() {
  return (
    <div className="glass rounded-2xl p-6 glow-border">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-purple)] rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">✓</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold gradient-text">
            Real Transaction Example
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            Actual cross-chain license purchase that happened
          </p>
        </div>
      </div>
      <div className="space-y-3">
        <div className="p-3 glass rounded-lg border border-[var(--border-primary)]">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[var(--text-secondary)]">
              Base Payment Tx:
            </span>
            <a
              href="https://basescan.org/tx/0x8532e90ee671268f578202850a1709a8d512f71b1a81bf3eb4929d6a627eb76a"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--accent-cyan)] hover:text-[var(--accent-purple)] font-mono hover:underline transition-colors"
            >
              0x8532e90ee6...627eb76a ↗
            </a>
          </div>
        </div>
        <div className="p-3 glass rounded-lg border border-[var(--border-primary)]">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[var(--text-secondary)]">
              Story License Tx:
            </span>
            <a
              href="https://www.storyscan.io/tx/0x5a41060e17791be6506c62e782542127a10c7dd298fa894729bd0ba61b270fda"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--accent-cyan)] hover:text-[var(--accent-purple)] font-mono hover:underline transition-colors"
            >
              0x5a41060e17...b270fda ↗
            </a>
          </div>
        </div>
        <div className="p-3 glass rounded-lg border border-[var(--border-primary)]">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[var(--text-secondary)]">
              License Token:
            </span>
            <a
              href="https://explorer.story.foundation/transactions/0x5a41060e17791be6506c62e782542127a10c7dd298fa894729bd0ba61b270fda"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--accent-cyan)] hover:text-[var(--accent-purple)] font-mono hover:underline transition-colors"
            >
              #36896 ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

export default function HowItWorks() {
  return (
    <div className="glass rounded-2xl p-6 glow-border">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-purple)] rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">?</span>
        </div>
        <h3 className="text-lg font-semibold gradient-text">
          How It Works
        </h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-[var(--accent-cyan)]/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[var(--accent-cyan)] font-bold text-xs">
              1
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">
              Connect Base Wallet
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Pay with ETH on Base
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-[var(--accent-purple)]/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[var(--accent-purple)] font-bold text-xs">
              2
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">
              Cross-Chain Bridge
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              deBridge converts ETH → WIP
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-[var(--accent-pink)]/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[var(--accent-pink)] font-bold text-xs">
              3
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">
              License Minted
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Receive commercial license on Story
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
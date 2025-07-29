"use client";

import { useState, useRef } from "react";

interface MusicPlayerProps {
  coverImage: string;
  audioSrc: string;
  title: string;
}

export default function MusicPlayer({
  coverImage,
  audioSrc,
  title,
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Audio controls
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="glass rounded-2xl overflow-hidden glow-border">
      <div className="relative">
        <img
          src={coverImage}
          alt="Music Cover"
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
          {/* <p className="text-[var(--text-secondary)] mb-4">{subtitle}</p> */}

          {/* Music Controls Overlay */}
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className="w-10 h-10 bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-purple)] rounded-full flex items-center justify-center btn-glow"
            >
              {isPlaying ? (
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-white ml-0.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <div className="flex-1">
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-white/70 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <audio
          ref={audioRef}
          src={audioSrc}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />

        {/* IP Asset Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-pink)] rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-[var(--text-primary)]">
              Verified IP Asset
            </h4>
            <p className="text-sm text-[var(--text-secondary)]">
              Protected on Story Protocol
            </p>
          </div>
        </div>

        {/* Asset ID */}
        <div className="mb-4 p-3 glass rounded-lg border border-[var(--border-primary)]">
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-secondary)] text-sm">
              Asset ID:
            </span>
            <a
              href="https://explorer.story.foundation/ipa/0xcb6B9CCae4108A103097B30cFc25e1E257D4b5Fe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-cyan)] hover:text-[var(--accent-purple)] font-mono text-sm hover:underline transition-colors"
            >
              0xcb6B...57D4b5Fe ↗
            </a>
          </div>
        </div>

        {/* License Terms */}
        <div className="p-4 glass rounded-lg border border-[var(--border-primary)]">
          <h5 className="text-base font-medium text-[var(--text-primary)] mb-4">
            License Terms
          </h5>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">License Price:</span>
              <span className="text-[var(--accent-cyan)] font-mono">
                0.00001 $WIP
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">
                Commercial Rev Share:
              </span>
              <span className="text-[var(--accent-cyan)] font-mono">0%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Commercial Use:</span>
              <span className="text-[var(--accent-cyan)] font-mono">
                ✓ true
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">
                Derivatives Allowed:
              </span>
              <span className="text-[var(--accent-cyan)] font-mono">
                ✓ true
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">AI Training:</span>
              <span className="text-[var(--text-muted)] font-mono">
                ✗ false
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Transferrable:</span>
              <span className="text-[var(--accent-cyan)] font-mono">
                ✓ true
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Attribution:</span>
              <span className="text-[var(--accent-cyan)] font-mono">
                ✓ true
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Expiration:</span>
              <span className="text-[var(--accent-cyan)] font-mono">Never</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--border-primary)]">
            <a
              href="https://github.com/piplabs/pil-document/blob/main/Story%20Foundation%20-%20Programmable%20IP%20License%20(1.31.25).pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--accent-cyan)] hover:text-[var(--accent-purple)] font-mono hover:underline transition-colors"
            >
              View Full PIL License ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

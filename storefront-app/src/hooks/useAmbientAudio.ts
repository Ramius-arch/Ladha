import { useCallback, useEffect, useRef, useState } from 'react';

export interface AmbientTrack {
  id: string;
  shortTitle: string;
  src: string;
}

const PLAYLIST: AmbientTrack[] = [
  { id: '01', shortTitle: 'Wild World // Atlas', src: '/assets/audio/ladha-ambient.mp3' },
  { id: '02', shortTitle: 'Where Is My Mind // Twopilots', src: '/assets/audio/ladha-ambient-02.mp3' },
];

export function useAmbientAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  useEffect(() => {
    const audio = new Audio(PLAYLIST[0].src);
    audio.volume = 0.22;
    audio.preload = 'none';
    audioRef.current = audio;

    const handleEnded = () => {
      setTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    };

    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const track = PLAYLIST[trackIndex];
    if (!audio.src.endsWith(track.src)) {
      audio.src = track.src;
      if (isPlaying) {
        audio.play().catch(() => setIsPlaying(false));
      }
    }
  }, [trackIndex, isPlaying]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [isPlaying]);

  const nextTrack = useCallback(() => {
    setTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  }, []);

  return {
    isPlaying,
    currentTrack: PLAYLIST[trackIndex],
    togglePlay,
    nextTrack,
  };
}

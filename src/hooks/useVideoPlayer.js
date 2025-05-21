import { useState, useEffect, useRef } from 'react';
import { usePlayerHighlights } from './useQueries';
import Hls from 'hls.js';

export const useVideoPlayer = (selectedPlayer) => {
  const [selectedHighlight, setSelectedHighlight] = useState(null);
  const [videoError, setVideoError] = useState(false);
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0);
  
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const highlightTimerRef = useRef(null);
  const seekedRef = useRef(false);

  // Fetch player highlights using React Query
  const { 
    data: highlights = [], 
    isLoading,
  } = usePlayerHighlights(selectedPlayer?.id);

  // Reset highlight selection when player changes
  useEffect(() => {
    if (selectedPlayer) {
      setSelectedHighlight(null);
      setCurrentHighlightIndex(0);
    }
  }, [selectedPlayer]);

  // Set the first highlight when highlights are loaded
  useEffect(() => {
    // Select the first highlight by default if available
    if (highlights.length > 0 && !selectedHighlight) {
      setSelectedHighlight(highlights[0]);
      setCurrentHighlightIndex(0);
    }
  }, [highlights, selectedHighlight]);

  // Handler for when seeking completes
  const handleSeeked = () => {
    seekedRef.current = true;
    if (isPlaying) {
      videoRef.current.play().catch(e => console.error('Error playing video:', e));
      setupHighlightTimer();
    }
  };

  // Helper function to set up video after metadata is loaded
  const setupVideoAfterLoad = () => {
    // Jump to the clip's start position
    if (selectedHighlight.offset) {
      videoRef.current.currentTime = selectedHighlight.offset;
    } else {
      // If no offset, we don't need to wait for seek
      seekedRef.current = true;
      if (isPlaying) {
        videoRef.current.play().catch(e => console.error('Error playing video:', e));
        setupHighlightTimer();
      }
    }
  };

  // Setup HLS when the selected highlight changes
  useEffect(() => {
    if (!selectedHighlight) return;
    
    setVideoError(false);
    seekedRef.current = false;
    
    // Clean up previous HLS instance and timer
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    
    if (highlightTimerRef.current) {
      clearTimeout(highlightTimerRef.current);
      highlightTimerRef.current = null;
    }
    
    // Set initial remaining time from highlight duration
    setRemainingTime(selectedHighlight.duration || 0);
    
    if (videoRef.current && selectedHighlight.hls_url) {
      // Set video to muted
      videoRef.current.muted = true;
      
      // Add seeked event listener
      videoRef.current.addEventListener('seeked', handleSeeked);
      
      // Check if the browser supports HLS natively
      if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // Some browsers like Safari can play HLS natively
        videoRef.current.src = selectedHighlight.hls_url;
        videoRef.current.addEventListener('loadedmetadata', setupVideoAfterLoad);
      } 
      // Use hls.js if it's supported and the URL is an m3u8 file
      else if (Hls.isSupported() && selectedHighlight.hls_url.includes('.m3u8')) {
        const hls = new Hls();
        hlsRef.current = hls;
        
        hls.loadSource(selectedHighlight.hls_url);
        hls.attachMedia(videoRef.current);
        
        hls.on(Hls.Events.MANIFEST_PARSED, setupVideoAfterLoad);
        
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            console.error('HLS fatal error:', data);
            setVideoError(true);
            hls.destroy();
          }
        });
      } else {
        // For other video types or if HLS.js is not supported
        videoRef.current.src = selectedHighlight.hls_url;
        videoRef.current.addEventListener('loadedmetadata', setupVideoAfterLoad);
      }
    }
    
    return () => {
      // Clean up on unmount or when selected highlight changes
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (highlightTimerRef.current) {
        clearTimeout(highlightTimerRef.current);
        highlightTimerRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.removeEventListener('seeked', handleSeeked);
        videoRef.current.removeEventListener('loadedmetadata', setupVideoAfterLoad);
      }
    };
  }, [selectedHighlight, isPlaying]);

  // Set up countdown timer that updates every second
  useEffect(() => {
    // Only run the countdown if video is playing
    if (!isPlaying || !selectedHighlight) return;
    
    const intervalId = setInterval(() => {
      setRemainingTime(prevTime => {
        if (prevTime <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [isPlaying, selectedHighlight]);

  // Watch for remaining time reaching zero
  useEffect(() => {
    if (remainingTime <= 0 && isPlaying && selectedHighlight) {
      playNextHighlight();
    }
  }, [remainingTime, isPlaying]);

  // Setup a timer to move to the next highlight after the current one finishes
  const setupHighlightTimer = () => {
    if (!selectedHighlight || !selectedHighlight.duration || !isPlaying || !seekedRef.current) return;
    
    // Set a timer to switch to the next highlight when the current one finishes
    const durationMs = selectedHighlight.duration * 1000;
    
    highlightTimerRef.current = setTimeout(() => {
      playNextHighlight();
    }, durationMs);
  };

  // Play the next highlight in the queue
  const playNextHighlight = () => {
    if (highlights.length === 0) return;
    
    const nextIndex = (currentHighlightIndex + 1) % highlights.length;
    setCurrentHighlightIndex(nextIndex);
    setSelectedHighlight(highlights[nextIndex]);
  };

  // Play the previous highlight
  const playPreviousHighlight = () => {
    if (highlights.length === 0) return;
    
    const prevIndex = (currentHighlightIndex - 1 + highlights.length) % highlights.length;
    setCurrentHighlightIndex(prevIndex);
    setSelectedHighlight(highlights[prevIndex]);
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    
    if (isPlaying) {
      videoEl.pause();
      if (highlightTimerRef.current) {
        clearTimeout(highlightTimerRef.current);
        highlightTimerRef.current = null;
      }
    } else {
      videoEl.play();
      // If we're resuming, set up the timer with the remaining time
      if (remainingTime > 0 && selectedHighlight && seekedRef.current) {
        const remainingMs = remainingTime * 1000;
        highlightTimerRef.current = setTimeout(() => {
          playNextHighlight();
        }, remainingMs);
      }
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleVideoError = () => {
    console.error('Video error occurred with URL:', selectedHighlight?.hls_url);
    setVideoError(true);
  };

  return {
    highlights,
    isLoading,
    selectedHighlight,
    videoError,
    isPlaying,
    remainingTime,
    videoRef,
    playNextHighlight,
    playPreviousHighlight,
    togglePlayPause,
    handleVideoError,
    setSelectedHighlight,
    setCurrentHighlightIndex,
    setVideoError
  };
};

// Helper utility for formatting
export const formatEventName = (event) => {
  if (!event) return 'Highlight';
  
  return event
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Format time to MM:SS
export const formatTime = (seconds) => {
  if (!seconds && seconds !== 0) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}; 
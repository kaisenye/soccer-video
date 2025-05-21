import React from 'react';
import { formatTime } from '../../hooks/useVideoPlayer';

function VideoControls({ 
    isPlaying, 
    togglePlayPause, 
    playPreviousHighlight, 
    playNextHighlight, 
    remainingTime 
}) {
  return (
    <div className="video-controls">
      <div className="control-bar">
        <button 
          className="control-button prev-button" 
          onClick={playPreviousHighlight}
          aria-label="Previous clip"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7"></path>
            <path d="M19 19V5"></path>
          </svg>
        </button>
        
        <button 
          className="control-button play-pause-button" 
          onClick={togglePlayPause}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )}
        </button>
        
        <button 
          className="control-button next-button" 
          onClick={playNextHighlight}
          aria-label="Next clip"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 5 7 7-7 7"></path>
            <path d="M5 5v14"></path>
          </svg>
        </button>
      </div>
      <div className="time-display">
        {formatTime(remainingTime)}
      </div>
    </div>
  );
}

export default VideoControls; 
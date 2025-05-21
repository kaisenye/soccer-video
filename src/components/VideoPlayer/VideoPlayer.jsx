import React from 'react';
import './VideoPlayer.css';
import { useVideoPlayer } from '../../hooks/useVideoPlayer';
import LoadingSpinner from '../common/LoadingSpinner';
import VideoControls from './VideoControls';
import PlayerInfo from './PlayerInfo';
import HighlightsList from './HighlightsList';

function VideoPlayer({ selectedPlayer }) {
  const {
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
  } = useVideoPlayer(selectedPlayer);

  // Handler for highlight selection
  const handleSelectHighlight = (highlight, index) => {
    setSelectedHighlight(highlight);
    setCurrentHighlightIndex(index);
    setVideoError(false);
  };

  return (
    <div className="video-player">
      {selectedPlayer ? (
        <div className="player-info">
          {isLoading ? (
            <LoadingSpinner />
          ) : highlights.length > 0 ? (
            <div className="highlights-container">
              <div className="video-wrapper">
                {selectedHighlight && (
                  videoError ? (
                    <div className="video-error">
                      <p>Sorry, this video could not be loaded</p>
                      <p className="error-details">This video might not be available or accessible.</p>
                    </div>
                  ) : (
                    <>
                      <video 
                        ref={videoRef}
                        muted
                        poster="/placeholder-poster.jpg"
                        onError={handleVideoError}
                      >
                        Your browser does not support the video tag or HLS streaming.
                      </video>
                      
                      {/* Video Controls Container - includes both player info and controls */}
                      <div className="video-controls-container">
                        {/* Player Info - Always Visible */}
                        {selectedHighlight && <PlayerInfo 
                          selectedPlayer={selectedPlayer} 
                          selectedHighlight={selectedHighlight} 
                        />}
                        
                        {/* Custom Video Controls */}
                        <VideoControls
                          isPlaying={isPlaying}
                          togglePlayPause={togglePlayPause}
                          playPreviousHighlight={playPreviousHighlight}
                          playNextHighlight={playNextHighlight}
                          remainingTime={remainingTime}
                        />
                      </div>
                    </>
                  )
                )}
              </div>
              
              <HighlightsList
                highlights={highlights}
                selectedHighlight={selectedHighlight}
                onSelectHighlight={handleSelectHighlight}
              />
            </div>
          ) : (
            <div className="no-highlights">
              <p>No highlights available for this player</p>
            </div>
          )}
        </div>
      ) : (
        <div className="empty-state">
          <p>Select a player to watch highlights</p>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer; 
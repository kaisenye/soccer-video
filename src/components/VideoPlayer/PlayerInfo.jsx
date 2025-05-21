import React from 'react';
import { formatEventName } from '../../hooks/useVideoPlayer';

function PlayerInfo({ selectedPlayer, selectedHighlight }) {
  return (
    <div className="video-player-info-bar">
      <div className="video-player-info-overlay">
        <div className="video-player-top-row">
          <div className="video-player-initials">
            {selectedPlayer.firstName.charAt(0)}{selectedPlayer.lastName.charAt(0)}
          </div>
          <div className="video-player-number">#{selectedPlayer.jerseyNumber}</div>
          <div className="video-player-name">{selectedPlayer.firstName} {selectedPlayer.lastName}</div>
        </div>
        <div className="video-player-bottom-row">
          <div className="video-event-pill">
            {formatEventName(selectedHighlight.event)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerInfo; 
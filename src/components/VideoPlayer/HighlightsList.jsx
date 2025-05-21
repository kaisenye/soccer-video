import React from 'react';
import { formatEventName } from '../../hooks/useVideoPlayer';

function HighlightsList({ highlights, selectedHighlight, onSelectHighlight }) {
  return (
    <div className="highlights-list">
      <h3>All Highlights</h3>
      <ul>
        {highlights.map((highlight, index) => (
          <li 
            key={index}
            onClick={() => onSelectHighlight(highlight, index)}
            className={selectedHighlight === highlight ? 'selected' : ''}
          >
            <div className="highlight-item">
              <span className="highlight-event">{formatEventName(highlight.event)}</span>
              <span className="highlight-duration">{Math.round(highlight.duration)}s</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HighlightsList; 
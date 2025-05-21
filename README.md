# Soccer Video Highlights Viewer

A modern React application for viewing soccer player highlights with HLS video streaming support.

## Overview

This application allows users to browse teams, select players, and watch their game highlights using adaptive streaming technology. The interface is designed to be intuitive and responsive, displaying player information alongside their video highlights.

## Features

- **Team Selection**: Browse and select from multiple soccer teams
- **Player Filtering**: View players by team with detailed information
- **Video Highlights**: Watch player highlights with HLS streaming support
- **Cross-Browser Compatibility**: Works across modern browsers with fallback options
- **Responsive Controls**: Play, pause, and navigate between highlights
- **Highlight Information**: See event type and duration for each highlight

## Technology Stack

- **Frontend Framework**: React 19
- **Routing**: React Router 7
- **Data Fetching**: TanStack React Query
- **Video Streaming**: HLS.js for HTTP Live Streaming
- **Build Tool**: Vite
- **UI Components**: Custom-built components with modern CSS

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/soccer-video.git
   cd soccer-video
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/           # UI Components
│   ├── VideoPlayer/      # Video player components
│   ├── Navbar/           # Navigation components
│   └── common/           # Shared UI components
├── hooks/                # Custom React hooks
│   ├── useQueries.js     # React Query hooks for data fetching
│   └── useVideoPlayer.js # Video player logic and state management
├── pages/                # Application pages
├── providers/            # Context providers
└── services/             # API integration
    └── api.js            # API service functions
```

## Usage Guide

1. **Select a Team**: Use the dropdown in the navigation bar to select a team
2. **Choose a Player**: Click on a player from the sidebar to view their highlights
3. **Watch Highlights**: The video player will automatically start playing the first highlight
4. **Navigate Highlights**: Use the controls to play/pause or navigate between highlights

## API Integration

The application connects to the TraceVision API for:
- Fetching teams
- Loading team rosters
- Retrieving player highlights

## Browser Compatibility

The video player uses adaptive HLS streaming with different strategies:
- Native HLS support for Safari
- HLS.js for Chrome, Firefox, and other modern browsers
- Fallback options for older browsers

## Development

### Building for Production

```
npm run build
```

### Running Linters

```
npm run lint
```

### Preview Production Build

```
npm run preview
```

## License

[MIT License](LICENSE)

## Acknowledgments

- TraceVision API for providing the data
- HLS.js for the streaming capabilities
- React and the entire open-source community
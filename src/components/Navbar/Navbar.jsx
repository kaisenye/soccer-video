import { useState, useRef, useEffect } from 'react';
import './Navbar.css';

function Navbar({ 
  teams,
  teamsLoading,
  players,
  playersLoading,
  onSelectPlayer,
  onTeamChange,
  selectedPlayer,
  setSelectedPlayer,
  setSelectedTeam,
  selectedTeamName,
  setSelectedTeamName
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Loading state combines both loading states
  const loading = teamsLoading || playersLoading;

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle team selection
  const handleTeamChange = (teamId, teamName) => {
    if (onTeamChange) {
      onTeamChange(teamId, teamName);
    } else {
      setSelectedTeam(teamId);
      setSelectedTeamName(teamName);
      setSelectedPlayer(null);
    }
    setIsDropdownOpen(false);
  };

  // Get player initials
  const getPlayerInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
    onSelectPlayer(player);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="navbar">
      <div className="team-selection">
        <label>Select Team:</label>
        <div className="custom-dropdown" ref={dropdownRef}>
          <div className="dropdown-header" onClick={toggleDropdown}>
            <span>{selectedTeamName || '-- Select a team --'}</span>
            <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}></span>
          </div>
          {isDropdownOpen && (
            <div className="dropdown-options">
              {teams.map(team => (
                <div 
                  key={team.id} 
                  className="dropdown-option"
                  onClick={() => handleTeamChange(team.id, team.name)}
                >
                  {team.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="players-list">
        {loading ? (
          <p className="loading">Loading...</p>
        ) : players.length > 0 ? (
          <div className="players-list-container">
            <div className="players-list-header">
              <h2>Players</h2>
            </div>
            <ul>
              {players.map(player => (
                <li 
                  key={player.id} 
                  onClick={() => handlePlayerClick(player)}
                  className={selectedPlayer?.id === player.id ? 'selected' : ''}
                >
                  <div className="player-item">
                    <div className="player-initials-circle">
                      {getPlayerInitials(player.firstName, player.lastName)}
                    </div>
                    <div className="player-info">
                      <span className="player-jersey">#{player.jerseyNumber}</span>
                      <span className="player-name">{player.firstName} {player.lastName}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="no-players">Select a team to see players</p>
        )}
      </div>
    </div>
  );
}

export default Navbar; 
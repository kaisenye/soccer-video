import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Components
import Navbar from '../components/Navbar/Navbar';
import VideoPlayer from '../components/VideoPlayer/VideoPlayer';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Hooks
import { useTeams, useTeamMembers } from '../hooks/useQueries';

// CSS
import './Pages.css';

function Page() {
  // Get URL parameters if they exist
  const { teamId, playerId } = useParams();
  const navigate = useNavigate();

  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedTeamName, setSelectedTeamName] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Fetch teams using React Query
  const { data: teams = [], isLoading: teamsLoading } = useTeams();
  
  // Fetch team members when a team is selected
  const { data: players = [], isLoading: playersLoading } = useTeamMembers(selectedTeam);
  
  // Set initial team from URL params
  // Handles team-only selection 
  useEffect(() => {
    if (teamId && teams.length) {
      setSelectedTeam(teamId);
      setSelectedTeamName(teams.find(t => t.id === teamId)?.name || '');
      
      // Clear player selection if no playerId in URL
      if (!playerId) {
        setSelectedPlayer(null);
      }
    }
  }, [teamId, playerId, teams]);
  
  // Set selected Team and selected player from URL params
  // Handles when both team and player are selected
  useEffect(() => {
    if (teamId && playerId && players?.length) {
      setSelectedTeam(teamId);
      setSelectedTeamName(teams.find(t => t.id === teamId)?.name || '');
      
      const player = players.find(p => p.id === parseInt(playerId, 10));
      if (player) {
        setSelectedPlayer(player);
      }
    }
  }, [teamId, playerId, players, teams]);

  // Handle player selection from Navbar
  const handleSelectPlayer = (player) => {
    setSelectedPlayer(player);
    
    // Update URL with player and team info when a player is selected
    if (player && player.teamHash) {
      navigate(`/team/${player.teamHash}/player/${player.id}`);
    }
  };

  // Handle team selection from Navbar
  const handleTeamChange = (teamId, teamName) => {
    setSelectedTeam(teamId);
    setSelectedTeamName(teamName);
    setSelectedPlayer(null);
    
    // Update URL with team info
    navigate(`/team/${teamId}`);
  };

  return (
    <div className="app-container">
      <Navbar 
        teams={teams}
        teamsLoading={teamsLoading}
        players={players}
        playersLoading={playersLoading}
        onSelectPlayer={handleSelectPlayer}
        onTeamChange={handleTeamChange}
        selectedPlayer={selectedPlayer}
        setSelectedPlayer={setSelectedPlayer}
        setSelectedTeam={setSelectedTeam}
        selectedTeamName={selectedTeamName}
        setSelectedTeamName={setSelectedTeamName}
      />
      <VideoPlayer selectedPlayer={selectedPlayer} />

      {/* Loading Spinner */}
      {(teamsLoading || playersLoading) 
        && 
        <div className="loading-overlay">
          <LoadingSpinner />
        </div>}
    </div>
  );
}

export default Page; 
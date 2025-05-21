// TraceVision API Service

// Fetch teams from TraceVision API
export const fetchTeams = async () => {
  try {
    const response = await fetch('/api/trace/upload-dev/data/db-ro/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: [
          {
            type: 'query',
            table: 'test_top_teams',
            data: {}
          }
        ]
      })
    });

    const data = await response.json();
    
    if (data.success && data.result[0].ok) {
      return data.result[0].data.data.map(team => ({
        id: team.team_hash,
        name: team.title,
        numGames: team.num_games
      })).sort((a, b) => a.name.localeCompare(b.name));
    }
    
    throw new Error('Failed to fetch teams');
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

// Fetch team members using GraphQL
export const fetchTeamMembers = async (teamHash) => {
  if (!teamHash) {
    return [];
  }
  
  try {
    const response = await fetch('/api/trace/traceid-dev/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `query TeamMembers($teamHash: String!) { 
          teamMembers(team_hash: $teamHash) { 
            team_player_id 
            jersey_number 
            is_player 
            user { 
              user_id 
              first_name 
              last_name 
            } 
          } 
        }`,
        variables: {
          teamHash: teamHash
        },
        operationName: "TeamMembers"
      })
    });

    const data = await response.json();
          
    // Filter to only include players (is_player = true)
    if (data.data && data.data.teamMembers) {
      return data.data.teamMembers
        .filter(member => member.is_player)
        .map(player => ({
          id: player.team_player_id,
          firstName: player.user.first_name,
          lastName: player.user.last_name,
          jerseyNumber: player.jersey_number || 'N/A',
          teamHash: teamHash // Include teamHash to avoid adding it later
        }))
        .sort((a, b) => {
          // First sort by jersey number (handle 'N/A' case)
          if (a.jerseyNumber === 'N/A' && b.jerseyNumber !== 'N/A') return 1;
          if (a.jerseyNumber !== 'N/A' && b.jerseyNumber === 'N/A') return -1;
          if (a.jerseyNumber !== 'N/A' && b.jerseyNumber !== 'N/A') {
            const numA = parseInt(a.jerseyNumber);
            const numB = parseInt(b.jerseyNumber);
            if (numA !== numB) return numA - numB;
          }
          
          // Then sort by first name and last name
          const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
          const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
          return nameA.localeCompare(nameB);
        });
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching team members:', error);
    throw error;
  }
};

// Fetch player highlights using GraphQL
export const fetchPlayerHighlights = async (teamPlayerId) => {
  if (!teamPlayerId) {
    return [];
  }
  
  try {
    const response = await fetch('/api/trace/traceid-dev/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `query TeamPlayerMomentsInfo($teamPlayerId: Int!) { 
          teamPlayerMomentsInfo(team_player_id: $teamPlayerId) { 
            hls_url 
            offset 
            duration 
            event 
            game_id 
          } 
        }`,
        variables: {
          teamPlayerId: teamPlayerId
        },
        operationName: "TeamPlayerMomentsInfo"
      })
    });

    const data = await response.json();
    
    if (data.data && data.data.teamPlayerMomentsInfo) {
      return data.data.teamPlayerMomentsInfo;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching player highlights:', error);
    throw error;
  }
}; 
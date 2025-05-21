import { useQuery } from '@tanstack/react-query';
import { fetchTeams, fetchTeamMembers, fetchPlayerHighlights } from '../services/api';

// Hook for fetching teams
export const useTeams = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: fetchTeams,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook for fetching team members
export const useTeamMembers = (teamId) => {
  return useQuery({
    queryKey: ['teamMembers', teamId],
    queryFn: () => fetchTeamMembers(teamId),
    enabled: !!teamId, // Only run the query if teamId exists
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook for fetching player highlights
export const usePlayerHighlights = (playerId) => {
  return useQuery({
    queryKey: ['playerHighlights', playerId],
    queryFn: () => fetchPlayerHighlights(playerId),
    enabled: !!playerId, // Only run the query if playerId exists
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}; 
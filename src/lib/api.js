
import { supabase } from './supabase';

export const api = {
  supabase,
  
  matches: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    
    subscribe: (callback) => {
      return supabase
        .channel('matches')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'matches'
        }, callback)
        .subscribe();
    }
  },
  
  fantasyTips: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('fantasy_tips')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  },
  
  tournaments: {
    getAll: async () => {
      const { data: tournaments, error: tournamentsError } = await supabase
        .from('tournaments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (tournamentsError) throw tournamentsError;

      const enrichedTournaments = await Promise.all(
        tournaments.map(async (tournament) => {
          const [{ data: teams }, { data: players }] = await Promise.all([
            supabase
              .from('tournament_teams')
              .select('*')
              .eq('tournament_id', tournament.id)
              .order('position', { ascending: true }),
            supabase
              .from('tournament_players')
              .select('*')
              .eq('tournament_id', tournament.id)
          ]);

          return {
            ...tournament,
            teams: teams || [],
            topPlayers: players || []
          };
        })
      );

      return enrichedTournaments;
    }
  },
  
  news: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  }
};

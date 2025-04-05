
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart2, Award, Users, Loader2 } from 'lucide-react';
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tournamentsData = await api.tournaments.getAll();
        setTournaments(tournamentsData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch tournaments data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center space-x-2 mb-6">
        <BarChart2 className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Tournaments</h2>
      </div>

      <div className="space-y-8">
        {tournaments.map((tournament) => (
          <motion.div
            key={tournament.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border bg-card p-6 shadow-sm space-y-6"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">{tournament.name}</h3>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                tournament.status === "Ongoing" 
                  ? "bg-green-100 text-green-700" 
                  : "bg-yellow-100 text-yellow-700"
              }`}>
                {tournament.status}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">Points Table</h4>
                </div>
                <div className="space-y-3">
                  {tournament.teams?.map((team) => (
                    <div key={team.id} className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-muted-foreground">
                          {team.position}
                        </span>
                        <span className="font-medium">{team.name}</span>
                      </div>
                      <span className="font-semibold">{team.points}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">Top Performers</h4>
                </div>
                <div className="space-y-3">
                  {tournament.topPlayers?.map((player) => (
                    <div key={player.id} className="flex justify-between items-center">
                      <span className="font-medium">{player.name}</span>
                      <span className="text-sm text-muted-foreground">{player.stat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default Tournaments;


import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

function Schedule() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const matchesData = await api.matches.getAll();
        setMatches(matchesData.filter(match => match.status === "Upcoming"));
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch upcoming matches",
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
      className="space-y-6"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Calendar className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Upcoming Matches</h2>
      </div>

      <div className="space-y-6">
        {matches.map((match) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-primary font-medium">{match.tournament}</span>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(match.created_at), "PPP 'at' p")}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{match.team1} vs {match.team2}</h3>
                  <p className="text-sm text-muted-foreground">{match.venue}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                  match.ticketStatus === "Available" 
                    ? "bg-green-100 text-green-700" 
                    : "bg-red-100 text-red-700"
                }`}>
                  {match.ticketStatus || "Available"}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default Schedule;

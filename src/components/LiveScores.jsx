
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, Loader2 } from 'lucide-react';
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

function LiveScores() {
  const [matches, setMatches] = useState([]);
  const [fantasyTips, setFantasyTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchesData, tipsData] = await Promise.all([
          api.matches.getAll(),
          api.fantasyTips.getAll()
        ]);
        setMatches(matchesData);
        setFantasyTips(tipsData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch live scores and fantasy tips",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscription for matches
    const matchesSubscription = api.supabase
      .channel('matches')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'matches'
      }, (payload) => {
        if (payload.new) {
          setMatches(current => {
            const index = current.findIndex(match => match.id === payload.new.id);
            if (index >= 0) {
              const updated = [...current];
              updated[index] = payload.new;
              return updated;
            }
            return [...current, payload.new];
          });
        }
      })
      .subscribe();

    return () => {
      matchesSubscription.unsubscribe();
    };
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
      <section>
        <div className="flex items-center space-x-2 mb-6">
          <Trophy className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Live Matches</h2>
        </div>
        <div className="space-y-6">
          {matches.map((match) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-primary">{match.tournament}</span>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                  match.status === "Live" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                }`}>
                  {match.status}
                </span>
              </div>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">{match.team1}</span>
                    <span className="font-bold text-lg">{match.score1}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">{match.team2}</span>
                    <span className="font-bold text-lg">{match.score2}</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div className="flex justify-between items-center">
                    <span>{match.overs} overs</span>
                    <span>{match.required}</span>
                  </div>
                </div>
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm">
                    <span className="font-semibold">Last ball:</span> {match.last_ball}
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-semibold">Commentary:</span> {match.commentary}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Fantasy Tips</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {fantasyTips.map((tip) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-3">{tip.title}</h3>
              <div className="space-y-3">
                <div className="text-xl font-bold text-primary">
                  {tip.player}
                </div>
                <p className="text-muted-foreground">{tip.reason}</p>
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm font-medium">{tip.stats}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

export default LiveScores;

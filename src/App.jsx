
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Disc as Cricket, Trophy, TrendingUp, Calendar, BarChart2, Newspaper } from 'lucide-react';
import { format } from 'date-fns';

import LiveScores from "@/components/LiveScores";
import Schedule from "@/components/Schedule";
import Tournaments from "@/components/Tournaments";
import News from "@/components/News";

function App() {
  const { toast } = useToast();

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2">
                <Cricket className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">Scream11</h1>
              </Link>
              <nav className="hidden md:flex space-x-4">
                <Link to="/"><Button variant="ghost" className="flex items-center gap-2"><Trophy className="h-4 w-4" />Live Scores</Button></Link>
                <Link to="/schedule"><Button variant="ghost" className="flex items-center gap-2"><Calendar className="h-4 w-4" />Schedule</Button></Link>
                <Link to="/tournaments"><Button variant="ghost" className="flex items-center gap-2"><BarChart2 className="h-4 w-4" />Tournaments</Button></Link>
                <Link to="/news"><Button variant="ghost" className="flex items-center gap-2"><Newspaper className="h-4 w-4" />News</Button></Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<LiveScores />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/tournaments" element={<Tournaments />} />
              <Route path="/news" element={<News />} />
            </Routes>
          </AnimatePresence>
        </main>

        <Toaster />
      </div>
    </Router>
  );
}

export default App;


import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Newspaper, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

function News() {
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newsData = await api.news.getAll();
        setNewsArticles(newsData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch news articles",
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
        <Newspaper className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Latest News</h2>
      </div>

      <div className="space-y-6">
        {newsArticles.map((article) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary">{article.category}</span>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{article.read_time}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-muted-foreground">{article.summary}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {format(new Date(article.created_at), "MMMM d, yyyy")}
                </span>
                <div className="flex items-center space-x-1 text-primary group-hover:translate-x-1 transition-transform">
                  <span className="text-sm font-medium">Read more</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default News;

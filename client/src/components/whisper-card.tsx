import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, 
  HeartHandshake, 
  MessageCircle, 
  Flag, 
  Share2, 
  Clock,
  Sparkles,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WhisperCardProps {
  whisper: any;
  index?: number;
}

export default function WhisperCard({ whisper, index = 0 }: WhisperCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasBeenViewed, setHasBeenViewed] = useState(false);
  const [voteState, setVoteState] = useState<'up' | 'down' | null>(null);

  // Intersection Observer for reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasBeenViewed(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const voteMutation = useMutation({
    mutationFn: async ({ type }: { type: 'up' | 'down' }) => {
      return apiRequest(`/api/vote`, {
        method: 'POST',
        body: JSON.stringify({
          contentType: 'whisper',
          contentId: whisper.id,
          voteType: type
        })
      });
    },
    onSuccess: (_, variables) => {
      setVoteState(variables.type);
      queryClient.invalidateQueries({ queryKey: ['/api/whispers'] });
      
      // Haptic feedback for mobile
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    },
    onError: (error: any) => {
      if (error.message?.includes('401')) {
        toast({
          title: "Login Required",
          description: "Please log in to vote on whispers",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1000);
      } else {
        toast({
          title: "Vote Failed",
          description: "Unable to record your vote. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  const reportMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/report`, {
        method: 'POST',
        body: JSON.stringify({
          contentType: 'whisper',
          contentId: whisper.id,
          reason: 'inappropriate'
        })
      });
    },
    onSuccess: () => {
      toast({
        title: "Report Submitted",
        description: "Thank you for helping keep our community safe.",
      });
    },
    onError: () => {
      toast({
        title: "Report Failed",
        description: "Unable to submit report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleVote = (type: 'up' | 'down') => {
    if (voteMutation.isPending) return;
    
    // Optimistic update
    if (voteState === type) {
      setVoteState(null);
    } else {
      voteMutation.mutate({ type });
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/whisper/${whisper.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Anonymous Whisper',
          text: whisper.text.substring(0, 100) + '...',
          url: url,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied",
        description: "Whisper link copied to clipboard",
      });
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const whisperDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - whisperDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }
    },
    hover: {
      y: -12,
      scale: 1.02,
      rotateX: 5,
      transition: {
        duration: 0.3,
        ease: [0.68, -0.55, 0.265, 1.55]
      }
    }
  };

  const glowVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: [0, 0.3, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate={hasBeenViewed ? "visible" : "hidden"}
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative contain-layout"
    >
      {/* Animated background glow */}
      <motion.div
        variants={glowVariants}
        initial="initial"
        animate="animate"
        className="absolute inset-0 bg-gradient-to-r from-coral via-lavender to-electric-blue rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10"
      />
      
      {/* Main card */}
      <div className="whisper-card glass-card p-6 h-full gpu-accelerated">
        {/* Top accent line - animated on hover */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-coral to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-x-100 scale-x-0" />
        
        {/* Header with time and mood */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 text-xs text-cool-gray/70">
            <Clock size={14} />
            <span className="font-medium">{formatTimeAgo(whisper.createdAt)}</span>
            {whisper.moodTag && (
              <>
                <span className="w-1 h-1 bg-coral rounded-full" />
                <Badge 
                  variant="outline" 
                  className="bg-coral/10 border-coral/30 text-coral text-xs px-2 py-0.5 hover:bg-coral/20 transition-colors"
                >
                  {whisper.moodTag.name}
                </Badge>
              </>
            )}
          </div>
          
          {whisper.topicTag && (
            <Badge 
              variant="outline" 
              className="bg-lavender/10 border-lavender/30 text-lavender text-xs px-2 py-0.5 hover:bg-lavender/20 transition-colors"
            >
              {whisper.topicTag.name}
            </Badge>
          )}
        </div>

        {/* Whisper content */}
        <Link href={`/whisper/${whisper.id}`}>
          <div className="cursor-pointer group/content">
            <p className="text-cool-gray leading-relaxed mb-4 group-hover/content:text-white transition-colors duration-300">
              {whisper.text}
            </p>
            
            {/* Nickname if exists */}
            {whisper.nickname && (
              <div className="flex items-center gap-2 mb-4 text-sm text-cool-gray/60">
                <Sparkles size={14} className="text-lavender" />
                <span className="italic">— {whisper.nickname}</span>
              </div>
            )}
          </div>
        </Link>

        {/* Interaction bar */}
        <div className="flex items-center justify-between pt-4 border-t border-cool-gray/10">
          {/* Vote buttons */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleVote('up')}
              disabled={voteMutation.isPending}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                voteState === 'up' 
                  ? 'bg-coral/20 text-coral' 
                  : 'text-cool-gray/70 hover:text-coral hover:bg-coral/10'
              }`}
            >
              <Heart size={16} className={voteState === 'up' ? 'fill-current' : ''} />
              <span className="text-sm font-medium">{whisper.upvotes || 0}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleVote('down')}
              disabled={voteMutation.isPending}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                voteState === 'down' 
                  ? 'bg-cool-gray/20 text-cool-gray' 
                  : 'text-cool-gray/50 hover:text-cool-gray hover:bg-cool-gray/10'
              }`}
            >
              <HeartHandshake size={16} className={voteState === 'down' ? 'fill-current' : ''} />
              <span className="text-sm font-medium">{whisper.downvotes || 0}</span>
            </motion.button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Link href={`/whisper/${whisper.id}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 px-3 py-1.5 text-cool-gray/60 hover:text-lavender transition-colors rounded-lg hover:bg-lavender/10"
              >
                <MessageCircle size={16} />
                <span className="text-sm">{whisper.replies?.length || 0}</span>
              </motion.button>
            </Link>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="p-1.5 text-cool-gray/60 hover:text-electric-blue transition-colors rounded-lg hover:bg-electric-blue/10"
            >
              <Share2 size={16} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => reportMutation.mutate()}
              disabled={reportMutation.isPending}
              className="p-1.5 text-cool-gray/60 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"
            >
              <Flag size={16} />
            </motion.button>
          </div>
        </div>

        {/* Loading states */}
        <AnimatePresence>
          {(voteMutation.isPending || reportMutation.isPending) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-midnight/50 backdrop-blur-sm rounded-2xl flex items-center justify-center"
            >
              <div className="w-6 h-6 border-2 border-coral border-t-transparent rounded-full animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
import { Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";

interface WhisperCardProps {
  whisper: {
    id: string;
    text: string;
    nickname?: string;
    moodTag?: { name: string };
    topicTag?: { name: string };
    upvotes: number;
    downvotes: number;
    createdAt: string;
    replies?: any[];
  };
}

export default function WhisperCard({ whisper }: WhisperCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: async ({ voteType }: { voteType: string }) => {
      await apiRequest("POST", "/api/vote", {
        contentType: "whisper",
        contentId: whisper.id,
        voteType,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/whispers"] });
    },
    onError: (error) => {
      toast({
        title: "Error recording vote",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const reportMutation = useMutation({
    mutationFn: async ({ reason }: { reason: string }) => {
      await apiRequest("POST", "/api/report", {
        contentType: "whisper",
        contentId: whisper.id,
        reason,
      });
    },
    onSuccess: () => {
      toast({
        title: "Content reported",
        description: "Thank you for helping keep our community safe.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error reporting content",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleVote = (e: React.MouseEvent, voteType: string) => {
    e.preventDefault();
    e.stopPropagation();
    voteMutation.mutate({ voteType });
  };

  const handleReport = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const reason = prompt("Please provide a reason for reporting this content:");
    if (reason) {
      reportMutation.mutate({ reason });
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const replyCount = whisper.replies?.length || 0;

  return (
    <Link href={`/whisper/${whisper.id}`}>
      <div className="whisper-card bg-moonlight rounded-2xl p-6 border border-lavender/20 hover:border-coral/30 cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-coral/10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-2 flex-wrap">
            {whisper.moodTag && (
              <span className="bg-gradient-to-r from-coral/20 to-coral/10 text-coral px-3 py-1 rounded-full text-sm font-medium">
                {whisper.moodTag.name}
              </span>
            )}
            {whisper.topicTag && (
              <span className="bg-gradient-to-r from-lavender/20 to-lavender/10 text-lavender px-3 py-1 rounded-full text-sm font-medium">
                {whisper.topicTag.name}
              </span>
            )}
          </div>
          <span className="text-cool-gray/60 text-sm whitespace-nowrap ml-2">
            {formatTimeAgo(whisper.createdAt)}
          </span>
        </div>
        
        <p className="text-midnight mb-4 leading-relaxed">
          {truncateText(whisper.text)}
        </p>

        {whisper.nickname && (
          <p className="text-coral font-medium text-sm mb-4">— {whisper.nickname}</p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={(e) => handleVote(e, "up")}
              className="vote-btn flex items-center gap-1 text-cool-gray/60 hover:text-coral transition-all duration-200 transform hover:scale-110"
              disabled={voteMutation.isPending}
            >
              <i className="fas fa-arrow-up"></i>
              <span>{whisper.upvotes}</span>
            </button>
            <button
              onClick={(e) => handleVote(e, "down")}
              className="vote-btn flex items-center gap-1 text-cool-gray/60 hover:text-lavender transition-all duration-200 transform hover:scale-110"
              disabled={voteMutation.isPending}
            >
              <i className="fas fa-arrow-down"></i>
              <span>{whisper.downvotes}</span>
            </button>
            <div className="flex items-center gap-1 text-cool-gray/60">
              <i className="fas fa-comment"></i>
              <span>{replyCount}</span>
            </div>
          </div>
          <button
            onClick={handleReport}
            className="text-cool-gray/40 hover:text-coral/60 transition-colors duration-200 p-1"
            disabled={reportMutation.isPending}
          >
            <i className="fas fa-flag text-sm"></i>
          </button>
        </div>
      </div>
    </Link>
  );
}

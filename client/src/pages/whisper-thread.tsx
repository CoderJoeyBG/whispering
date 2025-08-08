import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function WhisperThread() {
  const [, params] = useRoute("/whisper/:id");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [replyText, setReplyText] = useState("");
  const [replyNickname, setReplyNickname] = useState("");

  const { data: whisper, isLoading } = useQuery({
    queryKey: ["/api/whispers", params?.id],
    enabled: !!params?.id,
  });

  const replyMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", `/api/whispers/${params?.id}/replies`, data);
    },
    onSuccess: () => {
      toast({
        title: "Reply posted successfully!",
        description: "Your reply has been added to the conversation.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/whispers", params?.id] });
      setReplyText("");
      setReplyNickname("");
    },
    onError: (error) => {
      toast({
        title: "Error posting reply",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const voteMutation = useMutation({
    mutationFn: async ({ contentType, contentId, voteType }: any) => {
      await apiRequest("POST", "/api/vote", { contentType, contentId, voteType });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/whispers", params?.id] });
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
    mutationFn: async ({ contentType, contentId, reason }: any) => {
      await apiRequest("POST", "/api/report", { contentType, contentId, reason });
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

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!replyText.trim()) {
      toast({
        title: "Please enter your reply",
        description: "Your reply cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    if (replyText.length > 200) {
      toast({
        title: "Reply too long",
        description: "Please keep your reply under 200 characters.",
        variant: "destructive",
      });
      return;
    }

    const replyData: any = {
      text: replyText.trim(),
    };

    if (replyNickname.trim()) {
      replyData.nickname = replyNickname.trim();
    }

    replyMutation.mutate(replyData);
  };

  const handleVote = (contentType: string, contentId: string, voteType: string) => {
    voteMutation.mutate({ contentType, contentId, voteType });
  };

  const handleReport = (contentType: string, contentId: string) => {
    const reason = prompt("Please provide a reason for reporting this content:");
    if (reason) {
      reportMutation.mutate({ contentType, contentId, reason });
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-midnight">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <i className="fas fa-spinner fa-spin text-2xl text-cool-gray mr-4"></i>
          <span className="text-cool-gray">Loading whisper...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (!whisper) {
    return (
      <div className="min-h-screen bg-midnight">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <i className="fas fa-exclamation-triangle text-4xl text-cool-gray/50 mb-4"></i>
            <h2 className="text-xl text-white mb-2">Whisper not found</h2>
            <p className="text-cool-gray">This whisper may have been deleted or doesn't exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-midnight">
      <Navigation />
      
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Original Whisper */}
          <div className="bg-moonlight rounded-2xl p-8 border border-lavender/20 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex gap-3">
                {whisper.moodTag && (
                  <span className="bg-gradient-to-r from-coral/20 to-coral/10 text-coral px-4 py-2 rounded-full font-medium">
                    {whisper.moodTag.name}
                  </span>
                )}
                {whisper.topicTag && (
                  <span className="bg-gradient-to-r from-lavender/20 to-lavender/10 text-lavender px-4 py-2 rounded-full font-medium">
                    {whisper.topicTag.name}
                  </span>
                )}
              </div>
              <span className="text-cool-gray/60">{formatTimeAgo(whisper.createdAt)}</span>
            </div>
            
            <p className="text-midnight text-lg leading-relaxed mb-6">
              {whisper.text}
            </p>
            
            {whisper.nickname && (
              <p className="text-coral font-medium mb-4">— {whisper.nickname}</p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => handleVote('whisper', whisper.id, 'up')}
                  className="vote-btn flex items-center gap-2 text-cool-gray/60 hover:text-coral bg-coral/10 px-4 py-2 rounded-xl transition-all duration-200"
                >
                  <i className="fas fa-arrow-up"></i>
                  <span>{whisper.upvotes}</span>
                </button>
                <button 
                  onClick={() => handleVote('whisper', whisper.id, 'down')}
                  className="vote-btn flex items-center gap-2 text-cool-gray/60 hover:text-lavender bg-lavender/10 px-4 py-2 rounded-xl transition-all duration-200"
                >
                  <i className="fas fa-arrow-down"></i>
                  <span>{whisper.downvotes}</span>
                </button>
                <span className="flex items-center gap-2 text-cool-gray/60">
                  <i className="fas fa-comment"></i>
                  <span>{whisper.replies?.length || 0} replies</span>
                </span>
              </div>
              <button 
                onClick={() => handleReport('whisper', whisper.id)}
                className="text-cool-gray/40 hover:text-coral/60 p-2 transition-colors duration-200"
              >
                <i className="fas fa-flag"></i>
              </button>
            </div>
          </div>

          {/* Reply Form */}
          <div className="bg-moonlight/50 rounded-2xl p-6 border border-lavender/20 mb-8">
            <h3 className="text-white font-semibold mb-4">Add Your Response</h3>
            <form onSubmit={handleReplySubmit}>
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full h-24 bg-moonlight border border-lavender/30 rounded-xl px-4 py-3 text-midnight placeholder-cool-gray/60 focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/20 resize-none mb-4"
                placeholder="Share your thoughts... (200 characters max)"
                maxLength={200}
              />
              
              <div className="flex justify-between items-center">
                <Input
                  type="text"
                  value={replyNickname}
                  onChange={(e) => setReplyNickname(e.target.value)}
                  className="bg-moonlight border border-lavender/30 rounded-xl px-4 py-2 text-midnight placeholder-cool-gray/60 focus:outline-none focus:border-coral w-40"
                  placeholder="Nickname (optional)"
                  maxLength={50}
                />
                <Button 
                  type="submit" 
                  disabled={replyMutation.isPending}
                  className="bg-gradient-to-r from-coral to-lavender text-white px-6 py-2 rounded-xl hover:from-coral/80 hover:to-lavender/80 transition-all duration-200"
                >
                  {replyMutation.isPending ? "Posting..." : "Reply"}
                </Button>
              </div>
            </form>
          </div>

          {/* Replies */}
          <div className="space-y-4">
            {whisper.replies && whisper.replies.length > 0 ? (
              whisper.replies.map((reply: any) => (
                <div key={reply.id} className="bg-moonlight/30 rounded-xl p-6 border border-lavender/10 ml-8">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-coral font-medium">
                      {reply.nickname || "Anonymous"}
                    </span>
                    <span className="text-cool-gray/60 text-sm">{formatTimeAgo(reply.createdAt)}</span>
                  </div>
                  <p className="text-midnight mb-4">{reply.text}</p>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleVote('reply', reply.id, 'up')}
                      className="vote-btn flex items-center gap-1 text-cool-gray/60 hover:text-coral transition-colors duration-200"
                    >
                      <i className="fas fa-arrow-up"></i>
                      <span>{reply.upvotes}</span>
                    </button>
                    <button 
                      onClick={() => handleVote('reply', reply.id, 'down')}
                      className="vote-btn flex items-center gap-1 text-cool-gray/60 hover:text-lavender transition-colors duration-200"
                    >
                      <i className="fas fa-arrow-down"></i>
                      <span>{reply.downvotes}</span>
                    </button>
                    <button 
                      onClick={() => handleReport('reply', reply.id)}
                      className="text-cool-gray/40 hover:text-coral/60 transition-colors duration-200"
                    >
                      <i className="fas fa-flag text-sm"></i>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 ml-8">
                <i className="fas fa-comment text-2xl text-cool-gray/50 mb-3"></i>
                <p className="text-cool-gray">No replies yet. Be the first to respond!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

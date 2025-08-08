import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertWhisperSchema, insertReplySchema, insertMoodTagSchema, insertTopicTagSchema, insertThemeSchema, insertFlagSchema, insertVoteSchema } from "@shared/schema";
import { z } from "zod";
import rateLimit from "express-rate-limit";

// Rate limiters
const whisperLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 whispers per hour
  message: { message: "Too many whispers. Please wait before posting again." },
  standardHeaders: true,
  legacyHeaders: false,
});

const replyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 replies per 15 minutes
  message: { message: "Too many replies. Please wait before replying again." },
  standardHeaders: true,
  legacyHeaders: false,
});

const voteLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 votes per minute
  message: { message: "Too many votes. Please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin middleware
const isAdmin = async (req: any, res: any, next: any) => {
  try {
    const userId = req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = await storage.getUser(userId);
    if (!user?.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    next();
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

function getClientIP(req: any): string {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress || 
         req.ip || 
         '127.0.0.1';
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Seed initial data
  try {
    const moodTags = await storage.getMoodTags();
    if (moodTags.length === 0) {
      const defaultMoods = [
        { name: "Hope", description: "Feelings of optimism and expectation" },
        { name: "Regret", description: "Feelings of sadness or disappointment" },
        { name: "Fear", description: "Feelings of anxiety or worry" },
        { name: "Joy", description: "Feelings of happiness and delight" },
        { name: "Sadness", description: "Feelings of sorrow and melancholy" },
        { name: "Love", description: "Feelings of affection and care" },
        { name: "Anger", description: "Feelings of frustration and rage" },
      ];
      
      for (const mood of defaultMoods) {
        await storage.createMoodTag(mood);
      }
    }

    const topicTags = await storage.getTopicTags();
    if (topicTags.length === 0) {
      const defaultTopics = [
        { name: "Relationships", description: "Love, friendship, family dynamics" },
        { name: "Work", description: "Career, job experiences, workplace" },
        { name: "Family", description: "Family relationships and experiences" },
        { name: "Dreams", description: "Aspirations, goals, and ambitions" },
        { name: "Mental Health", description: "Emotional wellbeing and mental health" },
      ];
      
      for (const topic of defaultTopics) {
        await storage.createTopicTag(topic);
      }
    }
  } catch (error) {
    console.error("Error seeding data:", error);
  }

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Public API routes

  // Get whispers with filtering
  app.get('/api/whispers', async (req, res) => {
    try {
      const { mood, topic, theme, sort, search, page = "1", limit = "12" } = req.query;
      
      const filters = {
        moodTagId: mood as string,
        topicTagId: topic as string,
        themeId: theme as string,
        sort: sort as 'recent' | 'popular' | 'discussed',
        search: search as string,
        limit: parseInt(limit as string),
        offset: (parseInt(page as string) - 1) * parseInt(limit as string),
      };

      const whispers = await storage.getWhispers(filters);
      res.json(whispers);
    } catch (error) {
      console.error("Error fetching whispers:", error);
      res.status(500).json({ message: "Failed to fetch whispers" });
    }
  });

  // Get single whisper with replies
  app.get('/api/whispers/:id', async (req, res) => {
    try {
      const whisper = await storage.getWhisperById(req.params.id);
      if (!whisper) {
        return res.status(404).json({ message: "Whisper not found" });
      }
      res.json(whisper);
    } catch (error) {
      console.error("Error fetching whisper:", error);
      res.status(500).json({ message: "Failed to fetch whisper" });
    }
  });

  // Create whisper
  app.post('/api/whispers', whisperLimiter, async (req, res) => {
    try {
      const data = insertWhisperSchema.parse(req.body);
      const whisper = await storage.createWhisper(data, getClientIP(req));
      res.status(201).json(whisper);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating whisper:", error);
      res.status(500).json({ message: "Failed to create whisper" });
    }
  });

  // Create reply
  app.post('/api/whispers/:id/replies', replyLimiter, async (req, res) => {
    try {
      const data = insertReplySchema.parse({
        ...req.body,
        whisperId: req.params.id,
      });
      
      const reply = await storage.createReply(data, getClientIP(req));
      res.status(201).json(reply);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating reply:", error);
      res.status(500).json({ message: "Failed to create reply" });
    }
  });

  // Vote on content
  app.post('/api/vote', voteLimiter, async (req, res) => {
    try {
      const { contentType, contentId, voteType } = req.body;
      const ipAddress = getClientIP(req);
      
      if (!['whisper', 'reply'].includes(contentType)) {
        return res.status(400).json({ message: "Invalid content type" });
      }
      
      if (!['up', 'down'].includes(voteType)) {
        return res.status(400).json({ message: "Invalid vote type" });
      }

      // Check if user already voted
      const existingVote = await storage.hasVoted(contentType, contentId, ipAddress);
      if (existingVote) {
        if (existingVote.voteType === voteType) {
          // Remove vote if same type
          await storage.removeVote(contentType, contentId, ipAddress);
        } else {
          // Remove old vote and add new one
          await storage.removeVote(contentType, contentId, ipAddress);
          await storage.recordVote({ contentType, contentId, voteType }, ipAddress);
        }
      } else {
        // Record new vote
        await storage.recordVote({ contentType, contentId, voteType }, ipAddress);
      }

      // Update vote counts
      // This is a simplified approach - in production you'd want to aggregate votes more efficiently
      res.json({ message: "Vote recorded" });
    } catch (error) {
      console.error("Error recording vote:", error);
      res.status(500).json({ message: "Failed to record vote" });
    }
  });

  // Report content
  app.post('/api/report', async (req, res) => {
    try {
      const data = insertFlagSchema.parse(req.body);
      const flag = await storage.createFlag(data, getClientIP(req));
      
      // Flag the content
      if (data.contentType === 'whisper') {
        await storage.flagWhisper(data.contentId);
      } else {
        await storage.flagReply(data.contentId);
      }
      
      res.status(201).json({ message: "Content reported successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error reporting content:", error);
      res.status(500).json({ message: "Failed to report content" });
    }
  });

  // Get tags
  app.get('/api/tags', async (req, res) => {
    try {
      const [moodTags, topicTags] = await Promise.all([
        storage.getMoodTags(),
        storage.getTopicTags()
      ]);
      
      res.json({ moodTags, topicTags });
    } catch (error) {
      console.error("Error fetching tags:", error);
      res.status(500).json({ message: "Failed to fetch tags" });
    }
  });

  // Get current theme
  app.get('/api/themes/current', async (req, res) => {
    try {
      const theme = await storage.getCurrentTheme();
      res.json(theme);
    } catch (error) {
      console.error("Error fetching current theme:", error);
      res.status(500).json({ message: "Failed to fetch current theme" });
    }
  });

  // Get all themes
  app.get('/api/themes', async (req, res) => {
    try {
      const themes = await storage.getThemes();
      res.json(themes);
    } catch (error) {
      console.error("Error fetching themes:", error);
      res.status(500).json({ message: "Failed to fetch themes" });
    }
  });

  // Admin routes
  app.get('/api/admin/stats', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get('/api/admin/flagged', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const flaggedContent = await storage.getFlaggedContent();
      res.json(flaggedContent);
    } catch (error) {
      console.error("Error fetching flagged content:", error);
      res.status(500).json({ message: "Failed to fetch flagged content" });
    }
  });

  app.post('/api/admin/content/:type/:id/approve', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { type, id } = req.params;
      
      if (type === 'whisper') {
        // Unflag whisper (you'd implement this method in storage)
        // await storage.unflagWhisper(id);
      } else if (type === 'reply') {
        // await storage.unflagReply(id);
      }
      
      await storage.logAdminAction({
        adminUserId: req.user.claims.sub,
        actionType: 'approve_content',
        targetType: type,
        targetId: id,
      });
      
      res.json({ message: "Content approved" });
    } catch (error) {
      console.error("Error approving content:", error);
      res.status(500).json({ message: "Failed to approve content" });
    }
  });

  app.delete('/api/admin/content/:type/:id', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { type, id } = req.params;
      
      if (type === 'whisper') {
        await storage.deleteWhisper(id);
      } else if (type === 'reply') {
        await storage.deleteReply(id);
      }
      
      await storage.logAdminAction({
        adminUserId: req.user.claims.sub,
        actionType: 'delete_content',
        targetType: type,
        targetId: id,
      });
      
      res.json({ message: "Content deleted" });
    } catch (error) {
      console.error("Error deleting content:", error);
      res.status(500).json({ message: "Failed to delete content" });
    }
  });

  app.post('/api/admin/tags/mood', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const data = insertMoodTagSchema.parse(req.body);
      const tag = await storage.createMoodTag(data);
      
      await storage.logAdminAction({
        adminUserId: req.user.claims.sub,
        actionType: 'create_mood_tag',
        details: JSON.stringify(data),
      });
      
      res.status(201).json(tag);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating mood tag:", error);
      res.status(500).json({ message: "Failed to create mood tag" });
    }
  });

  app.post('/api/admin/tags/topic', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const data = insertTopicTagSchema.parse(req.body);
      const tag = await storage.createTopicTag(data);
      
      await storage.logAdminAction({
        adminUserId: req.user.claims.sub,
        actionType: 'create_topic_tag',
        details: JSON.stringify(data),
      });
      
      res.status(201).json(tag);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating topic tag:", error);
      res.status(500).json({ message: "Failed to create topic tag" });
    }
  });

  app.post('/api/admin/themes', isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const data = insertThemeSchema.parse(req.body);
      const theme = await storage.createTheme(data);
      
      await storage.logAdminAction({
        adminUserId: req.user.claims.sub,
        actionType: 'create_theme',
        details: JSON.stringify(data),
      });
      
      res.status(201).json(theme);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating theme:", error);
      res.status(500).json({ message: "Failed to create theme" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

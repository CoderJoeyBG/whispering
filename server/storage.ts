import {
  users,
  whispers,
  replies,
  moodTags,
  topicTags,
  themes,
  flags,
  votes,
  adminActions,
  type User,
  type UpsertUser,
  type Whisper,
  type WhisperWithRelations,
  type InsertWhisper,
  type Reply,
  type InsertReply,
  type MoodTag,
  type TopicTag,
  type Theme,
  type Flag,
  type Vote,
  type AdminAction,
  type InsertMoodTag,
  type InsertTopicTag,
  type InsertTheme,
  type InsertFlag,
  type InsertVote,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, sql, count, asc } from "drizzle-orm";
import { createHash } from "crypto";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Whisper operations
  getWhispers(filters?: {
    moodTagId?: string;
    topicTagId?: string;
    themeId?: string;
    sort?: 'recent' | 'popular' | 'discussed';
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<WhisperWithRelations[]>;
  getWhisperById(id: string): Promise<WhisperWithRelations | undefined>;
  createWhisper(whisper: InsertWhisper, ipAddress: string): Promise<Whisper>;
  updateWhisperVotes(id: string, upvotes: number, downvotes: number): Promise<void>;
  flagWhisper(id: string): Promise<void>;
  deleteWhisper(id: string): Promise<void>;
  
  // Reply operations
  getRepliesByWhisperId(whisperId: string): Promise<Reply[]>;
  createReply(reply: InsertReply, ipAddress: string): Promise<Reply>;
  updateReplyVotes(id: string, upvotes: number, downvotes: number): Promise<void>;
  flagReply(id: string): Promise<void>;
  deleteReply(id: string): Promise<void>;
  
  // Tag operations
  getMoodTags(): Promise<MoodTag[]>;
  getTopicTags(): Promise<TopicTag[]>;
  createMoodTag(tag: InsertMoodTag): Promise<MoodTag>;
  createTopicTag(tag: InsertTopicTag): Promise<MoodTag>;
  deleteMoodTag(id: string): Promise<void>;
  deleteTopicTag(id: string): Promise<void>;
  
  // Theme operations
  getThemes(): Promise<Theme[]>;
  getCurrentTheme(): Promise<Theme | undefined>;
  createTheme(theme: InsertTheme): Promise<Theme>;
  updateTheme(id: string, theme: Partial<InsertTheme>): Promise<void>;
  deleteTheme(id: string): Promise<void>;
  
  // Voting operations
  hasVoted(contentType: string, contentId: string, ipAddress: string): Promise<Vote | undefined>;
  recordVote(vote: InsertVote, ipAddress: string): Promise<Vote>;
  removeVote(contentType: string, contentId: string, ipAddress: string): Promise<void>;
  
  // Flag operations
  createFlag(flag: InsertFlag, ipAddress: string): Promise<Flag>;
  getFlaggedContent(): Promise<(Flag & { whisper?: Whisper; reply?: Reply })[]>;
  
  // Admin operations
  getStats(): Promise<{
    totalWhispers: number;
    totalReplies: number;
    flaggedContent: number;
    activeThemes: number;
    todayWhispers: number;
  }>;
  logAdminAction(action: Omit<AdminAction, 'id' | 'createdAt'>): Promise<AdminAction>;
}

function hashIP(ip: string): string {
  return createHash('sha256').update(ip + (process.env.IP_SALT || 'default-salt')).digest('hex');
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Whisper operations
  async getWhispers(filters?: {
    moodTagId?: string;
    topicTagId?: string;
    themeId?: string;
    sort?: 'recent' | 'popular' | 'discussed';
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<WhisperWithRelations[]> {
    let query = db
      .select({
        whisper: whispers,
        moodTag: moodTags,
        topicTag: topicTags,
        theme: themes,
        replyCount: sql<number>`cast(count(${replies.id}) as int)`.as('reply_count'),
      })
      .from(whispers)
      .leftJoin(moodTags, eq(whispers.moodTagId, moodTags.id))
      .leftJoin(topicTags, eq(whispers.topicTagId, topicTags.id))
      .leftJoin(themes, eq(whispers.themeId, themes.id))
      .leftJoin(replies, eq(whispers.id, replies.whisperId))
      .where(and(
        eq(whispers.buried, false),
        eq(whispers.flagged, false)
      ))
      .groupBy(whispers.id, moodTags.id, topicTags.id, themes.id);

    // Apply filters
    const conditions = [eq(whispers.buried, false), eq(whispers.flagged, false)];
    
    if (filters?.moodTagId) {
      conditions.push(eq(whispers.moodTagId, filters.moodTagId));
    }
    
    if (filters?.topicTagId) {
      conditions.push(eq(whispers.topicTagId, filters.topicTagId));
    }
    
    if (filters?.themeId) {
      conditions.push(eq(whispers.themeId, filters.themeId));
    }
    
    if (filters?.search) {
      conditions.push(sql`${whispers.text} ILIKE ${'%' + filters.search + '%'}`);
    }

    query = query.where(and(...conditions));

    // Apply sorting
    if (filters?.sort === 'popular') {
      query = query.orderBy(desc(sql`${whispers.upvotes} - ${whispers.downvotes}`));
    } else if (filters?.sort === 'discussed') {
      query = query.orderBy(desc(sql`count(${replies.id})`));
    } else {
      query = query.orderBy(desc(whispers.createdAt));
    }

    // Apply pagination
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }

    const results = await query;
    
    return results.map(result => ({
      ...result.whisper,
      moodTag: result.moodTag || undefined,
      topicTag: result.topicTag || undefined,
      theme: result.theme || undefined,
      replies: [], // Will be populated separately if needed
    }));
  }

  async getWhisperById(id: string): Promise<WhisperWithRelations | undefined> {
    const [result] = await db
      .select({
        whisper: whispers,
        moodTag: moodTags,
        topicTag: topicTags,
        theme: themes,
      })
      .from(whispers)
      .leftJoin(moodTags, eq(whispers.moodTagId, moodTags.id))
      .leftJoin(topicTags, eq(whispers.topicTagId, topicTags.id))
      .leftJoin(themes, eq(whispers.themeId, themes.id))
      .where(eq(whispers.id, id));

    if (!result) return undefined;

    const whisperReplies = await this.getRepliesByWhisperId(id);

    return {
      ...result.whisper,
      moodTag: result.moodTag || undefined,
      topicTag: result.topicTag || undefined,
      theme: result.theme || undefined,
      replies: whisperReplies,
    };
  }

  async createWhisper(whisper: InsertWhisper, ipAddress: string): Promise<Whisper> {
    const [newWhisper] = await db
      .insert(whispers)
      .values({
        ...whisper,
        ipHash: hashIP(ipAddress),
      })
      .returning();
    return newWhisper;
  }

  async updateWhisperVotes(id: string, upvotes: number, downvotes: number): Promise<void> {
    await db
      .update(whispers)
      .set({ 
        upvotes, 
        downvotes,
        buried: downvotes >= 10 // Bury if too many downvotes
      })
      .where(eq(whispers.id, id));
  }

  async flagWhisper(id: string): Promise<void> {
    await db
      .update(whispers)
      .set({ flagged: true })
      .where(eq(whispers.id, id));
  }

  async deleteWhisper(id: string): Promise<void> {
    await db.delete(whispers).where(eq(whispers.id, id));
  }

  // Reply operations
  async getRepliesByWhisperId(whisperId: string): Promise<Reply[]> {
    return await db
      .select()
      .from(replies)
      .where(and(
        eq(replies.whisperId, whisperId),
        eq(replies.buried, false),
        eq(replies.flagged, false)
      ))
      .orderBy(asc(replies.createdAt));
  }

  async createReply(reply: InsertReply, ipAddress: string): Promise<Reply> {
    const [newReply] = await db
      .insert(replies)
      .values({
        ...reply,
        ipHash: hashIP(ipAddress),
      })
      .returning();
    return newReply;
  }

  async updateReplyVotes(id: string, upvotes: number, downvotes: number): Promise<void> {
    await db
      .update(replies)
      .set({ 
        upvotes, 
        downvotes,
        buried: downvotes >= 10 // Bury if too many downvotes
      })
      .where(eq(replies.id, id));
  }

  async flagReply(id: string): Promise<void> {
    await db
      .update(replies)
      .set({ flagged: true })
      .where(eq(replies.id, id));
  }

  async deleteReply(id: string): Promise<void> {
    await db.delete(replies).where(eq(replies.id, id));
  }

  // Tag operations
  async getMoodTags(): Promise<MoodTag[]> {
    return await db.select().from(moodTags).orderBy(asc(moodTags.name));
  }

  async getTopicTags(): Promise<TopicTag[]> {
    return await db.select().from(topicTags).orderBy(asc(topicTags.name));
  }

  async createMoodTag(tag: InsertMoodTag): Promise<MoodTag> {
    const [newTag] = await db.insert(moodTags).values(tag).returning();
    return newTag;
  }

  async createTopicTag(tag: InsertTopicTag): Promise<MoodTag> {
    const [newTag] = await db.insert(topicTags).values(tag).returning();
    return newTag;
  }

  async deleteMoodTag(id: string): Promise<void> {
    await db.delete(moodTags).where(eq(moodTags.id, id));
  }

  async deleteTopicTag(id: string): Promise<void> {
    await db.delete(topicTags).where(eq(topicTags.id, id));
  }

  // Theme operations
  async getThemes(): Promise<Theme[]> {
    return await db.select().from(themes).orderBy(desc(themes.startDate));
  }

  async getCurrentTheme(): Promise<Theme | undefined> {
    const now = new Date();
    const [theme] = await db
      .select()
      .from(themes)
      .where(and(
        eq(themes.isActive, true),
        sql`${themes.startDate} <= ${now}`,
        sql`${themes.endDate} >= ${now}`
      ))
      .orderBy(desc(themes.startDate))
      .limit(1);
    return theme;
  }

  async createTheme(theme: InsertTheme): Promise<Theme> {
    const [newTheme] = await db.insert(themes).values(theme).returning();
    return newTheme;
  }

  async updateTheme(id: string, theme: Partial<InsertTheme>): Promise<void> {
    await db.update(themes).set(theme).where(eq(themes.id, id));
  }

  async deleteTheme(id: string): Promise<void> {
    await db.delete(themes).where(eq(themes.id, id));
  }

  // Voting operations
  async hasVoted(contentType: string, contentId: string, ipAddress: string): Promise<Vote | undefined> {
    const [vote] = await db
      .select()
      .from(votes)
      .where(and(
        eq(votes.contentType, contentType),
        eq(votes.contentId, contentId),
        eq(votes.ipHash, hashIP(ipAddress))
      ));
    return vote;
  }

  async recordVote(vote: InsertVote, ipAddress: string): Promise<Vote> {
    const [newVote] = await db
      .insert(votes)
      .values({
        ...vote,
        ipHash: hashIP(ipAddress),
      })
      .returning();
    return newVote;
  }

  async removeVote(contentType: string, contentId: string, ipAddress: string): Promise<void> {
    await db
      .delete(votes)
      .where(and(
        eq(votes.contentType, contentType),
        eq(votes.contentId, contentId),
        eq(votes.ipHash, hashIP(ipAddress))
      ));
  }

  // Flag operations
  async createFlag(flag: InsertFlag, ipAddress: string): Promise<Flag> {
    const [newFlag] = await db
      .insert(flags)
      .values({
        ...flag,
        ipHash: hashIP(ipAddress),
      })
      .returning();
    return newFlag;
  }

  async getFlaggedContent(): Promise<(Flag & { whisper?: Whisper; reply?: Reply })[]> {
    const flaggedWhispers = await db
      .select({
        flag: flags,
        whisper: whispers,
      })
      .from(flags)
      .leftJoin(whispers, and(
        eq(flags.contentType, 'whisper'),
        eq(flags.contentId, whispers.id)
      ))
      .where(eq(flags.contentType, 'whisper'));

    const flaggedReplies = await db
      .select({
        flag: flags,
        reply: replies,
      })
      .from(flags)
      .leftJoin(replies, and(
        eq(flags.contentType, 'reply'),
        eq(flags.contentId, replies.id)
      ))
      .where(eq(flags.contentType, 'reply'));

    return [
      ...flaggedWhispers.map(f => ({ ...f.flag, whisper: f.whisper || undefined })),
      ...flaggedReplies.map(f => ({ ...f.flag, reply: f.reply || undefined })),
    ];
  }

  // Admin operations
  async getStats(): Promise<{
    totalWhispers: number;
    totalReplies: number;
    flaggedContent: number;
    activeThemes: number;
    todayWhispers: number;
  }> {
    const [whisperCount] = await db.select({ count: count() }).from(whispers);
    const [replyCount] = await db.select({ count: count() }).from(replies);
    const [flagCount] = await db.select({ count: count() }).from(flags);
    const [themeCount] = await db.select({ count: count() }).from(themes).where(eq(themes.isActive, true));
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [todayCount] = await db
      .select({ count: count() })
      .from(whispers)
      .where(sql`${whispers.createdAt} >= ${today}`);

    return {
      totalWhispers: whisperCount.count,
      totalReplies: replyCount.count,
      flaggedContent: flagCount.count,
      activeThemes: themeCount.count,
      todayWhispers: todayCount.count,
    };
  }

  async logAdminAction(action: Omit<AdminAction, 'id' | 'createdAt'>): Promise<AdminAction> {
    const [newAction] = await db
      .insert(adminActions)
      .values(action)
      .returning();
    return newAction;
  }
}

export const storage = new DatabaseStorage();

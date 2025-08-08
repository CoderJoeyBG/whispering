import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Mood tags
export const moodTags = pgTable("mood_tags", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 50 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Topic tags
export const topicTags = pgTable("topic_tags", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 50 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Themes
export const themes = pgTable("themes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Whispers
export const whispers = pgTable("whispers", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  text: text("text").notNull(),
  nickname: varchar("nickname", { length: 50 }),
  moodTagId: uuid("mood_tag_id").references(() => moodTags.id),
  topicTagId: uuid("topic_tag_id").references(() => topicTags.id),
  themeId: uuid("theme_id").references(() => themes.id),
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  buried: boolean("buried").default(false),
  flagged: boolean("flagged").default(false),
  ipHash: varchar("ip_hash", { length: 64 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Replies
export const replies = pgTable("replies", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  whisperId: uuid("whisper_id").notNull().references(() => whispers.id, { onDelete: 'cascade' }),
  text: text("text").notNull(),
  nickname: varchar("nickname", { length: 50 }),
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  buried: boolean("buried").default(false),
  flagged: boolean("flagged").default(false),
  ipHash: varchar("ip_hash", { length: 64 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Flags/Reports
export const flags = pgTable("flags", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  contentType: varchar("content_type", { length: 20 }).notNull(), // 'whisper' or 'reply'
  contentId: uuid("content_id").notNull(),
  reason: text("reason").notNull(),
  ipHash: varchar("ip_hash", { length: 64 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Votes
export const votes = pgTable("votes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  contentType: varchar("content_type", { length: 20 }).notNull(), // 'whisper' or 'reply'
  contentId: uuid("content_id").notNull(),
  voteType: varchar("vote_type", { length: 10 }).notNull(), // 'up' or 'down'
  ipHash: varchar("ip_hash", { length: 64 }).notNull(),
  sessionId: varchar("session_id", { length: 128 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin actions log
export const adminActions = pgTable("admin_actions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  adminUserId: varchar("admin_user_id").notNull().references(() => users.id),
  actionType: varchar("action_type", { length: 50 }).notNull(),
  targetType: varchar("target_type", { length: 20 }),
  targetId: uuid("target_id"),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const whispersRelations = relations(whispers, ({ one, many }) => ({
  moodTag: one(moodTags, {
    fields: [whispers.moodTagId],
    references: [moodTags.id],
  }),
  topicTag: one(topicTags, {
    fields: [whispers.topicTagId],
    references: [topicTags.id],
  }),
  theme: one(themes, {
    fields: [whispers.themeId],
    references: [themes.id],
  }),
  replies: many(replies),
}));

export const repliesRelations = relations(replies, ({ one }) => ({
  whisper: one(whispers, {
    fields: [replies.whisperId],
    references: [whispers.id],
  }),
}));

export const moodTagsRelations = relations(moodTags, ({ many }) => ({
  whispers: many(whispers),
}));

export const topicTagsRelations = relations(topicTags, ({ many }) => ({
  whispers: many(whispers),
}));

export const themesRelations = relations(themes, ({ many }) => ({
  whispers: many(whispers),
}));

// Zod schemas
export const insertWhisperSchema = createInsertSchema(whispers).omit({
  id: true,
  upvotes: true,
  downvotes: true,
  buried: true,
  flagged: true,
  ipHash: true,
  createdAt: true,
}).extend({
  text: z.string().min(1).max(200),
  nickname: z.string().max(50).optional(),
});

export const insertReplySchema = createInsertSchema(replies).omit({
  id: true,
  upvotes: true,
  downvotes: true,
  buried: true,
  flagged: true,
  ipHash: true,
  createdAt: true,
}).extend({
  text: z.string().min(1).max(200),
  nickname: z.string().max(50).optional(),
});

export const insertMoodTagSchema = createInsertSchema(moodTags).omit({
  id: true,
  createdAt: true,
});

export const insertTopicTagSchema = createInsertSchema(topicTags).omit({
  id: true,
  createdAt: true,
});

export const insertThemeSchema = createInsertSchema(themes).omit({
  id: true,
  createdAt: true,
});

export const insertFlagSchema = createInsertSchema(flags).omit({
  id: true,
  createdAt: true,
});

export const insertVoteSchema = createInsertSchema(votes).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertWhisper = z.infer<typeof insertWhisperSchema>;
export type Whisper = typeof whispers.$inferSelect;
export type WhisperWithRelations = Whisper & {
  moodTag?: MoodTag;
  topicTag?: TopicTag;
  theme?: Theme;
  replies?: Reply[];
};
export type InsertReply = z.infer<typeof insertReplySchema>;
export type Reply = typeof replies.$inferSelect;
export type MoodTag = typeof moodTags.$inferSelect;
export type TopicTag = typeof topicTags.$inferSelect;
export type Theme = typeof themes.$inferSelect;
export type Flag = typeof flags.$inferSelect;
export type Vote = typeof votes.$inferSelect;
export type AdminAction = typeof adminActions.$inferSelect;
export type InsertMoodTag = z.infer<typeof insertMoodTagSchema>;
export type InsertTopicTag = z.infer<typeof insertTopicTagSchema>;
export type InsertTheme = z.infer<typeof insertThemeSchema>;
export type InsertFlag = z.infer<typeof insertFlagSchema>;
export type InsertVote = z.infer<typeof insertVoteSchema>;

import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  date,
  primaryKey,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * User profiles — extends Supabase auth.users.
 * The id references auth.users(id) via FK set up in raw SQL.
 */
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  subscriptionTier: text("subscription_tier").notNull().default("free"),
  subscriptionExpiresAt: timestamp("subscription_expires_at", {
    withTimezone: true,
  }),
  stripeCustomerId: text("stripe_customer_id"),
  onboardingCompleted: boolean("onboarding_completed").notNull().default(false),
  settings: jsonb("settings").default("{}"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** Areas for organizing projects */
export const areas = pgTable("areas", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  icon: text("icon"),
  color: text("color").default("#6366F1"),
  sortOrder: integer("sort_order").notNull().default(0),
  collapsed: boolean("collapsed").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

/** Projects within areas */
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  areaId: uuid("area_id").references(() => areas.id, {
    onDelete: "set null",
  }),
  name: text("name").notNull(),
  notes: text("notes"),
  color: text("color"),
  deadline: date("deadline"),
  status: text("status").notNull().default("active"),
  sortOrder: integer("sort_order").notNull().default(0),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

/** Headings (section dividers) within projects */
export const headings = pgTable("headings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

/** Tasks — the core entity */
export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  projectId: uuid("project_id").references(() => projects.id, {
    onDelete: "set null",
  }),
  areaId: uuid("area_id").references(() => areas.id, {
    onDelete: "set null",
  }),
  headingId: uuid("heading_id").references(() => headings.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  notes: text("notes"),
  status: text("status").notNull().default("active"),
  priority: text("priority").notNull().default("none"),
  scheduledDate: date("scheduled_date"),
  scheduledTimeSlot: text("scheduled_time_slot"),
  deadline: date("deadline"),
  reminderAt: timestamp("reminder_at", { withTimezone: true }),
  repeatConfig: jsonb("repeat_config"),
  sortOrder: integer("sort_order").notNull().default(0),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

/** Checklist items (subtasks) within tasks */
export const checklistItems = pgTable("checklist_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  taskId: uuid("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  completed: boolean("completed").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

/** Tags for cross-cutting categorization */
export const tags = pgTable(
  "tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    color: text("color"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    uniqueUserTag: unique().on(t.userId, t.name),
  })
);

/** Junction table for task-tag many-to-many relationship */
export const taskTags = pgTable(
  "task_tags",
  {
    taskId: uuid("task_id")
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.taskId, t.tagId] }),
  })
);

// ────────────────────────────────────────────
// Relations
// ────────────────────────────────────────────

export const profilesRelations = relations(profiles, ({ many }) => ({
  areas: many(areas),
  projects: many(projects),
  tasks: many(tasks),
}));

export const areasRelations = relations(areas, ({ one, many }) => ({
  user: one(profiles, {
    fields: [areas.userId],
    references: [profiles.id],
  }),
  projects: many(projects),
  tasks: many(tasks),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(profiles, {
    fields: [projects.userId],
    references: [profiles.id],
  }),
  area: one(areas, {
    fields: [projects.areaId],
    references: [areas.id],
  }),
  headings: many(headings),
  tasks: many(tasks),
}));

export const headingsRelations = relations(headings, ({ one, many }) => ({
  user: one(profiles, {
    fields: [headings.userId],
    references: [profiles.id],
  }),
  project: one(projects, {
    fields: [headings.projectId],
    references: [projects.id],
  }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  user: one(profiles, {
    fields: [tasks.userId],
    references: [profiles.id],
  }),
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  area: one(areas, {
    fields: [tasks.areaId],
    references: [areas.id],
  }),
  heading: one(headings, {
    fields: [tasks.headingId],
    references: [headings.id],
  }),
  checklistItems: many(checklistItems),
  taskTags: many(taskTags),
}));

export const checklistItemsRelations = relations(
  checklistItems,
  ({ one }) => ({
    user: one(profiles, {
      fields: [checklistItems.userId],
      references: [profiles.id],
    }),
    task: one(tasks, {
      fields: [checklistItems.taskId],
      references: [tasks.id],
    }),
  })
);

export const tagsRelations = relations(tags, ({ one, many }) => ({
  user: one(profiles, {
    fields: [tags.userId],
    references: [profiles.id],
  }),
  taskTags: many(taskTags),
}));

export const taskTagsRelations = relations(taskTags, ({ one }) => ({
  task: one(tasks, {
    fields: [taskTags.taskId],
    references: [tasks.id],
  }),
  tag: one(tags, {
    fields: [taskTags.tagId],
    references: [tags.id],
  }),
}));

/** Subscription tier for billing */
export type SubscriptionTier = "free" | "cloud" | "enterprise";

/** User settings stored as JSONB */
export interface UserSettings {
  theme?: "light" | "dark" | "system";
  dateFormat?: "us" | "eu" | "iso";
  weekStartsOn?: 0 | 1;
  defaultList?: "inbox" | "today";
}

/** User profile extending Supabase auth.users */
export interface Profile {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt: string | null;
  stripeCustomerId: string | null;
  onboardingCompleted: boolean;
  settings: UserSettings;
  createdAt: string;
  updatedAt: string;
}

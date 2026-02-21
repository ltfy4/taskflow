/** Subscription tier for billing */
export type SubscriptionTier = "free" | "cloud";

/** User profile extending Supabase auth.users */
export interface Profile {
  id: string;
  fullName: string | null;
  avatarUrl: string | null;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt: string | null;
  stripeCustomerId: string | null;
  createdAt: string;
  updatedAt: string;
}

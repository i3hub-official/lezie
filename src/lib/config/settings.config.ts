// src/lib/config/settings.config.ts
// Shared types, defaults, and tier access rules for user settings.
// Imported by both the API server and the SettingsPage component.

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserSettingsData {
  notifications: {
    push:           boolean;
    email:          boolean;
    sms:            boolean;
    // incidentNearby is ALWAYS true — stored but never read from DB for toggle
    reportVerified: boolean;
  };
  privacy: {
    anonymousReporting: boolean;
    showLocation:       boolean;
    profileVisibility:  'public' | 'community' | 'private';
  };
  appearance: {
    theme:    'light' | 'dark' | 'system';
    language: string;
  };
}

// What the API returns — includes tier context so the UI knows what to lock
export interface SettingsResponse extends UserSettingsData {
  tier:             string;
  kycStatus:        string;
  trustScore:       number;
  reportCount:      number;
  unlockedFeatures: UnlockedFeatures;
}

export interface UnlockedFeatures {
  emailSmsToggle:       boolean;   // Tier 2+
  anonymousReporting:   boolean;   // Tier 3+
  localScopedPosts:     boolean;   // Tier 3+
  profileVisibility:    boolean;   // Tier 4
  showLocationToggle:   boolean;   // Tier 4
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_SETTINGS: UserSettingsData = {
  notifications: {
    push:           true,
    email:          false,
    sms:            false,
    reportVerified: true,
  },
  privacy: {
    anonymousReporting: false,
    showLocation:       false,
    profileVisibility:  'community',
  },
  appearance: {
    theme:    'light',
    language: 'en',
  },
};

// ─── Tier thresholds ──────────────────────────────────────────────────────────

export const TIER_THRESHOLDS = {
  tier2: { minTrustScore: 10,  minReports: 1  },
  tier3: { minTrustScore: 50,  minReports: 5,  requiresKyc: true },
  tier4: { minTrustScore: 100, minReports: 10, requiresKyc: true },
} as const;

// ─── Access resolver ──────────────────────────────────────────────────────────

export function resolveUnlockedFeatures(
  tier: string,
  kycStatus: string,
  trustScore: number,
  reportCount: number
): UnlockedFeatures {
  const isKycVerified = kycStatus === 'verified';
  const numericTier   = parseInt(tier, 10) || 1;

  // Tier 2: trust ≥ 10 AND at least 1 report
  const hasTier2 =
    numericTier >= 2 ||
    (trustScore >= TIER_THRESHOLDS.tier2.minTrustScore &&
     reportCount >= TIER_THRESHOLDS.tier2.minReports);

  // Tier 3: KYC verified + trust ≥ 50 + ≥ 5 reports
  const hasTier3 =
    numericTier >= 3 ||
    (isKycVerified &&
     trustScore >= TIER_THRESHOLDS.tier3.minTrustScore &&
     reportCount >= TIER_THRESHOLDS.tier3.minReports);

  // Tier 4: KYC verified + trust ≥ 100 + ≥ 10 reports
  const hasTier4 =
    numericTier >= 4 ||
    (isKycVerified &&
     trustScore >= TIER_THRESHOLDS.tier4.minTrustScore &&
     reportCount >= TIER_THRESHOLDS.tier4.minReports);

  return {
    emailSmsToggle:     hasTier2,
    anonymousReporting: hasTier3,
    localScopedPosts:   hasTier3,
    profileVisibility:  hasTier4,
    showLocationToggle: hasTier4,
  };
}

// ─── Sanitiser ────────────────────────────────────────────────────────────────
// Strips any settings the user isn't allowed to have based on their tier.
// Called server-side on every PATCH to prevent privilege escalation.

export function sanitiseSettings(
  input: Partial<UserSettingsData>,
  unlocked: UnlockedFeatures,
  existing: UserSettingsData
): UserSettingsData {
  return {
    notifications: {
      push:           input.notifications?.push           ?? existing.notifications.push,
      email:          unlocked.emailSmsToggle
                        ? (input.notifications?.email ?? existing.notifications.email)
                        : false,
      sms:            unlocked.emailSmsToggle
                        ? (input.notifications?.sms ?? existing.notifications.sms)
                        : false,
      reportVerified: input.notifications?.reportVerified ?? existing.notifications.reportVerified,
    },
    privacy: {
      anonymousReporting: unlocked.anonymousReporting
        ? (input.privacy?.anonymousReporting ?? existing.privacy.anonymousReporting)
        : false,
      showLocation: unlocked.showLocationToggle
        ? (input.privacy?.showLocation ?? existing.privacy.showLocation)
        : false,
      profileVisibility: unlocked.profileVisibility
        ? (input.privacy?.profileVisibility ?? existing.privacy.profileVisibility)
        : 'community',
    },
    appearance: {
      theme:    (input.appearance?.theme    ?? existing.appearance.theme)    as UserSettingsData['appearance']['theme'],
      language: input.appearance?.language  ?? existing.appearance.language,
    },
  };
}

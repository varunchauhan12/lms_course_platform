import { env } from "./env";
import arcjet, {
  shield,
  detectBot,
  slidingWindow,
  protectSignup,
  type BotOptions,
  type EmailOptions,
  type ProtectSignupOptions,
  type SlidingWindowRateLimitOptions,
} from "@arcjet/next";

// Base Arcjet instance with Shield protection
// This can be used directly or extended with additional rules using .withRule()
const aj = arcjet({
  key: env.ARCJET_API_KEY,
  characteristics: ["userId"], // Track by userId (or IP for anonymous)
  rules: [
    shield({
      mode: "LIVE", // Protects against common attacks
    }),
  ],
});

// Reusable rule configurations
export const botOptions: BotOptions = {
  mode: "LIVE",
  allow: [], // Prevents bots from accessing protected routes
};

export const emailOptions: EmailOptions = {
  mode: "LIVE",
  block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
};

export const rateLimitOptions: SlidingWindowRateLimitOptions<[]> = {
  mode: "LIVE",
  interval: "2m",
  max: 5,
};

// File upload specific rate limit (more restrictive)
export const fileUploadRateLimitOptions: SlidingWindowRateLimitOptions<[]> = {
  mode: "LIVE",
  interval: "1m",
  max: 10, // Allow 10 file uploads per minute
};

export const signupOptions: ProtectSignupOptions<[]> = {
  email: emailOptions,
  bots: botOptions,
  rateLimit: rateLimitOptions,
};

// Export the base Arcjet instance
export default aj;

// Export pre-configured Arcjet instances for common use cases
export const arcjetWithBot = aj.withRule(detectBot(botOptions));

export const arcjetWithRateLimit = aj.withRule(slidingWindow(rateLimitOptions));

export const arcjetWithFileUploadRateLimit = aj.withRule(
  slidingWindow(fileUploadRateLimitOptions),
);

export const arcjetForSignup = aj.withRule(protectSignup(signupOptions));

export const arcjetForAuth = aj.withRule(detectBot(botOptions));

import { Resend } from "resend";
import { env } from "@/lib/env";

// Initialize Resend client

export const resend = new Resend(env.RESEND_API_KEY);

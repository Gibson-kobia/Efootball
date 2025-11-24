import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  konamiId: z.string().min(3, 'Konami ID or email must be at least 3 characters'),
  efootballPassword: z.string().min(1, 'eFootball account password is required'),
  platform: z.enum(['mobile']),
  password: z.string().min(1, 'Password is required'), // eFootball password used as website password
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const passwordResetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const verifyOTPSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, 'OTP must be 6 digits'),
  type: z.enum(['email', 'phone', 'password_reset']),
});

export const uploadResultSchema = z.object({
  matchId: z.number().int().positive(),
  player1Score: z.number().int().min(0),
  player2Score: z.number().int().min(0),
  screenshot: z.string().url().optional(),
});


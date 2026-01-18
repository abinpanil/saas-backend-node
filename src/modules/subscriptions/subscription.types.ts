/**
 * Data Transfer Objects for Subscription Module
 */

// Plan Response DTO
export interface PlanResponseDto {
  id: string;
  name: string;
  price: number;
  features: Record<string, any>;
}

// Current Subscription Response DTO
export interface CurrentSubscriptionResponseDto {
  plan: string;
  status: string;
  expiresAt: string;
}

// Change Plan Request DTO
export interface ChangePlanDto {
  planId: string;
}

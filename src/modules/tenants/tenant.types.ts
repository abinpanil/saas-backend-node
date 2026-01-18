/**
 * Data Transfer Objects for Tenant Module
 */

// Update Tenant Request DTO
export interface UpdateTenantDto {
  name: string;
}

// Tenant Response DTO
export interface TenantResponseDto {
  id: string;
  name: string;
  slug: string;
  status: string;
}

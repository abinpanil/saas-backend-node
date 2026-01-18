import { AppDataSource } from '../../config/data-source';
import { Tenant } from '../../database/entities/tenant.entity';
import { NotFoundError, ValidationError } from '../../common/utils/errors';
import { UpdateTenantDto, TenantResponseDto } from './tenant.types';

export class TenantService {
  private tenantRepository = AppDataSource.getRepository(Tenant);

  /**
   * Get tenant by ID
   */
  async getCurrentTenant(tenantId: string): Promise<TenantResponseDto> {
    const tenant = await this.tenantRepository.findOne({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundError('Tenant not found');
    }

    return {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      status: tenant.status,
    };
  }

  /**
   * Update tenant information
   */
  async updateTenant(
    tenantId: string,
    dto: UpdateTenantDto
  ): Promise<TenantResponseDto> {
    // Validate input
    if (!dto.name || dto.name.trim().length === 0) {
      throw new ValidationError('Tenant name is required');
    }

    // Find tenant
    const tenant = await this.tenantRepository.findOne({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundError('Tenant not found');
    }

    // Update tenant
    tenant.name = dto.name.trim();
    await this.tenantRepository.save(tenant);

    return {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      status: tenant.status,
    };
  }
}

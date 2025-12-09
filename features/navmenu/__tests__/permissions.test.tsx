import { describe, it, expect } from 'vitest';
import { hasRole, hasAnyRole, can } from '../../../shared/utils/permissions';

const user = { id: '1', name: 'T', roles: ['admin', 'manage'] } as any;

describe('permissions helper', () => {
  it('hasRole returns true when role present', () => {
    expect(hasRole(user, 'admin')).toBe(true);
  });

  it('hasRole returns false when no user', () => {
    expect(hasRole(null, 'admin')).toBe(false);
  });

  it('hasAnyRole returns true when any role matches', () => {
    expect(hasAnyRole(user, ['general', 'manage'])).toBe(true);
  });

  it('can returns true when no requiredRoles', () => {
    expect(can(user, undefined)).toBe(true);
  });

  it('can returns false when user lacks required role', () => {
    expect(can({ ...user, roles: ['general'] } as any, ['admin'])).toBe(false);
  });
});

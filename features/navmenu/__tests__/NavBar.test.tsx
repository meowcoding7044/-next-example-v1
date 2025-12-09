import { describe, it, expect } from 'vitest';
import { NAV_LINKS } from '../config/nav.config';
import { hasAnyRole } from '../../../shared/utils/permissions';

describe('Nav config', () => {
  it('includes a Roles link that requires admin', () => {
    const roles = NAV_LINKS.find((l) => l.id === 'roles');
    expect(roles).toBeDefined();
    expect(roles?.requiredRoles).toContain('admin');
  });

  it('permissions helper grants access to admin user', () => {
    const user = { id: '1', name: 'Admin', roles: ['admin'] } as any;
    const roles = NAV_LINKS.find((l) => l.id === 'roles');
    expect(roles).toBeDefined();
    expect(hasAnyRole(user, roles!.requiredRoles as any)).toBe(true);
  });
});

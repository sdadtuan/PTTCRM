export type StaffSsoMode = 'nest' | 'dual' | 'keycloak';

export type PublicEnterpriseIdentity = {
  sso_mode: StaffSsoMode;
  sso_configured: boolean;
  mfa_required_positions: string[];
  nest_password_login: boolean;
};

export type PublicEnterpriseRbac = {
  permission_sets: boolean;
  row_level_scope_pilot: boolean;
};

export type PublicEnterpriseLogin = {
  staff_url: string;
  branded_staff_url: string | null;
};

export type PublicEnterpriseReadiness = {
  updated_at: string;
  identity: PublicEnterpriseIdentity;
  rbac: PublicEnterpriseRbac;
  login: PublicEnterpriseLogin;
};

const SSO_MODES = new Set<StaffSsoMode>(['nest', 'dual', 'keycloak']);

function parseIdentity(raw: unknown): PublicEnterpriseIdentity | null {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return null;
  const row = raw as Record<string, unknown>;
  const sso_mode = typeof row.sso_mode === 'string' ? row.sso_mode : '';
  if (!SSO_MODES.has(sso_mode as StaffSsoMode)) return null;
  if (typeof row.sso_configured !== 'boolean') return null;
  if (typeof row.nest_password_login !== 'boolean') return null;
  if (!Array.isArray(row.mfa_required_positions)) return null;
  const mfa_required_positions = row.mfa_required_positions.filter(
    (p): p is string => typeof p === 'string',
  );
  return {
    sso_mode: sso_mode as StaffSsoMode,
    sso_configured: row.sso_configured,
    mfa_required_positions,
    nest_password_login: row.nest_password_login,
  };
}

function parseRbac(raw: unknown): PublicEnterpriseRbac | null {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return null;
  const row = raw as Record<string, unknown>;
  if (typeof row.permission_sets !== 'boolean') return null;
  if (typeof row.row_level_scope_pilot !== 'boolean') return null;
  return {
    permission_sets: row.permission_sets,
    row_level_scope_pilot: row.row_level_scope_pilot,
  };
}

function parseLogin(raw: unknown): PublicEnterpriseLogin | null {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return null;
  const row = raw as Record<string, unknown>;
  const staff_url = typeof row.staff_url === 'string' ? row.staff_url : '';
  if (!staff_url.startsWith('https://')) return null;
  const branded =
    row.branded_staff_url === null
      ? null
      : typeof row.branded_staff_url === 'string'
        ? row.branded_staff_url
        : undefined;
  if (branded === undefined) return null;
  if (branded !== null && !branded.startsWith('https://')) return null;
  return { staff_url, branded_staff_url: branded };
}

export function parsePublicEnterpriseReadiness(input: unknown): PublicEnterpriseReadiness | null {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) return null;
  const record = input as Record<string, unknown>;
  const updated_at = typeof record.updated_at === 'string' ? record.updated_at : '';
  if (!updated_at) return null;
  const identity = parseIdentity(record.identity);
  const rbac = parseRbac(record.rbac);
  const login = parseLogin(record.login);
  if (!identity || !rbac || !login) return null;
  return { updated_at, identity, rbac, login };
}

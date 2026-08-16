import trust from '../../content/en/trust.json';
import subprocessors from '../../content/en/subprocessors.json';
import statusCopy from '../../content/en/status.json';
import security from '../../content/en/security.json';

export type TrustContent = typeof trust;
export type SubprocessorsContent = typeof subprocessors;
export type StatusCopyContent = typeof statusCopy;
export type SecurityPackContent = typeof security;

export function getTrustContent(): TrustContent {
  return trust;
}

export function getSubprocessorsContent(): SubprocessorsContent {
  return subprocessors;
}

export function getStatusCopy(): StatusCopyContent {
  return statusCopy;
}

export function getSecurityPack(): SecurityPackContent {
  return security;
}

import trust from '../../content/en/trust.json';
import subprocessors from '../../content/en/subprocessors.json';
import statusCopy from '../../content/en/status.json';

export type TrustContent = typeof trust;
export type SubprocessorsContent = typeof subprocessors;
export type StatusCopyContent = typeof statusCopy;

export function getTrustContent(): TrustContent {
  return trust;
}

export function getSubprocessorsContent(): SubprocessorsContent {
  return subprocessors;
}

export function getStatusCopy(): StatusCopyContent {
  return statusCopy;
}

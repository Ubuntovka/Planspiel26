import type { NodeSize } from '@/types/diagram';

export const NODE_DEFAULT_SIZE: Record<string, NodeSize> = {
  applicationNode: { width: 87, height: 88 },
  aiApplicationNode: { width: 87, height: 88 },
  dataProviderNode: { width: 77, height: 88 },
  datasetNode: { width: 77, height: 88 },
  identityProviderNode: { width: 76, height: 77 },
  processUnitNode: { width: 87, height: 87 },
  aiProcessNode: { width: 87, height: 87 },
  securityRealmNode: { width: 400, height: 400 },
  serviceNode: { width: 87, height: 77 },
  aiServiceNode: { width: 87, height: 76 },
};
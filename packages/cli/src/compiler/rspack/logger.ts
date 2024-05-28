import { compileLogger } from '../internal/logger';

export const rspackLogger = compileLogger.createChild({ name: 'rspack' });

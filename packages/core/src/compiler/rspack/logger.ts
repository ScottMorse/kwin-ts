import { compileLogger } from '../logger';

export const rspackLogger = compileLogger.createChild({ name: 'rspack' });

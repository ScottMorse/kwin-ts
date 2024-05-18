import { Workspace } from './src/workspace';

declare global {
  const workspace: Workspace;
  function print(message: string): void;
}

export {};

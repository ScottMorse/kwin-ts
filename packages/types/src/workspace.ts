interface Window {
  caption: string;
}

interface Workspace {
  windowList(): Window[];
}

declare global {
  const workspace: Workspace;
  function print(message: string): void;
}

export {};

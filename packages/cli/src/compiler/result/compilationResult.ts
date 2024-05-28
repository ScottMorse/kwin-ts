export interface CompilationOutput {
  sourcePath: string;
  outputPath: string;
  matchedInput: string;
}

export interface CompilationResult {
  outputs: CompilationOutput[];
  success: boolean;
}

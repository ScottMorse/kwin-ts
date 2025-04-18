import { InputFile } from "../inputFile";

export interface CompilationOutput {
  outputPath: string;
  input: InputFile;
}

export interface CompilationResult {
  outputs: CompilationOutput[];
  success: boolean;
  error?: Error;
}

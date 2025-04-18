import { selectGlobalLoggerOption, setLoggingDefaults } from "./global";
import { LogLevel } from "./level";

const VERBOSITY_ALIASES = {
  verbose: "debug",
  all: "debug",
  warnings: "warn",
  errors: "error",
  crash: "fatal",
  quiet: "silent",
} as const;

type VerbosityAlias = keyof typeof VERBOSITY_ALIASES;

export type VerbosityLevel = LogLevel | VerbosityAlias | "default";

type NarrowedVerbosityLevel<
  V extends VerbosityLevel,
  StartingVerbosity = VerbosityLevel,
> = Exclude<StartingVerbosity, V> | LogLevel;

const resolveDefaultVerbosity = <V extends VerbosityLevel>(
  verbosity: V,
): NarrowedVerbosityLevel<"default", V> =>
  verbosity === "default"
    ? selectGlobalLoggerOption("verbosity")
    : (verbosity as Exclude<V, "default">);

const resolveVerbosityAlias = <V extends VerbosityLevel>(
  verbosity: V,
): NarrowedVerbosityLevel<VerbosityAlias, V> => {
  const name = VERBOSITY_ALIASES[verbosity as VerbosityAlias];
  return name ?? verbosity;
};

export const resolveLogLevel = (verbosity: VerbosityLevel): LogLevel =>
  resolveVerbosityAlias(resolveDefaultVerbosity(verbosity));

if (process.env.KWIN_TS_VERBOSITY) {
  setLoggingDefaults({
    verbosity: resolveLogLevel(process.env.KWIN_TS_VERBOSITY as VerbosityLevel),
  });
}

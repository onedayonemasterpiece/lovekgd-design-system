import fs from 'node:fs';

const SEMVER = /^\d+\.\d+\.\d+$/u;

const nonEmpty = (value) => typeof value === 'string' && value.trim().length > 0;

export const resolveActionsRunnerVersion = ({
  env = process.env,
  parentPid = process.ppid,
  filesystem = fs,
} = {}) => {
  if (nonEmpty(env.ACTIONS_RUNNER_VERSION)) {
    if (!SEMVER.test(env.ACTIONS_RUNNER_VERSION)) {
      throw new Error('ACTIONS_RUNNER_VERSION is present but is not an exact semantic version');
    }
    return env.ACTIONS_RUNNER_VERSION;
  }

  let pid = parentPid;
  for (let depth = 0; depth < 12 && pid > 1; depth += 1) {
    try {
      const executable = filesystem.readlinkSync(`/proc/${pid}/exe`);
      const match = executable.match(/\/runners\/(\d+\.\d+\.\d+)\/bin\/Runner\.(?:Worker|Listener)$/u);
      if (match) return match[1];
      const status = filesystem.readFileSync(`/proc/${pid}/status`, 'utf8');
      pid = Number(status.match(/^PPid:\s+(\d+)$/mu)?.[1] ?? 0);
    } catch {
      break;
    }
  }

  try {
    const rootEntries = filesystem.readdirSync('/home/runner/runners', { withFileTypes: true });
    const versions = rootEntries
      .filter((entry) => entry.isDirectory() && SEMVER.test(entry.name))
      .map((entry) => entry.name);
    return versions.sort((left, right) => left.localeCompare(right, undefined, { numeric: true })).at(-1) ?? null;
  } catch {
    return null;
  }
};

export const captureRunnerProvenance = ({
  env = process.env,
  platform = process.platform,
  architecture = process.arch,
  requireActionsContext = false,
  resolvedVersion,
} = {}) => {
  const githubActions = env.GITHUB_ACTIONS === 'true';
  if (requireActionsContext && !githubActions) {
    throw new Error('runner provenance was required outside GitHub Actions');
  }

  const actionsRunnerVersion = resolvedVersion === undefined
    ? resolveActionsRunnerVersion({ env })
    : resolvedVersion;
  if (actionsRunnerVersion !== null && !SEMVER.test(actionsRunnerVersion)) {
    throw new Error('resolved Actions runner version is not an exact semantic version');
  }

  const runner = {
    actions_runner_version: actionsRunnerVersion,
    version_resolution_status: actionsRunnerVersion !== null
      ? 'resolved'
      : githubActions
        ? 'not_exposed_by_hosted_runner'
        : 'not_applicable_local_replay',
    name: env.NORMALIZATION_RUNNER_NAME ?? env.RUNNER_NAME ?? null,
    os: env.NORMALIZATION_RUNNER_OS ?? env.RUNNER_OS ?? platform,
    arch: env.NORMALIZATION_RUNNER_ARCH ?? env.RUNNER_ARCH ?? architecture,
    environment: env.NORMALIZATION_RUNNER_ENVIRONMENT ?? env.RUNNER_ENVIRONMENT ?? null,
    image_os: env.ImageOS ?? null,
    image_version: env.ImageVersion ?? null,
    runs_on: githubActions ? (env.NORMALIZATION_RUNS_ON ?? 'ubuntu-24.04') : null,
  };

  if (requireActionsContext) {
    for (const field of ['name', 'os', 'arch', 'environment', 'image_os', 'image_version', 'runs_on']) {
      if (!nonEmpty(runner[field])) throw new Error(`GitHub Actions runner provenance field is missing: ${field}`);
    }
    if (runner.environment !== 'github-hosted') {
      throw new Error(`unexpected GitHub Actions runner environment: ${runner.environment}`);
    }
    if (!['resolved', 'not_exposed_by_hosted_runner'].includes(runner.version_resolution_status)) {
      throw new Error(`unexpected GitHub Actions runner version status: ${runner.version_resolution_status}`);
    }
  }

  return runner;
};

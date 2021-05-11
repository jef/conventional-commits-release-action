import {getInput, setFailed} from '@actions/core';
import {exec, ExecOptions} from '@actions/exec';

async function getCommits(): Promise<string> {
  let stdout = '';
  let stderr = '';
  const defaultBranch = getInput('default-branch');

  const options: ExecOptions = {};
  options.listeners = {
    stdout: (data: Buffer) => {
      stdout += data.toString();
    },
    stderr: (data: Buffer) => {
      stderr += data.toString();
    },
  };

  await exec('git', ['rev-list', '--format=%B', `origin/${defaultBranch}..HEAD`], options);

  return stdout;
}

/**
 * Entrypoint for action.
 */
export async function entrypoint() {
  try {
    const commits = await getCommits();

    const majorBump = new RegExp('.*(\(.*\))?!:.*(BREAKING CHANGE)?');
    const minorBump = new RegExp('feat')

    if (majorBump.test(commits)) {

    } else if (minorBump.test(commits)) {

    } else {

    }
  } catch (error: unknown) {
    setFailed(error as Error);
  }
}

void entrypoint();

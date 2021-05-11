import {exec, ExecOptions} from '@actions/exec';

/**
 * A simple wrapper for using {@link exec}.
 *
 * @param cmd Bash command to execute.
 * @param args Arguments for bash command.
 */
export async function callExec(
  cmd: string,
  ...args: string[]
): Promise<string> {
  let output = '';
  let error = '';

  const options: ExecOptions = {
    listeners: {
      stderr: (data: Buffer) => {
        error = data.toString();
      },
      stdout: (data: Buffer) => {
        output = data.toString();
      },
    },
    ignoreReturnCode: true,
    silent: true,
  };

  const errorCode = await exec(cmd, args, options);

  if (errorCode !== 0) {
    throw new Error(error);
  }

  return output.trim();
}

/**
 * Either gets the latest commit message or commit messages between `tag`
 * and `HEAD`.
 *
 * @param tag Git ref.
 * @return Latest commit message.
 */
export async function getCommitMessage(tag?: string): Promise<string> {
  if (tag) {
    return callExec('git', 'rev-list', `v${tag}..HEAD`, '--format=%B');
  }

  return callExec('git', 'log', '-1', '--pretty=format:%B');
}

/**
 * @return All tags.
 */
async function getTags(): Promise<string> {
  return callExec('git', 'tag', '--sort=v:refname');
}

export async function getLatestTags(): Promise<string> {
  const tags = (await getTags())
    .split('\n')
    .map(tag => (tag.startsWith('v') ? tag.slice(1) : tag))
    .filter(tag => {
      return tag.length !== 0;
    });

  if (tags.length > 0) {
    return tags[tags.length - 1];
  }

  return '';
}

/**
 * @return Latest commit hash in SHA-1 format.
 */
export async function getSha(): Promise<string> {
  return callExec('git', 'rev-parse', 'HEAD');
}

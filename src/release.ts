import {setFailed, setOutput} from '@actions/core';
import {getCommitMessage, getLatestTags} from './git';
import {createTagReference} from './github';
import {inc} from 'semver';

/**
 * A wrapper for {@link semver.inc}.
 *
 * These increments will follow the same rules that
 * {@link https://www.conventionalcommits.org/en/v1.0.0/|Conventional Commits}
 * uses. Currently, we will only follow this rule if it's breaking change.
 * Patch changes are reserved warmfixes and hotfixes. Otherwise, will be a
 * minor change.
 *
 * If it cannot increment the tag, an {@link Error} is thrown.
 *
 * @param tag Tag to be incremented.
 * @param incrementBy Type of increment.
 * @return Incremented semantic version.
 */
async function incrementTag(tag: string): Promise<string> {
  let incTag: string | null;
  const defaultTag = tag === '' ? '0.0.0' : tag;

  let message = '';
  try {
    message = await getCommitMessage(tag);
  } catch (error: unknown) {
    setFailed('could not get commit messages');
  }

  const majorBump = new RegExp(/.*(\(.*\))?!:.*(BREAKING CHANGE)?/);
  const minorBump = new RegExp(/feat(\(.*\))?:.*$/);
  if (majorBump.test(message)) {
    incTag = inc(defaultTag, 'major');
  } else if (minorBump.test(message)) {
    incTag = inc(defaultTag, 'minor');
  } else {
    incTag = inc(defaultTag, 'patch');
  }

  if (!incTag) {
    throw new Error('could not increment tag');
  }

  return incTag;
}

export async function release() {
  const latestTag = await getLatestTags();
  const incrementedTag = await incrementTag(latestTag);

  await createTagReference(incrementedTag);
  setOutput('tag', incrementedTag);

  return incrementedTag;
}

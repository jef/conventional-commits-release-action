import {getInput, info, setSecret} from '@actions/core';
import {getOctokit} from '@actions/github';
import {getSha} from './git';

function getClient() {
  const token = getInput('token');
  setSecret(token);

  return getOctokit(token);
}

async function createMajorTagReference(
  tag: string,
  owner: string,
  repo: string
) {
  const client = getClient();

  const majorTagArray = tag.match(/(\d+).*/) ?? [];
  const majorTag = majorTagArray[1];
  info(`major tag: ${majorTag}`);

  try {
    await client.rest.git.updateRef({
      force: true,
      owner,
      ref: `tags/v${majorTag}`,
      repo,
      sha: await getSha(),
    });
  } catch (error: unknown) {
    const message = (error as Error).message;

    if (message.includes('Reference does not exist')) {
      await client.rest.git.createRef({
        owner,
        ref: `refs/tags/v${tag}`,
        repo,
        sha: await getSha(),
      });

      return;
    }

    throw error;
  }
}

/**
 * Creates remote tag ref. Needs fully qualified ref.
 *
 * @param tag Given tag.
 */
export async function createTagReference(tag: string) {
  const repository = process.env['GITHUB_REPOSITORY'];
  info(`tag: ${tag}`);

  if (!repository) {
    throw new Error('Could not get repository');
  }

  const [owner, repo] = repository.split('/');

  const client = getClient();

  try {
    const createMajor = getInput('create-major').toLowerCase() === 'true';
    if (createMajor) {
      await createMajorTagReference(tag, owner, repo);
    }

    await client.rest.git.createRef({
      owner,
      ref: `refs/tags/v${tag}`,
      repo,
      sha: await getSha(),
    });
  } catch (error: unknown) {
    const message = (error as Error).message;

    if (message.includes('Reference already exists')) {
      info(`not creating a reference: ${message}`);
      return;
    }

    throw error;
  }
}

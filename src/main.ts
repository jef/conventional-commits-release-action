import {setFailed} from '@actions/core';
import {release} from './release';

/**
 * Entrypoint for action.
 */
export async function entrypoint() {
  try {
    await release();
  } catch (error: unknown) {
    setFailed(error as Error);
  }
}

void entrypoint();

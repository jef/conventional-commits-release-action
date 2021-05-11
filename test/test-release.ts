import * as actionsCore from '@actions/core';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as github from '../src/github';
import * as git from '../src/git';
import * as release from '../src/release';
import {SinonStub} from 'sinon';
import {expect} from 'chai';
import {stub} from 'sinon';

chai.use(chaiAsPromised);

describe('release tests', () => {
  let createTagReferenceStub: SinonStub;
  let getCommitMessageStub: SinonStub;
  let getLatestTagsStub: SinonStub;
  let getInputStub: SinonStub;

  before(() => {
    createTagReferenceStub = stub(github, 'createTagReference');
  });

  after(() => {
    createTagReferenceStub.restore();
  });

  beforeEach(() => {
    getCommitMessageStub = stub(git, 'getCommitMessage');
    getLatestTagsStub = stub(git, 'getLatestTags');
    getInputStub = stub(actionsCore, 'getInput').returns('');
  });

  afterEach(() => {
    getCommitMessageStub.restore();
    getLatestTagsStub.restore();
    getInputStub.restore();
  });

  describe('#release()', () => {
    describe('has tag', () => {
      it('should increment tag by major', async () => {
        getCommitMessageStub.returns(Promise.resolve('feat!: test'));
        getLatestTagsStub.returns(Promise.resolve('1.0.0'));

        const tag = await release.release();
        expect(tag).to.eq('2.0.0');
      });

      it('should increment tag by minor', async () => {
        getCommitMessageStub.returns(Promise.resolve('feat: test'));
        getLatestTagsStub.returns(Promise.resolve('1.0.0'));

        const tag = await release.release();
        expect(tag).to.eq('1.1.0');
      });

      it('should increment tag by patch', async () => {
        getCommitMessageStub.returns(Promise.resolve('chore: test'));
        getLatestTagsStub.returns(Promise.resolve('1.0.0'));

        const tag = await release.release();
        expect(tag).to.eq('1.0.1');
      });
    });

    describe('does not have tag', () => {
      it('should increment tag by major', async () => {
        getCommitMessageStub.returns(Promise.resolve('feat!: test'));
        getLatestTagsStub.returns(Promise.resolve(''));

        const tag = await release.release();
        expect(tag).to.eq('1.0.0');
      });

      it('should increment tag by minor', async () => {
        getCommitMessageStub.returns(Promise.resolve('feat: test'));
        getLatestTagsStub.returns(Promise.resolve(''));

        const tag = await release.release();
        expect(tag).to.eq('0.1.0');
      });

      it('should increment tag by patch', async () => {
        getCommitMessageStub.returns(Promise.resolve('chore: test'));
        getLatestTagsStub.returns(Promise.resolve(''));

        const tag = await release.release();
        expect(tag).to.eq('0.0.1');
      });
    });
  });
});

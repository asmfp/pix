import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import ENV from 'pix-orga/config/environment';

module('Unit | Adapter | campaign-stats', function (hooks) {
  setupTest(hooks);

  let adapter;
  let ajaxStub;

  hooks.beforeEach(function () {
    adapter = this.owner.lookup('adapter:campaign-stats');
    ajaxStub = sinon.stub();
    adapter.set('ajax', ajaxStub);
  });

  module('getParticipationsByStage', function () {
    test('it request participations by stage', async function (assert) {
      const campaignId = 12;
      const url = `${ENV.APP.API_HOST}/api/campaigns/${campaignId}/stats/participations-by-stage`;
      const expectedStats = Symbol('participations-by-stage');
      ajaxStub.withArgs(url, 'GET').resolves(expectedStats);
      const stats = await adapter.getParticipationsByStage(campaignId);

      // TODO: Fix this the next time the file is edited.
      // eslint-disable-next-line qunit/no-assert-equal
      assert.equal(stats, expectedStats);
    });
  });

  module('getParticipationsByStatus', function () {
    test('it request participations by status', async function (assert) {
      const campaignId = 12;
      const url = `${ENV.APP.API_HOST}/api/campaigns/${campaignId}/stats/participations-by-status`;
      const expectedStats = Symbol('participations-by-status');
      ajaxStub.withArgs(url, 'GET').resolves(expectedStats);
      const stats = await adapter.getParticipationsByStatus(campaignId);

      // TODO: Fix this the next time the file is edited.
      // eslint-disable-next-line qunit/no-assert-equal
      assert.equal(stats, expectedStats);
    });
  });

  module('getParticipationsByDay', function () {
    test('it request participations by day', async function (assert) {
      const campaignId = 12;
      const url = `${ENV.APP.API_HOST}/api/campaigns/${campaignId}/stats/participations-by-day`;
      const expectedStats = Symbol('participations-by-day');
      ajaxStub.withArgs(url, 'GET').resolves(expectedStats);
      const stats = await adapter.getParticipationsByDay(campaignId);

      // TODO: Fix this the next time the file is edited.
      // eslint-disable-next-line qunit/no-assert-equal
      assert.equal(stats, expectedStats);
    });
  });

  module('getParticipationsByMasteryRate', function () {
    test('it request participations by mastery percentage', async function (assert) {
      const campaignId = 12;
      const url = `${ENV.APP.API_HOST}/api/campaigns/${campaignId}/stats/participations-by-mastery-rate`;
      const expectedStats = Symbol('result-distribution');
      ajaxStub.withArgs(url, 'GET').resolves(expectedStats);
      const stats = await adapter.getParticipationsByMasteryRate(campaignId);

      // TODO: Fix this the next time the file is edited.
      // eslint-disable-next-line qunit/no-assert-equal
      assert.equal(stats, expectedStats);
    });
  });
});

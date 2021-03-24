import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';

module('Unit | Route | authenticated/sessions/finalize', (hooks) => {
  setupTest(hooks);
  let route;

  hooks.beforeEach(function() {
    route = this.owner.lookup('route:authenticated/sessions/finalize');
  });

  module('#model', (hooks) => {
    const session_id = 1;
    const returnedSession = Symbol('session');

    hooks.beforeEach(() => {
      route.store.findRecord = sinon.stub().resolves(returnedSession);
    });

    test('it should return the session', async function(assert) {
      // when
      const actualModel = await route.model({ session_id });

      // then
      const expectedModel = returnedSession;
      sinon.assert.calledWith(route.store.findRecord, 'session', session_id, { reload: true });
      assert.deepEqual(actualModel, expectedModel);
    });
  });

  module('#afterModel', (hooks) => {
    const model = { session: {} };
    let transition;

    hooks.beforeEach(() => {
      transition = { abort: sinon.stub() };
      route.notifications.error = sinon.stub();
    });

    module('when model is already finalized', (hooks) => {

      hooks.beforeEach(() => {
        model.isFinalized = true;
      });

      test('it should abort transition', async function(assert) {
        // when
        await route.afterModel(model, transition);

        // then
        sinon.assert.calledOnce(transition.abort);
        assert.ok(route);
      });

      test('it should display error notification', async function(assert) {
        // when
        await route.afterModel(model, transition);

        // then
        sinon.assert.calledOnce(route.notifications.error);
        assert.ok(route);
      });
    });

    module('when model is not finalized', (hooks) => {

      hooks.beforeEach(() => {
        model.isFinalized = false;
      });

      test('it should not abort transition', async function(assert) {
        // when
        await route.afterModel(model, transition);

        // then
        sinon.assert.notCalled(transition.abort);
        assert.ok(route);
      });

      test('it should not display error notification', async function(assert) {
        // when
        await route.afterModel(model, transition);

        // then
        sinon.assert.notCalled(route.notifications.error);
        assert.ok(route);
      });
    });
  });
});

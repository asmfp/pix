import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';

module('Unit | Route | authenticated/target-profiles/list', function (hooks) {
  setupTest(hooks);
  let route;

  hooks.beforeEach(function () {
    route = this.owner.lookup('route:authenticated/target-profiles/list');
  });

  module('#model', function (hooks) {
    const params = {};
    const expectedQueryArgs = {};

    hooks.beforeEach(function () {
      route.store.query = sinon.stub().resolves();
      params.pageNumber = 'somePageNumber';
      params.pageSize = 'somePageSize';
      expectedQueryArgs.page = {
        number: 'somePageNumber',
        size: 'somePageSize',
      };
    });

    module('when queryParams filters are falsy', function () {
      test('it should call store.query with no filters on name and id', async function (assert) {
        // when
        await route.model(params);
        expectedQueryArgs.filter = {
          name: '',
          id: '',
        };

        // then
        sinon.assert.calledWith(route.store.query, 'target-profile', expectedQueryArgs);
        assert.ok(true);
      });
    });

    module('when queryParams filters are truthy', function () {
      test('it should call store.query with filters containing trimmed values', async function (assert) {
        // given
        params.name = ' someName';
        params.id = 'someId ';
        expectedQueryArgs.filter = {
          name: 'someName',
          id: 'someId',
        };

        // when
        await route.model(params);

        // then
        sinon.assert.calledWith(route.store.query, 'target-profile', expectedQueryArgs);
        assert.ok(true);
      });
    });
  });

  module('#resetController', function (hooks) {
    let controller;

    hooks.beforeEach(function () {
      controller = {
        pageNumber: 'somePageNumber',
        pageSize: 'somePageSize',
        name: 'someName',
        id: 'someId',
      };
    });

    module('when route is exiting', function () {
      test('it should reset controller', function (assert) {
        // when
        route.resetController(controller, true);

        // then
        // TODO: Fix this the next time the file is edited.
        // eslint-disable-next-line qunit/no-assert-equal
        assert.equal(controller.pageNumber, 1);
        // TODO: Fix this the next time the file is edited.
        // eslint-disable-next-line qunit/no-assert-equal
        assert.equal(controller.pageSize, 10);
        // TODO: Fix this the next time the file is edited.
        // eslint-disable-next-line qunit/no-assert-equal
        assert.equal(controller.name, null);
        // TODO: Fix this the next time the file is edited.
        // eslint-disable-next-line qunit/no-assert-equal
        assert.equal(controller.id, null);
      });
    });

    module('when route is not exiting', function () {
      test('it should not reset controller', function (assert) {
        // when
        route.resetController(controller, false);

        // then
        // TODO: Fix this the next time the file is edited.
        // eslint-disable-next-line qunit/no-assert-equal
        assert.equal(controller.pageNumber, 'somePageNumber');
        // TODO: Fix this the next time the file is edited.
        // eslint-disable-next-line qunit/no-assert-equal
        assert.equal(controller.pageSize, 'somePageSize');
        // TODO: Fix this the next time the file is edited.
        // eslint-disable-next-line qunit/no-assert-equal
        assert.equal(controller.name, 'someName');
        // TODO: Fix this the next time the file is edited.
        // eslint-disable-next-line qunit/no-assert-equal
        assert.equal(controller.id, 'someId');
      });
    });
  });
});

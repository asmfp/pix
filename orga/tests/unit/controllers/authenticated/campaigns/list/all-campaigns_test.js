import { module, test } from 'qunit';
import sinon from 'sinon';
import setupIntlRenderingTest from '../../../../../helpers/setup-intl-rendering';

module('Unit | Controller | authenticated/campaigns/list/all-campaigns', function (hooks) {
  setupIntlRenderingTest(hooks);
  let controller;

  const event = {
    preventDefault: sinon.stub(),
    stopPropagation: sinon.stub(),
  };

  hooks.beforeEach(function () {
    controller = this.owner.lookup('controller:authenticated/campaigns/list/all-campaigns');
  });

  module('#get isArchived', function () {
    module('when status is archived', function () {
      test('it should returns true', function (assert) {
        // given
        controller.status = 'archived';

        // when
        const isArchived = controller.isArchived;

        // then
        assert.true(isArchived);
      });
    });

    module('when status is not archived', function () {
      test('it should returns false', function (assert) {
        // given
        controller.status = null;

        // when
        const isArchived = controller.isArchived;

        // then
        assert.false(isArchived);
      });
    });
  });

  module('#action updateCampaignStatus', function () {
    test('it should update controller status field', function (assert) {
      // given
      controller.status = 'someStatus';

      // when
      controller.send('updateCampaignStatus', 'someOtherStatus');

      // then
      // TODO: Fix this the next time the file is edited.
      // eslint-disable-next-line qunit/no-assert-equal
      assert.equal(controller.status, 'someOtherStatus');
    });
  });

  module('#action goToCampaignPage', function () {
    test('it should call transitionToRoute with appropriate arguments', function (assert) {
      // given
      controller.transitionToRoute = sinon.stub();

      // when
      controller.send('goToCampaignPage', 123, event);

      // then
      assert.true(event.preventDefault.called);
      assert.true(event.stopPropagation.called);
      assert.true(controller.transitionToRoute.calledWith('authenticated.campaigns.campaign', 123));
    });
  });

  module('#action clearFilters', function () {
    test('it should set params to initial empty values', async function (assert) {
      // given
      controller.status = 'archived';
      controller.name = 'a name';
      controller.ownerName = 'an owner bame';

      // when
      await controller.clearFilters();

      // then
      assert.strictEqual(controller.status, null);
      assert.strictEqual(controller.name, '');
      assert.strictEqual(controller.ownerName, '');
    });
  });

  module('#get isClearFiltersButtonDisabled', function () {
    module('when status is not archived', function () {
      test('it should returns true', function (assert) {
        // given
        controller.status = null;
        controller.name = '';
        controller.ownerName = '';

        // when
        const isClearFiltersButtonDisabled = controller.isClearFiltersButtonDisabled;

        // then
        assert.true(isClearFiltersButtonDisabled);
      });
    });

    module('when filters are not empty', function () {
      test('it should returns false', function (assert) {
        // given
        controller.status = 'archived';
        controller.name = 'Some';
        controller.ownerName = '';

        // when
        const isClearFiltersButtonDisabled = controller.isClearFiltersButtonDisabled;

        // then
        assert.false(isClearFiltersButtonDisabled);
      });
    });
  });
});

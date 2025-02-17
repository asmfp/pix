import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Helper | display-campaign-errors', function (hooks) {
  setupTest(hooks);
  let helper;
  hooks.beforeEach(function () {
    this.owner.lookup('service:intl').setLocale('fr');
    helper = this.owner.factoryFor('helper:display-campaign-errors').create();
  });

  module('when there is an error', function () {
    test('it returns the intlKey corresponding to the name error message', function (assert) {
      const nameErrors = [{ attribute: 'name', message: 'CAMPAIGN_NAME_IS_REQUIRED' }];
      // TODO: Fix this the next time the file is edited.
      // eslint-disable-next-line qunit/no-assert-equal
      assert.equal(helper.compute([nameErrors]), 'Veuillez donner un nom à votre campagne.');
    });
  });

  module('when there is no error', function () {
    test('it returns the intlKey corresponding to the type error message', function (assert) {
      const noError = [];
      // TODO: Fix this the next time the file is edited.
      // eslint-disable-next-line qunit/no-assert-equal
      assert.equal(helper.compute([noError]), null);
    });
  });
});

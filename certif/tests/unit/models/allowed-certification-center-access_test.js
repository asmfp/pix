import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | allowed-certification-center-access', function(hooks) {
  setupTest(hooks);
  let store;

  hooks.beforeEach(function() {
    store = this.owner.lookup('service:store');
  });

  module('#get isSco', function() {

    test('should return true when AllowedCertificationCenterAccess is of type SCO', function(assert) {
      // when
      const model = store.createRecord('allowed-certification-center-access', {
        type: 'SCO',
      });

      // then
      assert.true(model.isSco);
    });

    test('should return false when AllowedCertificationCenterAccess is of not type SCO', function(assert) {
      // when
      const model = store.createRecord('allowed-certification-center-access', {
        type: 'NOT_SCO',
      });

      // then
      assert.false(model.isSco);
    });
  });

  module('#get isScoManagingStudents', function() {

    test('should return false when AllowedCertificationCenterAccess is not managing students', function(assert) {
      // when
      const model = store.createRecord('allowed-certification-center-access', {
        type: 'SCO',
        isRelatedToManagingStudentsOrganization: false,
      });

      // then
      assert.false(model.isScoManagingStudents);
    });

    test('should return false when AllowedCertificationCenterAccess is not of type SCO', function(assert) {
      // when
      const model = store.createRecord('allowed-certification-center-access', {
        type: 'not_SCO',
        isRelatedToManagingStudentsOrganization: true,
      });

      // then
      assert.false(model.isScoManagingStudents);
    });

    test('should return true when all above conditions are matched', function(assert) {
      // when
      const model = store.createRecord('allowed-certification-center-access', {
        type: 'SCO',
        isRelatedToManagingStudentsOrganization: true,
      });

      // then
      assert.true(model.isScoManagingStudents);
    });
  });
});

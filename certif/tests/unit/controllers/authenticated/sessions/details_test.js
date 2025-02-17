import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Service from '@ember/service';

module('Unit | Controller | authenticated/sessions/details', function (hooks) {
  setupTest(hooks);

  module('#certificationCandidatesCount', function () {
    test('should return a string that matches the candidate count if more than 0 candidate', function (assert) {
      // given
      const controller = this.owner.lookup('controller:authenticated/sessions/details');
      controller.model = { certificationCandidates: ['candidate1', 'candidate2'] };

      // when
      const certificationCandidatesCountResult = controller.certificationCandidatesCount;

      // then
      // TODO: Fix this the next time the file is edited.
      // eslint-disable-next-line qunit/no-assert-equal
      assert.equal(certificationCandidatesCountResult, '(2)');
    });

    test('should return an empty string when there are no certification candidates in the session', function (assert) {
      // given
      const controller = this.owner.lookup('controller:authenticated/sessions/details');
      controller.model = { certificationCandidates: [] };

      // when
      const certificationCandidatesCountResult = controller.certificationCandidatesCount;

      // then
      // TODO: Fix this the next time the file is edited.
      // eslint-disable-next-line qunit/no-assert-equal
      assert.equal(certificationCandidatesCountResult, '');
    });
  });

  module('#hasOneOrMoreCandidates', function () {
    test('should return true if session has at least 1 candidate', function (assert) {
      // given
      const controller = this.owner.lookup('controller:authenticated/sessions/details');
      controller.model = { certificationCandidates: ['candidate1', 'candidate2'] };

      // when
      const hasOneOrMoreCandidates = controller.hasOneOrMoreCandidates;

      // then
      assert.ok(hasOneOrMoreCandidates);
    });

    test('should return false if session has 0 candidate', function (assert) {
      // given
      const controller = this.owner.lookup('controller:authenticated/sessions/details');
      controller.model = { certificationCandidates: [] };

      // when
      const hasOneOrMoreCandidates = controller.hasOneOrMoreCandidates;

      // then
      assert.notOk(hasOneOrMoreCandidates);
    });
  });

  module('#shouldDisplaySupervisorKitButton', function () {
    test('should return true if current certification center is allowed to access supervisor space', function (assert) {
      // given
      const controller = this.owner.lookup('controller:authenticated/sessions/details');
      class currentUserStub extends Service {
        currentAllowedCertificationCenterAccess = {
          isEndTestScreenRemovalEnabled: true,
        };
      }

      this.owner.register('service:currentUser', currentUserStub);

      // when
      const shouldDisplaySupervisorKitButton = controller.shouldDisplaySupervisorKitButton;

      // then
      assert.true(shouldDisplaySupervisorKitButton);
    });

    test('should return false if current certification center is allowed to access supervisor space', function (assert) {
      // given
      const controller = this.owner.lookup('controller:authenticated/sessions/details');
      class currentUserStub extends Service {
        currentAllowedCertificationCenterAccess = {
          isEndTestScreenRemovalEnabled: false,
        };
      }

      this.owner.register('service:currentUser', currentUserStub);

      // when
      const shouldDisplaySupervisorKitButton = controller.shouldDisplaySupervisorKitButton;

      // then
      assert.false(shouldDisplaySupervisorKitButton);
    });
  });

  module('#shouldDisplayDownloadButton', function () {
    module('when there is at least one enrolled candidate', function () {
      module('when it should display the CertifPrescriptionScoFeature', function () {
        test('should return true ', function (assert) {
          // given
          const controller = this.owner.lookup('controller:authenticated/sessions/details');
          controller.model = {
            certificationCandidates: ['candidate1', 'candidate2'],
            shouldDisplayPrescriptionScoStudentRegistrationFeature: true,
          };

          // when
          const shouldDisplayDownloadButton = controller.shouldDisplayDownloadButton;

          // then
          assert.ok(shouldDisplayDownloadButton);
        });
      });

      test('Should return true', function (assert) {
        // given
        const controller = this.owner.lookup('controller:authenticated/sessions/details');
        controller.model = {
          certificationCandidates: ['candidate1', 'candidate2'],
          shouldDisplayPrescriptionScoStudentRegistrationFeature: false,
        };

        // when
        const shouldDisplayDownloadButton = controller.shouldDisplayDownloadButton;

        // then
        assert.ok(shouldDisplayDownloadButton);
      });
    });
  });

  module('#shouldDisplayResultRecipientInfoMessage', function () {
    module('when the current user certification center does manage students', function () {
      test('should return false', function (assert) {
        // given
        const controller = this.owner.lookup('controller:authenticated/sessions/details');
        controller.currentUser = {
          currentAllowedCertificationCenterAccess: { isScoManagingStudents: true },
        };

        // when
        const shouldDisplayResultRecipientInfoMessage = controller.shouldDisplayResultRecipientInfoMessage;

        // then
        assert.notOk(shouldDisplayResultRecipientInfoMessage);
      });
    });

    module('when current user does not manage students', function () {
      test('should return true', function (assert) {
        // given
        const controller = this.owner.lookup('controller:authenticated/sessions/details');
        controller.currentUser = {
          currentAllowedCertificationCenterAccess: { isScoManagingStudents: false },
        };

        // when
        const shouldDisplayResultRecipientInfoMessage = controller.shouldDisplayResultRecipientInfoMessage;

        // then
        assert.ok(shouldDisplayResultRecipientInfoMessage);
      });
    });
  });

  module('when there is no enrolled candidate', function () {
    test('Should return false.', function (assert) {
      // given
      const controller = this.owner.lookup('controller:authenticated/sessions/details');
      controller.model = {
        certificationCandidates: [],
        isUserFromSco: true,
      };

      // when
      const shouldDisplayDownloadButton = controller.shouldDisplayDownloadButton;

      // then
      assert.notOk(shouldDisplayDownloadButton);
    });
  });
});

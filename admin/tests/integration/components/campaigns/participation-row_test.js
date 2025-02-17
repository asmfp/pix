import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { fillIn } from '@ember/test-helpers';
import { clickByName, render } from '@1024pix/ember-testing-library';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';
import sinon from 'sinon';

module('Integration | Component | Campaigns | participation-row', function (hooks) {
  setupRenderingTest(hooks);

  module('Display information', function () {
    test('it should display firstName, lastName and createdAt', async function (assert) {
      // given
      const participation = EmberObject.create({
        firstName: 'Jean',
        lastName: 'Claude',
        createdAt: new Date('2020-01-01'),
      });
      this.set('participation', participation);

      // when
      const screen = await render(hbs`<Campaigns::ParticipationRow @participation={{participation}}/>`);

      // then
      assert.dom(screen.getByText('Jean')).exists();
      assert.dom(screen.getByText('Claude')).exists();
      assert.dom(screen.getByText('01/01/2020')).exists();
    });

    test('it should not display participantExternalId if idPixLabel is null', async function (assert) {
      // given
      const participation = EmberObject.create({
        participationExternalId: '123',
      });

      this.set('participation', participation);
      this.set('idPixLabel', null);

      // when
      await render(hbs`<Campaigns::ParticipationRow @participation={{participation}} @idPixLabel={{idPixLabel}}/>`);

      // then
      assert.notContains('123');
    });

    test('it should display participantExternalId if idPixLabel is set', async function (assert) {
      // given
      const participation = EmberObject.create({
        participantExternalId: '123',
      });
      this.set('participation', participation);
      this.set('idPixLabel', 'identifiant');

      // when
      const screen = await render(
        hbs`<Campaigns::ParticipationRow @participation={{participation}} @idPixLabel={{idPixLabel}}/>`
      );

      // then
      assert.dom(screen.getByText('123')).exists();
    });

    test('it should display shared date if participation is shared', async function (assert) {
      // given
      const participation = EmberObject.create({
        sharedAt: new Date('2020-01-01'),
      });
      this.set('participation', participation);

      // when
      const screen = await render(hbs`<Campaigns::ParticipationRow @participation={{participation}}/>`);

      // then
      assert.dom(screen.getByText('01/01/2020')).exists();
    });
  }),
    module("when editing participant's external id", function (hooks) {
      hooks.beforeEach(async function () {
        // given
        const participation = EmberObject.create({
          participantExternalId: '123',
        });
        this.participation = participation;
        this.idPixLabel = 'identifiant';
        this.updateParticipantExternalId = sinon.spy();
      });

      test('it should display save and cancel button', async function (assert) {
        // when
        const screen = await render(
          hbs`<Campaigns::ParticipationRow @participation={{this.participation}} @idPixLabel={{this.idPixLabel}} @updateParticipantExternalId={{this.updateParticipantExternalId}} />`
        );
        await clickByName('Modifier');

        // then
        assert.dom(screen.getByRole('button', { name: 'Enregistrer' })).exists();
        assert.dom(screen.getByRole('button', { name: 'Annuler' })).exists();
      });

      test('it should update participantExternalId on save', async function (assert) {
        // given
        await render(
          hbs`<Campaigns::ParticipationRow @participation={{this.participation}} @idPixLabel={{this.idPixLabel}} @updateParticipantExternalId={{this.updateParticipantExternalId}} />`
        );
        await clickByName('Modifier');

        // when
        await fillIn('#participantExternalId', '4567890');
        await clickByName('Enregistrer');

        // then
        assert.notContains('Enregistrer');
        assert.strictEqual(this.participation.participantExternalId, '4567890');
        assert.ok(this.updateParticipantExternalId.called);
      });

      test('it should update participantExternalId with null if participantExternalId only  has blank space', async function (assert) {
        // given
        await render(
          hbs`<Campaigns::ParticipationRow @participation={{this.participation}} @idPixLabel={{this.idPixLabel}} @updateParticipantExternalId={{this.updateParticipantExternalId}} />`
        );
        await clickByName('Modifier');

        // when
        await fillIn('#participantExternalId', '    ');
        await clickByName('Enregistrer');

        // then
        assert.notContains('Enregistrer');
        assert.strictEqual(this.participation.participantExternalId, null);
        assert.ok(this.updateParticipantExternalId.called);
      });

      test('it should update participantExternalId with null if participantExternalId is empty', async function (assert) {
        // given
        await render(
          hbs`<Campaigns::ParticipationRow @participation={{this.participation}} @idPixLabel={{this.idPixLabel}} @updateParticipantExternalId={{this.updateParticipantExternalId}} />`
        );
        await clickByName('Modifier');

        // when
        await fillIn('#participantExternalId', '');
        await clickByName('Enregistrer');

        // then
        assert.notContains('Enregistrer');
        assert.strictEqual(this.participation.participantExternalId, null);
        assert.ok(this.updateParticipantExternalId.called);
      });

      test('it should not update participantExternalId on cancel', async function (assert) {
        // given
        await render(
          hbs`<Campaigns::ParticipationRow @participation={{this.participation}} @idPixLabel={{this.idPixLabel}} @updateParticipantExternalId={{this.updateParticipantExternalId}} />`
        );
        await clickByName('Modifier');

        // when
        await fillIn('#participantExternalId', '4567890');
        await clickByName('Annuler');

        // then
        assert.notContains('Enregistrer');
        assert.strictEqual(this.participation.participantExternalId, '123');
        assert.notOk(this.updateParticipantExternalId.called);
      });
    });
});

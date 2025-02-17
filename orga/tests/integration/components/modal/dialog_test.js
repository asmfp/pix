import { module, test } from 'qunit';
import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';
import { getRootElement, render, click, triggerKeyEvent } from '@ember/test-helpers';
import sinon from 'sinon';
import { clickByName } from '@1024pix/ember-testing-library';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | modal', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('Component rendering', function (hooks) {
    let close;

    hooks.beforeEach(function () {
      close = sinon.stub();
      this.set('close', close);
      this.set('title', 'Mon titre');

      return render(
        hbs`<Modal::Dialog @display={{display}} @title={{title}} @close={{close}} @additionalContainerClass={{additionalContainerClass}}>Mon contenu</Modal::Dialog>`
      );
    });

    test('should render title and content', async function (assert) {
      this.set('display', true);

      assert.contains('Mon titre');
      assert.contains('Mon contenu');
    });

    test('should not display the modal', async function (assert) {
      this.set('display', false);

      assert.notContains('Mon titre');
    });

    test('should call close method when user clicks on close button', async function (assert) {
      this.set('display', true);

      await clickByName(this.intl.t('common.actions.close'));

      assert.ok(close.called);
    });

    test('should call close method when user clicks on overlay', async function (assert) {
      this.set('display', true);

      await click('[data-emd-overlay]');

      assert.ok(close.called);
    });

    test('should call close method when user press Escape', async function (assert) {
      this.set('display', true);

      await triggerKeyEvent(getRootElement(), 'keyup', 'Escape');

      assert.ok(close.called);
    });

    test('should be accessible', async function (assert) {
      this.set('display', true);

      assert.dom('[aria-modal="true"]').exists();
      assert.dom('[role="dialog"]').exists();
      assert.dom('[aria-labelledby="modal_mon_titre_label"]').exists();
      assert.dom('#modal_mon_titre_label').exists();
    });

    test('should add additional container class', async function (assert) {
      const additionalContainerClass = 'a_class';
      this.set('display', true);
      this.set('additionalContainerClass', additionalContainerClass);

      assert.dom('.modal-dialog').hasClass(additionalContainerClass);
    });
  });
});

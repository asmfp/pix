import { on } from '@ember/object/evented';
import ModalDialog from 'ember-modal-dialog/components/modal-dialog';
import { EKMixin as EmberKeyboardMixin, keyUp } from 'ember-keyboard';

// eslint-disable-next-line ember/require-tagless-components
export default ModalDialog.extend(EmberKeyboardMixin, {
  translucentOverlay: true,
  targetAttachment: 'none',
  wrapperClass: 'centered-scrolling-wrapper',
  overlayClass: 'centered-scrolling-overlay',
  containerClass: 'centered-scrolling-container',

  init() {
    this._super(...arguments);
    this.set('wrapperClassNames', ['pix-modal-wrapper']);
    this.set('containerClassNames', ['pix-modal-overlay']);
    this.set('containerClassNames', ['pix-modal-dialog']);
    this.set('keyboardActivated', true);
  },

  // eslint-disable-next-line ember/no-component-lifecycle-hooks
  didRender() {
    this._super(...arguments);
    document.querySelector('#modal-overlays').classList.add('active');
    document.body.classList.add('centered-modal-showing');
    document.body.style.overflowY = 'hidden';
  },

  // eslint-disable-next-line ember/no-component-lifecycle-hooks
  willDestroyElement() {
    document.querySelector('#modal-overlays').classList.remove('active');
    document.body.classList.remove('centered-modal-showing');
    this._super(...arguments);
    document.body.style.overflowY = '';
  },

  closeOnEsc: on(keyUp('Escape'), function () {
    this.onClose();
  }),

  // The block below fix a warning when closing a modal by clicking on the overlay.
  // It is copied from the original implementation of ember-modal-dialog, found in v3.0.0-beta.1.
  // The problem is that this version (up to v3.0.0-beta.3) introduces regression with our
  // current version of @ember/test-helpers and breaks a ton of rendering / application tests.
  // We can remove it after upgrading to a stable version of ember-modal-dialog (> v3.0.0-beta.3)
  //
  // cf. https://github.com/yapplabs/ember-modal-dialog/blob/26b3a89bab37bc584c3a3e9a221f1de4bb9ff979/addon/components/modal-dialog.js#L107-L114
  // eslint-disable-next-line ember/no-actions-hash
  actions: {
    onClickOverlay(e) {
      e.preventDefault();
      if (this.onClickOverlay) {
        this.onClickOverlay();
      } else {
        this.onClose();
      }
    },
  },
});

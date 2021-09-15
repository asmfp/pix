import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import isEmailValid from '../../utils/email-validator';
import isEmpty from 'lodash/isEmpty';

const ERROR_INPUT_MESSAGE_MAP = {
  invalidEmail: 'pages.user-account.account-update-email-with-validation.fields.errors.invalid-email',
  emptyPassword: 'pages.user-account.account-update-email-with-validation.fields.errors.empty-password',
};

export default class UserAccountUpdateEmailWithValidation extends Component {

  @service intl;
  @tracked newEmail = '';
  @tracked password = '';
  @tracked newEmailValidationMessage = null;
  @tracked passwordValidationMessage = null;

  get isFormValid() {
    return isEmailValid(this.newEmail) && !isEmpty(this.password);
  }

  @action
  validateNewEmail(event) {
    this.newEmail = event.target.value;
    const isInvalidInput = !isEmailValid(this.newEmail);

    this.newEmailValidationMessage = null;

    if (isInvalidInput) {
      this.newEmailValidationMessage = this.intl.t(ERROR_INPUT_MESSAGE_MAP['invalidEmail']);
    }
  }

  @action
  validatePassword(event) {
    this.password = event.target.value;
    const isInvalidInput = isEmpty(this.password);

    this.passwordValidationMessage = null;

    if (isInvalidInput) {
      this.passwordValidationMessage = this.intl.t(ERROR_INPUT_MESSAGE_MAP['emptyPassword']);
    }
  }

  @action
  async onSubmit(event) {
    event && event.preventDefault();
    if (this.isFormValid) {
      try {
        await this.args.sendVerificationCode({
          newEmail: this.newEmail,
          password: this.password,
        });
      } catch (response) {
        console.log(response);
      }
    }
  }
}

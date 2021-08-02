import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import get from 'lodash/get';

export default class UpdateScoRecordRoute extends Route {

  errors;
  @service intl;
  @service store;
  @service featureToggles;

  beforeModel() {
    if (!this.featureToggles.featureToggles.isScoAccountRecoveryEnabled) {
      this.replaceWith('/connexion');
    }
  }

  async model(params) {
    const temporaryKey = params.temporary_key;
    try {
      const { email, firstName } = await this.store.queryRecord('account-recovery-demand', { temporaryKey });
      return { email, firstName, temporaryKey };
    } catch (error) {
      const status = get(error, 'errors[0].status', '');
      if (status === '401' || status === '404' || status === '409') {
        this.errors = this.intl.t('pages.account-recovery.update-sco-record.invalid-demand');
        return { errors: this.errors } ;
      }
      else {
        throw error;
      }
    }
  }
}

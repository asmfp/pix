import Route from '@ember/routing/route';

export default class PersonalInformationRoute extends Route {
  model() {
    return this.modelFor('user-account');
  }
}

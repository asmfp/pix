import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class OrganizationTeamRoute extends Route {
  @service router;

  queryParams = {
    pageNumber: { refreshModel: true },
    pageSize: { refreshModel: true },
    firstName: { refreshModel: true },
    lastName: { refreshModel: true },
    email: { refreshModel: true },
    organizationRole: { refreshModel: true },
  };

  beforeModel() {
    const organization = this.modelFor('authenticated.organizations.get');
    if (organization.isArchived) {
      return this.router.replaceWith('authenticated.organizations.get.target-profiles');
    }
  }

  async model(params) {
    const organization = this.modelFor('authenticated.organizations.get');
    await organization.hasMany('memberships').reload({
      adapterOptions: {
        'page[size]': params.pageSize,
        'page[number]': params.pageNumber,
        'filter[firstName]': params.firstName,
        'filter[lastName]': params.lastName,
        'filter[email]': params.email,
        'filter[organizationRole]': params.organizationRole,
      },
    });
    return organization;
  }

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.pageNumber = 1;
      controller.pageSize = 10;
      controller.firstName = null;
      controller.lastName = null;
      controller.email = null;
      controller.organizationRole = null;
    }
  }
}

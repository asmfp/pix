// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const { OrganizationNotFoundError, OrganizationWithoutEmailError, ManyOrganizationsFoundError } = require('../errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'organizati... Remove this comment to see the full error message
const organizationInvitationService = require('../../domain/services/organization-invitation-service');
let errorMessage = null;
let organizationsFound: any = null;

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function sendScoInvitation({
  uai,
  firstName,
  lastName,
  locale,
  organizationRepository,
  organizationInvitationRepository
}: any) {
  organizationsFound = await organizationRepository.findScoOrganizationByUai(uai.trim());

  const nbOrganizations = _.get(organizationsFound, 'length', 0);

  _checkIfManyOrganizationsFoundError(nbOrganizations, uai);

  _checkIfOrganizationNotFoundError(nbOrganizations, uai);

  _checkIfOrganizationWithoutEmailError(nbOrganizations, uai);

  const email = organizationsFound[0].email;
  const organizationId = organizationsFound[0].id;

  const scoOrganizationInvitation = await organizationInvitationService.createScoOrganizationInvitation({
    organizationRepository,
    organizationInvitationRepository,
    organizationId,
    firstName,
    lastName,
    email,
    locale,
  });

  return scoOrganizationInvitation;
};

function _checkIfOrganizationNotFoundError(nbOrganizations: any, uai: any) {
  if (nbOrganizations == 0) {
    errorMessage = `L'UAI/RNE ${uai} de l'établissement n’est pas reconnu.`;
    throw new OrganizationNotFoundError(errorMessage);
  }
}

function _checkIfManyOrganizationsFoundError(nbOrganizations: any, uai: any) {
  if (nbOrganizations > 1) {
    errorMessage = `Plusieurs établissements de type SCO ont été retrouvés pour L'UAI/RNE ${uai}.`;
    throw new ManyOrganizationsFoundError(errorMessage);
  }
}

function _checkIfOrganizationWithoutEmailError(nbOrganizations: any, uai: any) {
  if (nbOrganizations == 1 && _.isEmpty(organizationsFound[0].email)) {
    errorMessage = `Nous n’avons pas d’adresse e-mail de contact associée à l'établissement concernant l'UAI/RNE ${uai}.`;
    throw new OrganizationWithoutEmailError(errorMessage);
  }
}

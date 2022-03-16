// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'randomStri... Remove this comment to see the full error message
const randomString = require('randomstring');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../models/Membership');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'mailServic... Remove this comment to see the full error message
const mailService = require('../../domain/services/mail-service');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_generateC... Remove this comment to see the full error message
const _generateCode = () => {
  return randomString.generate({ length: 10, capitalization: 'uppercase' });
};

const createOrganizationInvitation = async ({
  organizationRepository,
  organizationInvitationRepository,
  organizationId,
  email,
  locale,
  tags,
  role
}: any) => {
  let organizationInvitation = await organizationInvitationRepository.findOnePendingByOrganizationIdAndEmail({
    organizationId,
    email,
  });

  if (!organizationInvitation) {
    const code = _generateCode();
    organizationInvitation = await organizationInvitationRepository.create({
      organizationId,
      email,
      code,
      role,
    });
  }

  const organization = await organizationRepository.get(organizationId);

  await mailService.sendOrganizationInvitationEmail({
    email,
    organizationName: organization.name,
    organizationInvitationId: organizationInvitation.id,
    code: organizationInvitation.code,
    locale,
    tags,
  });

  return await organizationInvitationRepository.updateModificationDate(organizationInvitation.id);
};

const createProOrganizationInvitation = async ({
  organizationInvitationRepository,
  organizationId,
  email,
  role,
  locale,
  tags,
  name
}: any) => {
  let organizationInvitation = await organizationInvitationRepository.findOnePendingByOrganizationIdAndEmail({
    organizationId,
    email,
  });

  if (!organizationInvitation) {
    const code = _generateCode();
    organizationInvitation = await organizationInvitationRepository.create({ organizationId, email, role, code });
  }

  await mailService.sendOrganizationInvitationEmail({
    email,
    name,
    organizationInvitationId: organizationInvitation.id,
    code: organizationInvitation.code,
    locale,
    tags,
  });

  await organizationInvitationRepository.updateModificationDate(organizationInvitation.id);

  return organizationInvitation;
};

const createScoOrganizationInvitation = async ({
  organizationRepository,
  organizationInvitationRepository,
  organizationId,
  firstName,
  lastName,
  email,
  locale,
  tags
}: any) => {
  let organizationInvitation = await organizationInvitationRepository.findOnePendingByOrganizationIdAndEmail({
    organizationId,
    email,
  });

  if (!organizationInvitation) {
    const code = _generateCode();
    const role = Membership.roles.ADMIN;
    organizationInvitation = await organizationInvitationRepository.create({ organizationId, email, code, role });
  }

  const organization = await organizationRepository.get(organizationId);

  await mailService.sendScoOrganizationInvitationEmail({
    email,
    organizationName: organization.name,
    firstName,
    lastName,
    organizationInvitationId: organizationInvitation.id,
    code: organizationInvitation.code,
    locale,
    tags,
  });

  await organizationInvitationRepository.updateModificationDate(organizationInvitation.id);

  return organizationInvitation;
};

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  createOrganizationInvitation,
  createScoOrganizationInvitation,
  createProOrganizationInvitation,
};

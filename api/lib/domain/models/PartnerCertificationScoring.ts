// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi').extend(require('@joi/date'));
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'validateEn... Remove this comment to see the full error message
const { validateEntity } = require('../validators/entity-validator');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotImpleme... Remove this comment to see the full error message
const { NotImplementedError } = require('../errors');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PartnerCer... Remove this comment to see the full error message
class PartnerCertificationScoring {
  certificationCourseId: any;
  partnerKey: any;
  temporaryPartnerKey: any;
  constructor({
    certificationCourseId,
    partnerKey,
    temporaryPartnerKey = null
  }: any = {}) {
    this.certificationCourseId = certificationCourseId;
    this.partnerKey = partnerKey;
    this.temporaryPartnerKey = temporaryPartnerKey;
    const schema = Joi.object({
      certificationCourseId: Joi.number().integer().required(),
      partnerKey: Joi.string().allow(null).required(),
      temporaryPartnerKey: Joi.string().allow(null).required(),
    });
    validateEntity(schema, this);
  }

  isAcquired() {
    throw new NotImplementedError();
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = PartnerCertificationScoring;

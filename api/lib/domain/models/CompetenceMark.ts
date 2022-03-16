// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Joi'.
const Joi = require('joi');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'validateEn... Remove this comment to see the full error message
const { validateEntity } = require('../validators/entity-validator');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'schema'.
const schema = Joi.object({
  id: Joi.number().integer().optional(),
  level: Joi.number().integer().min(-1).max(8).required(),
  score: Joi.number().integer().min(0).max(64).required(),
  area_code: Joi.required(),
  competence_code: Joi.required(),
  competenceId: Joi.string().optional(),
  assessmentResultId: Joi.number().optional(),
});

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
class CompetenceMark {
  area_code: any;
  assessmentResultId: any;
  competenceId: any;
  competence_code: any;
  id: any;
  level: any;
  score: any;
  constructor({
    id,
    area_code,
    competence_code,
    competenceId,
    level,
    score,
    assessmentResultId
  }: any = {}) {
    this.id = id;
    this.area_code = area_code;
    this.competence_code = competence_code;
    this.competenceId = competenceId;
    this.level = level;
    this.score = score;
    this.assessmentResultId = assessmentResultId;
  }

  validate() {
    validateEntity(schema, this);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CompetenceMark;

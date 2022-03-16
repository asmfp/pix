// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'tutorialEv... Remove this comment to see the full error message
const tutorialEvaluationAttributes = require('./tutorial-evaluation-attributes');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'userTutori... Remove this comment to see the full error message
const userTutorialAttributes = require('./user-tutorial-attributes');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(tutorial = {}, pagination: any) {
    return new Serializer('tutorials', {
      attributes: [
        'duration',
        'format',
        'link',
        'source',
        'title',
        'tubeName',
        'tubePracticalTitle',
        'tubePracticalDescription',
        'tutorialEvaluation',
        'userTutorial',
      ],
      tutorialEvaluation: tutorialEvaluationAttributes,
      userTutorial: userTutorialAttributes,
      typeForAttribute(attribute: any) {
        return attribute === 'userTutorial' ? 'user-tutorial' : attribute;
      },
      meta: pagination,
    }).serialize(tutorial);
  },
};

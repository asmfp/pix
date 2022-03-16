// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'injectDefa... Remove this comment to see the full error message
const { injectDefaults, injectDependencies } = require('../../infrastructure/utils/dependency-injection');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'EventDispa... Remove this comment to see the full error message
const EventDispatcher = require('../../infrastructure/events/EventDispatcher');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'EventDispa... Remove this comment to see the full error message
const EventDispatcherLogger = require('../../infrastructure/events/EventDispatcherLogger');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const MonitoringTools = require('../../infrastructure/monitoring-tools');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../config');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'performanc... Remove this comment to see the full error message
const { performance } = require('perf_hooks');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'dependenci... Remove this comment to see the full error message
const dependencies = {
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  assessmentRepository: require('../../infrastructure/repositories/assessment-repository'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  assessmentResultRepository: require('../../infrastructure/repositories/assessment-result-repository'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  badgeAcquisitionRepository: require('../../infrastructure/repositories/badge-acquisition-repository'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  badgeCriteriaService: require('../services/badge-criteria-service'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  badgeRepository: require('../../infrastructure/repositories/badge-repository'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  campaignRepository: require('../../infrastructure/repositories/campaign-repository'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  campaignParticipationRepository: require('../../infrastructure/repositories/campaign-participation-repository'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  campaignParticipationResultRepository: require('../../infrastructure/repositories/campaign-participation-result-repository'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  certificationAssessmentRepository: require('../../infrastructure/repositories/certification-assessment-repository'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  certificationCenterRepository: require('../../infrastructure/repositories/certification-center-repository'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  certificationCourseRepository: require('../../infrastructure/repositories/certification-course-repository'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  cleaCertificationResultRepository: require('../../infrastructure/repositories/clea-certification-result-repository'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  certificationIssueReportRepository: require('../../infrastructure/repositories/certification-issue-report-repository'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  competenceMarkRepository: require('../../infrastructure/repositories/competence-mark-repository'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  competenceRepository: require('../../infrastructure/repositories/competence-repository'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  complementaryCertificationCourseRepository: require('../../infrastructure/repositories/complementary-certification-course-repository'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  knowledgeElementRepository: require('../../infrastructure/repositories/knowledge-element-repository'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  endTestScreenRemovalService: require('../services/end-test-screen-removal-service'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  organizationRepository: require('../../infrastructure/repositories/organization-repository'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  poleEmploiSendingRepository: require('../../infrastructure/repositories/pole-emploi-sending-repository'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  scoringCertificationService: require('../services/scoring/scoring-certification-service'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  skillRepository: require('../../infrastructure/repositories/skill-repository'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  supervisorAccessRepository: require('../../infrastructure/repositories/supervisor-access-repository'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  targetProfileRepository: require('../../infrastructure/repositories/target-profile-repository'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  targetProfileWithLearningContentRepository: require('../../infrastructure/repositories/target-profile-with-learning-content-repository'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  userRepository: require('../../infrastructure/repositories/user-repository'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  participantResultsSharedRepository: require('../../infrastructure/repositories/participant-results-shared-repository'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  poleEmploiNotifier: require('../../infrastructure/externals/pole-emploi/pole-emploi-notifier'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  juryCertificationSummaryRepository: require('../../infrastructure/repositories/jury-certification-summary-repository'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  finalizedSessionRepository: require('../../infrastructure/repositories/sessions/finalized-session-repository'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  challengeRepository: require('../../infrastructure/repositories/challenge-repository'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  logger: require('../../infrastructure/logger'),
};

const partnerCertificationScoringRepository = injectDependencies(
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  require('../../infrastructure/repositories/partner-certification-scoring-repository'),
  dependencies
);
// @ts-expect-error ts-migrate(2339) FIXME: Property 'partnerCertificationScoringRepository' d... Remove this comment to see the full error message
dependencies.partnerCertificationScoringRepository = partnerCertificationScoringRepository;

const handlersToBeInjected = {
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  computeCampaignParticipationResults: require('./compute-campaign-participation-results'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  handleAutoJury: require('./handle-auto-jury'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  handleBadgeAcquisition: require('./handle-badge-acquisition'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  handleCertificationScoring: require('./handle-certification-scoring'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  handleCertificationRescoring: require('./handle-certification-rescoring'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  handleCleaCertificationScoring: require('./handle-clea-certification-scoring'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  handlePixPlusEduCertificationsScoring: require('./handle-pix-plus-edu-certifications-scoring'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  handlePixPlusDroitCertificationsScoring: require('./handle-pix-plus-droit-certifications-scoring'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  handlePoleEmploiParticipationFinished: require('./handle-pole-emploi-participation-finished'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  handlePoleEmploiParticipationShared: require('./handle-pole-emploi-participation-shared'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  handlePoleEmploiParticipationStarted: require('./handle-pole-emploi-participation-started'),
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  handleSessionFinalized: require('./handle-session-finalized'),
};

function buildEventDispatcher(handlersStubs: any) {
  const eventDispatcher = new EventDispatcher(new EventDispatcherLogger(MonitoringTools, settings, performance));

  const handlersNames = _.map(handlersToBeInjected, (handler: any) => handler.name);

  if (_.some(handlersNames, (name: any) => _.isEmpty(name))) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Error'.
    throw new Error('All handlers must have a name. Handlers : ' + handlersNames.join(', '));
  }
  if (_.uniq(handlersNames).length !== handlersNames.length) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Error'.
    throw new Error('All handlers must have a unique name. Handlers : ' + handlersNames.join(', '));
  }

  const handlers = { ...handlersToBeInjected, ...handlersStubs };

  for (const key in handlers) {
    const inject = _.partial(injectDefaults, dependencies);
    const injectedHandler = inject(handlers[key]);
    injectedHandler.handlerName = handlers[key].name;
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    for (const eventType of handlersToBeInjected[key].eventTypes) {
      eventDispatcher.subscribe(eventType, injectedHandler);
    }
  }
  return eventDispatcher;
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  eventDispatcher: buildEventDispatcher({}),
  _forTestOnly: {
    handlers: handlersToBeInjected,
    buildEventDispatcher: function (stubbedHandlers: any) {
      return buildEventDispatcher(stubbedHandlers);
    },
  },
};

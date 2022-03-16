// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require('path');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const ms = require('ms');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getArrayOf... Remove this comment to see the full error message
const { getArrayOfStrings } = require('../lib/infrastructure/utils/string-utils');

function parseJSONEnv(varName: any) {
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  if (process.env[varName]) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'JSON'.
    return JSON.parse(process.env[varName]);
  }
  return undefined;
}

function isFeatureEnabled(environmentVariable: any) {
  return environmentVariable === 'true';
}

function isBooleanFeatureEnabledElseDefault(environmentVariable: any, defaultValue: any) {
  return environmentVariable === 'true' ? true : defaultValue;
}

function _getNumber(numberAsString: any, defaultIntNumber: any) {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
  const number = parseInt(numberAsString, 10);
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'isNaN'.
  return isNaN(number) ? defaultIntNumber : number;
}

function _getDate(dateAsString: any) {
  if (!dateAsString) {
    return null;
  }
  const dateAsMoment = moment(dateAsString);
  if (!dateAsMoment.isValid()) {
    return null;
  }

  return dateAsMoment.toDate();
}

function _removeTrailingSlashFromUrl(url: any) {
  return url.replace(/\/$/, '');
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = (function () {
  const config = {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '__dirname'.
    rootPath: path.normalize(__dirname + '/..'),

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
    port: parseInt(process.env.PORT, 10) || 3000,

    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    environment: process.env.NODE_ENV || 'development',

    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    logOpsMetrics: isFeatureEnabled(process.env.LOG_OPS_METRICS),

    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    version: process.env.CONTAINER_VERSION || 'development',

    hapi: {
      options: {},
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      enableRequestMonitoring: isFeatureEnabled(process.env.ENABLE_REQUEST_MONITORING),
    },

    domain: {
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      tldFr: process.env.TLD_FR || '.fr',
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      tldOrg: process.env.TLD_ORG || '.org',
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      pix: process.env.DOMAIN_PIX || 'https://pix',
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      pixApp: process.env.DOMAIN_PIX_APP || 'https://app.pix',
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      pixOrga: process.env.DOMAIN_PIX_ORGA || 'https://orga.pix',
    },

    lcms: {
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      url: _removeTrailingSlashFromUrl(process.env.CYPRESS_LCMS_API_URL || process.env.LCMS_API_URL || ''),
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      apiKey: process.env.CYPRESS_LCMS_API_KEY || process.env.LCMS_API_KEY,
    },

    logging: {
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      enabled: isFeatureEnabled(process.env.LOG_ENABLED),
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      logLevel: process.env.LOG_LEVEL || 'info',
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      logForHumans: isFeatureEnabled(process.env.LOG_FOR_HUMANS),
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      enableLogKnexQueries: isFeatureEnabled(process.env.LOG_KNEX_QUERIES),
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      enableLogStartingEventDispatch: isFeatureEnabled(process.env.LOG_STARTING_EVENT_DISPATCH),
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      enableLogEndingEventDispatch: isFeatureEnabled(process.env.LOG_ENDING_EVENT_DISPATCH),
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      emitOpsEventEachSeconds: isFeatureEnabled(process.env.OPS_EVENT_EACH_SECONDS) || 15,
    },

    mailing: {
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      enabled: isFeatureEnabled(process.env.MAILING_ENABLED),
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      provider: process.env.MAILING_PROVIDER || 'sendinblue',
      sendinblue: {
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        apiKey: process.env.SENDINBLUE_API_KEY,
        templates: {
          // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
          accountCreationTemplateId: process.env.SENDINBLUE_ACCOUNT_CREATION_TEMPLATE_ID,
          // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
          organizationInvitationTemplateId: process.env.SENDINBLUE_ORGANIZATION_INVITATION_TEMPLATE_ID,
          // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
          organizationInvitationScoTemplateId: process.env.SENDINBLUE_ORGANIZATION_INVITATION_SCO_TEMPLATE_ID,
          // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
          passwordResetTemplateId: process.env.SENDINBLUE_PASSWORD_RESET_TEMPLATE_ID,
          // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
          certificationResultTemplateId: process.env.SENDINBLUE_CERTIFICATION_RESULT_TEMPLATE_ID,
          // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
          emailChangeTemplateId: process.env.SENDINBLUE_EMAIL_CHANGE_TEMPLATE_ID,
          // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
          accountRecoveryTemplateId: process.env.SENDINBLUE_ACCOUNT_RECOVERY_TEMPLATE_ID,
          // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
          emailVerificationCodeTemplateId: process.env.SENDINBLUE_EMAIL_VERIFICATION_CODE_TEMPLATE_ID,
        },
      },
    },

    authentication: {
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      secret: process.env.AUTH_SECRET,
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      accessTokenLifespanMs: ms(process.env.ACCESS_TOKEN_LIFESPAN || '20m'),
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      refreshTokenLifespanMs: ms(process.env.REFRESH_TOKEN_LIFESPAN || '7d'),
      tokenForCampaignResultLifespan: '1h',
      tokenForStudentReconciliationLifespan: '1h',
    },

    apiManager: {
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      url: process.env.APIM_URL || 'https://gateway.pix.fr',
    },

    jwtConfig: {
      livretScolaire: {
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        secret: process.env.LIVRET_SCOLAIRE_AUTH_SECRET,
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        tokenLifespan: process.env.TOKEN_LIFE_SPAN || '1h',
      },
      poleEmploi: {
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        secret: process.env.POLE_EMPLOI_AUTH_SECRET,
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        tokenLifespan: process.env.TOKEN_LIFE_SPAN || '1h',
      },
    },

    saml: {
      spConfig: parseJSONEnv('SAML_SP_CONFIG'),
      idpConfig: parseJSONEnv('SAML_IDP_CONFIG'),
      attributeMapping: parseJSONEnv('SAML_ATTRIBUTE_MAPPING') || {
        samlId: 'IDO',
        firstName: 'PRE',
        lastName: 'NOM',
      },
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      accessTokenLifespanMs: ms(process.env.SAML_ACCESS_TOKEN_LIFESPAN || '7d'),
    },

    temporaryKey: {
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      secret: process.env.AUTH_SECRET,
      tokenLifespan: '1d',
      payload: 'PixResetPassword',
    },

    account: {
      passwordValidationPattern: '^(?=.*\\p{Lu})(?=.*\\p{Ll})(?=.*\\d).{8,}$',
    },

    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    bcryptNumberOfSaltRounds: _getNumber(process.env.BCRYPT_NUMBER_OF_SALT_ROUNDS, 10),

    availableCharacterForCode: {
      letters: 'BCDFGHJKMPQRTVWXY',
      numbers: '2346789',
    },

    caching: {
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      redisUrl: process.env.REDIS_URL,
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
      redisCacheKeyLockTTL: parseInt(process.env.REDIS_CACHE_KEY_LOCK_TTL, 10) || 60000,
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
      redisCacheLockedWaitBeforeRetry: parseInt(process.env.REDIS_CACHE_LOCKED_WAIT_BEFORE_RETRY, 10) || 1000,
    },

    features: {
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      dayBeforeImproving: _getNumber(process.env.DAY_BEFORE_IMPROVING, 4),
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      dayBeforeRetrying: _getNumber(process.env.DAY_BEFORE_RETRYING, 4),
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      dayBeforeCompetenceResetV2: _getNumber(process.env.DAY_BEFORE_COMPETENCE_RESET_V2, 7),
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      garAccessV2: isFeatureEnabled(process.env.GAR_ACCESS_V2),
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      maxReachableLevel: _getNumber(process.env.MAX_REACHABLE_LEVEL, 5),
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      newYearSchoolingRegistrationsImportDate: _getDate(process.env.NEW_YEAR_SCHOOLING_REGISTRATIONS_IMPORT_DATE),
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      numberOfChallengesForFlashMethod: _getNumber(process.env.NUMBER_OF_CHALLENGES_FOR_FLASH_METHOD),
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      pixCertifScoBlockedAccessWhitelist: getArrayOfStrings(process.env.PIX_CERTIF_SCO_BLOCKED_ACCESS_WHITELIST),
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      pixCertifScoBlockedAccessDateLycee: process.env.PIX_CERTIF_SCO_BLOCKED_ACCESS_DATE_LYCEE,
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      pixCertifScoBlockedAccessDateCollege: process.env.PIX_CERTIF_SCO_BLOCKED_ACCESS_DATE_COLLEGE,
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      userAnswersMaxLength: _getNumber(process.env.USER_ANSWERS_MAX_LENGTH, 500),
    },

    featureToggles: {
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      isEmailValidationEnabled: isFeatureEnabled(process.env.FT_VALIDATE_EMAIL),
      isComplementaryCertificationSubscriptionEnabled: isFeatureEnabled(
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        process.env.FT_IS_COMPLEMENTARY_CERTIFICATION_SUBSCRIPTION_ENABLED
      ),
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      isCertificationBillingEnabled: isFeatureEnabled(process.env.FT_CERTIFICATION_BILLING),
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      isNewTutorialsPageEnabled: isFeatureEnabled(process.env.FT_NEW_TUTORIALS_PAGE),
    },

    infra: {
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      concurrencyForHeavyOperations: _getNumber(process.env.INFRA_CONCURRENCY_HEAVY_OPERATIONS, 2),
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      chunkSizeForCampaignResultProcessing: _getNumber(process.env.INFRA_CHUNK_SIZE_CAMPAIGN_RESULT_PROCESSING, 10),
      chunkSizeForSchoolingRegistrationDataProcessing: _getNumber(
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        process.env.INFRA_CHUNK_SIZE_SCHOOLING_REGISTRATION_DATA_PROCESSING,
        1000
      ),
    },

    sentry: {
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      enabled: isFeatureEnabled(process.env.SENTRY_ENABLED),
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      dsn: process.env.SENTRY_DSN,
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      environment: process.env.SENTRY_ENVIRONMENT || 'development',
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      maxBreadcrumbs: _getNumber(process.env.SENTRY_MAX_BREADCRUMBS, 100),
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      debug: isFeatureEnabled(process.env.SENTRY_DEBUG),
      maxValueLength: 1000,
    },

    poleEmploi: {
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      clientId: process.env.POLE_EMPLOI_CLIENT_ID,
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      clientSecret: process.env.POLE_EMPLOI_CLIENT_SECRET,
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      tokenUrl: process.env.POLE_EMPLOI_TOKEN_URL,
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      sendingUrl: process.env.POLE_EMPLOI_SENDING_URL,
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      userInfoUrl: process.env.POLE_EMPLOI_USER_INFO_URL,
      temporaryStorage: {
        expirationDelaySeconds:
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
          parseInt(process.env.POLE_EMPLOI_TEMPORARY_STORAGE_EXPIRATION_DELAY_SECONDS, 10) || 1140,
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        redisUrl: process.env.REDIS_URL,
      },
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      poleEmploiSendingsLimit: _getNumber(process.env.POLE_EMPLOI_SENDING_LIMIT, 100),
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      poleEmploiIdentityProvider: process.env.POLE_EMPLOI_IDENTITY_PROVIDER || 'POLE_EMPLOI',
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      accessTokenLifespanMs: ms(process.env.POLE_EMPLOI_ACCESS_TOKEN_LIFESPAN || '7d'),
    },

    temporaryStorage: {
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
      expirationDelaySeconds: parseInt(process.env.TEMPORARY_STORAGE_EXPIRATION_DELAY_SECONDS, 10) || 600,
      // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      redisUrl: process.env.REDIS_URL,
    },

    graviteeRegisterApplicationsCredentials: [
      {
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        clientId: process.env.LSU_CLIENT_ID,
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        clientSecret: process.env.LSU_CLIENT_SECRET,
        scope: 'organizations-certifications-result',
        source: 'lsu',
      },
      {
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        clientId: process.env.LSL_CLIENT_ID,
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        clientSecret: process.env.LSL_CLIENT_SECRET,
        scope: 'organizations-certifications-result',
        source: 'lsl',
      },
      {
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        clientId: process.env.GRAVITEE_OSMOSE_CLIENT_ID,
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        clientSecret: process.env.GRAVITEE_OSMOSE_CLIENT_SECRET,
        scope: 'organizations-certifications-result',
        source: 'livretScolaire',
      },
      {
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        clientId: process.env.GRAVITEE_POLE_EMPLOI_CLIENT_ID,
        // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        clientSecret: process.env.GRAVITEE_POLE_EMPLOI_CLIENT_SECRET,
        scope: 'pole-emploi-participants-result',
        source: 'poleEmploi',
      },
    ],
  };

  if (config.environment === 'development') {
    config.logging.enabled = true;
  // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  } else if (process.env.NODE_ENV === 'test') {
    config.port = 0;

    config.lcms.apiKey = 'test-api-key';
    config.lcms.url = 'https://lcms-test.pix.fr/api';

    config.domain.tldFr = '.fr';
    config.domain.tldOrg = '.org';
    config.domain.pix = 'https://pix';
    config.domain.pixOrga = 'https://orga.pix';

    config.features.dayBeforeRetrying = 4;
    config.features.dayBeforeImproving = 4;
    config.features.dayBeforeCompetenceResetV2 = 7;
    config.features.garAccessV2 = false;
    config.features.numberOfChallengesForFlashMethod = 10;

    config.mailing.enabled = false;
    config.mailing.provider = 'sendinblue';

    config.mailing.sendinblue.apiKey = 'test-api-key';
    config.mailing.sendinblue.templates.accountCreationTemplateId = 'test-account-creation-template-id';
    config.mailing.sendinblue.templates.organizationInvitationTemplateId =
      'test-organization-invitation-demand-template-id';
    config.mailing.sendinblue.templates.organizationInvitationScoTemplateId =
      'test-organization-invitation-sco-demand-template-id';
    config.mailing.sendinblue.templates.certificationResultTemplateId = 'test-certification-result-template-id';
    config.mailing.sendinblue.templates.passwordResetTemplateId = 'test-password-reset-template-id';
    config.mailing.sendinblue.templates.emailChangeTemplateId = 'test-email-change-template-id';
    config.mailing.sendinblue.templates.accountRecoveryTemplateId = 'test-account-recovery-template-id';
    config.mailing.sendinblue.templates.emailVerificationCodeTemplateId = 'test-email-verification-code-template-id';

    config.bcryptNumberOfSaltRounds = 1;

    config.authentication.secret = 'test-jwt-key';

    config.temporaryKey.secret = 'test-jwt-key';

    config.poleEmploi.clientSecret = 'PIX_POLE_EMPLOI_CLIENT_SECRET';
    config.poleEmploi.tokenUrl = 'http://tokenUrl.fr';
    config.poleEmploi.sendingUrl = 'http://sendingUrl.fr';
    config.poleEmploi.userInfoUrl = 'http://userInfoUrl.fr';

    config.saml.accessTokenLifespanMs = 1000;

    config.graviteeRegisterApplicationsCredentials = [
      {
        clientId: 'lsuClientId',
        clientSecret: 'lsuClientSecret',
        scope: 'organizations-certifications-result',
        source: 'lsu',
      },
      {
        clientId: 'lslClientId',
        clientSecret: 'lslClientSecret',
        scope: 'organizations-certifications-result',
        source: 'lsl',
      },
      {
        clientId: 'graviteeOsmoseClientId',
        clientSecret: 'graviteeOsmoseClientSecret',
        scope: 'organizations-certifications-result',
        source: 'livretScolaire',
      },
      {
        clientId: 'poleEmploiClientId',
        clientSecret: 'poleEmploiClientSecret',
        scope: 'pole-emploi-participants-result',
        source: 'poleEmploi',
      },
    ];

    config.jwtConfig.livretScolaire = { secret: 'secretosmose', tokenLifespan: '1h' };
    config.jwtConfig.poleEmploi = { secret: 'secretPoleEmploi', tokenLifespan: '1h' };

    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    config.logging.enabled = isBooleanFeatureEnabledElseDefault(process.env.LOG_ENABLED, false);
    config.logging.enableLogKnexQueries = false;
    config.logging.enableLogStartingEventDispatch = false;
    config.logging.enableLogEndingEventDispatch = false;

    config.caching.redisUrl = null;
    config.caching.redisCacheKeyLockTTL = 0;
    config.caching.redisCacheLockedWaitBeforeRetry = 0;

    config.sentry.enabled = false;
  }

  return config;
})();

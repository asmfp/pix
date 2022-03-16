// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationDetailsSerializer = require('../../infrastructure/serializers/jsonapi/certification-details-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationSerializer = require('../../infrastructure/serializers/jsonapi/certification-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const juryCertificationSerializer = require('../../infrastructure/serializers/jsonapi/jury-certification-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationCourseSerializer = require('../../infrastructure/serializers/jsonapi/certification-course-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certifiedProfileRepository = require('../../infrastructure/repositories/certified-profile-repository');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certifiedProfileSerializer = require('../../infrastructure/serializers/jsonapi/certified-profile-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainTran... Remove this comment to see the full error message
const DomainTransaction = require('../../infrastructure/DomainTransaction');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'extractLoc... Remove this comment to see the full error message
const { extractLocaleFromRequest } = require('../../infrastructure/utils/request-response-utils');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const isEndTestScreenRemovalService = require('../../domain/services/end-test-screen-removal-service');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async getCertificationDetails(request: any) {
    const certificationCourseId = request.params.id;
    const certificationDetails = await usecases.getCertificationDetails({ certificationCourseId });

    return certificationDetailsSerializer.serialize(certificationDetails);
  },

  async getJuryCertification(request: any) {
    const certificationCourseId = request.params.id;
    const juryCertification = await usecases.getJuryCertification({ certificationCourseId });
    return juryCertificationSerializer.serialize(juryCertification);
  },

  async update(request: any) {
    const certificationCourseId = request.params.id;
    const userId = request.auth.credentials.userId;
    const command = await certificationSerializer.deserializeCertificationCandidateModificationCommand(
      request.payload,
      certificationCourseId,
      userId
    );
    await usecases.correctCandidateIdentityInCertificationCourse({ command });
    const updatedCertificationCourse = await usecases.getCertificationCourse({
      userId: command.userId,
      certificationCourseId: command.certificationCourseId,
    });
    return certificationSerializer.serializeFromCertificationCourse(updatedCertificationCourse);
  },

  async save(request: any, h: any) {
    const userId = request.auth.credentials.userId;
    const accessCode = request.payload.data.attributes['access-code'];
    const sessionId = request.payload.data.attributes['session-id'];
    const locale = extractLocaleFromRequest(request);

    const { created, certificationCourse } = await DomainTransaction.execute((domainTransaction: any) => {
      return usecases.retrieveLastOrCreateCertificationCourse({
        domainTransaction,
        sessionId,
        accessCode,
        userId,
        locale,
      });
    });

    const serialized = await certificationCourseSerializer.serialize(certificationCourse);

    return created ? h.response(serialized).created() : serialized;
  },

  async get(request: any) {
    const certificationCourseId = request.params.id;
    const userId = request.auth.credentials.userId;

    const certificationCourse = await usecases.getCertificationCourse({ userId, certificationCourseId });
    const isEndScreenRemoveEnabled = await isEndTestScreenRemovalService.isEndTestScreenRemovalEnabledBySessionId(
      certificationCourse.getSessionId()
    );
    return certificationCourseSerializer.serialize(certificationCourse, isEndScreenRemoveEnabled);
  },

  async getCertifiedProfile(request: any) {
    const certificationCourseId = request.params.id;
    const certifiedProfile = await certifiedProfileRepository.get(certificationCourseId);
    return certifiedProfileSerializer.serialize(certifiedProfile);
  },

  async cancel(request: any, h: any) {
    const certificationCourseId = request.params.id;
    await usecases.cancelCertificationCourse({ certificationCourseId });
    return h.response().code(200);
  },

  async uncancel(request: any, h: any) {
    const certificationCourseId = request.params.id;
    await usecases.uncancelCertificationCourse({ certificationCourseId });
    return h.response().code(200);
  },
};

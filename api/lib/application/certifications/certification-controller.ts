// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'events'.
const events = require('../../domain/events');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const privateCertificateSerializer = require('../../infrastructure/serializers/jsonapi/private-certificate-serializer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const shareableCertificateSerializer = require('../../infrastructure/serializers/jsonapi/shareable-certificate-serializer');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationAttestationPdf = require('../../infrastructure/utils/pdf/certification-attestation-pdf');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findUserCertifications(request: any) {
    const userId = request.auth.credentials.userId;

    const privateCertificates = await usecases.findUserPrivateCertificates({ userId });
    return privateCertificateSerializer.serialize(privateCertificates);
  },

  async getCertification(request: any) {
    const userId = request.auth.credentials.userId;
    const certificationId = request.params.id;

    const privateCertificate = await usecases.getPrivateCertificate({
      userId,
      certificationId,
    });
    return privateCertificateSerializer.serialize(privateCertificate);
  },

  async getCertificationByVerificationCode(request: any) {
    const verificationCode = request.payload.verificationCode;

    const shareableCertificate = await usecases.getShareableCertificate({ verificationCode });
    return shareableCertificateSerializer.serialize(shareableCertificate);
  },

  async getPDFAttestation(request: any, h: any) {
    const userId = request.auth.credentials.userId;
    const certificationId = request.params.id;
    const attestation = await usecases.getCertificationAttestation({
      userId,
      certificationId,
    });

    const { buffer } = await certificationAttestationPdf.getCertificationAttestationsPdfBuffer({
      certificates: [attestation],
    });

    const fileName = `attestation-pix-${moment(attestation.deliveredAt).format('YYYYMMDD')}.pdf`;
    return h
      .response(buffer)
      .header('Content-Disposition', `attachment; filename=${fileName}`)
      .header('Content-Type', 'application/pdf');
  },

  async neutralizeChallenge(request: any, h: any) {
    const challengeRecId = request.payload.data.attributes.challengeRecId;
    const certificationCourseId = request.payload.data.attributes.certificationCourseId;
    const juryId = request.auth.credentials.userId;
    const event = await usecases.neutralizeChallenge({
      challengeRecId,
      certificationCourseId,
      juryId,
    });
    await events.eventDispatcher.dispatch(event);
    return h.response().code(204);
  },

  async deneutralizeChallenge(request: any, h: any) {
    const challengeRecId = request.payload.data.attributes.challengeRecId;
    const certificationCourseId = request.payload.data.attributes.certificationCourseId;
    const juryId = request.auth.credentials.userId;
    const event = await usecases.deneutralizeChallenge({
      challengeRecId,
      certificationCourseId,
      juryId,
    });
    await events.eventDispatcher.dispatch(event);
    return h.response().code(204);
  },
};

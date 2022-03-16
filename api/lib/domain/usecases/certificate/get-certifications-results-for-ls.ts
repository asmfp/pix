// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
const CertificationsResults = require('../../read-models/livret-scolaire/CertificationsResults');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
const Competence = require('../../read-models/livret-scolaire/Competence');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sortBy'.
const sortBy = require('lodash/sortBy');

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getCertificationsResultsForLS({
  uai,
  certificationLsRepository,
  competenceTreeRepository
}: any) {
  // @ts-expect-error ts-migrate(2583) FIXME: Cannot find name 'Promise'. Do you need to change ... Remove this comment to see the full error message
  const [referential, certifications] = await Promise.all([
    competenceTreeRepository.get(),
    certificationLsRepository.getCertificatesByOrganizationUAI(uai),
  ]);

  const areas = referential.areas;
  const competences = areas.flatMap(({
    competences,
    code,
    title
  }: any) =>
    competences.map((competence: any) => {
      const area = { id: code, name: title };
      return new Competence({ area, id: competence.index, name: competence.name });
    })
  );
  const sortedCompetences = sortBy(competences, 'id');

  return new CertificationsResults({ certifications, competences: sortedCompetences });
};

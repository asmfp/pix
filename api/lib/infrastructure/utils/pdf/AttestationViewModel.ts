// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sortBy'.
const sortBy = require('lodash/sortBy');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'moment'.
const moment = require('moment');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const getImagePathByBadgeKey = require('./get-image-path-by-badge-key');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'toArrayOfF... Remove this comment to see the full error message
const { toArrayOfFixedLengthStringsConservingWords } = require('../string-utils');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Attestatio... Remove this comment to see the full error message
class AttestationViewModel {
  _hasAcquiredAnyComplementaryCertifications: any;
  _hasAcquiredCleaCertification: any;
  _hasAcquiredPixPlusDroitCertification: any;
  _hasAcquiredPixPlusEduCertification: any;
  _maxReachableLevelOnCertificationDate: any;
  absoluteMaxLevelIndication: any;
  birth: any;
  birthplace: any;
  certificationCenter: any;
  certificationDate: any;
  cleaCertificationImagePath: any;
  competenceDetailViewModels: any;
  fullName: any;
  maxLevel: any;
  maxReachableLevelIndication: any;
  maxReachableScore: any;
  pixPlusDroitCertificationImagePath: any;
  pixPlusEduCertificationImagePath: any;
  pixPlusEduTemporaryBadgeMessage: any;
  pixScore: any;
  verificationCode: any;
  constructor({
    pixScore,
    maxReachableScore,
    maxLevel,
    absoluteMaxLevelIndication,
    maxReachableLevelIndication,
    fullName,
    birthplace,
    birth,
    certificationCenter,
    certificationDate,
    verificationCode,
    maxReachableLevelOnCertificationDate,
    hasAcquiredAnyComplementaryCertifications,
    cleaCertificationImagePath,
    hasAcquiredPixPlusDroitCertification,
    hasAcquiredCleaCertification,
    pixPlusDroitCertificationImagePath,
    hasAcquiredPixPlusEduCertification,
    pixPlusEduCertificationImagePath,
    pixPlusEduTemporaryBadgeMessage,
    competenceDetailViewModels
  }: any) {
    this.pixScore = pixScore;
    this.maxReachableScore = maxReachableScore;
    this.maxLevel = maxLevel;
    this.absoluteMaxLevelIndication = absoluteMaxLevelIndication;
    this.maxReachableLevelIndication = maxReachableLevelIndication;
    this.fullName = fullName;
    this.birthplace = birthplace;
    this.birth = birth;
    this.certificationCenter = certificationCenter;
    this.certificationDate = certificationDate;
    this.cleaCertificationImagePath = cleaCertificationImagePath;
    this.pixPlusDroitCertificationImagePath = pixPlusDroitCertificationImagePath;
    this.pixPlusEduCertificationImagePath = pixPlusEduCertificationImagePath;
    this.pixPlusEduTemporaryBadgeMessage = pixPlusEduTemporaryBadgeMessage;
    this.competenceDetailViewModels = competenceDetailViewModels;
    this.verificationCode = verificationCode;
    this._maxReachableLevelOnCertificationDate = maxReachableLevelOnCertificationDate;
    this._hasAcquiredAnyComplementaryCertifications = hasAcquiredAnyComplementaryCertifications;
    this._hasAcquiredPixPlusDroitCertification = hasAcquiredPixPlusDroitCertification;
    this._hasAcquiredCleaCertification = hasAcquiredCleaCertification;
    this._hasAcquiredPixPlusEduCertification = hasAcquiredPixPlusEduCertification;
  }

  shouldDisplayComplementaryCertifications() {
    return this._hasAcquiredAnyComplementaryCertifications;
  }

  shouldDisplayAbsoluteMaxLevelIndication() {
    return this._maxReachableLevelOnCertificationDate < 8;
  }

  shouldDisplayCleaCertification() {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(this._hasAcquiredCleaCertification);
  }

  shouldDisplayPixPlusDroitCertification() {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(this._hasAcquiredPixPlusDroitCertification);
  }

  shouldDisplayPixPlusEduCertification() {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Boolean'.
    return Boolean(this._hasAcquiredPixPlusEduCertification);
  }

  static from(certificate: any) {
    const pixScore = certificate.pixScore.toString();
    const maxReachableScore = certificate.maxReachableScore.toString() + '*';

    const maxLevel = `(niveaux sur ${certificate.maxReachableLevelOnCertificationDate})`;
    const maxReachableLevelIndication = `* À la date d’obtention de cette certification, le nombre maximum de pix atteignable était de ${certificate.maxReachableScore}, correspondant au niveau ${certificate.maxReachableLevelOnCertificationDate}.`;
    const absoluteMaxLevelIndication =
      'Lorsque les 8 niveaux du référentiel Pix seront disponibles, ce nombre maximum sera de 1024 pix.';

    const verificationCode = certificate.verificationCode;

    const fullName = `${certificate.firstName} ${certificate.lastName}`;
    const birthplace = certificate.birthplace ? ` à ${certificate.birthplace}` : '';
    const birth = _formatDate(certificate.birthdate) + birthplace;
    const certificationCenter = certificate.certificationCenter;
    const certificationDate = _formatDate(certificate.deliveredAt);

    const maxReachableLevelOnCertificationDate = certificate.maxReachableLevelOnCertificationDate < 8;
    const hasAcquiredAnyComplementaryCertifications = certificate.hasAcquiredAnyComplementaryCertifications();

    let hasAcquiredCleaCertification = false;
    let cleaCertificationImagePath;
    if (certificate.getAcquiredCleaCertification()) {
      hasAcquiredCleaCertification = true;
      cleaCertificationImagePath = getImagePathByBadgeKey(certificate.getAcquiredCleaCertification());
    }

    let hasAcquiredPixPlusDroitCertification = false;
    let pixPlusDroitCertificationImagePath;
    if (certificate.getAcquiredPixPlusDroitCertification()) {
      hasAcquiredPixPlusDroitCertification = true;
      pixPlusDroitCertificationImagePath = getImagePathByBadgeKey(certificate.getAcquiredPixPlusDroitCertification());
    }

    let hasAcquiredPixPlusEduCertification = false;
    let pixPlusEduCertificationImagePath;
    let pixPlusEduTemporaryBadgeMessage;
    if (certificate.getAcquiredPixPlusEduCertification()) {
      hasAcquiredPixPlusEduCertification = true;
      const { partnerKey, temporaryPartnerKey } = certificate.getAcquiredPixPlusEduCertification();
      pixPlusEduCertificationImagePath = getImagePathByBadgeKey(partnerKey || temporaryPartnerKey);
      if (temporaryPartnerKey && !partnerKey) {
        pixPlusEduTemporaryBadgeMessage = toArrayOfFixedLengthStringsConservingWords(
          `Vous avez obtenu le niveau “${certificate.getPixPlusEduBadgeDisplayName()}” dans le cadre du volet 1 de la certification Pix+Édu. Votre niveau final sera déterminé à l’issue du volet 2`,
          45
        );
      }
    }

    const sortedCompetenceTree = sortBy(certificate.resultCompetenceTree.areas, 'code');
    const competenceDetailViewModels = sortedCompetenceTree.flatMap((area: any) => {
      return area.resultCompetences.map((competence: any) => {
        return CompetenceDetailViewModel.from(competence);
      });
    });

    return new AttestationViewModel({
      pixScore,
      maxReachableScore,
      maxLevel,
      verificationCode,
      maxReachableLevelIndication,
      absoluteMaxLevelIndication,
      fullName,
      birthplace,
      birth,
      certificationCenter,
      certificationDate,
      maxReachableLevelOnCertificationDate,
      hasAcquiredAnyComplementaryCertifications,
      cleaCertificationImagePath,
      pixPlusDroitCertificationImagePath,
      pixPlusEduCertificationImagePath,
      pixPlusEduTemporaryBadgeMessage,
      hasAcquiredPixPlusDroitCertification,
      hasAcquiredCleaCertification,
      hasAcquiredPixPlusEduCertification,
      competenceDetailViewModels,
    });
  }
}

class CompetenceDetailViewModel {
  _levelValue: any;
  level: any;
  constructor({
    level,
    levelValue
  }: any) {
    this.level = level;
    this._levelValue = levelValue;
  }

  shouldBeDisplayed() {
    return this._levelValue > 0;
  }

  static from(competence: any) {
    return new CompetenceDetailViewModel({
      level: competence.level.toString(),
      levelValue: competence.level,
    });
  }
}

function _formatDate(date: any) {
  return moment(date).locale('fr').format('LL');
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = AttestationViewModel;

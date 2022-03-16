// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DomainErro... Remove this comment to see the full error message
class DomainError extends Error {
  code: any;
  meta: any;
  constructor(message: any, code: any, meta: any) {
    super(message);
    this.code = code;
    this.meta = meta;
  }
}

class AccountRecoveryDemandNotCreatedError extends DomainError {
  constructor(message = "La demande de récupération de compte n'a pas pu être générée.") {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
class TargetProfileCannotBeCreated extends DomainError {
  constructor(message = 'Erreur lors de la création du profil cible.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
class AlreadyExistingEntityError extends DomainError {
  constructor(message = 'L’entité existe déjà.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
class AlreadyExistingMembershipError extends DomainError {
  constructor(message = 'Le membership existe déjà.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Applicatio... Remove this comment to see the full error message
class ApplicationWithInvalidClientIdError extends DomainError {
  constructor(message = 'The client ID or secret are invalid.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Applicatio... Remove this comment to see the full error message
class ApplicationWithInvalidClientSecretError extends DomainError {
  constructor(message = 'The client secret is invalid.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Applicatio... Remove this comment to see the full error message
class ApplicationScopeNotAllowedError extends DomainError {
  constructor(message = 'The scope is invalid.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
class AuthenticationMethodNotFoundError extends DomainError {
  constructor(message = 'Authentication method not found.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
class AuthenticationMethodAlreadyExistsError extends DomainError {
  constructor(message = 'Authentication method already exists.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NoCertific... Remove this comment to see the full error message
class NoCertificationAttestationForDivisionError extends DomainError {
  constructor(division: any) {
    const message = `Aucune attestation de certification pour la classe ${division}.`;
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
class OrganizationAlreadyExistError extends DomainError {
  constructor(message = "L'organisation existe déjà.") {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
class OrganizationNotFoundError extends DomainError {
  constructor(message = 'Organisation non trouvée.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
class OrganizationWithoutEmailError extends DomainError {
  constructor(message = 'Organisation sans email renseigné.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ManyOrgani... Remove this comment to see the full error message
class ManyOrganizationsFoundError extends DomainError {
  constructor(message = 'Plusieurs organisations ont été retrouvées.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
class AlreadyExistingOrganizationInvitationError extends DomainError {
  constructor(message = "L'invitation de l'organisation existe déjà.") {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AlreadyAcc... Remove this comment to see the full error message
class AlreadyAcceptedOrCancelledOrganizationInvitationError extends DomainError {
  constructor(message = "L'invitation à rejoindre l'organisation a déjà été acceptée ou annulée.") {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AlreadyRat... Remove this comment to see the full error message
class AlreadyRatedAssessmentError extends DomainError {
  constructor(message = 'Cette évaluation a déjà été évaluée.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
class AssessmentResultNotCreatedError extends DomainError {
  constructor(message = "L'assessment result n'a pas pu être généré.") {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
class AlreadyRegisteredEmailAndUsernameError extends DomainError {
  constructor(message = 'Cette adresse e-mail et cet identifiant sont déjà utilisés.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
class AlreadyRegisteredEmailError extends DomainError {
  constructor(message = 'Cette adresse e-mail est déjà utilisée.', code = 'ACCOUNT_WITH_EMAIL_ALREADY_EXISTS') {
    super(message, code);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AlreadyReg... Remove this comment to see the full error message
class AlreadyRegisteredUsernameError extends DomainError {
  constructor(message = 'Cet identifiant est déjà utilisé.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
class AlreadyExistingCampaignParticipationError extends DomainError {
  constructor(message = 'Une participation à cette campagne existe déjà.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AlreadySha... Remove this comment to see the full error message
class AlreadySharedCampaignParticipationError extends DomainError {
  constructor(message = 'Ces résultats de campagne ont déjà été partagés.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CancelledO... Remove this comment to see the full error message
class CancelledOrganizationInvitationError extends DomainError {
  constructor(
    message = "L'invitation à cette organisation a été annulée.",
    code = 'CANCELLED_ORGANIZATION_INVITATION_CODE'
  ) {
    super(message, code);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Uncancella... Remove this comment to see the full error message
class UncancellableOrganizationInvitationError extends DomainError {
  constructor(
    message = "L'invitation à cette organisation ne peut pas être annulée.",
    code = 'UNCANCELLABLE_ORGANIZATION_INVITATION_CODE'
  ) {
    super(message, code);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CantImprov... Remove this comment to see the full error message
class CantImproveCampaignParticipationError extends DomainError {
  constructor(message = 'Une campagne de collecte de profils ne peut pas être retentée.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NoCampaign... Remove this comment to see the full error message
class NoCampaignParticipationForUserAndCampaign extends DomainError {
  constructor(message = "L'utilisateur n'a pas encore participé à la campagne") {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NoStagesFo... Remove this comment to see the full error message
class NoStagesForCampaign extends DomainError {
  constructor(message = 'The campaign does not have stages.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
class AuthenticationKeyForPoleEmploiTokenExpired extends DomainError {
  constructor(message = 'This authentication key for pole emploi token has expired.') {
    super(message);
  }
}
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AccountRec... Remove this comment to see the full error message
class AccountRecoveryDemandExpired extends DomainError {
  constructor(message = 'This account recovery demand has expired.') {
    super(message);
  }
}

class AccountRecoveryUserAlreadyConfirmEmail extends DomainError {
  constructor(message = 'This user has already a confirmed email.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SchoolingR... Remove this comment to see the full error message
class SchoolingRegistrationsCouldNotBeSavedError extends DomainError {
  constructor(message = 'An error occurred during process') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MultipleSc... Remove this comment to see the full error message
class MultipleSchoolingRegistrationsWithDifferentNationalStudentIdError extends DomainError {
  constructor(message = 'Multiple schooling registrations with different INE') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
class UserNotAuthorizedToUpdateCampaignError extends DomainError {
  constructor(message = "Cet utilisateur n'est pas autorisé à modifier cette campagne.") {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
class UserNotAuthorizedToCreateCampaignError extends DomainError {
  constructor(message = "Cet utilisateur n'est pas autorisé à créer une campagne.") {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
class UserNotAuthorizedToUpdateResourceError extends DomainError {
  constructor(message = "Cet utilisateur n'est pas autorisé à mettre à jour la ressource.") {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
class UserNotAuthorizedToGetCampaignResultsError extends DomainError {
  constructor(message = "Cet utilisateur n'est pas autorisé à récupérer les résultats de la campagne.") {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
class UserNotAuthorizedToGetCertificationCoursesError extends DomainError {
  constructor(message = "Cet utilisateur n'est pas autorisé à récupérer ces certification courses.") {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
class UserNotAuthorizedToGenerateUsernamePasswordError extends DomainError {
  constructor(message = "Cet utilisateur n'est pas autorisé à générer un identifiant et un mot de passe.") {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationCourseUpdateError extends DomainError {
  constructor(message = 'Échec lors la création ou de la mise à jour du test de certification.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationCourseNotPublishableError extends DomainError {
  constructor(message = "Une Certification avec le statut 'started' ou 'error' ne peut-être publiée.") {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'InvalidCer... Remove this comment to see the full error message
class InvalidCertificationCandidate extends DomainError {
  key: any;
  why: any;
  constructor({
    message = 'Candidat de certification invalide.',
    error
  }: any) {
    super(message);
    this.key = error.key;
    this.why = error.why;
  }

  static fromJoiErrorDetail(errorDetail: any) {
    const error = {};
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'key' does not exist on type '{}'.
    error.key = errorDetail.context.key;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'why' does not exist on type '{}'.
    error.why = null;
    const type = errorDetail.type;
    const value = errorDetail.context.value;
    const allowedValues = errorDetail.context.valids;

    if (type === 'any.required') {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'why' does not exist on type '{}'.
      error.why = 'required';
    }
    if (type === 'date.format') {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'why' does not exist on type '{}'.
      error.why = 'date_format';
    }
    if (type === 'date.base') {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'why' does not exist on type '{}'.
      error.why = 'not_a_date';
    }
    if (type === 'string.email') {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'why' does not exist on type '{}'.
      error.why = 'email_format';
    }
    if (type === 'string.base') {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'why' does not exist on type '{}'.
      error.why = 'not_a_string';
    }
    if (type === 'number.base' || type === 'number.integer') {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'why' does not exist on type '{}'.
      error.why = 'not_a_number';
    }
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'key' does not exist on type '{}'.
    if (type === 'any.only' && error.key === 'sex') {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'why' does not exist on type '{}'.
      error.why = 'not_a_sex_code';
    }
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'key' does not exist on type '{}'.
    if (type === 'any.only' && error.key === 'billingMode') {
      if (allowedValues.length === 1 && allowedValues[0] === null) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'why' does not exist on type '{}'.
        error.why = 'billing_mode_not_null';
      } else {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'why' does not exist on type '{}'.
        error.why = value !== null ? 'not_a_billing_mode' : 'required';
      }
    }
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'key' does not exist on type '{}'.
    if (type === 'any.only' && error.key === 'prepaymentCode') {
      if (allowedValues.length === 1 && allowedValues[0] === null) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'why' does not exist on type '{}'.
        error.why = 'prepayment_code_not_null';
      }
    }
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'key' does not exist on type '{}'.
    if (type === 'any.required' && error.key === 'prepaymentCode') {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'why' does not exist on type '{}'.
      error.why = 'prepayment_code_null';
    }
    return new InvalidCertificationCandidate({ error });
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'InvalidCer... Remove this comment to see the full error message
class InvalidCertificationReportForFinalization extends DomainError {
  constructor(message = 'Échec lors de la validation du certification course') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'InvalidCer... Remove this comment to see the full error message
class InvalidCertificationIssueReportForSaving extends DomainError {
  constructor(message = 'Échec lors de la validation du signalement') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Deprecated... Remove this comment to see the full error message
class DeprecatedCertificationIssueReportSubcategory extends DomainError {
  constructor(message = 'La catégorie de signalement choisie est dépréciée.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SendingEma... Remove this comment to see the full error message
class SendingEmailToResultRecipientError extends DomainError {
  constructor(failedEmailsRecipients: any) {
    super(`Échec lors de l'envoi des résultats au(x) destinataire(s) : ${failedEmailsRecipients.join(', ')}`);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Competence... Remove this comment to see the full error message
class CompetenceResetError extends DomainError {
  constructor(remainingDaysBeforeReset: any) {
    super(`Il reste ${remainingDaysBeforeReset} jours avant de pouvoir réinitiliser la compétence.`);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
class AssessmentEndedError extends DomainError {
  constructor(message = 'Evaluation terminée.') {
    super(message);
  }

  getErrorMessage() {
    return {
      data: {
        error: ["L'évaluation est terminée. Nous n'avons plus de questions à vous poser."],
      },
    };
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignCo... Remove this comment to see the full error message
class CampaignCodeError extends DomainError {
  constructor(message = "Le code campagne n'existe pas.") {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificateVerificationCodeGenerationTooManyTrials extends DomainError {
  constructor(numberOfTrials: any) {
    super(`Could not find an available certificate verification code after ${numberOfTrials} trials`);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationEndedBySupervisorError extends DomainError {
  constructor(message = 'Le surveillant a mis fin à votre test de certification.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Supervisor... Remove this comment to see the full error message
class SupervisorAccessNotAuthorizedError extends DomainError {
  constructor(
    message = "Cette session est organisée dans un centre de certification pour lequel l'espace surveillant n'a pas été activé par Pix."
  ) {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationCandidateAlreadyLinkedToUserError extends DomainError {
  constructor(message = 'Ce candidat de certification a déjà été lié à un utilisateur.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationCandidateByPersonalInfoNotFoundError extends DomainError {
  constructor(message = "Aucun candidat de certification n'a été trouvé avec ces informations.") {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MatchingRe... Remove this comment to see the full error message
class MatchingReconciledStudentNotFoundError extends DomainError {
  code: any;
  constructor(message = "Le candidat de certification ne correspond pas à l'étudiant trouvé avec ces informations.") {
    super(message);
    this.code = 'MATCHING_RECONCILED_STUDENT_NOT_FOUND';
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationCandidateByPersonalInfoTooManyMatchesError extends DomainError {
  constructor(message = "Plus d'un candidat de certification a été trouvé avec ces informations.") {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationCandidateCreationOrUpdateError extends DomainError {
  constructor(message = 'Echec lors la création ou de la mise à jour du candidat de certification.') {
    super(message);
  }
}

class CertificationCandidateDeletionError extends DomainError {
  constructor(message = 'Echec lors de la suppression du candidat de certification.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationCandidateMultipleUserLinksWithinSessionError extends DomainError {
  constructor(
    message = "Il est interdit de lier un utilisateur à plusieurs candidats de certification au sein d'une même session."
  ) {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationCandidatePersonalInfoFieldMissingError extends DomainError {
  constructor(message = 'Information obligatoire manquante du candidat de certification.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationCandidatePersonalInfoWrongFormat extends DomainError {
  constructor(message = 'Information transmise par le candidat de certification au mauvais format.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationCandidateForbiddenDeletionError extends DomainError {
  constructor(message = 'Il est interdit de supprimer un candidat de certification déjà lié à un utilisateur.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationCandidateAddError extends DomainError {
  constructor(message = 'Candidat de certification invalide.') {
    super(message);
  }

  static fromInvalidCertificationCandidateError(error: any) {
    let message = 'Candidat de certification invalide.';

    if (error.why === 'not_a_billing_mode') {
      message = `Le champ “Tarification part Pix” ne peut contenir qu'une des valeurs suivantes: Gratuite, Payante ou Prépayée.`;
    } else if (error.why === 'prepayment_code_null') {
      message = `Le champ “Code de prépaiement” est obligatoire puisque l’option “Prépayée” a été sélectionnée pour ce candidat.`;
    } else if (error.why === 'prepayment_code_not_null') {
      message = `Le champ “Code de prépaiement” doit rester vide puisque l’option “Prépayée” n'a pas été sélectionnée pour ce candidat.`;
    }

    return new CertificationCandidateAddError(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationCandidatesImportError extends DomainError {
  // @ts-expect-error ts-migrate(7031) FIXME: Binding element 'code' implicitly has an 'any' typ... Remove this comment to see the full error message
  constructor({ message = "Quelque chose s'est mal passé. Veuillez réessayer", code = null } = {}) {
    super(message, code);
  }

  static fromInvalidCertificationCandidateError(error: any, keyLabelMap: any, lineNumber: any) {
    const label = error.key in keyLabelMap ? keyLabelMap[error.key].replace(/\* /, '') : 'none';
    const linePortion = `Ligne ${lineNumber} :`;
    let contentPortion = "Quelque chose s'est mal passé. Veuillez réessayer";

    if (error.why === 'not_a_date' || error.why === 'date_format') {
      contentPortion = `Le champ “${label}” doit être au format jj/mm/aaaa.`;
    } else if (error.why === 'email_format') {
      contentPortion = `Le champ “${label}” doit être au format email.`;
    } else if (error.why === 'not_a_string') {
      contentPortion = `Le champ “${label}” doit être une chaîne de caractères.`;
    } else if (error.why === 'not_a_number') {
      contentPortion = `Le champ “${label}” doit être un nombre.`;
    } else if (error.why === 'required') {
      contentPortion = `Le champ “${label}” est obligatoire.`;
    } else if (error.why === 'not_a_sex_code') {
      contentPortion = `Le champ “${label}” accepte les valeurs "M" pour un homme ou "F" pour une femme.`;
    } else if (error.why === 'not_a_billing_mode') {
      contentPortion = `Le champ “${label}” ne peut contenir qu'une des valeurs suivantes: Gratuite, Payante ou Prépayée.`;
    } else if (error.why === 'prepayment_code_null') {
      contentPortion = `Le champ “${label}” est obligatoire puisque l’option “Prépayée” a été sélectionnée pour ce candidat.`;
    } else if (error.why === 'prepayment_code_not_null') {
      contentPortion = `Le champ “${label}” doit rester vide puisque l’option “Prépayée” n'a pas été sélectionnée pour ce candidat.`;
    }

    return new CertificationCandidatesImportError({ message: `${linePortion} ${contentPortion}` });
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationComputeError extends DomainError {
  constructor(message = 'Erreur lors du calcul de la certification.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationCenterMembershipCreationError extends DomainError {
  constructor(message = 'Erreur lors de la création du membership de centre de certification.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationCenterMembershipDisableError extends DomainError {
  constructor(message = 'Erreur lors de la mise à jour du membership de centre de certification.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ChallengeA... Remove this comment to see the full error message
class ChallengeAlreadyAnsweredError extends DomainError {
  constructor(message = 'La question a déjà été répondue.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ChallengeN... Remove this comment to see the full error message
class ChallengeNotAskedError extends DomainError {
  constructor(message = 'La question à laquelle vous essayez de répondre ne vous a pas été proposée.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ChallengeT... Remove this comment to see the full error message
class ChallengeToBeNeutralizedNotFoundError extends DomainError {
  constructor() {
    super("La question à neutraliser n'a pas été posée lors du test de certification");
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ChallengeT... Remove this comment to see the full error message
class ChallengeToBeDeneutralizedNotFoundError extends DomainError {
  constructor() {
    super("La question à dé-neutraliser n'a pas été posée lors du test de certification");
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CsvParsing... Remove this comment to see the full error message
class CsvParsingError extends DomainError {
  constructor(message = "Les données n'ont pas pu être parsées.") {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
class EntityValidationError extends DomainError {
  invalidAttributes: any;
  constructor({
    invalidAttributes
  }: any) {
    super("Échec de validation de l'entité.");
    this.invalidAttributes = invalidAttributes;
  }

  static fromJoiErrors(joiErrors: any) {
    const invalidAttributes = joiErrors.map((error: any) => {
      return { attribute: error.context.key, message: error.message };
    });
    return new EntityValidationError({ invalidAttributes });
  }

  static fromMultipleEntityValidationErrors(entityValidationErrors: any) {
    const invalidAttributes = entityValidationErrors.reduce((invalidAttributes: any, entityValidationError: any) => {
      invalidAttributes.push(...entityValidationError.invalidAttributes);
      return invalidAttributes;
    }, []);
    return new EntityValidationError({ invalidAttributes });
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ForbiddenA... Remove this comment to see the full error message
class ForbiddenAccess extends DomainError {
  constructor(message = 'Accès non autorisé.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'ImproveCompetenceEvaluationF... Remove this comment to see the full error message
class ImproveCompetenceEvaluationForbiddenError extends DomainError {
  constructor(message = 'Le niveau maximum est déjà atteint pour cette compétence.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'InvalidExt... Remove this comment to see the full error message
class InvalidExternalUserTokenError extends DomainError {
  constructor(message = 'L’idToken de l’utilisateur externe est invalide.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'InvalidPas... Remove this comment to see the full error message
class InvalidPasswordForUpdateEmailError extends DomainError {
  constructor(message = 'Le mot de passe que vous avez saisi est invalide.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'InvalidRes... Remove this comment to see the full error message
class InvalidResultRecipientTokenError extends DomainError {
  constructor(message = 'Le token de récupération des résultats de la session de certification est invalide.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'InvalidSes... Remove this comment to see the full error message
class InvalidSessionResultError extends DomainError {
  constructor(message = 'Le token de récupération des résultats de la session de certification est invalide.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'InvalidTem... Remove this comment to see the full error message
class InvalidTemporaryKeyError extends DomainError {
  constructor(message = 'Demande de réinitialisation invalide.') {
    super(message);
  }

  getErrorMessage() {
    return {
      data: {
        temporaryKey: ['Cette demande de réinitialisation n’est pas valide.'],
      },
    };
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Unexpected... Remove this comment to see the full error message
class UnexpectedUserAccountError extends DomainError {
  code: any;
  meta: any;
  constructor({
    message = "Ce compte utilisateur n'est pas celui qui est attendu.",
    code,
    meta
  }: any) {
    super(message);
    this.code = code;
    this.meta = meta;
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
class MembershipCreationError extends DomainError {
  constructor(message = 'Erreur lors de la création du membership à une organisation.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
class MembershipUpdateError extends DomainError {
  constructor(message = 'Erreur lors de la mise à jour du membership à une organisation.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MissingOrI... Remove this comment to see the full error message
class MissingOrInvalidCredentialsError extends DomainError {
  constructor(message = 'Missing or invalid credentials') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MissingAtt... Remove this comment to see the full error message
class MissingAttributesError extends DomainError {
  constructor(message = 'Attributs manquants.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MissingAss... Remove this comment to see the full error message
class MissingAssessmentId extends DomainError {
  constructor(message = 'AssessmentId manquant ou incorrect') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
class AssessmentNotCompletedError extends DomainError {
  constructor(message = "Cette évaluation n'est pas terminée.") {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotEligibl... Remove this comment to see the full error message
class NotEligibleCandidateError extends DomainError {
  constructor(message = 'Erreur, candidat non éligible à la certification.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'NotFoundError'.
class NotFoundError extends DomainError {
  constructor(message = 'Erreur, ressource introuvable.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NoCertific... Remove this comment to see the full error message
class NoCertificationResultForDivision extends DomainError {
  constructor(message = 'Aucun résultat de certification pour cette classe.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ObjectVali... Remove this comment to see the full error message
class ObjectValidationError extends DomainError {
  constructor(message = 'Erreur, objet non valide.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
class OrganizationArchivedError extends DomainError {
  constructor(message = "L'organisation est archivée.") {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserCouldN... Remove this comment to see the full error message
class UserCouldNotBeReconciledError extends DomainError {
  constructor(message = "Cet utilisateur n'a pas pu être rattaché à une organisation.") {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserShould... Remove this comment to see the full error message
class UserShouldChangePasswordError extends DomainError {
  constructor(message = 'Erreur, vous devez changer votre mot de passe.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SchoolingR... Remove this comment to see the full error message
class SchoolingRegistrationAlreadyLinkedToUserError extends DomainError {
  code: any;
  meta: any;
  constructor(message = "L'élève est déjà rattaché à un compte utilisateur.", code: any, meta: any) {
    super(message);
    this.code = code;
    this.meta = meta;
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SchoolingR... Remove this comment to see the full error message
class SchoolingRegistrationAlreadyLinkedToInvalidUserError extends DomainError {
  constructor(message = 'Élève rattaché avec un compte invalide.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserAlread... Remove this comment to see the full error message
class UserAlreadyExistsWithAuthenticationMethodError extends DomainError {
  constructor(message = 'Il existe déjà un compte qui possède cette méthode d‘authentification.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
class UserNotAuthorizedToCreateResourceError extends DomainError {
  constructor(message = "Cet utilisateur n'est pas autorisé à créer la ressource.") {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserOrgaSe... Remove this comment to see the full error message
class UserOrgaSettingsCreationError extends DomainError {
  constructor(message = 'Erreur lors de la création des paramètres utilisateur relatifs à Pix Orga.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotMem... Remove this comment to see the full error message
class UserNotMemberOfOrganizationError extends DomainError {
  constructor(message = "L'utilisateur n'est pas membre de l'organisation.") {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'FileValida... Remove this comment to see the full error message
class FileValidationError extends DomainError {
  code: any;
  meta: any;
  constructor(code: any, meta: any) {
    super('An error occurred, file is invalid');
    this.code = code;
    this.meta = meta;
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PasswordNo... Remove this comment to see the full error message
class PasswordNotMatching extends DomainError {
  constructor(message = 'Mauvais mot de passe.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'PasswordRe... Remove this comment to see the full error message
class PasswordResetDemandNotFoundError extends DomainError {
  constructor(message = "La demande de réinitialisation de mot de passe n'existe pas.") {
    super(message);
  }

  getErrorMessage() {
    return {
      data: {
        temporaryKey: ['Cette demande de réinitialisation n’existe pas.'],
      },
    };
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SessionAlr... Remove this comment to see the full error message
class SessionAlreadyFinalizedError extends DomainError {
  constructor(message = 'Erreur, tentatives de finalisation multiples de la session.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SessionAlr... Remove this comment to see the full error message
class SessionAlreadyPublishedError extends DomainError {
  constructor(message = 'La session est déjà publiée.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SessionNot... Remove this comment to see the full error message
class SessionNotAccessible extends DomainError {
  constructor(message = "La session de certification n'est plus accessible.") {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'TargetProf... Remove this comment to see the full error message
class TargetProfileInvalidError extends DomainError {
  constructor(message = 'Le profil cible ne possède aucun acquis ciblé.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
class OrganizationTagNotFound extends DomainError {
  constructor(message = 'Le tag de l’organization n’existe pas.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserAlread... Remove this comment to see the full error message
class UserAlreadyLinkedToCandidateInSessionError extends DomainError {
  constructor(message = 'Cet utilisateur est déjà lié à un candidat de certification au sein de cette session.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ArchivedCa... Remove this comment to see the full error message
class ArchivedCampaignError extends DomainError {
  constructor(message = 'Cette campagne est déjà archivée.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
class UserNotAuthorizedToUpdateEmailError extends DomainError {
  constructor(message = 'User is not authorized to update email') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserHasAlr... Remove this comment to see the full error message
class UserHasAlreadyLeftSCO extends DomainError {
  constructor(message = 'User has already left SCO.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
class UserNotAuthorizedToAccessEntityError extends DomainError {
  constructor(message = 'User is not authorized to access ressource') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
class UserNotAuthorizedToCertifyError extends DomainError {
  constructor(message = 'User is not certifiable') {
    super(message);
  }

  getErrorMessage() {
    return {
      data: {
        authorization: ['Vous n’êtes pas autorisé à passer un test de certification.'],
      },
    };
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
class UserNotAuthorizedToUpdatePasswordError extends DomainError {
  constructor(message = "L'utilisateur n'est pas autorisé à mettre à jour ce mot de passe.") {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
class UserNotAuthorizedToRemoveAuthenticationMethod extends DomainError {
  constructor(message = "L'utilisateur n'est pas autorisé à supprimer cette méthode de connexion.") {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SchoolingR... Remove this comment to see the full error message
class SchoolingRegistrationDisabledError extends DomainError {
  constructor(message = "L'inscription de l'élève est désactivée dans l'organisation.") {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SchoolingR... Remove this comment to see the full error message
class SchoolingRegistrationNotFound extends NotFoundError {
  constructor(message = 'Aucune inscription d‘élève n‘a été trouvée.') {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserCantBe... Remove this comment to see the full error message
class UserCantBeCreatedError extends DomainError {
  constructor(message = "L'utilisateur ne peut pas être créé") {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UserNotFou... Remove this comment to see the full error message
class UserNotFoundError extends NotFoundError {
  constructor(message = 'Ce compte est introuvable.') {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    super(message);
  }

  getErrorMessage() {
    return {
      data: {
        id: ['Ce compte est introuvable.'],
      },
    };
  }
}

class UserAccountNotFoundForPoleEmploiError extends DomainError {
  authenticationKey: any;
  responseCode: any;
  constructor({
    message = "L'utilisateur n'a pas de compte Pix",
    responseCode,
    authenticationKey
  }: any) {
    super(message);
    this.responseCode = responseCode;
    this.authenticationKey = authenticationKey;
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'UnknownCou... Remove this comment to see the full error message
class UnknownCountryForStudentEnrollmentError extends DomainError {
  constructor(
    {
      firstName,
      lastName
    }: any,
    message = `L'élève ${firstName} ${lastName} a été inscrit avec un code pays de naissance invalide. Veuillez corriger ses informations sur l'espace PixOrga de l'établissement ou contacter le support Pix`
  ) {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'WrongDateF... Remove this comment to see the full error message
class WrongDateFormatError extends DomainError {
  constructor(message = 'Format de date invalide.') {
    super(message);
  }

  getErrorMessage() {
    return {
      data: {
        date: ['Veuillez renseigner une date de session au format (jj/mm/yyyy).'],
      },
    };
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CsvImportE... Remove this comment to see the full error message
class CsvImportError extends DomainError {
  code: any;
  meta: any;
  constructor(code: any, meta: any) {
    super('An error occurred during CSV import');
    this.code = code;
    this.meta = meta;
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SiecleXmlI... Remove this comment to see the full error message
class SiecleXmlImportError extends DomainError {
  code: any;
  meta: any;
  constructor(code: any, meta: any) {
    super('An error occurred during Siecle XML import');
    this.code = code;
    this.meta = meta;
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NotImpleme... Remove this comment to see the full error message
class NotImplementedError extends Error {
  constructor(message = 'Not implemented error.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'GeneratePo... Remove this comment to see the full error message
class GeneratePoleEmploiTokensError extends DomainError {
  status: any;
  title: any;
  constructor(message: any, status: any) {
    super(message);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'parseInt'.
    this.status = parseInt(status, 10);
    this.title = 'Pole emploi tokens generation fails.';
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'InvalidMem... Remove this comment to see the full error message
class InvalidMembershipOrganizationRoleError extends DomainError {
  constructor(message = 'Le rôle du membre est invalide.') {
    super(message);
  }
}

class TooManyRows extends DomainError {
  constructor(message = 'Plusieurs enregistrements ont été retrouvés.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Unexpected... Remove this comment to see the full error message
class UnexpectedPoleEmploiStateError extends DomainError {
  constructor(message = 'La valeur du paramètre state reçu ne correspond pas à celui envoyé.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'YamlParsin... Remove this comment to see the full error message
class YamlParsingError extends DomainError {
  constructor(message = "Une erreur s'est produite lors de l'interprétation des réponses.") {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'InvalidExt... Remove this comment to see the full error message
class InvalidExternalAPIResponseError extends DomainError {
  constructor(message = "L'API externe a renvoyé une réponse incorrecte.") {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CpfBirthIn... Remove this comment to see the full error message
class CpfBirthInformationValidationError extends DomainError {
  constructor(message: any) {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'NoOrganiza... Remove this comment to see the full error message
class NoOrganizationToAttach extends DomainError {
  constructor(message: any) {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'InvalidVer... Remove this comment to see the full error message
class InvalidVerificationCodeError extends DomainError {
  constructor(
    message = 'Le code de vérification renseigné ne correspond pas à celui enregistré.',
    code = 'INVALID_VERIFICATION_CODE'
  ) {
    super(message, code);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'EmailModif... Remove this comment to see the full error message
class EmailModificationDemandNotFoundOrExpiredError extends DomainError {
  constructor(
    message = "La demande de modification d'adresse e-mail n'existe pas ou est expirée.",
    code = 'EXPIRED_OR_NULL_EMAIL_MODIFICATION_DEMAND'
  ) {
    super(message, code);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'InvalidSes... Remove this comment to see the full error message
class InvalidSessionSupervisingLoginError extends DomainError {
  constructor(message = 'Le numéro de session et/ou le mot de passe saisis sont incorrects.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CandidateN... Remove this comment to see the full error message
class CandidateNotAuthorizedToJoinSessionError extends DomainError {
  constructor(
    message = 'Votre surveillant n’a pas confirmé votre présence dans la salle de test. Vous ne pouvez donc pas encore commencer votre test de certification. Merci de prévenir votre surveillant.',
    code = 'CANDIDATE_NOT_AUTHORIZED_TO_JOIN_SESSION'
  ) {
    super(message, code);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CandidateN... Remove this comment to see the full error message
class CandidateNotAuthorizedToResumeCertificationTestError extends DomainError {
  constructor(
    message = "Merci de contacter votre surveillant afin qu'il autorise la reprise de votre test.",
    code = 'CANDIDATE_NOT_AUTHORIZED_TO_RESUME_SESSION'
  ) {
    super(message, code);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'InvalidSki... Remove this comment to see the full error message
class InvalidSkillSetError extends DomainError {
  constructor(message = 'Acquis non valide') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SchoolingR... Remove this comment to see the full error message
class SchoolingRegistrationCannotBeDissociatedError extends DomainError {
  constructor(message = 'Impossible de dissocier') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'AcquiredBa... Remove this comment to see the full error message
class AcquiredBadgeForbiddenDeletionError extends DomainError {
  constructor(message = 'Il est interdit de supprimer un résultat thématique déjà acquis par un utilisateur.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationBadgeForbiddenDeletionError extends DomainError {
  constructor(message = 'Il est interdit de supprimer un résultat thématique lié à une certification.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'MissingBad... Remove this comment to see the full error message
class MissingBadgeCriterionError extends DomainError {
  constructor(message = 'Vous devez définir au moins un critère pour créer ce résultat thématique.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
class CampaignParticipationDeletedError extends DomainError {
  constructor(message = 'La participation est supprimée.') {
    super(message);
  }
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  AccountRecoveryDemandNotCreatedError,
  AccountRecoveryDemandExpired,
  AccountRecoveryUserAlreadyConfirmEmail,
  AcquiredBadgeForbiddenDeletionError,
  AlreadyAcceptedOrCancelledOrganizationInvitationError,
  AlreadyExistingEntityError,
  AlreadyExistingCampaignParticipationError,
  AlreadyExistingMembershipError,
  AlreadyExistingOrganizationInvitationError,
  AlreadyRatedAssessmentError,
  AlreadyRegisteredEmailAndUsernameError,
  AlreadyRegisteredEmailError,
  AlreadyRegisteredUsernameError,
  AlreadySharedCampaignParticipationError,
  ApplicationWithInvalidClientIdError,
  ApplicationWithInvalidClientSecretError,
  ApplicationScopeNotAllowedError,
  ArchivedCampaignError,
  AssessmentEndedError,
  AssessmentNotCompletedError,
  AssessmentResultNotCreatedError,
  AuthenticationMethodNotFoundError,
  AuthenticationMethodAlreadyExistsError,
  AuthenticationKeyForPoleEmploiTokenExpired,
  UncancellableOrganizationInvitationError,
  CampaignCodeError,
  CampaignParticipationDeletedError,
  CancelledOrganizationInvitationError,
  CandidateNotAuthorizedToJoinSessionError,
  CandidateNotAuthorizedToResumeCertificationTestError,
  CertificateVerificationCodeGenerationTooManyTrials,
  NoCertificationAttestationForDivisionError,
  CertificationBadgeForbiddenDeletionError,
  CertificationCandidateAddError,
  CertificationCandidateAlreadyLinkedToUserError,
  CertificationCandidateByPersonalInfoNotFoundError,
  CertificationCandidateByPersonalInfoTooManyMatchesError,
  CertificationCandidateCreationOrUpdateError,
  CertificationCandidateDeletionError,
  CertificationCandidateForbiddenDeletionError,
  CertificationCandidateMultipleUserLinksWithinSessionError,
  CertificationCandidatePersonalInfoFieldMissingError,
  CertificationCandidatePersonalInfoWrongFormat,
  CertificationCandidatesImportError,
  CertificationCenterMembershipCreationError,
  CertificationCenterMembershipDisableError,
  CertificationComputeError,
  CertificationCourseNotPublishableError,
  CertificationCourseUpdateError,
  CertificationEndedBySupervisorError,
  ChallengeAlreadyAnsweredError,
  ChallengeNotAskedError,
  ChallengeToBeNeutralizedNotFoundError,
  ChallengeToBeDeneutralizedNotFoundError,
  CompetenceResetError,
  CpfBirthInformationValidationError,
  CsvImportError,
  CsvParsingError,
  DeprecatedCertificationIssueReportSubcategory,
  DomainError,
  EmailModificationDemandNotFoundOrExpiredError,
  EntityValidationError,
  FileValidationError,
  ForbiddenAccess,
  GeneratePoleEmploiTokensError,
  ImproveCompetenceEvaluationForbiddenError,
  InvalidCertificationCandidate,
  InvalidCertificationReportForFinalization,
  InvalidCertificationIssueReportForSaving,
  InvalidExternalUserTokenError,
  InvalidExternalAPIResponseError,
  InvalidMembershipOrganizationRoleError,
  InvalidPasswordForUpdateEmailError,
  InvalidResultRecipientTokenError,
  InvalidSessionResultError,
  InvalidSessionSupervisingLoginError,
  InvalidSkillSetError,
  InvalidTemporaryKeyError,
  InvalidVerificationCodeError,
  ManyOrganizationsFoundError,
  MatchingReconciledStudentNotFoundError,
  MembershipCreationError,
  MembershipUpdateError,
  MissingAssessmentId,
  MissingAttributesError,
  MissingBadgeCriterionError,
  MissingOrInvalidCredentialsError,
  MultipleSchoolingRegistrationsWithDifferentNationalStudentIdError,
  NoCampaignParticipationForUserAndCampaign,
  CantImproveCampaignParticipationError,
  NoCertificationResultForDivision,
  NoStagesForCampaign,
  NoOrganizationToAttach,
  NotEligibleCandidateError,
  NotFoundError,
  NotImplementedError,
  ObjectValidationError,
  OrganizationArchivedError,
  OrganizationTagNotFound,
  OrganizationAlreadyExistError,
  OrganizationNotFoundError,
  OrganizationWithoutEmailError,
  PasswordNotMatching,
  PasswordResetDemandNotFoundError,
  SchoolingRegistrationAlreadyLinkedToUserError,
  SchoolingRegistrationAlreadyLinkedToInvalidUserError,
  SchoolingRegistrationCannotBeDissociatedError,
  SchoolingRegistrationDisabledError,
  SchoolingRegistrationNotFound,
  SchoolingRegistrationsCouldNotBeSavedError,
  SendingEmailToResultRecipientError,
  SessionAlreadyFinalizedError,
  SessionAlreadyPublishedError,
  SessionNotAccessible,
  SiecleXmlImportError,
  SupervisorAccessNotAuthorizedError,
  TargetProfileInvalidError,
  TargetProfileCannotBeCreated,
  TooManyRows,
  UnexpectedPoleEmploiStateError,
  UnexpectedUserAccountError,
  UserAccountNotFoundForPoleEmploiError,
  UnknownCountryForStudentEnrollmentError,
  UserAlreadyExistsWithAuthenticationMethodError,
  UserAlreadyLinkedToCandidateInSessionError,
  UserCantBeCreatedError,
  UserCouldNotBeReconciledError,
  UserHasAlreadyLeftSCO,
  UserNotAuthorizedToAccessEntityError,
  UserNotAuthorizedToCertifyError,
  UserNotAuthorizedToCreateCampaignError,
  UserNotAuthorizedToCreateResourceError,
  UserNotAuthorizedToGenerateUsernamePasswordError,
  UserNotAuthorizedToGetCampaignResultsError,
  UserNotAuthorizedToGetCertificationCoursesError,
  UserNotAuthorizedToRemoveAuthenticationMethod,
  UserNotAuthorizedToUpdateCampaignError,
  UserNotAuthorizedToUpdatePasswordError,
  UserNotAuthorizedToUpdateResourceError,
  UserNotFoundError,
  UserNotAuthorizedToUpdateEmailError,
  UserNotMemberOfOrganizationError,
  UserOrgaSettingsCreationError,
  UserShouldChangePasswordError,
  WrongDateFormatError,
  YamlParsingError,
};

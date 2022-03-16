// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SiecleXmlI... Remove this comment to see the full error message
const { SiecleXmlImportError } = require('../../../domain/errors');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const xml2js = require('xml2js');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const saxPath = require('saxpath');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isEmpty'.
const { isEmpty, isUndefined } = require('lodash');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SiecleFile... Remove this comment to see the full error message
const SiecleFileStreamer = require('../../utils/xml/siecle-file-streamer');
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const XMLSchoolingRegistrationSet = require('./xml-schooling-registration-set');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ERRORS'.
const ERRORS = {
  UAI_MISMATCHED: 'UAI_MISMATCHED',
};

const NODE_ORGANIZATION_UAI = '/BEE_ELEVES/PARAMETRES/UAJ';
const NODES_SCHOOLING_REGISTRATIONS = '/BEE_ELEVES/DONNEES/*/*';
const ELEVE_ELEMENT = '<ELEVE';
const STRUCTURE_ELEVE_ELEMENT = '<STRUCTURES_ELEVE';

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'SieclePars... Remove this comment to see the full error message
class SiecleParser {
  organization: any;
  path: any;
  schoolingRegistrationsSet: any;
  siecleFileStreamer: any;
  constructor(organization: any, path: any) {
    this.organization = organization;
    this.path = path;
    this.schoolingRegistrationsSet = new XMLSchoolingRegistrationSet();
  }

  async parse() {
    this.siecleFileStreamer = await SiecleFileStreamer.create(this.path);

    await this._parseUAI();

    await this._parseStudents();

    await this.siecleFileStreamer.close();

    return this.schoolingRegistrationsSet.schoolingRegistrations.filter(
      (schoolingRegistration: any) => !isUndefined(schoolingRegistration.division)
    );
  }

  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  async _parseUAI() {
    await this.siecleFileStreamer.perform((stream: any, resolve: any, reject: any) => this._checkUAI(stream, resolve, reject));
  }

  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  async _checkUAI(stream: any, resolve: any, reject: any) {
    const streamerToParseOrganizationUAI = new saxPath.SaXPath(stream, NODE_ORGANIZATION_UAI);

    streamerToParseOrganizationUAI.once('match', (xmlNode: any) => {
      xml2js.parseString(xmlNode, (err: any, nodeData: any) => {
        if (err) return reject(err); // Si j'enleve cette ligne les tests passent
        const UAIFromUserOrganization = this.organization.externalId;
        if (nodeData.UAJ !== UAIFromUserOrganization) {
          // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
          reject(new SiecleXmlImportError(ERRORS.UAI_MISMATCHED));
        } else {
          resolve();
        }
      });
    });

    stream.on('end', () => {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      reject(new SiecleXmlImportError(ERRORS.UAI_MISMATCHED));
    });
  }

  // @ts-expect-error ts-migrate(2697) FIXME: An async function or method must return a 'Promise... Remove this comment to see the full error message
  async _parseStudents() {
    await this.siecleFileStreamer.perform((stream: any, resolve: any, reject: any) =>
      this._extractStudentRegistrationsFromStream(stream, resolve, reject)
    );
  }

  _extractStudentRegistrationsFromStream(saxParser: any, resolve: any, reject: any) {
    const streamerToParseSchoolingRegistrations = new saxPath.SaXPath(saxParser, NODES_SCHOOLING_REGISTRATIONS);
    streamerToParseSchoolingRegistrations.on('match', (xmlNode: any) => {
      if (_isSchoolingRegistrationNode(xmlNode)) {
        xml2js.parseString(xmlNode, (err: any, nodeData: any) => {
          try {
            if (err) throw err; // Si j'enleve cette ligne les tests passent

            if (_isNodeImportableStudent(nodeData)) {
              this.schoolingRegistrationsSet.add(nodeData.ELEVE.$.ELEVE_ID, nodeData.ELEVE);
            } else if (_isNodeImportableStructures(nodeData, this.schoolingRegistrationsSet)) {
              this.schoolingRegistrationsSet.updateDivision(nodeData);
            }
          } catch (err) {
            reject(err);
          }
        });
      }
    });

    streamerToParseSchoolingRegistrations.on('end', resolve);
  }
}

function _isSchoolingRegistrationNode(xmlNode: any) {
  return xmlNode.startsWith(ELEVE_ELEMENT) || xmlNode.startsWith(STRUCTURE_ELEVE_ELEMENT);
}

function _isNodeImportableStudent(nodeData: any) {
  return nodeData.ELEVE && _isImportable(nodeData.ELEVE);
}

function _isNodeImportableStructures(nodeData: any, schoolingRegistrationsSet: any) {
  return nodeData.STRUCTURES_ELEVE && schoolingRegistrationsSet.has(nodeData.STRUCTURES_ELEVE.$.ELEVE_ID);
}

function _isImportable(studentData: any) {
  const isStudentNotLeftSchoolingRegistration = isEmpty(studentData.DATE_SORTIE);
  const isStudentNotYetArrivedSchoolingRegistration = !isEmpty(studentData.ID_NATIONAL);
  return isStudentNotLeftSchoolingRegistration && isStudentNotYetArrivedSchoolingRegistration;
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = SiecleParser;

/* eslint-disable no-sync */
const { expect, databaseBuilder, catchErr, knex, sinon } = require('../../../test-helper');
const importApprentices = require('../../../../scripts/prod/import-apprentices');
const iconv = require('iconv-lite');
const { CsvImportError } = require('../../../../lib/domain/errors');

describe('Integration | Scripts | import-apprentices', () => {
  const fileSystem = {
    readFileSync: sinon.stub(),
  };

  describe('#importApprentices', () => {

    afterEach(async () => {
      await knex('schooling-registrations').delete();
    });

    context('when the header is correctly formed', () => {
      context('when there is no line', () => {
        it('create no registrations',  async () => {
          const input = 'Identifiant unique*;Premier prénom*;Deuxième prénom;Troisième prénom;Nom de famille*;Nom d’usage;Date de naissance (jj/mm/aaaa)*;Code commune naissance**;Libellé commune naissance**;Code département naissance*;Code pays naissance*;Statut*;Code MEF*;Division*;UAI*';
          const encodedInput = iconv.encode(input, 'utf8');
          fileSystem.readFileSync.withArgs('tmp.csv').returns(encodedInput);

          await importApprentices('tmp.csv', fileSystem);
          const registrations = await knex.select('*').from('schooling-registrations');
          expect(registrations).to.be.empty;
        });
      });

      context('when there are lines', () => {
        it('create registrations for the correct organization', async () => {
          const organization1 = databaseBuilder.factory.buildOrganization({ type: 'SCO', externalId: '12345' });
          const organization2 = databaseBuilder.factory.buildOrganization({ type: 'SCO', externalId: '54321' });
          await databaseBuilder.commit();

          const registration1Attributes = {
            nationalApprenticeId: '123F',
            firstName: 'Beatrix',
            middleName: 'The',
            thirdName: 'Bride',
            lastName: 'Kiddo',
            preferredLastName: 'Black Mamba',
            birthdate: '1970-01-01',
            birthCityCode: '97422',
            birthProvinceCode: '200',
            birthCountryCode: '100',
            status: 'AP',
            MEFCode: 'MEF1',
            division: 'Division 1',
            organizationId: organization1.id,
          };

          const registration2Attributes = {
            nationalApprenticeId: '456F',
            firstName: 'O-Ren',
            lastName: 'Ishii',
            preferredLastName: 'Cottonmouth',
            birthdate: '1980-01-01',
            birthCity: 'Shangai',
            birthProvinceCode: '99',
            birthCountryCode: '132',
            status: 'AP',
            MEFCode: 'MEF1',
            division: 'Division 2',
            organizationId: organization2.id,
          };

          const input = `Identifiant unique*;Premier prénom*;Deuxième prénom;Troisième prénom;Nom de famille*;Nom d’usage;Date de naissance (jj/mm/aaaa)*;Code commune naissance**;Libellé commune naissance**;Code département naissance*;Code pays naissance*;Statut*;Code MEF*;Division*;UAI*
         123F;Beatrix;The;Bride;Kiddo;Black Mamba;01/01/1970;97422;;200;99100;AP;MEF1;Division 1;12345;
           456F;O-Ren;;;Ishii;Cottonmouth;01/01/1980;;Shangai;99;99132;AP;MEF1;Division 2;54321;
          `;

          const encodedInput = iconv.encode(input, 'utf8');

          fileSystem.readFileSync.withArgs('tmp.csv').returns(encodedInput);

          await importApprentices('tmp.csv', fileSystem);
          const [registration1, registration2 ] = await knex.select('*').from('schooling-registrations').orderBy('organizationId');
          expect(registration1).to.include(registration1Attributes);
          expect(registration2).to.include(registration2Attributes);
        });

        context('when there is an error', () => {
          it('throws a CsvImportError', async  () => {
            const header = 'Identifiant unique*;Premier prénom*;Deuxième prénom;Troisième prénom;Nom de famille*;Nom d’usage;Date de naissance (jj/mm/aaaa)*;Code commune naissance**;Libellé commune naissance**;Code département naissance*;Code pays naissance*;Statut*;Code MEF*;Division*;UAI*';
            const lineWithoutUniqueIdentifier = ';Beatrix;The;Bride;Kiddo;Black Mamba;01/01/1970;97422;;200;99100;AP;MEF1;Division 1;12345;';
            const input =
            `${header}
            ${lineWithoutUniqueIdentifier}`;

            const encodedInput = iconv.encode(input, 'utf8');
            fileSystem.readFileSync.withArgs('tmp.csv').returns(encodedInput);

            const err = await catchErr(importApprentices)('tmp.csv', fileSystem);
            expect(err).to.be.an.instanceOf(CsvImportError);
          });
        });
      });
    });
    context('when the header is not correctly formed', () => {
      const requiredColumns = [
        'Identifiant unique*',
        'Premier prénom*',
        'Deuxième prénom',
        'Troisième prénom',
        'Nom de famille*',
        'Nom d’usage',
        'Date de naissance (jj/mm/aaaa)*',
        'Code commune naissance**',
        'Libellé commune naissance**',
        'Code département naissance*',
        'Code pays naissance*',
        'Statut*',
        'Code MEF*',
        'Division*',
        'UAI*',
      ];

      requiredColumns.forEach((missingColumn) =>  {
        it('throws a CsvImportError', async  () => {
          const input = requiredColumns.filter((column)  => column != missingColumn).join(';');

          const encodedInput = iconv.encode(input, 'utf8');
          fileSystem.readFileSync.withArgs('tmp.csv').returns(encodedInput);

          const err = await catchErr(importApprentices)('tmp.csv', fileSystem);
          expect(err).to.be.an.instanceOf(CsvImportError);
        });
      });
    });
  });
});

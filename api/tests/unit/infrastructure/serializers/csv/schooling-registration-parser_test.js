const iconv = require('iconv-lite');
const { expect, catchErr } = require('../../../../test-helper');
const SchoolingRegistrationParser = require('../../../../../lib/infrastructure/serializers/csv/schooling-registration-parser');
const { CsvImportError } = require('../../../../../lib/domain/errors');

const schoolingRegistrationCsvColumns = SchoolingRegistrationParser.COLUMNS.map((column) => column.label).join(';');

describe('Unit | Infrastructure | SchoolingRegistrationParser', function() {
  context('when the header is not correctly formed', function() {
    const organizationId = 123;

    const fieldList = ['Identifiant unique*', 'Nom de famille*', 'Date de naissance (jj/mm/aaaa)*', 'Code département naissance*', 'Code pays naissance*', 'Statut*', 'Code MEF*', 'Division*'];
    fieldList.forEach((field) => {
      context(`when the ${field} column is missing`, function() {
        it('should throw an CsvImportError', async function() {
          let input = schoolingRegistrationCsvColumns.replace(`${field}`, '');
          input = input.replace(';;', ';');
          const encodedInput = iconv.encode(input, 'utf8');
          const parser = new SchoolingRegistrationParser(encodedInput, organizationId);

          const error = await catchErr(parser.parse, parser)();

          expect(error.code).to.equal('HEADER_REQUIRED');
        });
      });
    });

    context('when the Premier prénom* column is missing', function() {
      it('should throw an CsvImportError', async function() {
        const input = schoolingRegistrationCsvColumns.replace('Premier prénom*;', '');
        const encodedInput = iconv.encode(input, 'utf8');
        const parser = new SchoolingRegistrationParser(encodedInput, organizationId);

        const error = await catchErr(parser.parse, parser)();

        expect(error.code).to.equal('ENCODING_NOT_SUPPORTED');
      });
    });
  });

  context('when the header is correctly formed', function() {
    context('when there is no line', function() {
      it('returns no registrations', function() {
        const input = schoolingRegistrationCsvColumns;
        const encodedInput = iconv.encode(input, 'utf8');
        const parser = new SchoolingRegistrationParser(encodedInput, 123);

        const { registrations } = parser.parse();

        expect(registrations).to.be.empty;
      });
    });

    context('when there are lines', function() {
      context('when the data are correct', function() {
        it('returns a schooling registration for each line', function() {
          const input = `${schoolingRegistrationCsvColumns}
          123F;Beatrix;The;Bride;Kiddo;Black Mamba;01/01/1970;97422;;200;99100;ST;MEF1;Division 1;
          456F;O-Ren;;;Ishii;Cottonmouth;01/01/1980;;Shangai;99;99132;ST;MEF1;Division 2;
          `;
          const encodedInput = iconv.encode(input, 'utf8');
          const parser = new SchoolingRegistrationParser(encodedInput, 456);

          const { registrations } = parser.parse();
          expect(registrations).to.have.lengthOf(2);
        });

        it('returns schooling registrations for each line using the CSV column', function() {
          const input = `${schoolingRegistrationCsvColumns}
          123F;Beatrix;The;Bride;Kiddo;Black Mamba;01/01/1970;97422;;974;99100;ST;MEF1;Division 1;
          0123456789F;O-Ren;;;Ishii;Cottonmouth;01/01/1980;;Shangai;99;99132;AP;MEF1;Division 2;
          `;
          const organizationId = 789;
          const encodedInput = iconv.encode(input, 'utf8');
          const parser = new SchoolingRegistrationParser(encodedInput, organizationId);

          const { registrations } = parser.parse();
          expect(registrations[0]).to.includes({
            nationalStudentId: '123F',
            nationalApprenticeId: undefined,
            firstName: 'Beatrix',
            middleName: 'The',
            thirdName: 'Bride',
            lastName: 'Kiddo',
            preferredLastName: 'Black Mamba',
            birthdate: '1970-01-01',
            birthCityCode: '97422',
            birthProvinceCode: '974',
            birthCountryCode: '100',
            status: 'ST',
            MEFCode: 'MEF1',
            division: 'Division 1',
            organizationId,
          });

          expect(registrations[1]).to.includes({
            nationalStudentId: '0123456789F',
            nationalApprenticeId: undefined,
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
            organizationId,
          });
        });
      });

      context('when the data are not correct', function() {
        it('should throw an EntityValidationError with malformated National Apprentice Id', async function() {
          //given
          const input = `${schoolingRegistrationCsvColumns}
          123F;Beatrix;The;Bride;Kiddo;Black Mamba;aaaaa;97422;;200;99100;AP;MEF1;Division 1;
          `;
          const encodedInput = iconv.encode(input, 'utf8');
          const parser = new SchoolingRegistrationParser(encodedInput, 123);

          const error = await catchErr(parser.parse, parser)();

          //then
          expect(error.code).to.equal('INA_FORMAT');
          expect(error.meta).to.deep.equal({ line: 2, field: 'Identifiant unique*' });
        });

        it('should throw an EntityValidationError with malformated birthCountryCode', async function() {
          //given
          const wrongData = 'FRANC';
          const input = `${schoolingRegistrationCsvColumns}
          123F;Beatrix;The;Bride;Kiddo;Black Mamba;01/01/1980;97422;;200;${wrongData};ST;MEF1;Division 1;
          `;
          const encodedInput = iconv.encode(input, 'utf8');
          const parser = new SchoolingRegistrationParser(encodedInput, 123);

          const error = await catchErr(parser.parse, parser)();

          //then
          expect(error.code).to.equal('INSEE_CODE_INVALID');
          expect(error.meta).to.deep.equal({ line: 2, field: 'Code pays naissance*' });
        });

        it('should throw an EntityValidationError with malformated birthCityCode', async function() {
          //given
          const wrongData = 'A1234';
          const input = `${schoolingRegistrationCsvColumns}
          123F;Beatrix;The;Bride;Kiddo;Black Mamba;01/01/1980;${wrongData};;974;99100;ST;MEF1;Division 1;
          `;
          const encodedInput = iconv.encode(input, 'utf8');
          const parser = new SchoolingRegistrationParser(encodedInput, 123);

          const error = await catchErr(parser.parse, parser)();

          //then
          expect(error).to.be.an.instanceOf(CsvImportError);
          expect(error.code).to.equal('INSEE_CODE_INVALID');
          expect(error.meta).to.deep.equal({ line: 2, field: 'Code commune naissance**' });
        });

        context('When the organization is Agriculture and file contain status AP', function() {
          it('should return schooling registration with nationalApprenticeId', function() {
            const input = `${schoolingRegistrationCsvColumns}
            0123456789F;Beatrix;The;Bride;Kiddo;Black Mamba;01/01/1970;97422;;974;99100;AP;MEF1;Division 1;
            `;
            const organizationId = 789;
            const encodedInput = iconv.encode(input, 'utf8');
            const parser = new SchoolingRegistrationParser(encodedInput, organizationId, true);

            const { registrations } = parser.parse();
            expect(registrations[0]).to.includes({
              nationalStudentId: undefined,
              nationalApprenticeId: '0123456789F',
              status: 'AP',
            });
          });
        });

        context('When csv has duplicates on national identifier', function() {
          context('when organization is SCO', function() {
            it('should throw an CsvImportError even with different status', async function() {
              const input = `${schoolingRegistrationCsvColumns}
              0123456789F;Beatrix;The;Bride;Kiddo;Black Mamba;01/05/1986;97422;;200;99100;ST;MEF1;Division 1;
              0123456789F;Beatrix;The;Bride;Kiddo;Black Mamba;01/05/1986;97422;;200;99100;AP;MEF1;Division 1;
              `;

              const encodedInput = iconv.encode(input, 'utf8');
              const parser = new SchoolingRegistrationParser(encodedInput, 123);

              const error = await catchErr(parser.parse, parser)();

              //then
              expect(error.code).to.equal('INA_UNIQUE');
              expect(error.meta).to.deep.equal({ line: 3, field: 'Identifiant unique*' });
            });
          });

          context('when organization is SCO Agriculture', function() {
            const isAgriculture = true;

            it('should not return error given nationalIdentifier with different status', function() {
              const input = `${schoolingRegistrationCsvColumns}
              0123456789F;Beatrix;The;Bride;Kiddo;Black Mamba;01/01/1970;97422;;974;99100;AP;MEF1;Division 1;
              0123456789F;Beatrix;The;Bride;Kiddo;Black Mamba;01/01/1970;97422;;974;99100;ST;MEF1;Division 1;
              `;
              const organizationId = 789;
              const encodedInput = iconv.encode(input, 'utf8');
              const parser = new SchoolingRegistrationParser(encodedInput, organizationId, isAgriculture);

              const { registrations } = parser.parse();

              expect(registrations[0]).to.includes({
                nationalStudentId: undefined,
                nationalApprenticeId: '0123456789F',
                status: 'AP',
              });

              expect(registrations[1]).to.includes({
                nationalStudentId: '0123456789F',
                nationalApprenticeId: undefined,
                status: 'ST',
              });
            });

            it('should throw an CsvImportError, with same status', async function() {
              const input = `${schoolingRegistrationCsvColumns}
              0123456789F;Beatrix;The;Bride;Kiddo;Black Mamba;01/05/1986;97422;;200;99100;AP;MEF1;Division 1;
              0123456789F;Beatrix;The;Bride;Kiddo;Black Mamba;01/05/1986;97422;;200;99100;AP;MEF1;Division 1;
              `;

              const encodedInput = iconv.encode(input, 'utf8');
              const parser = new SchoolingRegistrationParser(encodedInput, 123, isAgriculture);

              const error = await catchErr(parser.parse, parser)();

              //then
              expect(error.code).to.equal('INA_UNIQUE');
              expect(error.meta).to.deep.equal({ line: 3, field: 'Identifiant unique*' });
            });
          });
        });
      });
    });
  });
});

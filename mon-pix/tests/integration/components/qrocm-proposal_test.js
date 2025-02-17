import { expect } from 'chai';
import { describe, it } from 'mocha';
import setupIntlRenderingTest from '../../helpers/setup-intl-rendering';
import { fillIn, find, findAll, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

describe('Integration | Component | QROCm proposal', function () {
  setupIntlRenderingTest();

  it('renders', async function () {
    await render(hbs`<QrocmProposal />`);

    expect(find('.qrocm-proposal')).to.exist;
  });

  describe('When block type is select', function () {
    beforeEach(function () {
      this.set('proposals', '${potato§La patate#samurai options=["salad", "tomato", "onion"]}');
    });

    it('should display a selector with related options', async function () {
      // given
      const placeholderValue = '';
      const expectedOptionValues = [placeholderValue, 'salad', 'tomato', 'onion'];

      // when
      await render(hbs`<QrocmProposal @proposals={{this.proposals}}/>`);

      // then
      const selector = find('select[data-test="challenge-response-proposal-selector"]');
      const options = findAll('select[data-test="challenge-response-proposal-selector"] option');
      const optionValues = options.map((option) => option.value);

      expect(selector.tagName).to.equal('SELECT');
      expect(selector.getAttribute('aria-label')).to.equal('La patate');
      expect(optionValues).to.deep.equal(expectedOptionValues);
    });

    it('should select option', async function () {
      // given
      this.set('answersValue', { potato: null });

      // when
      await render(hbs`<QrocmProposal @proposals={{this.proposals}} @answersValue={{this.answersValue}}/>`);
      await fillIn('select[data-test="challenge-response-proposal-selector"]', 'tomato');

      // then
      expect(this.answersValue['potato']).to.equal('tomato');
    });
  });

  describe('When block type is input', function () {
    describe('When format is a paragraph', function () {
      it('should display a textarea', async function () {
        // given
        this.set('proposals', '${myInput}');
        this.set('format', 'paragraphe');

        // when
        await render(hbs`<QrocmProposal @proposals={{this.proposals}} @format={{this.format}} />`);

        // then
        expect(find('.challenge-response__proposal--paragraph').tagName).to.equal('TEXTAREA');
      });
    });

    describe('When format is a sentence', function () {
      it('should display a input', async function () {
        // given
        this.set('proposals', '${myInput}');
        this.set('format', 'phrase');

        // when
        await render(hbs`<QrocmProposal @proposals={{this.proposals}} @format={{this.format}} />`);

        // then
        expect(find('.challenge-response__proposal--sentence').tagName).to.equal('INPUT');
      });
    });

    describe('When format is a neither a paragraph nor a sentence', function () {
      [
        { format: 'petit', expectedSize: '11' },
        { format: 'mots', expectedSize: '20' },
        { format: 'unreferenced_format', expectedSize: '20' },
      ].forEach((data) => {
        it(`should display an input with expected size (${data.expectedSize}) when format is ${data.format}`, async function () {
          // given
          this.set('proposals', '${myInput}');
          this.set('format', data.format);

          // when
          await render(hbs`<QrocmProposal @proposals={{this.proposals}} @format={{this.format}} />`);

          // then
          expect(find('.challenge-response__proposal--paragraph')).to.not.exist;
          expect(find('.challenge-response__proposal').tagName).to.equal('INPUT');
          expect(find('.challenge-response__proposal').getAttribute('size')).to.equal(data.expectedSize);
        });
      });
    });

    describe('Whatever the format', function () {
      [
        { format: 'mots', cssClass: '.challenge-response__proposal', inputType: 'input' },
        { format: 'phrase', cssClass: '.challenge-response__proposal--sentence', inputType: 'input' },
        { format: 'paragraphe', cssClass: '.challenge-response__proposal--paragraph', inputType: 'textarea' },
        { format: 'unreferenced_format', cssClass: '.challenge-response__proposal', inputType: 'input' },
      ].forEach((data) => {
        describe(`Component behavior when the user clicks on the ${data.inputType}`, function () {
          it('should not display autocompletion answers', async function () {
            // given
            const proposals = '${myInput}';
            this.set('proposals', proposals);
            this.set('answerValue', '');
            this.set('format', `${data.format}`);

            // when
            await render(
              hbs`<QrocmProposal @proposals={{this.proposals}} @format={{this.format}} @answerValue={{this.answerValue}} />`
            );

            // then
            expect(find(`${data.cssClass}`).getAttribute('autocomplete')).to.equal('nope');
          });
        });
      });

      [
        { proposals: '${input}', expectedAriaLabel: ['Réponse 1'] },
        { proposals: '${rep1}, ${rep2} ${rep3}', expectedAriaLabel: ['Réponse 1', 'Réponse 2', 'Réponse 3'] },
      ].forEach((data) => {
        describe(`Component aria-label accessibility when proposal is ${data.proposals}`, function () {
          let allInputElements;

          beforeEach(async function () {
            // given
            this.set('proposals', data.proposals);
            this.set('answerValue', '');
            this.set('format', 'phrase');

            // when
            await render(
              hbs`<QrocmProposal @proposals={{this.proposals}} @format={{this.format}} @answerValue={{this.answerValue}} />`
            );

            //then
            allInputElements = findAll('.challenge-response__proposal');
          });

          it('should have an aria-label', async function () {
            // then
            expect(allInputElements.length).to.be.equal(data.expectedAriaLabel.length);
            allInputElements.forEach((element, index) => {
              expect(element.getAttribute('aria-label')).to.contains(data.expectedAriaLabel[index]);
            });
          });

          it('should not have a label', async function () {
            // then
            expect(find('label')).to.be.null;
          });
        });
      });

      [{ proposals: 'texte : ${rep1}\nautre texte : ${rep2}', expectedLabel: ['texte :', 'autre texte :'] }].forEach(
        (data) => {
          describe(`Component label accessibility when proposal is ${data.proposals}`, function () {
            let allLabelElements, allInputElements;

            beforeEach(async function () {
              // given
              this.set('proposals', data.proposals);
              this.set('answerValue', '');
              this.set('format', 'phrase');

              // when
              await render(
                hbs`<QrocmProposal @proposals={{this.proposals}} @format={{this.format}} @answerValue={{this.answerValue}} />`
              );

              //then
              allLabelElements = findAll('label');
              allInputElements = findAll('.challenge-response__proposal');
            });

            it('should have a label', async function () {
              // then
              expect(allLabelElements.length).to.be.equal(allInputElements.length);
              expect(allLabelElements.length).to.be.equal(data.expectedLabel.length);
              allLabelElements.forEach((element, index) => {
                expect(element.textContent.trim()).to.equal(data.expectedLabel[index]);
              });
            });

            it('should not have an aria-label', async function () {
              // then
              expect(find('.challenge-response__proposal').getAttribute('aria-label')).to.be.null;
            });

            it('should connect the label with the input', async function () {
              // then
              expect(allInputElements.length).to.equal(allLabelElements.length);
              const allInputElementsId = allInputElements.map((inputElement) => inputElement.getAttribute('id'));
              const allLabelElementsFor = allLabelElements.map((labelElement) => labelElement.getAttribute('for'));
              expect(allInputElementsId).to.deep.equal(allLabelElementsFor);
            });
          });
        }
      );
    });
  });
});

import { expect } from 'chai';
import { describe, it } from 'mocha';
import setupIntlRenderingTest from '../../helpers/setup-intl-rendering';
import { find, render } from '@ember/test-helpers';
import { contains } from '../../helpers/contains';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';

describe('Integration | Component | user certifications detail result', function () {
  setupIntlRenderingTest();

  let certification;

  it('renders', async function () {
    await render(hbs`<UserCertificationsDetailResult @certification={{this.certification}}/>`);
    expect(find('.user-certifications-detail-result')).to.exist;
  });

  context('when certification is complete', function () {
    beforeEach(async function () {
      // given
      certification = EmberObject.create({
        id: 1,
        birthdate: new Date('2000-01-22T15:15:52Z'),
        firstName: 'Jean',
        lastName: 'Bon',
        date: new Date('2018-02-15T15:15:52Z'),
        certificationCenter: 'Université de Lyon',
        isPublished: true,
        pixScore: 654,
        status: 'validated',
        commentForCandidate: 'Comment for candidate',
      });
      this.set('certification', certification);

      // when
      await render(hbs`<UserCertificationsDetailResult @certification={{this.certification}}/>`);
    });

    it('should show the comment for candidate', function () {
      expect(find('.user-certifications-detail-result__jury__comment')).to.exist;
      expect(find('.user-certifications-detail-result__jury__comment').textContent).to.include('Comment for candidate');
    });
  });

  context('when certification has no comment for user', function () {
    beforeEach(async function () {
      // given
      certification = EmberObject.create({
        id: 1,
        birthdate: new Date('2000-01-22T15:15:52Z'),
        firstName: 'Jean',
        lastName: 'Bon',
        date: new Date('2018-02-15T15:15:52Z'),
        certificationCenter: 'Université de Lyon',
        isPublished: true,
        pixScore: 654,
        status: 'validated',
        commentForCandidate: null,
      });
      this.set('certification', certification);

      // when
      await render(hbs`<UserCertificationsDetailResult @certification={{this.certification}}/>`);
    });

    it('should not show the comment for candidate', function () {
      expect(find('.user-certifications-detail-result__jury__comment')).to.not.exist;
    });
  });

  context('when certification has Cléa', function () {
    beforeEach(async function () {
      // given
      certification = EmberObject.create({
        id: 1,
        birthdate: new Date('2000-01-22T15:15:52Z'),
        firstName: 'Jean',
        lastName: 'Bon',
        date: new Date('2018-02-15T15:15:52Z'),
        certificationCenter: 'Université de Lyon',
        isPublished: true,
        pixScore: 654,
        status: 'validated',
        commentForCandidate: null,
        hasCleaCertif: true,
      });
      this.set('certification', certification);

      // when
      await render(hbs`<UserCertificationsDetailResult @certification={{this.certification}}/>`);
    });

    // then
    it('should show the CLEA badge', function () {
      expect(find('img[alt="Certification cléA numérique"]')).to.exist;
    });
  });

  context('when certification does not have Cléa', function () {
    beforeEach(async function () {
      // given
      certification = EmberObject.create({
        id: 1,
        birthdate: new Date('2000-01-22T15:15:52Z'),
        firstName: 'Jean',
        lastName: 'Bon',
        date: new Date('2018-02-15T15:15:52Z'),
        certificationCenter: 'Université de Lyon',
        isPublished: true,
        pixScore: 654,
        status: 'validated',
        commentForCandidate: null,
        hasCleaCertif: false,
      });
      this.set('certification', certification);

      // when
      await render(hbs`<UserCertificationsDetailResult @certification={{this.certification}}/>`);
    });

    // then
    it('should not show the CLEA badge', function () {
      expect(find('img[alt="Certification cléA numérique"]')).not.to.exist;
    });
  });

  context('when certification has a certified badge image', function () {
    it('should show the complementary certification badge', async function () {
      // given
      certification = EmberObject.create({
        id: 1,
        birthdate: new Date('2000-01-22T15:15:52Z'),
        firstName: 'Jean',
        lastName: 'Bon',
        date: new Date('2018-02-15T15:15:52Z'),
        certificationCenter: 'Université de Lyon',
        isPublished: true,
        pixScore: 654,
        status: 'validated',
        certifiedBadgeImages: [
          {
            url: '/some/img',
            isTemporaryBadge: false,
          },
        ],
      });
      this.set('certification', certification);

      // when
      await render(hbs`<UserCertificationsDetailResult @certification={{this.certification}}/>`);

      // then
      expect(find('img[alt="Certification complémentaire"]')).to.exist;
    });

    context('when the certified badge image is a temporary badge', function () {
      it('should display the temporary badge message', async function () {
        // given
        certification = EmberObject.create({
          id: 1,
          birthdate: new Date('2000-01-22T15:15:52Z'),
          firstName: 'Jean',
          lastName: 'Bon',
          date: new Date('2018-02-15T15:15:52Z'),
          certificationCenter: 'Université de Lyon',
          isPublished: true,
          pixScore: 654,
          status: 'validated',
          certifiedBadgeImages: [
            {
              url: '/some/img',
              isTemporaryBadge: true,
              levelName: 'Level Name',
            },
          ],
        });
        this.set('certification', certification);

        // when
        await render(hbs`<UserCertificationsDetailResult @certification={{this.certification}}/>`);

        // then
        expect(
          contains(
            'Vous avez obtenu le niveau "Level Name" dans le cadre du volet 1 de la certification Pix+Édu. Votre niveau final sera déterminé à l’issue du volet 2'
          )
        ).to.exist;
      });
    });
  });

  context('when certification has no certifed badge image', function () {
    beforeEach(async function () {
      // given
      certification = EmberObject.create({
        id: 1,
        birthdate: new Date('2000-01-22T15:15:52Z'),
        firstName: 'Jean',
        lastName: 'Bon',
        date: new Date('2018-02-15T15:15:52Z'),
        certificationCenter: 'Université de Lyon',
        isPublished: true,
        pixScore: 654,
        status: 'validated',
        commentForCandidate: null,
        hasCleaCertif: false,
        certifiedBadgeImages: [],
      });
      this.set('certification', certification);

      // when
      await render(hbs`<UserCertificationsDetailResult @certification={{this.certification}}/>`);
    });

    // then
    it('should not show the complementary certification badge', function () {
      expect(find('img[alt="Certification complémentaire"]')).not.to.exist;
    });
  });
});

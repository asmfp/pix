import { currentURL, visit } from '@ember/test-helpers';
import { beforeEach, describe, it } from 'mocha';
import { authenticateByEmail } from '../helpers/authentication';
import { expect } from 'chai';
import { setupApplicationTest } from 'ember-mocha';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { contains } from '../helpers/contains';
import { clickByLabel } from '../helpers/click-by-label';
import setupIntl from '../helpers/setup-intl';

describe('Acceptance | User account page', function () {
  setupApplicationTest();
  setupMirage();
  setupIntl();

  context('When user is not connected', function () {
    it('should be redirected to connection page', async function () {
      // given / when
      await visit('/mon-compte');

      // then
      expect(currentURL()).to.equal('/connexion');
    });
  });

  context('When user is connected', function () {
    let user;

    beforeEach(async function () {
      // given
      user = server.create('user', 'withEmail');
      await authenticateByEmail(user);
    });

    it('should display my account page', async function () {
      // when
      await visit('/mon-compte');

      // then
      expect(currentURL()).to.equal('/mon-compte/informations-personnelles');
    });

    describe('My account menu', function () {
      it('should display my account menu', async function () {
        // when
        await visit('/mon-compte');

        // then
        expect(contains(this.intl.t('pages.user-account.personal-information.menu-link-title'))).to.exist;
        expect(contains(this.intl.t('pages.user-account.connexion-methods.menu-link-title'))).to.exist;
        expect(contains(this.intl.t('pages.user-account.language.menu-link-title'))).to.exist;
      });

      it('should display personal information on click on "Informations personnelles"', async function () {
        // given
        await visit('/mon-compte');

        // when
        await clickByLabel(this.intl.t('pages.user-account.personal-information.menu-link-title'));

        // then
        expect(currentURL()).to.equal('/mon-compte/informations-personnelles');
      });

      it('should display connection methods on click on "Méthodes de connexion"', async function () {
        // given
        await visit('/mon-compte');

        // when
        await clickByLabel(this.intl.t('pages.user-account.connexion-methods.menu-link-title'));

        // then
        expect(currentURL()).to.equal('/mon-compte/methodes-de-connexion');
      });

      it('should display language on click on "Choisir ma langue"', async function () {
        // given
        await visit('/mon-compte');

        // when
        await clickByLabel(this.intl.t('pages.user-account.language.menu-link-title'));

        // then
        expect(currentURL()).to.equal('/mon-compte/langue');
      });
    });
  });
});

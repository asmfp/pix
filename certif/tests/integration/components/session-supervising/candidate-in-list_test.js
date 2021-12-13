import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render as renderScreen } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';

import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module('Integration | Component | SessionSupervising::CandidateInList', function(hooks) {
  setupRenderingTest(hooks);

  let store;

  hooks.beforeEach(async function() {
    store = this.owner.lookup('service:store');
  });

  test('it renders the candidates information with an unchecked checkbox', async function(assert) {
    // given
    this.candidate = store.createRecord('certification-candidate-for-supervising', {
      id: 123,
      firstName: 'Gamora',
      lastName: 'Zen Whoberi Ben Titan',
      birthdate: '1984-05-28',
      extraTimePercentage: '8',
      authorizedToStart: false,
      assessmentStatus: null,
    });
    this.toggleCandidate = sinon.spy();

    // when
    const screen = await renderScreen(hbs`
      <SessionSupervising::CandidateInList
        @candidate={{this.candidate}}
        @toggleCandidate={{this.toggleCandidate}}
      />
    `);

    // then
    assert.dom('.session-supervising-candidate-in-list').hasText('Zen Whoberi Ben Titan Gamora 28/05/1984 · Temps majoré : 8%');
    assert.dom(screen.getByRole('checkbox', { name: 'Zen Whoberi Ben Titan Gamora' })).isNotChecked();
  });

  module('when the candidate is authorized to start', function() {
    test('it renders the checkbox checked', async function(assert) {
      // given
      this.candidate = store.createRecord('certification-candidate-for-supervising', {
        id: 456,
        firstName: 'Star',
        lastName: 'Lord',
        birthdate: '1983-06-28',
        extraTimePercentage: '12',
        authorizedToStart: true,
        assessmentStatus: null,
      });
      this.toggleCandidate = sinon.spy();

      // when
      const screen = await renderScreen(hbs`
        <SessionSupervising::CandidateInList
          @candidate={{this.candidate}}
          @toggleCandidate={{this.toggleCandidate}}
        />
      `);

      // then
      assert.dom('.session-supervising-candidate-in-list').hasText('Lord Star 28/06/1983 · Temps majoré : 12%');
      assert.dom(screen.getByRole('checkbox', { name: 'Lord Star' })).isChecked();
    });
    test('it does not display neither "en cours" label nor the options menu button', async function(assert) {
      // given
      this.candidate = store.createRecord('certification-candidate-for-supervising', {
        id: 789,
        firstName: 'Rocket',
        lastName: 'Racoon',
        birthdate: '1982-07-28',
        extraTimePercentage: null,
        authorizedToStart: true,
        assessmentStatus: null,
      });
      this.toggleCandidate = sinon.spy();

      // when
      const screen = await renderScreen(hbs`
        <SessionSupervising::CandidateInList
          @candidate={{this.candidate}}
          @toggleCandidate={{this.toggleCandidate}}
        />
      `);

      // then
      assert.dom(screen.queryByRole('button', { name: 'Afficher les options du candidat' })).doesNotExist();
      assert.notContains('En cours');
    });
  });

  module('when the candidate has started the test', function() {
    test('it displays the "en cours" label and the options menu button', async function(assert) {
      // given
      this.candidate = store.createRecord('certification-candidate-for-supervising', {
        id: 789,
        firstName: 'Rocket',
        lastName: 'Racoon',
        birthdate: '1982-07-28',
        extraTimePercentage: null,
        authorizedToStart: true,
        assessmentStatus: 'started',
      });
      this.toggleCandidate = sinon.spy();

      // when
      const screen = await renderScreen(hbs`
        <SessionSupervising::CandidateInList
          @candidate={{this.candidate}}
          @toggleCandidate={{this.toggleCandidate}}
        />
      `);

      // then
      assert.dom('.session-supervising-candidate-in-list').hasText('Racoon Rocket 28/07/1982 En cours');
      assert.dom(screen.queryByRole('checkbox', { name: 'Racoon Rocket' })).doesNotExist();
      assert.dom(screen.queryByRole('button', { name: 'Afficher les options du candidat' })).exists();
    });

    module('when the candidate options button is clicked', function() {
      test('it displays the "autoriser la reprise" option', async function(assert) {
        // given
        this.candidate = store.createRecord('certification-candidate-for-supervising', {
          id: 1123,
          firstName: 'Drax',
          lastName: 'The Destroyer',
          birthdate: '1928-08-27',
          extraTimePercentage: null,
          authorizedToStart: true,
          assessmentStatus: 'started',
        });
        this.toggleCandidate = sinon.spy();
        const screen = await renderScreen(hbs`
          <SessionSupervising::CandidateInList
            @candidate={{this.candidate}}
            @toggleCandidate={{this.toggleCandidate}}
          />
        `);

        // when
        await click(screen.getByRole('button', { name: 'Afficher les options du candidat' }));

        // then
        assert.dom(screen.getByRole('button', { name: 'Autoriser la reprise du test' })).exists();
      });

      test('it displays the "Terminer le test" option', async function(assert) {
        // given
        this.candidate = store.createRecord('certification-candidate-for-supervising', {
          id: 1123,
          firstName: 'Drax',
          lastName: 'The Destroyer',
          birthdate: '1928-08-27',
          extraTimePercentage: null,
          authorizedToStart: true,
          assessmentStatus: 'started',
        });
        this.toggleCandidate = sinon.spy();
        const screen = await renderScreen(hbs`
          <SessionSupervising::CandidateInList
            @candidate={{this.candidate}}
            @toggleCandidate={{this.toggleCandidate}}
          />
        `);

        // when
        await click(screen.getByRole('button', { name: 'Afficher les options du candidat' }));

        // then
        assert.dom(screen.getByRole('button', { name: 'Terminer le test' })).exists();
      });

      module('when the "autoriser la reprise" option is clicked', function() {
        test('it displays a confirmation modal', async function(assert) {
          // given
          this.candidate = store.createRecord('certification-candidate-for-supervising', {
            id: 1123,
            firstName: 'Drax',
            lastName: 'The Destroyer',
            birthdate: '1928-08-27',
            extraTimePercentage: null,
            authorizedToStart: true,
            assessmentStatus: 'started',
          });
          this.toggleCandidate = sinon.spy();
          const screen = await renderScreen(hbs`
          <SessionSupervising::CandidateInList
            @candidate={{this.candidate}}
            @toggleCandidate={{this.toggleCandidate}}
          />
        `);

          // when
          await click(screen.getByRole('button', { name: 'Afficher les options du candidat' }));
          await click(screen.getByRole('button', { name: 'Autoriser la reprise du test' }));

          // then
          assert.dom(screen.getByRole('button', { name: 'Je confirme l\'autorisation' })).exists();
          assert.contains('Autoriser Drax The Destroyer à reprendre son test ?');
          assert.contains('Si le candidat a fermé la fenêtre de son test de certification (par erreur, ou à cause d\'un problème technique) et est toujours présent dans la salle de test, vous pouvez lui permettre de reprendre son test à l\'endroit où il l\'avait quitté.');
        });

        module('when the confirmation modal "Annuler" button is clicked', function() {
          test('it closes the confirmation modal', async function(assert) {
            // given
            this.candidate = store.createRecord('certification-candidate-for-supervising', {
              id: 1123,
              firstName: 'Drax',
              lastName: 'The Destroyer',
              birthdate: '1928-08-27',
              extraTimePercentage: null,
              authorizedToStart: true,
              assessmentStatus: 'started',
            });
            this.toggleCandidate = sinon.spy();
            const screen = await renderScreen(hbs`
          <SessionSupervising::CandidateInList
            @candidate={{this.candidate}}
            @toggleCandidate={{this.toggleCandidate}}
          />
        `);

            // when
            await click(screen.getByRole('button', { name: 'Afficher les options du candidat' }));
            await click(screen.getByRole('button', { name: 'Autoriser la reprise du test' }));
            await click(screen.getByRole('button', { name: 'Annuler et fermer la fenêtre de confirmation' }));

            // then
            assert.dom(screen.queryByRole('button', { name: 'Je confirme l\'autorisation' })).doesNotExist();
          });
        });

        module('when the confirmation modal "Fermer" button is clicked', function() {
          test('it closes the confirmation modal', async function(assert) {
            // given
            this.candidate = store.createRecord('certification-candidate-for-supervising', {
              id: 1123,
              firstName: 'Drax',
              lastName: 'The Destroyer',
              birthdate: '1928-08-27',
              extraTimePercentage: null,
              authorizedToStart: true,
              assessmentStatus: 'started',
            });
            this.toggleCandidate = sinon.spy();
            const screen = await renderScreen(hbs`
          <SessionSupervising::CandidateInList
            @candidate={{this.candidate}}
            @toggleCandidate={{this.toggleCandidate}}
          />
        `);

            // when
            await click(screen.getByRole('button', { name: 'Afficher les options du candidat' }));
            await click(screen.getByRole('button', { name: 'Autoriser la reprise du test' }));
            await click(screen.getByRole('button', { name: 'Fermer la fenêtre de confirmation' }));

            // then
            assert.dom(screen.queryByRole('button', { name: 'Je confirme l\'autorisation' })).doesNotExist();
          });
        });

        module('when the confirmation modal "Je confirme…" button is clicked', function() {
          module('when the authorization succeeds', function() {
            test('it closes the modal and displays a success notification', async function(assert) {
              // given
              this.candidate = store.createRecord('certification-candidate-for-supervising', {
                firstName: 'Yondu',
                lastName: 'Undonta',
                authorizedToStart: true,
                assessmentStatus: 'started',
              });
              this.toggleCandidate = sinon.spy();
              this.authorizeTestResume = sinon.stub().resolves();
              const screen = await renderScreen(hbs`
                <SessionSupervising::CandidateInList
                  @candidate={{this.candidate}}
                  @toggleCandidate={{this.toggleCandidate}}
                  @onCandidateTestResumeAuthorization={{this.authorizeTestResume}}
                />
                <NotificationContainer @position="bottom-right" />
              `);

              // when
              await click(screen.getByRole('button', { name: 'Afficher les options du candidat' }));
              await click(screen.getByRole('button', { name: 'Autoriser la reprise du test' }));
              await click(screen.getByRole('button', { name: 'Je confirme l\'autorisation' }));

              // then
              sinon.assert.calledOnce(this.authorizeTestResume);
              assert.dom(screen.queryByRole('button', { name: 'Je confirme l\'autorisation' })).doesNotExist();
              assert.contains('Succès ! Yondu Undonta peut reprendre son test de certification.');
            });
          });

          module('when the authorization fails', function() {
            test('it closes the modal and displays an error notification', async function(assert) {
              // given
              this.candidate = store.createRecord('certification-candidate-for-supervising', {
                firstName: 'Vance',
                lastName: 'Astro',
                authorizedToStart: true,
                assessmentStatus: 'started',
              });
              this.toggleCandidate = sinon.spy();
              this.authorizeTestResume = sinon.stub().rejects();
              const screen = await renderScreen(hbs`
                <SessionSupervising::CandidateInList
                  @candidate={{this.candidate}}
                  @toggleCandidate={{this.toggleCandidate}}
                  @onCandidateTestResumeAuthorization={{this.authorizeTestResume}}
                />
                <NotificationContainer @position="bottom-right" />
              `);

              // when
              await click(screen.getByRole('button', { name: 'Afficher les options du candidat' }));
              await click(screen.getByRole('button', { name: 'Autoriser la reprise du test' }));
              await click(screen.getByRole('button', { name: 'Je confirme l\'autorisation' }));

              // then
              sinon.assert.calledOnce(this.authorizeTestResume);
              assert.dom(screen.queryByRole('button', { name: 'Je confirme l\'autorisation' })).doesNotExist();
              assert.contains('Une erreur est survenue, Vance Astro n\'a a pu être autorisé à reprendre son test.');
            });
          });
        });
      });

      module('when the "Terminer le test" option is clicked', function() {
        test('it displays a confirmation modal', async function(assert) {
          // given
          this.candidate = store.createRecord('certification-candidate-for-supervising', {
            id: 1123,
            firstName: 'Drax',
            lastName: 'The Destroyer',
            birthdate: '1928-08-27',
            extraTimePercentage: null,
            authorizedToStart: true,
            assessmentStatus: 'started',
          });
          this.toggleCandidate = sinon.spy();
          const screen = await renderScreen(hbs`
          <SessionSupervising::CandidateInList
            @candidate={{this.candidate}}
            @toggleCandidate={{this.toggleCandidate}}
          />
        `);

          // when
          await click(screen.getByRole('button', { name: 'Afficher les options du candidat' }));
          await click(screen.getByRole('button', { name: 'Terminer le test' }));

          // then
          assert.dom(screen.getByRole('button', { name: 'Terminer ce test' })).exists();
          assert.contains('Attention : cette action entraine la fin de son test de certification et est irréversible.');
          assert.contains('Terminer le test de Drax The Destroyer ?');
        });

        module('when the confirmation modal "Annuler" button is clicked', function() {
          test('it closes the confirmation modal', async function(assert) {
            // given
            this.candidate = store.createRecord('certification-candidate-for-supervising', {
              id: 1123,
              firstName: 'Drax',
              lastName: 'The Destroyer',
              birthdate: '1928-08-27',
              extraTimePercentage: null,
              authorizedToStart: true,
              assessmentStatus: 'started',
            });
            this.toggleCandidate = sinon.spy();
            const screen = await renderScreen(hbs`
          <SessionSupervising::CandidateInList
            @candidate={{this.candidate}}
            @toggleCandidate={{this.toggleCandidate}}
          />
        `);

            // when
            await click(screen.getByRole('button', { name: 'Afficher les options du candidat' }));
            await click(screen.getByRole('button', { name: 'Terminer le test' }));
            await click(screen.getByRole('button', { name: 'Annuler et fermer la fenêtre de confirmation' }));

            // then
            assert.dom(screen.queryByRole('button', { name: 'Terminer ce test' })).doesNotExist();
          });
        });

        module('when the confirmation modal "Fermer" button is clicked', function() {
          test('it closes the confirmation modal', async function(assert) {
            // given
            this.candidate = store.createRecord('certification-candidate-for-supervising', {
              id: 1123,
              firstName: 'Drax',
              lastName: 'The Destroyer',
              birthdate: '1928-08-27',
              extraTimePercentage: null,
              authorizedToStart: true,
              assessmentStatus: 'started',
            });
            this.toggleCandidate = sinon.spy();
            const screen = await renderScreen(hbs`
          <SessionSupervising::CandidateInList
            @candidate={{this.candidate}}
            @toggleCandidate={{this.toggleCandidate}}
          />
        `);

            // when
            await click(screen.getByRole('button', { name: 'Afficher les options du candidat' }));
            await click(screen.getByRole('button', { name: 'Autoriser la reprise du test' }));
            await click(screen.getByRole('button', { name: 'Fermer la fenêtre de confirmation' }));

            // then
            assert.dom(screen.queryByRole('button', { name: 'Terminer ce test' })).doesNotExist();
          });
        });

        module('when the confirmation modal "Terminer le test" button is clicked', function() {
          module('when the end by supervisors succeeds', function() {
            test('it closes the end test modal and displays a success notification', async function(assert) {
              // given
              this.candidate = store.createRecord('certification-candidate-for-supervising', {
                firstName: 'Yondu',
                lastName: 'Undonta',
                authorizedToStart: true,
                assessmentStatus: 'started',
              });
              this.toggleCandidate = sinon.spy();
              this.endTestForCandidate = sinon.stub().resolves();
              const screen = await renderScreen(hbs`
                <SessionSupervising::CandidateInList
                  @candidate={{this.candidate}}
                  @toggleCandidate={{this.toggleCandidate}}
                  @onSupervisorEndTest={{this.endTestForCandidate}}
                />
                <NotificationContainer @position="bottom-right" />
              `);

              // when
              await click(screen.getByRole('button', { name: 'Afficher les options du candidat' }));
              await click(screen.getByRole('button', { name: 'Terminer le test' }));
              await click(screen.getByRole('button', { name: 'Terminer ce test' }));

              // then
              sinon.assert.calledOnce(this.endTestForCandidate);
              assert.dom(screen.queryByRole('button', { name: 'Terminer ce test' })).doesNotExist();
              assert.contains('Succès ! Le test de  Yondu Undonta est terminé.');
            });
          });

          module('when the end by supervisor fails', function() {
            test('it closes the end test modal and displays an error notification', async function(assert) {
              // given
              this.candidate = store.createRecord('certification-candidate-for-supervising', {
                firstName: 'Vance',
                lastName: 'Astro',
                authorizedToStart: true,
                assessmentStatus: 'started',
              });
              this.toggleCandidate = sinon.spy();
              this.endTestBySupervisor = sinon.stub().rejects();
              const screen = await renderScreen(hbs`
                <SessionSupervising::CandidateInList
                  @candidate={{this.candidate}}
                  @toggleCandidate={{this.toggleCandidate}}
                  @onSupervisorEndTest={{this.endTestBySupervisor}}
                />
                <NotificationContainer @position="bottom-right" />
              `);

              // when
              await click(screen.getByRole('button', { name: 'Afficher les options du candidat' }));
              await click(screen.getByRole('button', { name: 'Terminer le test' }));
              await click(screen.getByRole('button', { name: 'Terminer ce test' }));

              // then
              sinon.assert.calledOnce(this.endTestBySupervisor);
              assert.dom(screen.queryByRole('button', { name: 'Terminer le test' })).doesNotExist();
              assert.contains('Une erreur est survenue, le test de Vance Astro n\'a pas pu être terminé');
            });
          });
        });
      });
    });
  });

  module('when the checkbox is clicked', function() {
    module('when the candidate is already authorized', function() {
      test('it calls the argument callback with candidate and false', async function(assert) {
        // given
        this.candidate = store.createRecord('certification-candidate-for-supervising', {
          id: 123,
          firstName: 'Toto',
          lastName: 'Tutu',
          birthdate: '1984-05-28',
          extraTimePercentage: '8',
          authorizedToStart: true,
          assessmentResult: null,
        });
        this.toggleCandidate = sinon.spy();

        const screen = await renderScreen(hbs`<SessionSupervising::CandidateInList
          @candidate={{this.candidate}}
          @toggleCandidate={{this.toggleCandidate}}
        />`);
        const checkbox = screen.getByRole('checkbox');

        // when
        await checkbox.click();

        // then
        sinon.assert.calledOnceWithExactly(this.toggleCandidate, this.candidate);
        assert.ok(true);
      });
    });

    module('when the candidate is not authorized', function() {
      test('it calls the argument callback with candidate', async function(assert) {
        // given
        const candidate = store.createRecord('certification-candidate-for-supervising', {
          id: 123,
          firstName: 'Toto',
          lastName: 'Tutu',
          birthdate: '1984-05-28',
          extraTimePercentage: '8',
          authorizedToStart: false,
          assessmentResult: null,
        });
        this.sessionForSupervising = store.createRecord('session-for-supervising', {
          certificationCandidates: [candidate],
        });
        this.toggleCandidate = sinon.spy();

        const screen = await renderScreen(hbs`<SessionSupervising::CandidateInList
            @candidates={{this.sessionForSupervising.certificationCandidates}}
            @toggleCandidate={{this.toggleCandidate}}
        />`);
        const checkbox = screen.getByRole('checkbox');

        // when
        await checkbox.click();

        // then
        sinon.assert.calledOnceWithExactly(this.toggleCandidate, this.candidate);
        assert.ok(true);
      });
    });
  });
});

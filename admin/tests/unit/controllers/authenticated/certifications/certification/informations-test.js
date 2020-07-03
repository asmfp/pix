import { module, test } from 'qunit';
import sinon from 'sinon';
import { setupTest } from 'ember-qunit';
import { getSettledState, settled } from '@ember/test-helpers';

import EmberObject from '@ember/object';

module('Unit | Controller | authenticated/certifications/certification/informations', function(hooks) {

  setupTest(hooks);

  const createCompetence = (code, score, level) => {
    return {
      competence_code: code,
      score: score,
      level: level
    };
  };

  const createMark = ({
    competence_code,
    score,
    level
  }) => {
    return {
      competence_code,
      level,
      score,
      area_code: competence_code.substr(0, 1),
      'competence-id': undefined,
    };
  };

  const aNewCompetenceCode = '4.2';
  const anExistingCompetenceCode = '1.1';
  const anExistingCompetenceWithNoScoreCode = '1.2';
  const anExistingCompetenceWithNoLevelCode = '1.3';
  const anotherExistingCompetenceCode = '5.2';

  const competencesWithMark = [
    createCompetence(anExistingCompetenceCode, 24, 3),
    createCompetence(anExistingCompetenceWithNoScoreCode, null, 5),
    createCompetence(anExistingCompetenceWithNoLevelCode, 40, null),
    createCompetence(anotherExistingCompetenceCode, 33, 4)
  ];

  let controller;

  hooks.beforeEach(function() {
    controller = this.owner.lookup('controller:authenticated/certifications/certification/informations');
  });

  module('#onUpdateScore', () => {

    module('when there is a given score', function() {

      test('it replaces competence score correctly', async function(assert) {
        // given
        controller.set('model', EmberObject.create({
          competencesWithMark
        }));

        // when
        await controller.onUpdateScore(anExistingCompetenceCode, '55');

        // then
        const competences = controller.certification.competencesWithMark;
        const aCompetence = competences.find((value) => value.competence_code === anExistingCompetenceCode);
        assert.equal(aCompetence.score, 55);
      });
    });

    module('when there is no given score and competence has no level', function() {

      test('it removes competence correctly (score)', async function(assert) {
        // given
        controller.set('model', EmberObject.create({
          competencesWithMark
        }));

        // when
        await controller.onUpdateScore(anExistingCompetenceWithNoLevelCode, '');

        // then
        const competences = controller.certification.competencesWithMark;
        const aCompetence = competences.find((value) => value.competence_code === anExistingCompetenceWithNoLevelCode);

        assert.notOk(aCompetence);
      });
    });

    module('when the competence is not present', function() {

      test('it creates competence score correctly', async function(assert) {
        // given
        controller.set('model', EmberObject.create({
          competencesWithMark
        }));

        // when
        await controller.onUpdateScore(aNewCompetenceCode, '55');

        // then
        const competences = controller.certification.competencesWithMark;
        const aCompetence = competences.find((value) => value.competence_code === aNewCompetenceCode);
        assert.equal(aCompetence.score, 55);
      });
    });
  });

  module('#onUpdateLevel', () => {

    module('when there is a given level', function() {

      test('it replaces competence level correctly', async function(assert) {
        // given
        controller.set('model', EmberObject.create({
          competencesWithMark
        }));

        // when
        await controller.onUpdateLevel(anExistingCompetenceCode, '5');

        // then
        const competences = controller.certification.competencesWithMark;
        const aCompetence = competences.find((value) => value.competence_code === anExistingCompetenceCode);
        assert.equal(aCompetence.level, 5);
      });
    });

    module('when there is no given level and competence has no score', function() {

      test('it removes competence correctly (level)', async function(assert) {
        // given
        controller.set('model', EmberObject.create({
          competencesWithMark
        }));

        // when
        await controller.onUpdateLevel(anExistingCompetenceWithNoScoreCode, '');

        // then
        const competences = controller.certification.competencesWithMark;
        const aCompetence = competences.find((value) => value.competence_code === anExistingCompetenceWithNoScoreCode);

        assert.notOk(aCompetence);
      });
    });

    module('when the competence is not present', function() {

      test('it creates competence level correctly', async function(assert) {
        // given
        controller.set('model', EmberObject.create({
          competencesWithMark
        }));

        // when
        await controller.onUpdateLevel(aNewCompetenceCode, '8');

        // then
        const competences = controller.certification.competencesWithMark;
        const aCompetence = competences.find((value) => value.competence_code === aNewCompetenceCode);
        assert.equal(aCompetence.level, 8);
      });
    });
  });

  module('#onSave', () => {

    test('it saves competences info when save is sent', async function(assert) {
      // given
      const save = sinon.stub().resolves();
      const store = this.owner.lookup('service:store');

      const certification = store.createRecord('certification', {
        competencesWithMark
      });
      certification.save = save;
      controller.certification = certification;

      // when
      await controller.onSave();

      // then
      sinon.assert.calledWith(save, { adapterOptions: { updateMarks: false } });
      sinon.assert.calledWith(save, { adapterOptions: { updateMarks: true } });
      assert.ok(true);
    });

    test('marks are not updated when no change has been made and save is sent', async function(assert) {
      // given
      const save = sinon.stub().resolves();
      const store = this.owner.lookup('service:store');

      const certification = store.createRecord('certification');
      certification.save = save;
      certification.hasDirtyAttributes = false;
      controller.certification = certification;

      // when
      await controller.onSave();

      // then
      sinon.assert.calledWith(save, { adapterOptions: { updateMarks: false } });
      sinon.assert.neverCalledWith(save, { adapterOptions: { updateMarks: true } });
      assert.ok(true);
    });
  });

  module('#onCheckMarks', () => {
    module('when there is no mark', () => {
      test('should not set competencesWithMark', async (assert) => {
        // given
        //const store = this.owner.lookup('service:mark-store');
        controller.certification =  EmberObject.create({ competencesWithMark });

        // when
        await controller.onCheckMarks();
        // then
        assert.deepEqual(controller.certification.competencesWithMark, competencesWithMark);
      });
    });

    module('when there are marks', () => {
      test('should set competencesWithMark', async function(assert) {

        // given
        const score = 100;
        const anExistingCompetence =  competencesWithMark.find((value) => value.competence_code === anExistingCompetenceCode);

        const expectedCompetencesWithMark = [
          createMark({
            competence_code: anExistingCompetenceCode,
            level: anExistingCompetence.level + 1,
            score: anExistingCompetence.score + 1,
          }),
          createMark({
            competence_code: aNewCompetenceCode,
            level: 5,
            score: 6,
          }),
        ];

        const store = this.owner.lookup('service:mark-store');
        store.storeState({
          score,
          marks: {
            [anExistingCompetenceCode]: {
              level: anExistingCompetence.level + 1,
              score: anExistingCompetence.score + 1,
            },
            [aNewCompetenceCode]: {
              level: 5,
              score: 6,
            },
          },
        });

        // when
        await controller.onCheckMarks();
        const state = await getSettledState();

        // then
        assert.equal(controller.certification.pixScore, score);
        assert.deepEqual(controller.certification.competencesWithMark, expectedCompetencesWithMark);
        assert.ok(state.hasPendingTimers);

        await settled();
        assert.ok(controller.edition);
      });
    });
  });

  test('it restores competences when cancel is sent', async function(assert) {
    // given
    const rollbackAttributes = sinon.stub().resolves();
    controller.set('model', EmberObject.create({
      competencesWithMark,
      rollbackAttributes
    }));

    await controller.onEdit();
    await controller.onUpdateLevel(anExistingCompetenceCode, '5');
    await controller.onUpdateScore(anExistingCompetenceCode, '50');
    await controller.onUpdateLevel(anotherExistingCompetenceCode, '');
    await controller.onUpdateScore(anotherExistingCompetenceCode, '');

    // when
    await controller.onCancel();

    // then
    const competences = controller.certification.competencesWithMark;

    let aCompetence = competences.find((value) => value.competence_code === anotherExistingCompetenceCode);
    let aCompetenceRef = competencesWithMark.find((value) => value.competence_code === anotherExistingCompetenceCode);
    assert.equal(aCompetence.score, aCompetenceRef.score);
    assert.equal(aCompetence.level, aCompetenceRef.level);

    aCompetence = competences.find((value) => value.competence_code === anExistingCompetenceCode);
    aCompetenceRef = competencesWithMark.find((value) => value.competence_code === anExistingCompetenceCode);
    assert.equal(aCompetence.score, aCompetenceRef.score);
    assert.equal(aCompetence.level, aCompetenceRef.level);

    sinon.assert.calledOnce(rollbackAttributes);
  });

});

import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';
import Service from '@ember/service';
import { render as renderScreen } from '@1024pix/ember-testing-library';

function getMetaForPage(pageNumber) {
  const rowCount = 50;
  const pageSize = 25;
  return {
    page: pageNumber,
    pageSize,
    rowCount,
    pageCount: Math.ceil(rowCount / pageSize),
  };
}

module('Integration | Component | pagination-control', function (hooks) {
  setupRenderingTest(hooks);

  test('it should disable previous button when user is on first page', async function (assert) {
    // given
    this.meta = getMetaForPage(1);

    // when
    await render(hbs`<PaginationControl @pagination={{meta}}/>`);

    // then
    assert.dom('.page-navigation__arrow--previous').hasClass('page-navigation__arrow--disabled');
    assert.dom('.page-navigation__arrow--previous .icon-button').hasClass('disabled');
  });

  test('it should disable next button when user is on last page', async function (assert) {
    // given
    this.meta = getMetaForPage(2);

    // when
    await render(hbs`<PaginationControl @pagination={{meta}}/>`);

    // then
    assert.dom('.page-navigation__arrow--next').hasClass('page-navigation__arrow--disabled');
    assert.dom('.page-navigation__arrow--next .icon-button').hasClass('disabled');
  });

  test('it should enable previous button when user is on second page', async function (assert) {
    // given
    this.meta = getMetaForPage(2);

    // when
    await render(hbs`<PaginationControl @pagination={{meta}}/>`);

    // then
    assert.dom('.page-navigation__arrow--previous').hasNoClass('page-navigation__arrow--disabled');
    assert.dom('.page-navigation__arrow--previous .icon-button').hasNoClass('disabled');
  });

  test('it should re-route to page with changed page size', async function (assert) {
    const replaceWithStub = sinon.stub();
    class RouterStub extends Service {
      replaceWith = replaceWithStub;
    }
    this.owner.register('service:router', RouterStub);
    this.meta = getMetaForPage(2);
    const screen = await renderScreen(hbs`<PaginationControl @pagination={{meta}}/>`);

    // when
    await fillIn(screen.getByLabelText("Nombre d'éléments par page"), '25');

    // then
    assert.ok(replaceWithStub.calledWith({ queryParams: { pageSize: '25', pageNumber: 1 } }));
  });
});

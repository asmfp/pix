import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit | Model | user model', function () {
  setupTest();

  let store;

  beforeEach(function () {
    store = this.owner.lookup('service:store');
  });

  it('exists', function () {
    const model = store.createRecord('user');
    expect(model).to.be.ok;
  });

  describe('#fullName', () => {
    it('should concatenate user first and last name', function () {
      // given
      const model = store.createRecord('user');
      model.firstName = 'Manu';
      model.lastName = 'Phillip';

      // when
      const fullName = model.fullName;

      // then
      expect(fullName).to.equal('Manu Phillip');
    });
  });
});

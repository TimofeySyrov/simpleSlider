/**
 * @jest-environment jsdom
 */

import Controller from '../Controller';
import defaultModelOptions from '../../utils/defaultModelOptions';
import IModelOptions from '../../utils/interfaces/IUserOptions';

describe('Controller:', () => {
  describe('updateOptions:', () => {
    test('должен обновлять опции слайдера', () => {
      const someNewOptions: IModelOptions = {
        step: 2,
        withScale: false,
      };

      const mockParent = document.createElement('div');
      const controller = new Controller(mockParent, defaultModelOptions);

      controller.updateOptions(someNewOptions);

      expect(controller.options).toStrictEqual({ ...defaultModelOptions, ...someNewOptions });
    });
  });
});

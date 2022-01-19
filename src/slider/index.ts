/// <reference path="./utils/interfaces/IJQuerySlider.d.ts" />

import IUserOptions from './utils/interfaces/IUserOptions';
import { DomParent } from './utils/types/namespace';
import defaultModelOptions from './utils/defaultModelOptions';
import SimpleSlider from './simpleSlider';

/* eslint-disable func-names, no-param-reassign */
(function ($) {
  $.fn.simpleSlider = function (options?: IUserOptions) {
    const domParent: DomParent = this[0];
    const finalOptions: IUserOptions = $.extend({}, defaultModelOptions, options);

    const slider = new SimpleSlider(domParent, finalOptions);

    return slider;
  };
}(jQuery));
/* eslint-enable func-names, no-param-reassign */

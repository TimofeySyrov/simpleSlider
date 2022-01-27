/// <reference path="./utils/interfaces/IJQuerySlider.d.ts" />

import IUserOptions from './utils/interfaces/IUserOptions';
import { DomParent } from './utils/types/namespace';
import defaultModelOptions from './utils/defaultModelOptions';
import SimpleSlider from './simpleSlider';

/* eslint-disable func-names, no-param-reassign */
(function ($) {
  $.fn.simpleSlider = function (userOptions?: IUserOptions) {
    const domParent: DomParent = this[0];
    const mergedOptions: IUserOptions = $.extend({}, defaultModelOptions, userOptions);
    const slider = new SimpleSlider(domParent, mergedOptions);

    $(domParent).data('simpleSlider', slider);

    return domParent;
  };
}(jQuery));
/* eslint-enable func-names, no-param-reassign */

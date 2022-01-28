/// <reference path="./utils/interfaces/jquerySimpleSlider.d.ts" />

import { DomParent } from './utils/types/namespace';
import SimpleSlider from './simpleSlider';
import Options from './utils/interfaces/options';
import defaultOptions from './utils/defaultOptions';

/* eslint-disable func-names, no-param-reassign */
(function ($) {
  $.fn.simpleSlider = function (options?: Partial<Options>) {
    const domParent: DomParent = this[0];
    const mergedOptions: Options = $.extend({}, defaultOptions, options);
    const slider = new SimpleSlider(domParent, mergedOptions);

    $(domParent).data('simpleSlider', slider);

    return domParent;
  };
}(jQuery));
/* eslint-enable func-names, no-param-reassign */

/// <reference path="./interfaces/IJQuerySlider.d.ts" />

import IModelOptions from "./interfaces/IModelOptions";
import defaultModelOptions from "./model/utils/defaultModelOptions";
import SimpleSlider from "./simpleSlider";

(function ( $ ) {
  $.fn.simpleSlider = function (options: IModelOptions) {

    const domParent:HTMLDivElement = this[0];
    const finalOptions = $.extend(defaultModelOptions, options);

    const simpleSlider = new SimpleSlider(domParent, finalOptions)

    return simpleSlider;
  }
}(jQuery));
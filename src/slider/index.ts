/// <reference path="./interfaces/IJQuerySlider.d.ts" />

import IModelOptions from "./interfaces/IModelOptions";
import SimpleSlider from "./simpleSlider";

(function ( $ ) {
  $.fn.simpleSlider = function (options: IModelOptions) {

    const domParent:HTMLDivElement = this[0];

    const simpleSlider = new SimpleSlider(domParent, options)

    return simpleSlider
  }
}(jQuery));
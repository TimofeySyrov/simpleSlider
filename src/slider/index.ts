/// <reference path="./interfaces/IJQuerySlider.d.ts" />

import IModelOptions from "./interfaces/IModelOptions";
import { TDomParent } from "./interfaces/namespace";
import defaultModelOptions from "./model/utils/defaultModelOptions";
import SimpleSlider from "./simpleSlider";

(function ( $ ) {
  $.fn.simpleSlider = function (options?: IModelOptions) {
    
    const domParent: TDomParent = this[0];
    let finalOptions = $.extend({}, defaultModelOptions, options);

    const slider = new SimpleSlider(domParent, finalOptions);

    return slider;
  }
}(jQuery));
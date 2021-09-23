/// <reference path="./utils/interfaces/IJQuerySlider.d.ts" />

import IUserOptions from "./utils/interfaces/IUserOptions";
import { TDomParent } from "./utils/types/namespace";
import defaultModelOptions from "./utils/defaultModelOptions";
import SimpleSlider from "./simpleSlider";

(function ( $ ) {
  $.fn.simpleSlider = function (options?: IUserOptions) {
    
    const domParent: TDomParent = this[0];
    const finalOptions: IUserOptions = $.extend({}, defaultModelOptions, options);

    const slider = new SimpleSlider(domParent, finalOptions);

    return slider;
  }
}(jQuery));
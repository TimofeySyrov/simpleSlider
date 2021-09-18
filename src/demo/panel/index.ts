/// <reference path="./interfaces/index.d.ts" />

import { TDomParent } from "../../slider/interfaces/namespace";
import SimpleSlider from "../../slider/simpleSlider";
import SimpleSliderPanel from "./SimpleSliderPanel";

(function ( $ ) {
  $.fn.simpleSliderPanel = function (slider: SimpleSlider) {
    
    const domParent: TDomParent = this[0];

    const panel = new SimpleSliderPanel(domParent, slider);

    return panel;
  }
}(jQuery));
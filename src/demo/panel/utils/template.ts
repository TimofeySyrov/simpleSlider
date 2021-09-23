const template = `
  <div class="panel__container">
    <div class="panel__item">
      <div class="panel__item-title">Diapason:</div>
      <div class="panel__form">
        <label class="panel__label">
          <span class="panel__label-title">min</span>
          <input type="number" data-option-type="min" class="panel__input panel__min-input js-panel__min-input">
        </label>
        <label class="panel__label">
          <span class="panel__label-title">max</span>
          <input type="number" data-option-type="max" class="panel__input panel__max-input js-panel__max-input">
        </label>
      </div>
    </div>
    <div class="panel__item">
      <div class="panel__item-title">Current value:</div>
      <div class="panel__form">
        <label class="panel__label">
          <span class="panel__label-title">from</span>
          <input type="number" data-option-type="from" class="panel__input panel__from-input js-panel__from-input">
        </label>
        <label class="panel__label">
          <span class="panel__label-title">to</span>
          <input type="number" data-option-type="to" class="panel__input panel__to-input js-panel__to-input">
        </label>
      </div>
    </div>
    <div class="panel__item">
      <div class="panel__form">
        <label class="panel__label panel__label_single">
          <span class="panel__label-title">Step:</span>
          <input type="number" data-option-type="step" class="panel__input panel__step-input js-panel__step-input">
        </label>
      </div>
    </div>
    <div class="panel__item">
      <div class="panel__item-title">Orientation:</div>
      <form class="panel__form panel__orient-form">
        <label class="panel__label">
          <input type="radio" name="orientation" data-option-type="orientation" value="vertical" class="panel__input panel__vertical-input js-panel__vertical-input">
          <span class="panel__label-title">vertical</span>
        </label>
        <label class="panel__label">
          <input type="radio" name="orientation" data-option-type="orientation" value="horizontal" class="panel__input panel__horizontal-input js-panel__horizontal-input">
          <span class="panel__label-title">horizontal</span>
        </label>
      </form>
    </div>
    <div class="panel__item">
      <div class="panel__item-title">Type:</div>
      <form class="panel__form panel__type-form">
        <label class="panel__label">
          <input type="radio" name="type" data-option-type="type" value="from-start" class="panel__input panel__from-start-input js-panel__from-start-input">
          <span class="panel__label-title">from-start</span>
        </label>
        <label class="panel__label">
          <input type="radio" name="type" data-option-type="type" value="from-end" class="panel__input panel__from-end-input js-panel__from-end-input">
          <span class="panel__label-title">from-end</span>
        </label>
        <label class="panel__label">
          <input type="radio" name="type" data-option-type="type" value="range" class="panel__input panel__range-input js-panel__range-input">
          <span class="panel__label-title">range</span>
        </label>
      </form>
    </div>
    <div class="panel__item">
      <div class="panel__item-title">Other settings:</div>
      <div class="panel__form">
        <label class="panel__label">
          <input type="checkbox" data-option-type="withRange" class="panel__input panel__range-input js-panel__withRange-input">
          <span class="panel__label-title">withRange</span>
        </label>
        <label class="panel__label">
          <input type="checkbox" data-option-type="withThumb" class="panel__input panel__thumb-input js-panel__withThumb-input">
          <span class="panel__label-title">withThumb</span>
        </label>
        <label class="panel__label">
          <input type="checkbox" data-option-type="withScale" class="panel__input panel__scale-input js-panel__withScale-input">
          <span class="panel__label-title">withScale</span>
        </label>
      </div>
    </div>
  </div>`;

export default template;

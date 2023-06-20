export class LumenItemSheet extends ItemSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['lumen', 'sheet', 'item'],
      width: 520,
      height: 480,
      tabs: [{ navSelector: '.sheet-tabs', contentSelector: '.sheet-body', initial: 'description' }]
    });
  }

  get template() {
    const path = 'systems/lumen/templates/item';
    return `${path}/item-sheet.html`;
  }

  getData() {
    const data = super.getData();
    return data;
  }

  setPosition(options = {}) {
    const position = super.setPosition(options);
    if (position) {
      const sheetBody = this.element.find('.sheet-body');
      const bodyHeight = position.height - 192;
      sheetBody.css('height', bodyHeight);
    }
    return position;
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Roll handlers, click handlers, etc. would go here.
  }
}

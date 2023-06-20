import type { LumenActorSheetData } from '../interfaces';

export class LumenActorSheet extends ActorSheet<ActorSheet.Options, LumenActorSheetData> {
  get template() {
    return `systems/${game.system.id}/templates/actor/actor-${this.actor.data.type}-sheet.html`;
  }

  /** @override */
  async getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = await super.getData();

    // Use a safe clone of the actor data for further operations.
    const actorData = context.actor.data;

    // Prepare character data and items.
    if (actorData.type == 'character') {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }

    // Prepare NPC data and items.
    if (actorData.type == 'npc') {
      this._prepareItems(context);
    }

    context.rollData = context.actor.getRollData();

    return context;
  }

  activateListeners(html: JQuery) {
    html.find('.item-create').on('click', this._onItemCreate.bind(this));
  }

  private _prepareCharacterData(_context: ActorSheet.Data<ActorSheet.Options>) {
    console.log('_prepareCharacterData');
  }

  private _prepareItems(_context: ActorSheet.Data<ActorSheet.Options>) {
    console.log('_prepareItems');
  }

  private async _onItemCreate(event: Event) {
    event?.preventDefault();
    console.log('_onItemCreate');
  }
}

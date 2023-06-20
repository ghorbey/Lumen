import { ActorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs';
import { EntryType } from '../common';

export type LumenActorType = EntryType.CHARACTER | EntryType.NPC;
export const LumenActorTypes: LumenActorType[] = [EntryType.CHARACTER, EntryType.NPC];

export class LumenActor extends Actor {
  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
  }

  /**
   * @override
   * Augment the basic actor data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const actorData = this.data;
    const _data = actorData.data;
    const _flags = actorData.flags.lumen || {};

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareCharacterData(actorData);
    this._prepareNpcData(actorData);
  }

  getRollData() {
    const data = super.getRollData();

    // Prepare character roll data.
    this._getCharacterRollData(data);
    this._getNpcRollData(data);

    return data;
  }

  private _prepareCharacterData(actorData: ActorData) {
    if (actorData.type !== 'character') return;
    const _data = actorData.data;
  }

  private _prepareNpcData(actorData: ActorData) {
    if (actorData.type !== 'npc') return;
    const _data = actorData.data;
  }

  private _getCharacterRollData(_data: object) {
    if (this.data.type !== 'character') return;
  }

  private _getNpcRollData(_data: object) {
    if (this.data.type !== 'npc') return;
  }
}

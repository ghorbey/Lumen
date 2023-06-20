import './lumen.scss';
import { LumenActor } from './module/actor/lumen-actor';
import { preloadHandlebarsTemplates } from './module/helpers/templates';
import { LumenItem } from './module/item/lumen-item';

window.addEventListener('unhandledrejection', function (event) {
  console.error('Unhandled rejection (promise: ', event.promise, ', reason: ', event.reason, ').');
});

Hooks.once('init', async function () {
  game.lumen = {
    entities: { LumenActor }
  };

  // Record Configuration Values
  CONFIG.Actor.documentClass = LumenActor;
  CONFIG.Item.documentClass = LumenItem;

  // Preload Handlebars templates.
  await preloadHandlebarsTemplates();
});

Hooks.once('ready', function () {
  // Include steps that need to happen after Foundry has fully loaded here.
});

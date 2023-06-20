export declare global {
  interface LenientGlobalVariableTypes {
    game: never;
    canvas: never;
  }

  namespace Game {
    interface SystemData {
      id: 'lumen';
    }
  }

  interface Game {
    lumen: {
      [x: string]: unknown;
    };
  }
}

import { ContextBridgeApi } from "postoffice-electron-context-bridge-js";

declare global {
  interface Window {
    electronAPI?: ContextBridgeApi;
  }

  interface VirtualKeyboardEventMap {
    geometrychange: Event;
  }
  interface VirtualKeyboard extends EventTarget {
    show(): void;
    hide(): void;
    readonly boundingRect: DOMRect;
    overlaysContent: boolean;
    ongeometrychange: ((this: VirtualKeyboard, ev: Event) => unknown) | null;
    addEventListener<K extends keyof VirtualKeyboardEventMap>(
      type: K,
      listener: (this: VirtualKeyboard, ev: VirtualKeyboardEventMap[K]) => unknown,
      options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof VirtualKeyboardEventMap>(
      type: K,
      listener: (this: VirtualKeyboard, ev: VirtualKeyboardEventMap[K]) => unknown,
      options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions,
    ): void;
  }

  interface Navigator {
    virtualKeyboard?: VirtualKeyboard;
  }
}

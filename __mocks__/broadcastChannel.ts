/* istanbul ignore file */
/* eslint-disable */

const channelCache: BroadcastChannel[] = [];

class StubBroadcastChannel implements BroadcastChannel {
  constructor(public readonly name: string) {
    channelCache.push(this);
  }

  onmessage = jest.fn();

  onmessageerror = jest.fn();

  close = jest.fn();

  postMessage = jest.fn().mockImplementation((data: any) => {
    channelCache.forEach((channel) => {
      if (channel === this) {
        return;
      }
      if (channel.onmessage && typeof data === "object" && channel.name === this.name) {
        channel.onmessage(new MessageEvent(this.name, data));
      }
    });
  });

  addEventListener<K extends keyof BroadcastChannelEventMap>(
    type: K,
    listener: (this: BroadcastChannel, ev: BroadcastChannelEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(type: any, listener: any, options?: any): void {
    throw new Error("Method not implemented.");
  }

  removeEventListener<K extends keyof BroadcastChannelEventMap>(
    type: K,
    listener: (this: BroadcastChannel, ev: BroadcastChannelEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;

  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;

  removeEventListener(type: any, listener: any, options?: any): void {
    throw new Error("Method not implemented.");
  }

  dispatchEvent(event: Event): boolean {
    throw new Error("Method not implemented.");
  }
}

function getBroadcastChannelInstances() {
  return [...channelCache];
}

function clearBroadcastChannelInstances() {
  channelCache.splice(0, channelCache.length);
}

function stubBroadcastChannel() {
  if (!window.BroadcastChannel) {
    window.BroadcastChannel = StubBroadcastChannel;
  }
}

export { stubBroadcastChannel, getBroadcastChannelInstances, clearBroadcastChannelInstances };

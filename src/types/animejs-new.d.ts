declare module 'animejs' {
  interface AnimeParams {
    targets?: any;
    translateX?: any;
    translateY?: any;
    translateZ?: any;
    rotateX?: any;
    rotateY?: any;
    rotateZ?: any;
    scaleX?: any;
    scaleY?: any;
    scaleZ?: any;
    scale?: any;
    opacity?: any;
    duration?: number;
    delay?: number | ((el: any, i: number, l: number) => number);
    easing?: string;
    loop?: boolean | number;
    direction?: string;
    autoplay?: boolean;
    complete?: () => void;
    update?: () => void;
    begin?: () => void;
    loopComplete?: () => void;
    changeComplete?: () => void;
    loopDelay?: number;
    endDelay?: number;
    round?: number;
    [key: string]: any;
  }

  interface AnimeInstance {
    play(): void;
    pause(): void;
    restart(): void;
    seek(time: number): void;
    reverse(): void;
    finished: Promise<void>;
  }

  interface AnimeTimelineInstance {
    add(params: AnimeParams, offset?: string | number): AnimeTimelineInstance;
    play(): void;
    pause(): void;
    restart(): void;
    seek(time: number): void;
    reverse(): void;
  }

  // Named exports for anime.js v4
  export function animate(params: AnimeParams): AnimeInstance;
  
  export function stagger(
    value: number, 
    options?: { 
      start?: number; 
      from?: string | number; 
      direction?: string; 
      easing?: string;
    }
  ): (el: any, i: number) => number;
  
  export function createTimeline(params?: { 
    easing?: string; 
    duration?: number; 
    autoplay?: boolean;
  }): AnimeTimelineInstance;
  
  export function createTimer(params?: { 
    duration?: number; 
    delay?: number; 
    complete?: () => void;
    update?: () => void;
  }): AnimeInstance;

  export function random(min: number, max: number): number;
  export function remove(targets: any): void;
  export function get(targets: any, prop: string): any;
  export function set(targets: any, values: any): void;

  // Default export
  interface Anime {
    (params: AnimeParams): AnimeInstance;
    timeline(params?: { easing?: string; duration?: number }): AnimeTimelineInstance;
    stagger: typeof stagger;
    remove: typeof remove;
    get: typeof get;
    set: typeof set;
    random: typeof random;
  }

  const anime: Anime;
  export default anime;
}

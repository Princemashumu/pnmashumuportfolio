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

  interface AnimeTimelineInstance {
    add(params: AnimeParams, offset?: string | number): AnimeTimelineInstance;
    play(): void;
    pause(): void;
    restart(): void;
    seek(time: number): void;
    reverse(): void;
  }

  interface AnimeStagger {
    (value: number, options?: { start?: number; from?: string | number; direction?: string; easing?: string }): (el: any, i: number) => number;
  }

  interface AnimeInstance {
    play(): void;
    pause(): void;
    restart(): void;
    seek(time: number): void;
    reverse(): void;
    finished: Promise<void>;
  }

  interface Anime {
    (params: AnimeParams): AnimeInstance;
    timeline(params?: { easing?: string; duration?: number }): AnimeTimelineInstance;
    stagger: AnimeStagger;
    remove(targets: any): void;
    get(targets: any, prop: string): string | number;
    set(targets: any, props: object): void;
    random(min: number, max: number): number;
  }

  const anime: Anime;
  export default anime;
}

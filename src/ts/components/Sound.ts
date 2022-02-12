class Sound {
  static BASE_SRC = 'https://rss-words-3.herokuapp.com/';

  isAllowedSound: boolean;

  sound: HTMLAudioElement;

  audioSet: string[];

  constructor({ src, volume, isAllowedSound = false }: { src?: string; volume?: number; isAllowedSound?: boolean }) {
    this.isAllowedSound = isAllowedSound;
    this.sound = document.createElement('audio') as HTMLAudioElement;
    this.sound.src = src || '';
    this.sound.volume = volume || 1;
    this.audioSet = [];
  }

  play = () => {
    this.sound.play();
    this.isAllowedSound = true;
  };

  stop = () => {
    this.sound.pause();
    this.isAllowedSound = false;
  };

  isNotAudioSrc = () => {
    return !this.sound.src;
  };

  isNotAudioSet = () => {
    return this.audioSet.length === 0;
  };

  setSound = (audioSet: string[]) => {
    this.audioSet = audioSet.reverse();
    const firstAudio = this.audioSet.pop();
    this.sound.src = `${Sound.BASE_SRC}${firstAudio}`;
    this.isAllowedSound = false;
    this.sound.addEventListener('ended', this.handleSetAudio);
  };

  handleSetAudio = () => {
    if (this.audioSet.length > 0) {
      const audio = this.audioSet.pop();
      this.sound.src = `${Sound.BASE_SRC}${audio}`;
      this.play();
    }
  };

  reset = () => {
    this.stop();
    this.audioSet = [];
  };
}

export default Sound;

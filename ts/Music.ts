export enum Track {
    MENU, STUDIO, DEFAULT, FAIL,
    SORTING, FINDNORB, KILLEM, ORBULATE
};

export class Music {
    currentTrack: Track;
    nextTrack: Track|null;  // Track or null if not set (In which case the same track is used again)

    audio: AudioContext;
    currentAudioBufferSource: AudioBufferSourceNode|null = null;

    tracks: any = {};

    loadAudioBufferFromUrl(url: string): Promise<AudioBuffer> {
        return new Promise((resolve, reject) => {
            fetch(url).then((res) => {
                res.arrayBuffer().then((ab) => {
                    this.audio.decodeAudioData(ab).then((buffer: AudioBuffer) => {
                        resolve(buffer);
                    })
                });
            });
        })
    }

    constructor() {
        this.audio = new AudioContext();
        this.currentTrack = Track.MENU;
        this.nextTrack = null;

        // Load all tracks AudioBuffers
        Promise.all([
            this.loadAudioBufferFromUrl("res/music/menu.wav"),
            this.loadAudioBufferFromUrl("res/music/studio.wav"),
            this.loadAudioBufferFromUrl("res/music/default.wav"),
            this.loadAudioBufferFromUrl("res/music/fail.wav"),
            this.loadAudioBufferFromUrl("res/music/sorting.wav"),
            this.loadAudioBufferFromUrl("res/music/findnorb.wav"),
            this.loadAudioBufferFromUrl("res/music/killem.wav"),
            this.loadAudioBufferFromUrl("res/music/orbulate.wav")
        ]).then((buffers: AudioBuffer[]) => {
            buffers.forEach((buffer: AudioBuffer, index: number) => {
                this.tracks[[Track.MENU, Track.STUDIO, Track.DEFAULT, Track.FAIL, Track.SORTING, Track.FINDNORB, Track.KILLEM, Track.ORBULATE][index]] = buffer;
            });
        });
    }

    start() {
        // Play next buffer if current one ends
        this.playBuffer(this.tracks[this.currentTrack]);
    }

    playBuffer(buffer: AudioBuffer) {
        let bs = this.audio.createBufferSource();
        bs.buffer = buffer;
        bs.connect(this.audio.destination);
        bs.start();

        bs.onended = () => {
            if (this.currentTrack == Track.FAIL)
                this.nextTrack = Track.MENU;

            if (this.nextTrack === null) this.nextTrack = this.currentTrack;
            this.currentTrack = this.nextTrack;
            this.playBuffer(this.tracks[this.currentTrack]);
            this.nextTrack = null;
        };
    }

    switchTo(track: Track) {
        this.nextTrack = track;
    }
}
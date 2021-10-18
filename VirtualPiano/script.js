class Synthesizer{
    constructor() {
        this.keyMap = new Map();
        let keys = 'AWSEDFTGYHUJKOLP;\']\\';
        for (let i = 0; i < keys.length; i++) {
            this.keyMap.set(keys.charAt(i), Object.keys(Synthesizer.noteFrequencies)[i]);
        }
        this.context = new AudioContext();
        this.oscillatorType = 'triangle';
    }
    static noteFrequencies = {
        'C4': 261.63,
        'Db4': 277.18,
        'D4': 293.66,
        'Eb4': 311.13,
        'E4': 329.63,
        'F4': 349.23,
        'Gb4': 369.99,
        'G4': 392,
        'Ab4': 415.3,
        'A4': 440,
        'Bb4': 466.16,
        'B4': 493.88,
        'C5': 523.25,
        'Db5': 554.37,
        'D5': 587.33,
        'Eb5': 622.25,
        'E5': 659.25,
        'F5': 698.46,
        'Gb5': 739.99,
        'G5': 783.99
    }
    playNote(key) {
        let oscillator = this.context.createOscillator();
        let gain = this.context.createGain();
        oscillator.type = this.oscillatorType;
        oscillator.connect(gain);
        oscillator.frequency.value = Synthesizer.noteFrequencies[this.keyMap.get(key)];
        gain.connect(this.context.destination);
        oscillator.start(0);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + 1);
    }
}

let piano = new Synthesizer();

const allowedKeys = 'AWSEDFTGYHUJKOLP;\']\\';


document.addEventListener('keypress', function (event) {
    if (allowedKeys.includes(event.key.toLocaleUpperCase())) {
        piano.playNote(event.key.toLocaleUpperCase());
    } else {
        console.log("ERROR: invalid key pressed!");
    }
});





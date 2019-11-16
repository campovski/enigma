const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nLetters = alphabet.length;

const rotors = [
    {
        name: 'I',
        wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
        turnLetter: 'Q',
        turn: alphabet.indexOf('Q')
    },
    {
        name: 'II',
        wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE',
        turnLetter: 'E',
        turn: alphabet.indexOf('E')
    },
    {
        name: 'III',
        wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO',
        turnLetter: 'V',
        turn: alphabet.indexOf('V')
    },
    {
        name: 'IV',
        wiring: 'ESOVPZJAYQUIRHXLNFTGKDCMWB',
        turnLetter: 'J',
        turn: alphabet.indexOf('J')
    },
    {
        name: 'V',
        wiring: 'VZBRGITYUPSDNHLXAWMJQOFECK',
        turnLetter: 'Z',
        turn: alphabet.indexOf('Z')
    },
];

const reflector = {
    name: 'UKW',
    wiring: 'IMETCGFRAYSQBZXWLHKDVUPOJN'
};

let plugboard;
let rotorsInstalled;
let rotorsPositions;


window.onload = function () {
    setDefaultSettings();

    document.addEventListener('keydown', onButtonPressed);
    document.addEventListener('keyup', onButtonReleased);
};

function setDefaultSettings() {
    rotorsInstalled = pickRandomRotors();
    console.log(rotorsInstalled);
    rotorsPositions = pickRotorStartingPositions();
    console.log(rotorsPositions);
    plugboard = pickRandomPlugboardSetting();
}

function pickRandomRotors() {
    const n = rotors.length;

    const indexFast = Math.floor(n * Math.random());
    let indexMid;
    let indexSlow;

    do {
        indexMid = Math.floor(n * Math.random());
    } while (indexMid === indexFast);

    do {
        indexSlow = Math.floor(n * Math.random());
    } while (indexSlow === indexMid || indexSlow === indexFast);

    return {
        fast: rotors[indexFast],
        mid: rotors[indexMid],
        slow: rotors[indexSlow]
    };
}

function pickRotorStartingPositions() {
    // TODO implement the table to pick from, like Germans had it during WW2
    return {
        fast: Math.ceil(26 * Math.random()),
        mid: Math.ceil(26 * Math.random()),
        slow: Math.ceil(26 * Math.random())
    };
}

function pickRandomPlugboardSetting() {

}

function stepRotors() {
    if (rotorsPositions.fast === rotorsInstalled.fast.turn) {
        if (rotorsPositions.mid === rotorsInstalled.mid.turn) {
            rotorsPositions.slow = (rotorsPositions.slow + 1) % nLetters;
        }
        rotorsPositions.mid = (rotorsPositions.mid + 1) % nLetters;
    }
    rotorsPositions.fast = (rotorsPositions.fast + 1) % nLetters;
    console.log(rotorsPositions);
}

function onButtonPressed(event) {
    if (event.which >= 65 && event.which <= 90) {
        const char = String.fromCharCode(event.which);
        const buttonPressed = document.getElementById('keyboard_' + char);

        buttonPressed.classList.add('keyboard-letter-pressed');
        document.removeEventListener('keydown', onButtonPressed);

        const encodedCharacter = encodeCharacter(char);
        console.log('Mapped ' + char + ' to ' + encodedCharacter);
    }
}

function onButtonReleased(event) {
    if (event.which >= 65 && event.which <= 90) {
        const char = String.fromCharCode(event.which);
        const buttonPressed = document.getElementById('keyboard_' + char);

        buttonPressed.classList.remove('keyboard-letter-pressed');
        document.addEventListener('keydown', onButtonPressed);
    }
}

function encodeCharacter(c) {
    console.log('Encoding character ' + c);

    // TODO map with plugboard
    let letter = mapWithPlugboard(c);

    console.log(letter);
    letter = mapWithRotor(letter, 'fast');
    console.log(letter);
    letter = mapWithRotor(letter, 'mid');
    console.log(letter);
    letter = mapWithRotor(letter, 'slow');
    console.log(letter);
    letter = mapWithReflector(letter);
    console.log(letter);
    stepRotors();

    letter = mapWithInverseRotor(letter, 'slow');
    console.log(letter);
    letter = mapWithInverseRotor(letter, 'mid');
    console.log(letter);
    letter = mapWithInverseRotor(letter, 'fast');
    console.log(letter);

    return letter;
}

function mapWithPlugboard(char) {
    return char;
}

function mapWithRotor(char, rotor) {
    const positionInAlphabet = alphabet.indexOf(char);
    const mapsToPosition = (positionInAlphabet + rotorsPositions[rotor]) % nLetters;
    return rotorsInstalled[rotor].wiring[mapsToPosition];
}

function mapWithReflector(char) {
    const positionInAlphabet = alphabet.indexOf(char);
    return reflector.wiring[positionInAlphabet];
}

function mapWithInverseRotor(char, rotor) {
    const positionInMap = rotorsInstalled[rotor].wiring.indexOf(char);
    const inverseMapsToPosition = (positionInMap + rotorsPositions[rotor]) % nLetters;
    return alphabet[inverseMapsToPosition];
}
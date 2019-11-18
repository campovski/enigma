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

const reflectors = [
    {
    name: 'UKW',
    wiring: 'IMETCGFRAYSQBZXWLHKDVUPOJN'
    }
];

const testingRotors = {
    fast: {
        wiring: 'PCEGIKMDQSUYWAOZFJXHBLNVTR',
        turnLetter: 'W',
        turn: alphabet.indexOf('W')
    },
    mid: {
        wiring: 'FBKELTJSVYCMIXUNDRHAOQZGWP',
        turnLetter: 'F',
        turn: alphabet.indexOf('F')
    },
    slow: {
        wiring: 'KFLNGMHERWAOUPXZIYVTQBJCSD',
        turnLetter: 'R',
        turn: alphabet.indexOf('R')
    }
};

const testingReflector = {
    wiring: 'YRUHQSLDPXNGOKMIEBFZCWVJAT'
};

let plugboard;
let reflectorInstalled;
let rotorsInstalled;
let rotorsPositions;


window.onload = function () {
    setRandomInitialSetting();

    document.addEventListener('keydown', onButtonPressed);
    document.addEventListener('keyup', onButtonReleased);
};

function setTestingInitialSetting() {
    reflectorInstalled = testingReflector;
    rotorsInstalled = testingRotors;
    rotorsPositions = {
        fast: 0,
        mid: 0,
        slow: 0
    };
}

function setRandomInitialSetting() {
    reflectorInstalled = pickRandomReflector();
    rotorsInstalled = pickRandomRotors();
    rotorsPositions = pickRotorStartingPositions();
    plugboard = pickRandomPlugboardSetting();
}

function pickRandomReflector() {
    const n = reflectors.length;
    return reflectors[Math.floor(n * Math.random())];
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
        fast: Math.floor(26 * Math.random()),
        mid: Math.floor(26 * Math.random()),
        slow: Math.floor(26 * Math.random())
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
    stepRotors();

    // TODO map with plugboard
    let letter = mapWithPlugboard(c);
    letter = mapWithRotor(letter, 'fast');
    letter = mapWithRotor(letter, 'mid');
    letter = mapWithRotor(letter, 'slow');
    letter = mapWithReflector(letter);
    letter = mapWithInverseRotor(letter, 'slow');
    letter = mapWithInverseRotor(letter, 'mid');
    letter = mapWithInverseRotor(letter, 'fast');

    return letter;
}

function mapWithPlugboard(char) {
    return char;
}

function mapWithRotor(char, rotor) {
    // Get index of input character.
    const rotorInput = alphabet.indexOf(char);
    // Get letter that enters the wiring.
    const rotorBeforeWiring = alphabet[(rotorInput + rotorsPositions[rotor] + nLetters) % nLetters];
    // Send the signal through wiring.
    const rotorAfterWiring = rotorsInstalled[rotor].wiring[alphabet.indexOf(rotorBeforeWiring)];
    // Return actual output of the rotor.
    return alphabet[(alphabet.indexOf(rotorAfterWiring) - rotorsPositions[rotor] + nLetters) % nLetters];
}

function mapWithReflector(char) {
    const positionInAlphabet = alphabet.indexOf(char);
    return reflectorInstalled.wiring[positionInAlphabet];
}

function mapWithInverseRotor(char, rotor) {
    // Get index of input character.
    const rotorInput = alphabet.indexOf(char);
    // Get letter on the right side of the wiring.
    const rotorBeforeWiring = alphabet[(rotorInput + rotorsPositions[rotor] + nLetters) % nLetters];
    // Send the signal back through wiring.
    const rotorAfterWiring = alphabet[rotorsInstalled[rotor].wiring.indexOf(rotorBeforeWiring)];
    // Return the actual character.
    return alphabet[(alphabet.indexOf(rotorAfterWiring) - rotorsPositions[rotor] + nLetters) % nLetters];
}
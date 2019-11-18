const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nLetters = alphabet.length;
const maxPlugboardPairs = 10;

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

    // Populate select objects for rotors' settings.
    const DOMRotors = {
        fast: document.getElementById('select-rotor-fast'),
        mid: document.getElementById('select-rotor-mid'),
        slow: document.getElementById('select-rotor-slow')
    };

    for (const speed in DOMRotors) {
        for (let i = 0; i < rotors.length; i++) {
            const option = document.createElement('option');
            option.value = rotors[i].name;
            option.text = rotors[i].name;
            DOMRotors[speed].add(option);

            if (rotors[i].name === rotorsInstalled[speed].name) {
                DOMRotors[speed].selectedIndex = i;
            }
        }
    }

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
    rotorsPositions = pickRandomRotorStartingPositions();
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

function pickRandomRotorStartingPositions() {
    return {
        fast: Math.floor(nLetters * Math.random()),
        mid: Math.floor(nLetters * Math.random()),
        slow: Math.floor(nLetters * Math.random())
    };
}

function pickRandomPlugboardSetting() {
    const plugboard = {};
    const nPairs = Math.ceil(maxPlugboardPairs * Math.random());
    let letter1, letter2;

    for (let i = 0; i < nPairs; i++) {
        do {
            letter1 = alphabet[Math.floor(nLetters * Math.random())];
        } while (letter1 in plugboard);
        do {
            letter2 = alphabet[Math.floor(nLetters * Math.random())];
        } while (letter2 in plugboard || letter2 === letter1);
        plugboard[letter1] = letter2;
        plugboard[letter2] = letter1;
    }

    return plugboard;
}

function onButtonPressed(event) {
    if (event.which >= 65 && event.which <= 90) {
        document.removeEventListener('keydown', onButtonPressed);

        const char = String.fromCharCode(event.which);
        const buttonPressed = document.getElementById('keyboard-' + char);
        buttonPressed.classList.add('keyboard-letter-pressed');
        const labelInput = document.getElementById('text-input');
        labelInput.innerText = labelInput.innerText + char;
        labelInput.scrollTop = labelInput.scrollHeight;

        const encodedCharacter = encodeCharacter(char);

        const lampTriggered = document.getElementById('lampboard-' + encodedCharacter);
        lampTriggered.classList.add('lampboard-letter-pressed');
        const labelOutput = document.getElementById('text-output');
        labelOutput.innerText = labelOutput.innerText + encodedCharacter;
        labelOutput.scrollTop = labelOutput.scrollHeight;
    }
}

function onButtonReleased(event) {
    if (event.which >= 65 && event.which <= 90) {
        const char = String.fromCharCode(event.which);
        const buttonPressed = document.getElementById('keyboard-' + char);
        buttonPressed.classList.remove('keyboard-letter-pressed');

        const lamps = document.getElementsByClassName('lampboard-letter');
        for (const lamp of lamps) {
            lamp.classList.remove('lampboard-letter-pressed');
        }

        document.addEventListener('keydown', onButtonPressed);
    }
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
    letter = mapWithPlugboard(letter);

    return letter;
}

function mapWithPlugboard(char) {
    return plugboard[char] === undefined ? char : plugboard[char];
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
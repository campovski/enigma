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

    const DOMInitialPositions = {
        fast: document.getElementById('input-sp-rotor-fast'),
        mid: document.getElementById('input-sp-rotor-mid'),
        slow: document.getElementById('input-sp-rotor-slow')
    };
    const DOMCurrentPositions = {
        fast: document.getElementById('input-cp-rotor-fast'),
        mid: document.getElementById('input-cp-rotor-mid'),
        slow: document.getElementById('input-cp-rotor-slow')
    };
    const DOMTurnNextRotors = {
        fast: document.getElementById('input-turn-rotor-fast'),
        mid: document.getElementById('input-turn-rotor-mid'),
        slow: document.getElementById('input-turn-rotor-slow')
    };
    for (const speed in DOMInitialPositions) {
        DOMInitialPositions[speed].value = alphabet[rotorsPositions[speed]];
        DOMCurrentPositions[speed].value = alphabet[rotorsPositions[speed]];
        DOMTurnNextRotors[speed].value = rotorsInstalled[speed].turnLetter;
    }

    document.addEventListener('keydown', onButtonPressed, false);
    document.addEventListener('keyup', onButtonReleased, false);

    const settingsElements = getDomSettingsElements();
    for (const rotorSelect of settingsElements.rotors.type) {
        rotorSelect.addEventListener('change', onSettingChange);
        rotorSelect.addEventListener('keydown', stopEvent, true);
        rotorSelect.addEventListener('keyup', stopEvent, true);
    }
    for (const rotorInitialPositionInput of settingsElements.rotors.initialPosition) {
        rotorInitialPositionInput.addEventListener('input', onSettingChange);
        rotorInitialPositionInput.addEventListener('keydown', stopEvent, true);
        rotorInitialPositionInput.addEventListener('keyup', stopEvent, true);
    }
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

function stepRotors() {
    if (rotorsPositions.fast === rotorsInstalled.fast.turn) {
        if (rotorsPositions.mid === rotorsInstalled.mid.turn) {
            rotorsPositions.slow = (rotorsPositions.slow + 1) % nLetters;
        }
        rotorsPositions.mid = (rotorsPositions.mid + 1) % nLetters;
    }
    rotorsPositions.fast = (rotorsPositions.fast + 1) % nLetters;

    updateDomRotors();
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

function encodeString(s) {
    let code = '';
    for (let i = 0; i < s.length; i++) {
        code += encodeCharacter(s[i]);
    }
    return code;
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

function updateDomRotors() {
    const settings = getDomSettingsElements();
    for (const currentPosition of settings.rotors.currentPosition) {
        const rotor = currentPosition.id.split('-')[3];
        currentPosition.value = alphabet[rotorsPositions[rotor]];
    }
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

function onSettingChange(event) {
    // In case a user empties the input element, we asynchronously wait if he will input
    // something. If not, we use the default value and perform the change of settings.
    if (event !== undefined && event.data === null) {
        setTimeout(onSettingChange, 2000);
        return;
    }

    const settings = getDomSettingsElements();
    const string = document.getElementById('text-input').innerText;

    for (const selectRotor of settings.rotors.type) {
        rotorsInstalled[selectRotor.id.split('-')[2]] = rotors[selectRotor.selectedIndex];
    }

    for (const inputInitialPosition of settings.rotors.initialPosition) {
        inputInitialPosition.classList.remove('wrong-input');
        const rotor = inputInitialPosition.id.split('-')[3];
        const inputInitialPositionValue = inputInitialPosition.value.toUpperCase();
        if (inputInitialPositionValue === '') {
            rotorsPositions[rotor] = 0;
            inputInitialPosition.value = alphabet[0];
        } else {
            const initialPosition = alphabet.indexOf(inputInitialPositionValue);
            if (initialPosition !== -1 && inputInitialPosition.value !== '') {
                rotorsPositions[rotor] = initialPosition;
            } else {
                inputInitialPosition.classList.add('wrong-input');
                return;
            }
        }
    }

    for (const inputCurrentPosition of settings.rotors.currentPosition) {
        const rotor = inputCurrentPosition.id.split('-')[3];
        inputCurrentPosition.value = alphabet[rotorsPositions[rotor]];
    }

    for (const inputTurnLetter of settings.rotors.turnLetter) {
        const rotor = inputTurnLetter.id.split('-')[3];
        inputTurnLetter.value = rotorsInstalled[rotor].turnLetter;
    }

    document.getElementById('text-output').innerText = encodeString(string);
}

function stopEvent(event) {
    event.stopPropagation();
}

function getDomSettingsElements() {
    return {
        rotors: {
            type: document.querySelectorAll('select.setting-rotor'),
            initialPosition: document.querySelectorAll('input[id^="input-sp-rotor"]'),
            currentPosition: document.querySelectorAll('input[id^="input-cp-rotor"]'),
            turnLetter: document.querySelectorAll('input[id^="input-turn-rotor"]')
        }
    }
}

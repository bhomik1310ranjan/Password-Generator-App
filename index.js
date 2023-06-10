const symbols = "~`!@#$%^&*()_-+={}[]:;\|<>,.?/";

const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const getRandomNumber = () => getRandomInteger(0, 10);
const getRandomUppercaseLetter = () => String.fromCharCode(getRandomInteger(65, 91));
const getRandomLowercaseLetter = () => String.fromCharCode(getRandomInteger(97, 123));
const getRandomSymbol = () => symbols.charAt(getRandomInteger(0, symbols.length));

let lengthOfPassword = 8;
const passwordLengthSlider = document.querySelector('#password-length-slider');
const passwordLength = document.querySelector('#password-length');

const handleSilder = () => {
    passwordLengthSlider.value = lengthOfPassword;
    passwordLength.innerText = lengthOfPassword;
    let min = passwordLengthSlider.min;
    let max = passwordLengthSlider.max;
    passwordLengthSlider.style.backgroundSize =  ((lengthOfPassword - min)*100/(max-min)) + '% 100%';
};
handleSilder();

passwordLengthSlider.addEventListener('input', (event) => {
    lengthOfPassword = event.target.value;
    handleSilder();
});

const copyButton = document.querySelector('#copy-button');
const passwordDisplay = document.querySelector('#password-display');
const message = document.querySelector('.message');

copyButton.addEventListener('click', async () => {
    if(passwordDisplay.value){
        try{
            await navigator.clipboard.writeText(passwordDisplay.value);
            message.innerText = "Copied!";
        }
        catch{
            message.innerText = "Failed!";
        }
        message.classList.add('active');
        setTimeout(() => message.classList.remove('active'), 2000);
    }
});

const includeUppercaseLetters = document.querySelector('#include-uppercase-letters');
const includeLowercaseLetters = document.querySelector('#include-lowercase-letters');
const includeNumbers = document.querySelector('#include-numbers');
const includeSymbols = document.querySelector('#include-symbols');
const strengthIndicator = document.querySelector('#strength-indicator');

const setIndicator = (color) => {
    strengthIndicator.style.backgroundColor = color;
    strengthIndicator.style.boxShadow = `0em 0em 1.2em 0.1em ${color}`; 
};

const calculateStrength = () => {
    let hasUppercaseLetters = includeUppercaseLetters.checked;
    let hasLowercaseLetters = includeLowercaseLetters.checked;
    let hasNumbers = includeNumbers.checked;
    let hasSymbols = includeSymbols.checked;

    if(hasUppercaseLetters && hasLowercaseLetters && (hasNumbers || hasSymbols) && lengthOfPassword >= 8){
        setIndicator("#00ff00");
    }
    else if((hasUppercaseLetters || hasLowercaseLetters) && (hasNumbers || hasSymbols) && lengthOfPassword >= 6){
        setIndicator("#ffff00");
    }
    else{
        setIndicator("#ff0000");
    }
}

let checkboxCount = 1;
const allCheckBoxes = document.querySelectorAll('input[type = checkbox]');

allCheckBoxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
        checkboxCount = 0;
        allCheckBoxes.forEach((checkbox) => {
            if(checkbox.checked){
                checkboxCount++;
            }
        });

        if(lengthOfPassword < checkboxCount){
            lengthOfPassword = checkboxCount;
            handleSilder();
        }
    });
});

const shufflePassword = (array) => {
    for(let i = array.length - 1; i > 0; i--){
        let randomIndex = getRandomInteger(0, i + 1);

        let temp = array[i];
        array[i] = array[randomIndex];
        array[randomIndex] = temp; 
    }

    return array.join('');
};

let password = "";
const generateButton = document.querySelector('#generate-button');

generateButton.addEventListener('click', () => {
    if(checkboxCount === 0){
        return;
    }

    if(lengthOfPassword < checkboxCount){
        lengthOfPassword = checkboxCount;
        handleSilder();
    }

    password = "";
    let charactersInclude = [];
    if(includeUppercaseLetters.checked){
        charactersInclude.push(getRandomUppercaseLetter);
    }

    if(includeLowercaseLetters.checked){
        charactersInclude.push(getRandomLowercaseLetter);
    }

    if(includeNumbers.checked){
        charactersInclude.push(getRandomNumber);
    }

    if(includeSymbols.checked){
        charactersInclude.push(getRandomSymbol);
    }

    for(let i = 0; i < charactersInclude.length; i++){
        password += charactersInclude[i]();
    }

    for(let i = 0; i < lengthOfPassword - charactersInclude.length; i++){
        let randomIndex = getRandomInteger(0, charactersInclude.length);
        password += charactersInclude[randomIndex]();
    }

    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password;
    
    calculateStrength();
});
let myText = document.querySelector("textarea");
let upCaseBtn = document.getElementById("upper-case");
let lowCaseBtn = document.getElementById("lower-case");
let propCaseBtn = document.getElementById("proper-case");
let sentCaseBtn = document.getElementById("sentence-case");
let saveTextFileBtn = document.getElementById("save-text-file");

upCaseBtn.addEventListener("click", toUpperCase);
lowCaseBtn.addEventListener("click", toLowerCase);
propCaseBtn.addEventListener("click", toProperCase);
sentCaseBtn.addEventListener("click", toSentenceCase);
saveTextFileBtn.addEventListener("click", function() {
    download("text.txt", myText.value);
});

function toUpperCase() {
    myText.value = myText.value.toUpperCase();
}

function toLowerCase() {
    myText.value = myText.value.toLowerCase();
}

function toProperCase() {
    // myText.value = myText.value
    //     .toLowerCase()
    //     .replaceAll(/\b\w/g, c => c.toUpperCase());
    let correctWords = [];
    let words = myText.value.toLowerCase().split(" ");
    words.forEach( (element) => {
        correctWords.push(element.replace(/\b\w/, c => c.toUpperCase()));
    });
    myText.value = correctWords.join(" ");
}

function toSentenceCase() {
    let correctSentences = [];
    let sentences = myText.value.toLowerCase().split(".");
    sentences.forEach( (element) => {
        correctSentences.push(element.replace(/\b\w/, c => c.toUpperCase()));
    });
    myText.value = correctSentences.join(".");
}

function download(filename, text) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
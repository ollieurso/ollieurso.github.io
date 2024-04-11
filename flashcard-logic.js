"use strict";

//Dropdown stuff
var dropdown = document.getElementById('dropdown');
var dropdownSelection = '';
var jsonName = '';
var arrayWords = [];
var arrayType;


//Checkbox stuff
var checkboxesNoun = document.getElementById('checkboxes-noun');
var checkboxesVerb = document.getElementById('checkboxes-verb');
var nounChoices = ['nominative','plural','genitive','partitive'];
var verbChoices = [];
//noun
var nomiCheck = document.getElementById('nomiCheck');
var plurCheck = document.getElementById('plurCheck');
var geniCheck = document.getElementById('geniCheck');
var partCheck = document.getElementById('partCheck');
//verb
var baseCheck = document.getElementById('baseCheck');
var persCheck = document.getElementById('persCheck');


//Card variables
var cardContain = document.getElementById('cardContain');
var defaultColor = '#FFDAB9';
var correctColor = '#BBEF7F';
var incorrectColor = '#FFAEAE';
var answerIsCorrect;
var questionTextBox = document.getElementById('questionText');
var inputTextBox = document.getElementById('answerBox');
var feedbackText = document.getElementById('correctAnswerText');
var answerCheckButton = document.getElementById('answerCheckButton');
var nextQuestionButton = document.getElementById('nextQuestionButton');
var randomType = '';
var randomQuestion = '';
var randomAnswer = '';

//var for when enter key and finnish alphabet shenanigans
var nextQuestionOK = false;
var enterKeyDown = {};
var inputTextBoxFocused;

var alphabet1 = document.getElementById('alphabet1');
var alphabet2 = document.getElementById('alphabet2');

//testing button for shits n giggles
var testBtn = document.getElementById('testBtn');

//------Fun Stuff Begins

//On load, run JSON update and checkboxes
$(document).ready(function(){
    
    nomiCheckUpdate();
    plurCheckUpdate();
    geniCheckUpdate();
    partCheckUpdate();
    baseCheckUpdate();
    persCheckUpdate();
    
    updateJSONstuff();
    
    nextQuestionOK = false;
    //console.log(nextQuestionOK);
    $(nextQuestionButton).css('display', 'none');
});

//On dropdown run JSON update
$(function(){
        $(dropdown).change(function(){    
            updateJSONstuff();
            pickQuestion();
        }
        )
    }
)

//JSON update, gets info from UI on which JSON to load and stores it into an accessible array
function updateJSONstuff() {
            dropdownSelection = $(dropdown).val();
            //console.log(dropdownSelection);
            jsonName = "cardstorage/" + dropdownSelection + ".json";
            //console.log(jsonName);
            
            var xhr = new XMLHttpRequest();
            xhr.overrideMimeType("application/json");
            
            function getJsonData(){
                xhr.open('GET', jsonName, true);
                xhr.send(null);
            }

            getJsonData();

            xhr.onload = function () {
                arrayWords = JSON.parse(xhr.responseText);
                //console.log(Object.keys(arrayWords)[0]);
                //console.log(arrayWords.noun[0].fin);
                
                //set the type of array - noun or verb
                arrayType = Object.keys(arrayWords)[0];
                //console.log(arrayType + '1');
                checkboxesVisible();
                pickQuestion();
            }
            
}


function pickQuestion(){
    cardContain.style.background = defaultColor;
    $(inputTextBox).val("");
    $(inputTextBox).show();
    $(feedbackText).hide();
    $(nextQuestionButton).css('display', 'none');
    $(answerCheckButton).css('display', 'block');
    nextQuestionOK = false;
    //console.log(nextQuestionOK);
    if (arrayType == 'noun'){
        nounRandomizer();
        //console.log('firing noun')
    }else{
        verbRandomizer();
        //console.log('firing verb')
    }
};

function nounRandomizer(){
    randomType = nounChoices[Math.floor(Math.random() * nounChoices.length)];
    //console.log(randomType);
    var i = Math.floor(Math.random() * arrayWords.noun.length);
    //console.log(i);
    randomQuestion = arrayWords.noun[i].eng;
    //console.log(randomQuestion);
    
    
    function getValueByKey(object, row){
        return object[row];
    };
    
    randomAnswer = getValueByKey(arrayWords.noun[i], randomType);
    //console.log(randomAnswer);
    
    $(questionTextBox).text(randomQuestion + "   -   " + randomType);
};

function verbRandomizer(){
    randomType = verbChoices[Math.floor(Math.random() * verbChoices.length)];
    //console.log(randomType);
    var i = Math.floor(Math.random() * arrayWords.verb.length);
    //console.log(i);
    randomQuestion = arrayWords.verb[i].eng;
    //console.log(randomQuestion);
    
    
    function getValueByKey(object, row){
        return object[row];
    };
    
    randomAnswer = getValueByKey(arrayWords.verb[i], randomType);
    //console.log(randomAnswer);
    
    $(questionTextBox).text(randomQuestion + "   -   " + randomType);
};



//GETTING A NEW QUESTION AND ALL THAT
//on button click
$(nextQuestionButton).click(function(){
    nextQuestion();
});


/*
//on hitting enter if the state is correct
$(document).keydown(function(e){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == 13){
            if(enterKeyDown[13] == null){
                if(nextQuestionOK && inputTextBoxFocused){
                    checkIfCorrect();
                
                }else{
                    nextQuestion();
                };
                
                enterKeyDown[13] = true;
            } 
        }
    });

$(document).keyup(function (e) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        enterKeyDown[keycode] = null;
    });


$(inputTextBox).focus(function(){
    inputTextBoxFocused = true;
    console.log(inputTextBoxFocused);
});

$(inputTextBox).blur(function(){
    inputTextBoxFocused = false;
    console.log(inputTextBoxFocused);
});
*/

function nextQuestion(){
    //console.log('NEXT BUTTON click');
    //preventing the rest if no checkboxes selected
    if (arrayType == 'noun'){
        var checked = $("#checkboxes-noun input:checked").length > 0;
        if (!checked){
        alert("Please select at least one checkbox!");
        return false;
        }
    }else{
        var checked = $("#checkboxes-verb input:checked").length > 0;
        if (!checked){
        alert("Please select at least one checkbox!");
        return false;
    }
    }
    //running the function that branches between noun/verb picking and then picks a valid question and answer
    pickQuestion();
};


//CHECKING IF ANSWER CORRECT AND ALL THAT
//on button click
$(answerCheckButton).click(function(){
    checkIfCorrect();
})
//on hitting enter if the textbox is selected
$(inputTextBox).on('keydown', function (e) {
         if(e.which === 13){
             checkIfCorrect();
            //Disable textbox to prevent multiple submit
            //$(this).attr("disabled", "disabled");

            //Do Stuff, submit, etc..

            //Enable the textbox again if needed.
            //$(this).removeAttr("disabled");
         }
   });

function checkIfCorrect(){
    //console.log('CHECK BUTTON click');
    $(feedbackText).text(randomAnswer);
    $(feedbackText).show();
    $(inputTextBox).hide();
    $(answerCheckButton).css('display', 'none');
    $(nextQuestionButton).css('display', 'block');
    nextQuestionOK = true;
    //console.log(nextQuestionOK);
    var answer = $(inputTextBox).val();
    if(answer.toLowerCase() === randomAnswer.toLowerCase()){
        answerIsCorrect = true;
    }else{
    answerIsCorrect = false;
    }
    feedbackDisplay();
}


//checkbox visibility update
function checkboxesVisible(){
                if(arrayType == 'noun'){
                    checkboxesVerb.style.display = 'none';
                    checkboxesNoun.style.display = '';
                    //console.log(arrayType + '2');
                }else{
                    checkboxesNoun.style.display = 'none';
                    checkboxesVerb.style.display = '';
                    //console.log(arrayType + '3');
                }
};


//feedback for answering
function feedbackDisplay(){
    if(answerIsCorrect){
        cardContain.style.background = correctColor;
        $(questionTextBox).text("CORRECT!");
        
    }else{
        cardContain.style.background = incorrectColor;
        $(questionTextBox).text("INCORRECT! Correct answer:");
    }
};


//CHECKBOX LOGIC FOR UPDATING THE CHOICE ARRAY--------------
//Functions getting run on checkbox changes
$(nomiCheck).change(function(){
    nomiCheckUpdate();
}
);

$(plurCheck).change(function(){
    plurCheckUpdate();
}
);

$(geniCheck).change(function(){
    geniCheckUpdate();
}
);

$(partCheck).change(function(){
    partCheckUpdate();
}
);

$(baseCheck).change(function(){
    baseCheckUpdate();
}
);

$(persCheck).change(function(){
    persCheckUpdate();
}
);


//Checkbox updater functions
function nomiCheckUpdate(){
    if(nomiCheck.checked){
        nounChoices.push('nominative');
        //console.log('nomi yayy');
    }else{
        //console.log('nomi nayy');
        
        for (var i = nounChoices.length - 1; i >= 0; i--) {
        if (nounChoices[i] === 'nominative') {
        nounChoices.splice(i, 1);
        }
        }
    };
}

function plurCheckUpdate(){
    if(plurCheck.checked){
        nounChoices.push('plural');
        //console.log('plur yayy');
    }else{
        //console.log('plur nayy');
        
        for (var i = nounChoices.length - 1; i >= 0; i--) {
        if (nounChoices[i] === 'plural') {
        nounChoices.splice(i, 1);
        }
        }
    };
}

function geniCheckUpdate(){
    if(geniCheck.checked){
        nounChoices.push('genitive');
        //console.log('geni yayy');
    }else{
        //console.log('geni nayy');
        
        for (var i = nounChoices.length - 1; i >= 0; i--) {
        if (nounChoices[i] === 'genitive') {
        nounChoices.splice(i, 1);
        }
        }
    };
}

function partCheckUpdate(){
    if(partCheck.checked){
        nounChoices.push('partitive');
        //console.log('part yayy');
    }else{
        //console.log('part nayy');
        
        for (var i = nounChoices.length - 1; i >= 0; i--) {
        if (nounChoices[i] === 'partitive') {
        nounChoices.splice(i, 1);
        }
        }
    };
}

function baseCheckUpdate(){
    if(baseCheck.checked){
        verbChoices.push('basic form');
        //console.log('base yayy');
        
    }else{
        //console.log('base nayy');
        
        for (var i = verbChoices.length - 1; i >= 0; i--) {
        if (verbChoices[i] === 'basic form') {
        verbChoices.splice(i, 1);
        }
        }
    };
}

function persCheckUpdate(){
    if(persCheck.checked){
        verbChoices.push('minä', 'sinä', 'hän', 'me', 'te', 'he');
        //console.log('pers yayy');
        
    }else{
        //console.log('pers nayy');
        
        for (var i = verbChoices.length - 1; i >= 0; i--) {
        if (verbChoices[i] != 'basic form') {
        verbChoices.splice(i, 1);
        }
        }
    };
}


$(alphabet1).click(function(){
    if(nextQuestionOK == false){
        $(inputTextBox).val($(inputTextBox).val() + 'ä');
        inputTextBox.focus();
    }
});

$(alphabet2).click(function(){
    if(nextQuestionOK == false){
        $(inputTextBox).val($(inputTextBox).val() + 'ö');
        inputTextBox.focus();
    }
});



//TEST BUTTON FUNCTION
$(testBtn).click(function(){
    //console.log('TEST BUTTON click');
    
    
    //console.log(nounChoices);
    //console.log(verbChoices);
    pickQuestion();
    
});
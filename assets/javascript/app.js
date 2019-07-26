console.log('bacon connected');

// Assign firebase database to variable
var database = firebase.database();

var trainName = [];
var destination = [];
var firstTrainTime = [];
var frequency = [];

// Takes user input and displays on board
function inputSubmission(trainName, destination, firstMilitaryTime, frequencyInMinutes){

}


database.ref().on('value', function(snap){
    console.log(snap.val());

    if (database.ref('/Train-Scheduler').exists()) {
        trainName
    }

}, function(error) {
    console.log('error encountered: '+error.code);
})
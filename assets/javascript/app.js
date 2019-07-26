console.log('bacon connected');

// Assign firebase database to variable
var database = firebase.database().ref('/Train-Scheduler');

var trainNames = [];
var destinationList = [];
var firstTrainTimes = [];
var frequency = [];

// Takes user input and displays on board
function inputSubmission(train, destination, firstMilitaryTime, frequencyInMinutes){
    trainNames.push(train);
    destinationList.push(destination);
    firstTrainTimes.push(firstMilitaryTime);
    frequency.push(frequencyInMinutes);

    // firebase update
    database.set({
        trainNames: trainNames,
        destination: destinationList,
        firstTrainTimes: firstTrainTimes,
        frequency: frequency
    })
}


database.on('value', function(snap){
    console.log(snap.val());

    if (snap.val() != null) {
        trainNames = snap.val().trainName;
        destinationList = snap.val().destination;
        firstTrainTimes = snap.val().firstTrainTime;
        frequency = snap.val().frequency;
    }

}, function(error) {
    console.log('error encountered: '+error.code);
})
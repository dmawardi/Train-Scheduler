// Assign firebase database to variable
var database = firebase.database().ref('/Train-Schedules');

// var trainNames = [];
// var destinationList = [];
// var firstTrainTimes = [];
// var frequency = [];

// Form
var trainNameInput = $('#trainNameInput');
var destinationInput = $('#destinationInput');
var firstTrainTimeInput = $('#firstTrainTimeInput');
var frequencyInput = $('#frequencyInput');


// Function to calculate/returns next arrival & mins away based on frequency and first train time 
function calcNextAndMinsAway(firstTrain, frequency) {
    // Convert times to moment objects. Note: subtracted 1 year from first train to ensure before current time
    var firstTrainTime = moment(firstTrain, "HH:mm");
    var currentTime = moment();
    var timeDiff = moment().diff(moment(firstTrainTime), 'minutes');

    var minsAway;
    var nextArrival;

    console.log('Current time: '+ moment(currentTime).format('HH:mm'));
    console.log('First Train Time: '+ moment(firstTrainTime).format('HH:mm'));
    console.log('Time difference: ' + timeDiff);

    // Calculate mins away from next train
    minsAway = frequency - (timeDiff % frequency)
    // Add minsAway to current time for next arrival and format as HH:mm
    nextArrival = moment().add(minsAway, 'minutes').format('HH:mm');
    return [nextArrival, minsAway]
}

// Takes object of JSON from snap then displays in table as row
function renderRow(snap) {
    console.log(snap.val());
    var table = $('#tableData');
    var row = $('<tr>');

    // Calculation variables
    var nextArrival;
    var minsAway;

    // Assign attribute of key to row to reference from delete button
    row.attr('id', snap.ref.key);

    // Create delete button and set in a <td> object
    var delButton = $('<button>');
    delButton.addClass('btn btn-danger');
    // Add key to delete key to match row (for deleting purposes later)
    delButton.attr('data-delete', snap.ref.key);
    delButton.attr('id', 'delButton');
    delButton.text('X');
    

    // Create update button and set in a <td> object
    var editButton = $('<button>');
    editButton.addClass('btn btn-info');
    // Add key to delete key to match row (for deleting purposes later)
    editButton.attr('data-edit', snap.ref.key);
    editButton.attr('id', 'editButton');
    editButton.text('Edit');

    // Create td and append buttons
    var buttonTD = $('<td>');
    buttonTD.append(delButton);
    buttonTD.append(editButton);

    // Calculations for calculated columns
    [nextArrival, minsAway]  =  calcNextAndMinsAway(snap.val().firstTrainTimes, snap.val().frequency)

    // variable declaration using snapshot values
    var trainNameTD = "<td>" + snap.val().trainNames + "</td>";
    var destinationTD = "<td>" + snap.val().destination + "</td>";
    var frequencyTD = "<td>" + snap.val().frequency + "</td>";
    var nextArrivalTD = "<td>" + nextArrival + "</td>";
    var minsAwayTD = "<td>" + minsAway + "</td>";

    // Append data fields to row
    row.append(trainNameTD);
    row.append(destinationTD);
    row.append(frequencyTD);
    row.append(nextArrivalTD);
    row.append(minsAwayTD);
    row.append(buttonTD);
    // Append row to table
    table.append(row);

}

// Event handler for click event of input submission form
$('#submitButton').on('click', function (event) {
    // Prevent default submission behaviour
    event.preventDefault();

    var convertedDate = moment(firstTrainTimeInput.val(), "HH:mm");
    // moment.unix(convertedDate);

    // console.log(trainNameInput.val());
    // console.log(destinationInput.val());
    // console.log(firstTrainTimeInput.val());
    // console.log(frequencyInput.val());
    console.log(moment.unix(convertedDate));

    // Push object to the database
    database.push({
        trainNames: trainNameInput.val(),
        destination: destinationInput.val(),
        firstTrainTimes: moment(convertedDate).format('HH:mm'),
        frequency: frequencyInput.val()
    });

    trainNameInput.val('');
    destinationInput.val('');
    firstTrainTimeInput.val('');
    frequencyInput.val('');


})

// Event handler for delete button
$(document.body).on('click', '#delButton', function () {
    var recordID = $(this).attr('data-delete');
    console.log("Record ID: " + recordID);

    // Remove record with row's record ID
    database.child(recordID).remove();
    // The above removal triggers the on "child removed" event

});

$(document.body).on('click', '#editButton', function () {
    var recordID = $(this).attr('data-edit');
    console.log("Record ID: " + recordID);

    // Remove record with row's record ID
    // database.child(recordID).set({

    // });
    // The above removal triggers the on "child removed" event

});


// Firebase update events
// WHen a child is added to the Firebase database
database.on('child_added', function (snap) {
    console.log(snap.val());

    if (snap.val() != null) {
        renderRow(snap);
    }

}, function (error) {
    console.log('error encountered: ' + error.code);
})

// When a child is removed from the database
database.on('child_removed', function (snap) {
    // Obtain the reference key of the deleted item
    var recordID = snap.ref.key;
    console.log(recordID);

    // Use the recordID to select the element with JQuery
    $('#' + recordID).remove();

}, function (error) {
    console.log('error encountered: ' + error.code);

})
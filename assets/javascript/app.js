// Assign firebase database to variable
var database = firebase.database();

// Form variable declaration
var trainNameInput = $('#trainNameInput');
var destinationInput = $('#destinationInput');
var firstTrainTimeInput = $('#firstTrainTimeInput');
var frequencyInput = $('#frequencyInput');
var submitButton = $('#submitButton');


// Function to calculate/returns next arrival & mins away based on frequency and first train time 
function calcNextAndMinsAway(firstTrain, frequency) {
    // Convert times to moment objects. Note: subtracted 1 year from first train to ensure before current time
    var firstTrainTime = moment(firstTrain, "HH:mm");
    // Compare current time to first train time to determine time difference in minutes
    var timeDiff = moment().diff(moment(firstTrainTime), 'minutes');
    // Declare variables for later assignment
    var minsAway;
    var nextArrival;

    // Calculate mins away from next train
    minsAway = frequency - (timeDiff % frequency)
    // Add minsAway to current time for next arrival and format as HH:mm
    nextArrival = moment().add(minsAway, 'minutes').format('HH:mm');
    return [nextArrival, minsAway]
}

// Takes object of JSON from snap then displays in table as row
function renderRow(snap) {
    // Declare variables
    var table = $('#tableData');
    var row = $('<tr>');

    // Calculation variables
    var nextArrival;
    var minsAway;

    // Assign attribute of key to row to reference from delete button
    row.attr('id', snap.ref.key);

    // Button Creation
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
    [nextArrival, minsAway] = calcNextAndMinsAway(snap.val().firstTrainTimes, snap.val().frequency)

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

    // Assign button state and button record id value to variables
    var buttonState = $(this).attr('data-state');
    var recordID = $(this).attr('data-idToEdit');
    // Convert first train time from mility time to moment converted date
    var convertedDate = moment(firstTrainTimeInput.val(), "HH:mm");
    // refer to index in database, assign to ref
    var ref = database.ref('/Train-Schedules');


    // If the button state is submit
    if (buttonState == 'submit') {

        // Push object to the database
        ref.push({
            trainNames: trainNameInput.val(),
            destination: destinationInput.val(),
            firstTrainTimes: moment(convertedDate).format('HH:mm'),
            frequency: frequencyInput.val()
        });

        // Else if button state is update
    } else if (buttonState == 'update') {

        // Grab values from database using record ID and edit
        ref.child('/' + recordID).set({
            trainNames: trainNameInput.val(),
            destination: destinationInput.val(),
            firstTrainTimes: moment(convertedDate).format('HH:mm'),
            frequency: frequencyInput.val()
        });
        // The above will trigger the render row function for the new data
        // Make submitButton text to Submit to change state
        submitButton.text('Submit');

    }

    // Clear form values
    trainNameInput.val('');
    destinationInput.val('');
    firstTrainTimeInput.val('');
    frequencyInput.val('');


})

// Event handler for row delete button 
$(document.body).on('click', '#delButton', function () {
    var recordID = $(this).attr('data-delete');

    // Remove record with row's record ID
    database.ref('/Train-Schedules').child(recordID).remove();
    // The above removal triggers the on "child removed" event

});

// Edit button event handler
$(document.body).on('click', '#editButton', function () {
    // Set HTML attributes to values
    var recordID = $(this).attr('data-edit');
    var ref = database.ref('/Train-Schedules');


    // Grab values from database using record ID
    ref.child('/' + recordID).once('value', function (snap) {

        // Set form input to values of record
        trainNameInput.val(snap.val().trainNames);
        destinationInput.val(snap.val().destination);
        firstTrainTimeInput.val(snap.val().firstTrainTimes);
        frequencyInput.val(snap.val().frequency);
    });

    // Create state of inputform button, where if data-state is a recordID, then it's in edit mode When submit button pressed, 
    submitButton.text('Update');
    submitButton.attr('data-state', 'update');
    submitButton.attr('data-idToEdit', recordID);

});


// Firebase update events
// WHen a child is added to the Firebase database
database.ref('/Train-Schedules').on('child_added', function (snap) {
    // If value exists render row
    if (snap.val() != null) {
        renderRow(snap);
    }

    // If error occurs
}, function (error) {
    console.log('error encountered: ' + error.code);
})

// Event handler for database child changes
database.ref('/Train-Schedules').on('child_changed', function (snap) {
    // set key of record to recordID
    var recordID = snap.ref.key;

    // If value found, 
    if (snap.val() != null) {
        // Remove old table row
        $('tr#'+recordID).remove();
        // Render the updated row
        renderRow(snap);
    }

    // If error occurs
}, function (error) {
    console.log('error encountered: ' + error.code);
})

// Event handler for if a child is removed from database
database.ref('/Train-Schedules').on('child_removed', function (snap) {
    // Obtain the reference key of the deleted item
    var recordID = snap.ref.key;

    // Use the recordID to select the element with JQuery
    $('#' + recordID).remove();

    // If error occurs
}, function (error) {
    console.log('error encountered: ' + error.code);

})
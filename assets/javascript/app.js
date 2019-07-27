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


// TODO: Build function to calculate/returns next arrival & mins away based on frequency and first train time 

// Takes object of JSON from snap then displays in table as row
function renderRow(snap) {
    console.log(snap.val());
    var table = $('#tableData');
    var row = $('<tr>');

    // Assign attribute of key to row to reference from delete button
    row.attr('id', snap.ref.key);

    // Create delete button and set in a <td> object
    var delButton = $('<button>');
    delButton.addClass('btn btn-warning');
    // Add key to delete key to match row (for deleting purposes later)
    delButton.attr('data-delete', snap.ref.key);
    delButton.attr('id', 'delButton');
    delButton.text('X');
    var buttonTD = $('<td>');
    buttonTD.append(delButton);

    // Calculations for calculated columns


    // variable declaration using snapshot values
    var trainNameTD = "<td>" + snap.val().trainNames + "</td>";
    var destinationTD = "<td>" + snap.val().destination + "</td>";
    var firstTrainTimeTD = "<td>" + snap.val().firstTrainTimes + "</td>";
    var frequencyTD = "<td>" + snap.val().frequency + "</td>";
    // var TotalBilledTD = "<td>" + totalBilledAmt + "</td>";

    // Append data fields to row
    row.append(trainNameTD);
    row.append(destinationTD);
    row.append(frequencyTD);
    row.append(firstTrainTimeTD);
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
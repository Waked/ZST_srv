// Constants
const INPUT1  = "name";     // Classname for input 1
const INPUT2  = "nameval";  // Classname for input 2
const WRAP    = "namespan"; // Classname for wrapping <span>

// Initialise all dynamic elements, i.e. attach handlers to buttons etc.
$(() => {
  const inputlist     = $('#inputlist');
  const addbutton     = $('#add');
  const removebutton  = $('#remove');
  const setbutton     = $('#set');
  const createbutton  = $('#create');
  const postbutton    = $('#post');

  var hash = '';

  // BUG - this shouldn't be necessary. Pug is probably broken.
  // Make operations unavailable before setting column types.
  createbutton.attr('disabled', true);
  postbutton.attr('disabled', true);

  var inputcount = 0;

  addInput();

  addbutton.click(addInput);
  removebutton.click(removeInput);
  setbutton.click(sealInputs);
  createbutton.click(createRequest);
  postbutton.click(postRequest);

  function addInput() {
    inputcount++;
    const newinput = document.createElement("input");
    newinput.id = INPUT1 + inputcount;
    inputs.push(newinput); // Adds the input field to an array for further reference
    const newspan = document.createElement("span");
    newspan.id = WRAP + inputcount;
    newspan.classList.add('block'); // Make each span in a new row
    spans.push(newspan); // Adds the span to a list
    newspan.appendChild(newinput);
    inputlist.append(newspan); // .append(), because it's a jQuery element
    //inputlist.append(document.createElement("br"));
    $(newinput).focus(); // Place focus in new input
    console.log("Added input");
  }

  function removeInput() {
    if (inputcount > 1) {
      console.log('Trying to remove ' + WRAP + inputcount);
      $(WRAP + inputcount )
      document.getElementById(WRAP + inputcount).remove();
      inputcount--;
    }
  }

  function sealInputs() {
    let isvalid = true;
    // Form validation
    for (let i = 0; i < inputcount; i++) {
      if (inputs[i].value == '' || inputs[i].value == null) {
        isvalid = false;
        break;
      }
    }

    if (isvalid) { // Code to execute on every input for column name
      console.log("Form is valid.")

      for (let i = 0; i < inputcount; i++) {
        const currinput = inputs[i];
        columnnames.push(currinput.value); // Add column name to list
        $(currinput).prop('disabled', true); // Disable input (jQuery)
        const input2 = document.createElement("input"); // Create second input
        input2.id = INPUT2 + (i + 1); // ...give it an ID
        inputs2.push(input2);
        spans[i].appendChild(input2); // ...and append it to wrapping span
      }
      addbutton.prop('disabled', true);
      removebutton.prop('disabled', true);
      setbutton.prop('disabled', true);
      createbutton.prop('disabled', false);
    } else {
      alert("Please fill in all fields, or remove excess ones");
    }
  } // sealInputs()

  function createRequest() {
    console.log("Trying to send " + columnnames);
    $.ajax({
      method: 'POST',
      url: '/define_log',
      data: { columnnames },
      success: function(data, status) {
        console.log("Success! Received: ");
        console.log(data);
        $('#srvresponse').text(data['returnstring']);  // a message after POST
        hash = data['hash'];
        createbutton.prop('disabled', true);
        postbutton.prop('disabled', false);
      },
      error: function() {
        $('#srvresponse').text('An error has occured.');
      }
    });
  }

  function postRequest() {
    var isValid = true;
    // Form validation
    for (let i = 0; i < inputcount; i++) {
      if (inputs2[i].value == '' || inputs2[i].value == null) {
        isvalid = false;
        break;
      }
    }
    if (isValid) {
      // Execute filling in log table
      for (let i = 0; i < inputcount; i++) {
        const currinput2 = inputs2[i];
        values.push(currinput2.value); // Add column name to list
        $(currinput2).text('') // Clear input for another use
      }
      // Send data
      console.log("Hash before sending: " + hash);
      $.ajax({
        method: 'POST',
        url: '/add_log',
        data: { columnnames, values, hash },
        success: function(data, status) {
          console.log("Success! Received: ");
          console.log(data);
          $('#valresponse').text(data['returnstring']);  // a message after POST
        },
        error: function() {
          $('#valresponse').text('An error has occured.');
        }
      });
      // Clear buffer
      values = [];
    } else {
      alert("Please fill in all value fields");
    }
  }
});

var inputs = [];
var inputs2 = [];
var spans = [];
var values = [];
var columnnames = [];

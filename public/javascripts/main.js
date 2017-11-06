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

  var inputcount = 0;

  addInput();

  addbutton.click(addInput);
  removebutton.click(removeInput);
  setbutton.click(sealInputs);

  function addInput() {
    inputcount++;
    var nodeinput = document.createElement("input");
    nodeinput.id = INPUT1 + inputcount;
    inputs.push(nodeinput); // Adds the input field to an array for further reference
    var nodespan = document.createElement("span");
    nodespan.id = WRAP + inputcount;
    nodespan.classList.add('block'); // Make each span in a new row
    spans.push(nodespan); // Adds the span to a list
    nodespan.appendChild(nodeinput);
    inputlist.append(nodespan); // .append(), because it's a jQuery element
    //inputlist.append(document.createElement("br"));
    $(nodeinput).focus(); // Place focus in new input
    console.log("Added input");
  } // addInput()

  function removeInput() {
    if (inputcount > 1) {
      console.log('Trying to remove ' + WRAP + inputcount);
      $(WRAP + inputcount )
      document.getElementById(WRAP + inputcount).remove();
      console.log(spans);
      console.log(inputs);
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
        spans[i].appendChild(input2); // ...and append it to wrapping span
      }
      addbutton.prop('disabled', true);
      removebutton.prop('disabled', true);
      setbutton.prop('disabled', true);
      createbutton.prop('disabled', false);
      postbutton.prop('disabled', false);
    } else {
      alert("Please fill in all fields, or remove excess ones");
    }
  } // sealInputs()

  function postRequest() {
    for (let i = 0; i < inputcount; i++) {

    }
  }
});

var inputs = [];
var spans = [];
var columnnames = [];
var values = [];

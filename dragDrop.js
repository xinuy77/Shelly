  document.addEventListener('dragover', handleDragOver, false);
  document.addEventListener('drop', handleFileSelect, false);

function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  var files = evt.dataTransfer.files; // FileList object.
  // files is a FileList of File objects. List some properties.
  var output = [];
  for (var i = 0, f; f = files[i]; i++) {
    //instead of outputting the file name do vim f.name into the terminal
    output.push(escape(f.name));
    console.log(f.name + " has been dragged and dropped");
  }
  document.getElementById('nameOfFile').innerHTML = '<ul>' + output.join('') + '</ul>';
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  //evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

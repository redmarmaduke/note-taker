var $noteTitle = $(".note-title");
var $noteText = $(".note-textarea");
var $saveNoteBtn = $(".save-note");
var $newNoteBtn = $(".new-note");
var $noteList = $(".list-container .list-group");

// activeNote is used to keep track of the note in the textarea
var activeNote = {};

/**
 * getNotes
 * 
 * @returns {object[]} JSON object representing an array of notes
 */
// A function for getting all notes from the db
var getNotes = function() {
  return $.ajax({
    url: "/api/notes",
    method: "GET"
  });
};

/**
 * saveNote
 * 
 * @param {object} note - note object to save
 * @returns {object} object saved
 */
var saveNote = function(note) {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST"
  });
};

/**
 * saveNote
 * A function for deleting a note from the db
 * 
 * @param {number} id - id of the note to delete
 * @returns {object} object that was just deleted
 */
var deleteNote = function(id) {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE"
  });
};

/**
 * renderActiveNote
 * 
 * @returns {undefined}
 */
var renderActiveNote = function() {
  $saveNoteBtn.hide();

  if (activeNote.id) {
    $noteTitle.attr("readonly", true);
    $noteText.attr("readonly", true);
    $noteTitle.val(activeNote.title);
    $noteText.val(activeNote.text);
  } else {
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
  }
};

/**
 * handleNoteSave
 * Get the note data from the inputs, save it to the db and update the view
 * 
 * @returns {undefined}
 */
var handleNoteSave = function() {
  var newNote = {
    title: $noteTitle.val(),
    text: $noteText.val()
  };

  saveNote(newNote).then(function(data) {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// 
/**
 * handleNoteDelete
 * Delete the clicked note
 * 
 * @param {InputEvent} - button clicked
 * 
 * @returns {undefined}
 */
var handleNoteDelete = function(event) {
  // prevents the click listener for the list from being called when the button inside of it is clicked
  event.stopPropagation();

  var note = $(this)
    .parent(".list-group-item")
    .data();

  if (activeNote.id === note.id) {
    activeNote = {};
  }

  deleteNote(note.id).then(function() {
    getAndRenderNotes();
    renderActiveNote();
  });
};

/**
 * handleNoteView
 * Sets the activeNote and displays it
 * 
 * @returns {undefined}
 */
var handleNoteView = function() {
  activeNote = $(this).data();
  renderActiveNote();
};

/**
 * handleNewNoteView
 * Sets the activeNote to and empty object and allows the user to enter a new note
 * 
 * @returns {undefined}
 */
var handleNewNoteView = function() {
  activeNote = {};
  renderActiveNote();
};

/**
 * handleRenderSaveBtn
 * If a note's title or text are empty, hide the save button
 * Or else show it
 * 
 * @returns {undefined}
 */
var handleRenderSaveBtn = function() {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};

/**
 * renderNoteList
 * Render's the list of note titles
 * 
 * @param {object[]} notes - array of notes to render
 * 
 * @returns {undefined}
 */
var renderNoteList = function(notes) {
  $noteList.empty();

  var noteListItems = [];

  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];

    var $li = $("<li class='list-group-item'>").data(note);
    var $span = $("<span>").text(note.title);
    var $delBtn = $(
      "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
    );

    $li.append($span, $delBtn);
    noteListItems.push($li);
  }

  $noteList.append(noteListItems);
};

/**
 * getAndRenderNotes
 * 
 * @returns {undefined}
 */
var getAndRenderNotes = function() {
  return getNotes().then(function(data) {
    renderNoteList(data);
  });
};

$saveNoteBtn.on("click", handleNoteSave);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$noteTitle.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);

// Gets and renders the initial list of notes
getAndRenderNotes();

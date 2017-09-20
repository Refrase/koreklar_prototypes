// ########## STATE ##########

const state = {
  thumbnailsVisible: null,
  explanationVisible: null,
  personalInfoDialogVisible: null
};

// ########## GENERIC ##########

// Message: Clear other messages than the current
function removeClassFromAllSimilarElementsApartFromThis( elementToShowId, className, similarElementsIds ) {
  for ( var i = 0; i < similarElementsIds.length; i++ ) {
    if ( similarElementsIds[i].id != elementToShowId ) {
      similarElementsIds[i].classList.remove( className );
    }
  }
}

var toggleClassTimeout;
function toggleClassTemporarily( elementNamedSameAsElementId, className, showtime, remove, similarElementsToToggleOff ) {
  removeClassFromAllSimilarElementsApartFromThis( elementNamedSameAsElementId, className, similarElementsToToggleOff );
  clearTimeout(toggleClassTimeout);
  if ( remove ) elementNamedSameAsElementId.classList.remove( className );
  else elementNamedSameAsElementId.classList.add( className );
  toggleClassTimeout = window.setTimeout( function() {
    if ( remove ) elementNamedSameAsElementId.classList.add( className );
    else elementNamedSameAsElementId.classList.remove( className );
  }, showtime);
}

function toggle( elementToggled, className = 'display-none' ) { elementToggled.classList.toggle( className ); }

// ########## UNDERVISNING ##########

/* ----- Dialogs ----- */
// ----- Personal info
var dialogPersonalInfo = document.getElementById( 'dialogPersonalInfo' );
var btnShowPersonalInfo = document.getElementById( 'menuItem-personalInfo' );
var dialogPersonalInfoClose = document.getElementById( 'dialogPersonalInfoClose' ); // Cross-icon in upper left corner
var btnSavePersonalInfo = document.getElementById( 'btnSavePersonalInfo' );
var btnCancelPersonalInfo = document.getElementById( 'btnCancelPersonalInfo' );
var btnClosePersonalInfo = document.getElementById( 'btnClosePersonalInfo' );
var messageElements = document.getElementsByClassName( 'message' );

var dialogIsOpen = false;

var togglePersonalInfoDialog = function( dialog ) {
  state.personalInfoDialogVisible ? null : toggleMenu();
  toggle( dialog, 'dialog-hidden' );
  state.personalInfoDialogVisible = !state.personalInfoDialogVisible;
};

btnShowPersonalInfo ? btnShowPersonalInfo.addEventListener( 'click', function() { togglePersonalInfoDialog(dialogPersonalInfo) } ) : null;
dialogPersonalInfoClose ? dialogPersonalInfoClose.addEventListener( 'click', function() { togglePersonalInfoDialog(dialogPersonalInfo) } ) : null;
btnCancelPersonalInfo ? btnCancelPersonalInfo.addEventListener( 'click', function() { togglePersonalInfoDialog(dialogPersonalInfo) } ) : null;
btnClosePersonalInfo ? btnClosePersonalInfo.addEventListener( 'click', function() { togglePersonalInfoDialog(dialogPersonalInfo) } ) : null;

// Change "Annuller" to "Luk when "Gem" is clicked
btnSavePersonalInfo ? btnSavePersonalInfo.addEventListener( 'click', function() {
  if ( btnClosePersonalInfo.classList.contains('display-none') ) {
    toggle(btnCancelPersonalInfo);
    toggle(btnClosePersonalInfo);
  }
}) : null;

// Message: Input-info
var inputInfoLabels = document.getElementsByClassName( 'label-info' );
var messageInputInfo = document.getElementById( 'messageInputInfo' );

var inputInfoTexts = {};

var personalInfoInputs = document.getElementsByClassName( 'input-personalInfo' );
for ( var i = 0; i < personalInfoInputs.length; i++ ) {
  var inputId = personalInfoInputs[i].id;
  inputInfoTexts[inputId] = 'Ingen ekstra information';
}

inputInfoTexts.username = 'Dit brugernavn';
inputInfoTexts.name = 'Dit navn';
inputInfoTexts.address = 'Din adresse';
inputInfoTexts.postalCode = 'Dit postnummer';
inputInfoTexts.city = 'Din by';
inputInfoTexts.email = 'Din email';
inputInfoTexts.userID = 'Dit bruger ID';
inputInfoTexts.cpr = 'Dit CPR nummer';
inputInfoTexts.phone = 'Din telefon';
inputInfoTexts.cellphone = 'Din mobiltelefon';

if ( inputInfoLabels ) {
  for ( var i = 0; i < inputInfoLabels.length; i++ ) {
    inputInfoLabels[i].addEventListener( 'click', function(e) {
      messageInputInfo.innerText = inputInfoTexts[e.target.previousElementSibling.id];
      toggleClassTemporarily( messageInputInfo, 'message-showing', 5000, null, messageElements );
    });
  }
}

// Message: Saved personal info successfully OR error message when e-mail is not sufficiently provided
var messageSuccess = document.getElementById( 'messageSuccess' );
var inputEmail = document.getElementById( 'email' );
var emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function emailValidator(string) {
  return emailRegExp.exec(string);
}

btnSavePersonalInfo ? btnSavePersonalInfo.addEventListener( 'click', function() {
  if ( !emailValidator(inputEmail.value) ) {
    inputEmail.classList.add( 'input-error' );
    toggleClassTemporarily( messageError, 'message-showing', 5000, null, messageElements );
  } else {
    for ( var i = 0; i < personalInfoInputs.length; i++ ) {
      personalInfoInputs[i].classList.remove( 'input-error' );
    }
    toggleClassTemporarily( messageSuccess, 'message-showing', 5000, null, messageElements );
  }
}) : null;

// Change password box
var btnShowChangePassword = document.getElementById( 'btnShowChangePassword' );
var boxChangePassword = document.getElementById( 'boxChangePassword' );
var btnSavePassword = document.getElementById( 'btnSavePassword' );
var btnCancelPassword = document.getElementById( 'btnCancelPassword' );
var btnClosePassword = document.getElementById( 'btnClosePassword' );

btnShowChangePassword ? btnShowChangePassword.addEventListener( 'click', function() {
  if ( !btnClosePassword.classList.contains('display-none') ) { // Make sure "Annuller" is shown on every visit
    toggle( btnCancelPassword );
    toggle( btnClosePassword );
  }
  toggle( boxChangePassword );
} ) : null;

btnCancelPassword ? btnCancelPassword.addEventListener( 'click', function() { toggle( boxChangePassword ); } ) : null;
btnClosePassword ? btnClosePassword.addEventListener( 'click', function() { toggle( boxChangePassword ); } ) : null;

btnSavePassword ? btnSavePassword.addEventListener( 'click', function() {
  if ( btnClosePassword.classList.contains('display-none') ) {
    toggle(btnCancelPassword);
    toggle(btnClosePassword);
  }
  toggleClassTemporarily( messageSuccess, 'message-showing', 5000, null, messageElements );
}) : null;

// Milestone completed
var controlBarBtnNext = document.getElementById( 'controlBarBtnNext' );
var dialogMilestoneCompleted = document.getElementById( 'dialogMilestoneCompleted' );
var dialogMilestoneCompletedCheckmark = document.getElementById( 'dialogMilestoneCompletedCheckmark' );
var dialogMilestoneCompletedBtnNo = document.getElementById( 'dialogMilestoneCompletedBtnNo' );

var toggleMilestoneCompletedDialog = function() {
  dialogMilestoneCompleted.classList.toggle( 'dialog-hidden' );
  dialogMilestoneCompletedCheckmark.classList.toggle( 'slideDown' );
  dialogMilestoneCompletedCheckmark.classList.toggle( 'slideDown-slow' );
};

controlBarBtnNext ? controlBarBtnNext.addEventListener( 'click', toggleMilestoneCompletedDialog ) : null;
dialogMilestoneCompletedBtnNo ? dialogMilestoneCompletedBtnNo.addEventListener( 'click', toggleMilestoneCompletedDialog ) : null;

// Loading spinner disc
var controlBarBtnRestart = document.getElementById( 'controlBarBtnRestart' );
var dialogLoadingSpinner = document.getElementById( 'dialogLoadingSpinner' );

controlBarBtnRestart ? controlBarBtnRestart.addEventListener( 'click', function() {
  toggleClassTemporarily( dialogLoadingSpinner, 'dialog-hidden', 4000, true, messageElements );
}) : null;

/* ----- Thumbnails AND Explanation Box ----- */
// Panel
var controlBarBtnThumbnails = document.getElementById( 'controlBarBtnThumbnails' );
var thumbnailPanel = document.getElementsByClassName( 'thumbnailPanel' );
var btnShowExplanation = document.getElementById( 'btnShowExplanation' );
var boxExplanation = document.getElementById( 'boxExplanation' );

const toggleThumbnailPanel = () => { thumbnailPanel[0].classList.toggle( 'thumbnailPanel-hidden' ); };

controlBarBtnThumbnails ? controlBarBtnThumbnails.addEventListener( 'click', function() {
  if ( state.explanationVisible ) {
    toggle( boxExplanation );
    state.explanationVisible = null;
  }
  toggleThumbnailPanel();
  state.thumbnailsVisible = !state.thumbnailsVisible;
}) : null;

btnShowExplanation ? btnShowExplanation.addEventListener( 'click', function() {
  if ( state.thumbnailsVisible ) {
    toggleThumbnailPanel();
    state.thumbnailsVisible = null;
  }
  toggle( boxExplanation );
  state.explanationVisible = !state.explanationVisible;
}) : null;

var buildArray = function(domArray, emptyArray) {
  for ( var i = 0; i < domArray.length; i++ ) {
    emptyArray.push(domArray[i]);
  }
};

// When hovering over a thumbnail the corresponding progressbar step has a class added or removed
var thumbnails = document.getElementsByClassName( 'thumbnail' );
var progressBarSteps = document.getElementsByClassName( 'progressBar_step' );
var thumbnailsArray = [];
var progressBarStepsArray = [];
buildArray(thumbnails, thumbnailsArray);
buildArray(progressBarSteps, progressBarStepsArray);

var toggleCorrespondingProgressStep = function(e) {
  for (var i = 0; i < progressBarStepsArray.length; i++) {
    if (thumbnailsArray.indexOf(e.target) === progressBarStepsArray.indexOf(progressBarStepsArray[i])) {
      if ( e.type === 'mouseenter' ) {
        progressBarStepsArray[i].classList.add( 'active' );
      } else {
        progressBarStepsArray[i].classList.remove( 'active' );
      }
    }
  }
};

var addEventListernersToThumbnails = function() {
  for ( var i = 0; i < thumbnailsArray.length; i++ ) {
    thumbnails[i].addEventListener( 'mouseenter', toggleCorrespondingProgressStep );
    thumbnails[i].addEventListener( 'mouseleave', toggleCorrespondingProgressStep );
  }
}();

/* ----- Menu ----- */
// Toggle
var menu = document.getElementsByClassName( 'menu' );
var menuBackground = document.getElementsByClassName( 'menuBackground' );
var burgerIcon = document.getElementById( 'burger' );
var htmlTag = document.getElementsByTagName( 'html' )[0];

var toggleMenu = function() {
  menu[0].classList.toggle( 'menu-hidden' );
  menuBackground[0].classList.toggle( 'menuBackground-hidden' );
  burgerIcon.classList.toggle( 'burger-active' );
  if ( htmlTag.className === 'overflow-hidden' ) { // Check if <html> has already 'overflow-hidden' applied (meaning the menu is visible)
    setTimeout( function() { // If so then wait for the closing animation of the menu, so that ugly scrollbars don't appear and makes content jump
      htmlTag.classList.toggle( 'overflow-hidden' );
    }, 600); // Menu animation duration
  } else { // Else just apply immediately, so that content doesn't jump on opening animation
    htmlTag.classList.toggle( 'overflow-hidden' );
  }
};

burgerIcon ? burgerIcon.addEventListener( 'click', toggleMenu ) : null;

// Open/close lists
var menuItemKurser = document.getElementById( 'menuItem-kurser' );
var menuListKurser = document.getElementById( 'menuList-kurser' );
var menuItemKategoriB = document.getElementById( 'menuItem-kategoriB' );
var menuListKategoriB = document.getElementById( 'menuList-kategoriB' );
var menuItemLektion1Og2 = document.getElementById( 'menuItem-lektion1Og2' );
var menuListLektion1Og2 = document.getElementById( 'menuList-lektion1Og2' );
var menuItemDiverse = document.getElementById( 'menuItem-diverse' );
var menuListDiverse = document.getElementById( 'menuList-diverse' );

var toggleList = function(list) { list.classList.toggle( 'level-closed' ); };

menuItemKurser ? menuItemKurser.addEventListener( 'click', function() { toggleList(menuListKurser); }) : null;
menuItemKategoriB ? menuItemKategoriB.addEventListener( 'click', function() { toggleList(menuListKategoriB); }) : null;
menuItemLektion1Og2 ? menuItemLektion1Og2.addEventListener( 'click', function() { toggleList(menuListLektion1Og2); }) : null;
menuItemDiverse ? menuItemDiverse.addEventListener( 'click', function() { toggleList(menuListDiverse); }) : null;

/* ----- Left/right markers ----- */
// Toggle
var controlBarBtnLeftRight = document.getElementById( 'controlBarBtnLeftRight' );
var leftRightMarkers = document.getElementById( 'leftRightMarkers' );

controlBarBtnLeftRight ? controlBarBtnLeftRight.addEventListener( 'click', function() { leftRightMarkers.classList.toggle( 'display-none' ); }) : null;


// ########## TEST-01 ##########

/* ----- Dialogs ----- */
// Answers
var btnShowAnswers = document.getElementById( 'btnShowAnswers' );
var dialogAnswers = document.getElementById( 'dialogAnswers' );
var dialogAnswersClose = document.getElementById( 'dialogAnswersClose' );

btnShowAnswers ? btnShowAnswers.addEventListener( 'click', function() { toggle(dialogAnswers, 'dialog-hidden') } ) : null;
dialogAnswersClose ? dialogAnswersClose.addEventListener( 'click', function() { toggle(dialogAnswers, 'dialog-hidden') } ) : null;

/* ----- Answers pagination ----- */
var answersBlock1 = document.getElementById( 'answersBlock-01' );
var answersBlock2 = document.getElementById( 'answersBlock-02' );
var btnAnswersNext = document.getElementById( 'btnAnswersNext' );
var btnAnswersPrevious = document.getElementById( 'btnAnswersPrevious' );

var nextAnswersBlock = function() {
  answersBlock1.classList.add( 'display-none' );
  answersBlock2.classList.remove( 'display-none' );
};

var previousAnswersBlock = function() {
  answersBlock1.classList.remove( 'display-none' );
  answersBlock2.classList.add( 'display-none' );
};

btnAnswersNext ? btnAnswersNext.addEventListener( 'click', nextAnswersBlock ) : null;
btnAnswersPrevious ? btnAnswersPrevious.addEventListener( 'click', previousAnswersBlock ) : null;


// ########## TEST-01-UNDERVISER ##########

/* ----- Dialogs ----- */
// Bug report
var btnShowBugReport = document.getElementById( 'btnShowBugReport' );
var dialogBugReport = document.getElementById( 'dialogBugReport' );
var dialogBugReportClose = document.getElementById( 'dialogBugReportClose' );

btnShowBugReport ? btnShowBugReport.addEventListener( 'click', function() { toggle(dialogBugReport, 'dialog-hidden') } ) : null;
dialogBugReportClose ? dialogBugReportClose.addEventListener( 'click', function() { toggle(dialogBugReport, 'dialog-hidden') } ) : null;

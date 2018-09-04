const scale = 16;

// ########## STATE ##########

const state = {
  thumbnailsVisible: false,
  explanationVisible: false,
  personalInfoDialogVisible: false,
  boxUserMetaVisible: false,
  breadcrumbWrapVisible: true,
  testImageExpanded: false,
  audioPlaying: false
};

// ########## DOM ELEMENTS ##########
const getEl = ( id ) => { return document.getElementById( id ); }
const getElsByClass = ( className ) => { return document.getElementsByClassName( className ); }
const dom = {
  changePassword: {
    personalInfo: {
      show: getEl( 'btnShowChangePassword' ),
      close: getEl( 'btnClosePassword' ),
      cancel: getEl( 'btnCancelPassword' ),
      save: getEl( 'btnSavePassword' ),
      box: getEl( 'boxChangePassword' )
    },
    login: {
      show: getEl( 'btnShowChangePasswordLogin' ),
      close: getEl( 'btnClosePasswordLogin' ),
      cancel: getEl( 'btnCancelPasswordLogin' ),
      save: getEl( 'btnSavePasswordLogin' ),
      box: getEl( 'boxChangePasswordLogin' )
    }
  },
  audioPlayer: {
    test: getEl( 'audioPlayer' )
  },
  controlBar: {
    buttons: {
      playPause: {
        button: getEl( 'controlBarBtnPlayPause' ),
        icons: {
          pause: getEl( 'controlBarBtnPlayPauseIconsPause' ),
          play: getEl( 'controlBarBtnPlayPauseIconsPlay' )
        }
      }
    }
  },
  progressBar: {
    thumbnails: getElsByClass( 'thumbnail' ),
    thumbnailsWithText: getElsByClass( 'thumbnail-withText' ),
    steps: getElsByClass( 'progressBar_step' )
  }
}

// ########## GENERIC ##########

// Message: Clear other messages than the current
function removeClassFromAllSimilarElementsApartFromThis( elementToShow, className, similarElementsIds ) {
  for ( var i = 0; i < similarElementsIds.length; i++ ) {
    if ( similarElementsIds[i].id != elementToShow.id ) {
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

// Change password box. Initialize the logic
const initChangePasswordBox = ( btnShow, btnClose, btnCancel, btnSave, boxChangePassword ) => {

  btnShow ? btnShow.addEventListener( 'click', () => {
    console.log(btnSave, btnShow, boxChangePassword)
    if ( !btnClose.classList.contains('display-none') ) { // Make sure "Annuller" is shown on every visit
      toggle( btnCancel );
      toggle( btnClose );
    }
    toggle( boxChangePassword );
  } ) : null;

  btnCancel ? btnCancel.addEventListener( 'click', () => { toggle( boxChangePassword ); } ) : null;
  btnClose ? btnClose.addEventListener( 'click', () => { toggle( boxChangePassword ); } ) : null;

  btnSave ? btnSave.addEventListener( 'click', () => {
    if ( btnClose.classList.contains('display-none') ) {
      toggle( btnCancel );
      toggle( btnClose );
    }
    toggleClassTemporarily( messageSuccess, 'message-showing', 5000, null, messageElements );
  }) : null;
}

// ########## UNDERVISNING ##########

/* ----- Dialogs ----- */
// ----- Personal info
var dialogPersonalInfo = document.getElementById( 'dialogPersonalInfo' );
var btnShowPersonalInfo = document.getElementById( 'menuItem-personalInfo' );
var btnShowPersonalInfoBoxUserMeta = document.getElementById( 'btnShowPersonalInfoBoxUserMeta' );
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
btnShowPersonalInfoBoxUserMeta ? btnShowPersonalInfoBoxUserMeta.addEventListener( 'click', function() { togglePersonalInfoDialog(dialogPersonalInfo) } ) : null;
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

// Message: Saved personal info successfully OR error message when e-mail is not sufficiently provided OR warning if no city provided
var messageSuccess = document.getElementById( 'messageSuccess' );
var messageWarning = document.getElementById( 'messageWarning' );
var inputEmail = document.getElementById( 'email' );
var inputCity = document.getElementById( 'city' );
var emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function emailValidator(string) {
  return emailRegExp.exec(string);
}

btnSavePersonalInfo ? btnSavePersonalInfo.addEventListener( 'click', function() {
  if ( !emailValidator(inputEmail.value) ) {
    inputEmail.classList.add( 'input-error' );
    toggleClassTemporarily( messageError, 'message-showing', 5000, null, messageElements );
  } else if ( !inputCity.value ) {
    toggleClassTemporarily( messageWarning, 'message-showing', 5000, null, messageElements );
  } else {
    for ( var i = 0; i < personalInfoInputs.length; i++ ) {
      personalInfoInputs[i].classList.remove( 'input-error' );
    }
    toggleClassTemporarily( messageSuccess, 'message-showing', 5000, null, messageElements );
  }
}) : null;

// Change password box
const pi = {};
({ show: pi.show, close: pi.close, cancel: pi.cancel, save: pi.save, box: pi.box } = dom.changePassword.personalInfo);
initChangePasswordBox( pi.show, pi.close, pi.cancel, pi.save, pi.box );

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

/* ----- Boxes ----- */
// Thumbnails AND Explanation AND Breadcrumb
var controlBarBtnThumbnails = document.getElementById( 'controlBarBtnThumbnails' );
var thumbnailPanel = document.getElementsByClassName( 'thumbnailPanel' );
var thumbnailPanelClose = document.getElementById( 'thumbnailPanelClose' );
var btnShowExplanation = document.getElementById( 'btnShowExplanation' );
var boxExplanation = document.getElementById( 'boxExplanation' );
var boxExplanationClose = document.getElementById( 'boxExplanationClose' );
var breadcrumbWrap = document.getElementById( 'breadcrumbWrap' );

const toggleThumbnailPanel = () => { thumbnailPanel[0].classList.toggle( 'thumbnailPanel-hidden' ); };

controlBarBtnThumbnails ? controlBarBtnThumbnails.addEventListener( 'click', function() {
  if ( state.explanationVisible ) {
    toggle( boxExplanation );
    state.explanationVisible = null;
  } else {
    toggle( breadcrumbWrap );
    state.breadcrumbWrapVisible = !state.breadcrumbWrapVisible;
  }
  toggleThumbnailPanel();
  state.thumbnailsVisible = !state.thumbnailsVisible;
}) : null;

thumbnailPanelClose ? thumbnailPanelClose.addEventListener( 'click', () => {
  toggle( breadcrumbWrap );
  state.breadcrumbWrapVisible = true;
  toggleThumbnailPanel();
  state.thumbnailsVisible = null;
}) : null;

btnShowExplanation ? btnShowExplanation.addEventListener( 'click', function() {
  if ( state.thumbnailsVisible ) {
    toggleThumbnailPanel();
    state.thumbnailsVisible = null;
  } else {
    toggle( breadcrumbWrap );
    state.breadcrumbWrapVisible = !state.breadcrumbWrapVisible;
  }
  toggle( boxExplanation );
  state.explanationVisible = !state.explanationVisible;
}) : null;

boxExplanationClose ? boxExplanationClose.addEventListener( 'click', () => {
  toggle( breadcrumbWrap );
  state.breadcrumbWrapVisible = true;
  toggle( boxExplanation );
  state.explanationVisible = null;
}) : null;

var buildArray = function(domArray, emptyArray) {
  for ( var i = 0; i < domArray.length; i++ ) {
    emptyArray.push(domArray[i]);
  }
};

// Context: thumbnailPanel -> When hovering over a thumbnail the corresponding progressbar step has a class added or removed
var toggleCorrespondingProgressStep = function(e) {
  for (var i = 0; i < dom.progressBar.steps.length; i++) {
    if ([].indexOf.call(dom.progressBar.thumbnails, e.target) === [].indexOf.call(dom.progressBar.steps, dom.progressBar.steps[i])) {
      if ( e.type === 'mouseenter' ) dom.progressBar.steps[i].classList.add( 'active' );
      else                           dom.progressBar.steps[i].classList.remove( 'active' );
    }
  }
};

var addEventListenersToThumbnails = function() {
  for ( var i = 0; i < dom.progressBar.thumbnails.length; i++ ) {
    dom.progressBar.thumbnails[i].addEventListener( 'mouseenter', toggleCorrespondingProgressStep );
    dom.progressBar.thumbnails[i].addEventListener( 'mouseleave', toggleCorrespondingProgressStep );
  }
}();

// Context: progressBar -> When hovering over a progressbar step the corresponding thumbnail has a class added or removed
var toggleCorrespondingThumbnail = function(e) {
  for (var i = 0; i < dom.progressBar.thumbnailsWithText.length; i++) {
    dom.progressBar.thumbnailsWithText[i].style.width = `${dom.progressBar.steps[0].clientWidth}px`; // Setting the thumbnail width to the step width
    if ([].indexOf.call(dom.progressBar.steps, e.target) === [].indexOf.call(dom.progressBar.thumbnailsWithText, dom.progressBar.thumbnailsWithText[i])) {
      if ( e.type === 'mouseenter' ) dom.progressBar.thumbnailsWithText[i].classList.add( 'active' );
      else                           dom.progressBar.thumbnailsWithText[i].classList.remove( 'active' );
    }
  }
};

var addEventListenersToProgressSteps = function() {
  for ( var i = 0; i < dom.progressBar.steps.length; i++ ) {
    dom.progressBar.steps[i].addEventListener( 'mouseenter', toggleCorrespondingThumbnail );
    dom.progressBar.steps[i].addEventListener( 'mouseleave', toggleCorrespondingThumbnail );
  }
}();

// User meta (toggled by avatar)
var btnShowBoxUserMeta = document.getElementById( 'btnShowBoxUserMeta' );
var boxUserMeta = document.getElementById( 'boxUserMeta' );
var boxUserMetaClose = document.getElementById( 'boxUserMetaClose' );

btnShowBoxUserMeta ? btnShowBoxUserMeta.addEventListener( 'click', function() {
  toggle( boxUserMeta );
  state.boxUserMetaVisible = true;
}) : null;

boxUserMetaClose ? boxUserMetaClose.addEventListener( 'click', () => {
  toggle( boxUserMeta );
  state.boxUserMetaVisible = null;
}) : null;

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

// // Mark menuItem as part of a streak (showing the connector) if all menuItems before is completed AND the streak starts at the first task in the list
// // A CSS solution is also implemented, which is why this is commented out
// // If activated also uncomment the class under &-withConnector in _menu.scss that is labeled as part of this implementation

// const menuListsWithConnectors = document.getElementsByClassName( 'level-withConnector' )
// loopLists:
// for ( let list in menuListsWithConnectors ) {
//   const listItems = menuListsWithConnectors[list].children
//   loopListitems:
//   for ( let listItem in listItems ) {
//     const completion = listItems[listItem].getAttribute('completion')
//     if ( completion && completion == 100 ) listItems[listItem].classList.add( 'streak' )
//     else break loopListitems
//   }
// }

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

/* ----- Sound and completion-indicator ----- */
// Controlling audio and animation refered to below with play/pause button
// Animation filling out the progress bar step with green from left to right depending on how far the audio voiceover has come

const testNumber = document.getElementById('pageNumber') ? parseInt(document.getElementById('pageNumber').dataset.pageNumber) : null;
const testProgressBarStep = testNumber ? dom.progressBar.steps[testNumber - 1] : null;
const testProgressBarStepCompletionIndicator = testProgressBarStep ? testProgressBarStep.getElementsByClassName( 'completion' )[0] : null;

let audioDuration = null;

if ( dom.audioPlayer.test ) {
  dom.audioPlayer.test.play();
  state.audioPlaying = true;
  audioDuration = Math.floor(dom.audioPlayer.test.duration);
}

function onAudioEnd(interval) {
  if ( dom.audioPlayer.test && dom.audioPlayer.test.ended ) {
    state.audioPlaying = false;
    toggle(dom.controlBar.buttons.playPause.icons.pause, 'display-none');
    toggle(dom.controlBar.buttons.playPause.icons.play, 'display-none');
    clearInterval(interval);
  }
};

let audioEndCheck = setInterval( () => { onAudioEnd(audioEndCheck); }, 500);

testProgressBarStepCompletionIndicator ? testProgressBarStepCompletionIndicator.style.animation = `toFullWidth ${audioDuration}s linear forwards` : null;

dom.controlBar.buttons.playPause.button ? dom.controlBar.buttons.playPause.button.addEventListener( 'click', () => {
  clearInterval(audioEndCheck);
  toggle(dom.controlBar.buttons.playPause.icons.pause, 'display-none');
  toggle(dom.controlBar.buttons.playPause.icons.play, 'display-none');
  if ( state.audioPlaying ) {
    testProgressBarStepCompletionIndicator.style.animationPlayState = 'paused';
    dom.audioPlayer.test.pause();
    state.audioPlaying = false;
  } else {
    testProgressBarStepCompletionIndicator.style.animationPlayState = 'running';
    audioEndCheck = setInterval( () => { onAudioEnd(audioEndCheck); }, 500);
    dom.audioPlayer.test.play();
    state.audioPlaying = true;
  }
}) : null;

// ########## TEST-01-UNDERVISER ##########
/* ----- Dialogs ----- */
// ----- Bug report
var btnShowBugReport = document.getElementById( 'btnShowBugReport' );
var dialogBugReport = document.getElementById( 'dialogBugReport' );
var dialogBugReportClose = document.getElementById( 'dialogBugReportClose' );
var btnSendBugReport = document.getElementById( 'btnSendBugReport' );
var btnCancelBugReport = document.getElementById( 'btnCancelBugReport' );

btnShowBugReport ? btnShowBugReport.addEventListener( 'click', function() { toggle(dialogBugReport, 'dialog-hidden') } ) : null;
dialogBugReportClose ? dialogBugReportClose.addEventListener( 'click', function() { toggle(dialogBugReport, 'dialog-hidden') } ) : null;
btnCancelBugReport ? btnCancelBugReport.addEventListener( 'click', function() { toggle(dialogBugReport, 'dialog-hidden') } ) : null;

btnSendBugReport ? btnSendBugReport.addEventListener( 'click', function() {
  toggleClassTemporarily( messageSuccess, 'message-showing', 5000, null, messageElements );
  toggle(dialogBugReport, 'dialog-hidden');
}) : null;

// ########## LOGIN ##########
// ----- Change password box
const l = {};
({ show: l.show, close: l.close, cancel: l.cancel, save: l.save, box: l.box } = dom.changePassword.login);
initChangePasswordBox( l.show, l.close, l.cancel, l.save, l.box );

// ########## TEST-01-SMALL-SCREEN-ALTERNATIVE ##########

/* ----- Image ----- */
const floatingTestImageWrap = document.getElementById( 'floatingTestImageWrap' );
const floatingTestImage = document.getElementById( 'floatingTestImage' );
const btnExpandImage = document.getElementById( 'btnExpandImage' );

let testImageWidth = floatingTestImage ? floatingTestImage.width / 2 : null; // Not expanded by default, therefore it is half width due to the initial CSS transform scale3d(0.5, 0.5, 0.5) to preserve high quality on expansion
let testImageHeight = floatingTestImage ? floatingTestImage.height / 2 : null;

// Toggling the image between full and half width
btnExpandImage ? btnExpandImage.addEventListener( 'click', () => {
  toggle( floatingTestImage, 'expanded' );
  state.testImageExpanded = !state.testImageExpanded;
  testImageWidth = state.testImageExpanded === true ? floatingTestImage.width : floatingTestImage.width / 2;
  testImageHeight = state.testImageExpanded === true ? floatingTestImage.height : floatingTestImage.height / 2;
}) : null;

// Possibility of moving around the 'floating' image to each corner of the screen (it snaps to each corner after touch release)
let originalTouchPosX = 0;
let originalTouchPosY = 0;
floatingTestImageWrap ? floatingTestImageWrap.addEventListener( 'touchstart', (event) => {
  if (event.targetTouches.length == 1) {
    const touch = event.targetTouches[0];
    originalTouchPosX = touch.pageX;
    originalTouchPosY = touch.pageY;
  }
}) : null;

floatingTestImageWrap ? floatingTestImageWrap.addEventListener( 'touchmove', (event) => {
  if (event.targetTouches.length == 1) { // If there's exactly one finger inside this element
    const touch = event.targetTouches[0];
    floatingTestImageWrap.style.transition = 'none';
    floatingTestImageWrap.style.transform = `translate3d(${touch.pageX - originalTouchPosX}px, ${touch.pageY - originalTouchPosY}px, 0)`;
  }
}, false) : null;

let currentArea = 'bottomRight';
floatingTestImageWrap ? floatingTestImageWrap.addEventListener( 'touchend', (event) => {
  if (event.changedTouches.length == 1) {
    const touch = event.changedTouches[0];

    const classNames = [ 'topLeft', 'topRight', 'bottomRight', 'bottomLeft' ];
    const addRightClassname = ( rightClassname ) => {
      for ( let className in classNames ) floatingTestImageWrap.classList.remove( classNames[className] );
      floatingTestImageWrap.classList.add( rightClassname );
    }

    const decideDestination = () => {

      let dragThreshold = 50;
      let dragDirection = '';
      const decideDragDirection = () => {
        if ( touch.pageX > 0 && originalTouchPosX - touch.pageX > dragThreshold )                   dragDirection += 'left';
        if ( touch.pageX < window.innerWidth && originalTouchPosX - touch.pageX < -dragThreshold )  dragDirection += 'right';
        if ( touch.pageY > 0 && originalTouchPosY - touch.pageY > dragThreshold )                   dragDirection += 'up';
        if ( touch.pageY < window.innerHeight && originalTouchPosY - touch.pageY < -dragThreshold ) dragDirection += 'down';
      };
      decideDragDirection();

      const startAndStopTouchXDif = touch.pageX - originalTouchPosX;
      const startAndStopTouchYDif = touch.pageY - originalTouchPosY;
      const imageWidthIfNotExpanded = state.testImageExpanded ? 0 : testImageWidth;
      const halfImageHightIfExpandedElseDoubleHeight = state.testImageExpanded ? testImageHeight / 2 : testImageHeight * 2;

      const endTransforms = {
        bottomRight: {
          bottomLeft: `${startAndStopTouchXDif + imageWidthIfNotExpanded}px, ${startAndStopTouchYDif}`,
          topRight: `${startAndStopTouchXDif}px, ${startAndStopTouchYDif + halfImageHightIfExpandedElseDoubleHeight + 26}`,
          topLeft: `${startAndStopTouchXDif + imageWidthIfNotExpanded}px, ${startAndStopTouchYDif + halfImageHightIfExpandedElseDoubleHeight + 26}`,
        },
        bottomLeft: {
          bottomRight: `${startAndStopTouchXDif - imageWidthIfNotExpanded}px, ${startAndStopTouchYDif}`,
          topRight: `${startAndStopTouchXDif - imageWidthIfNotExpanded}px, ${startAndStopTouchYDif + halfImageHightIfExpandedElseDoubleHeight + 26}`,
          topLeft: `${startAndStopTouchXDif}px, ${startAndStopTouchYDif + halfImageHightIfExpandedElseDoubleHeight + 26}`,
        },
        topRight: {
          bottomRight: `${startAndStopTouchXDif}px, ${startAndStopTouchYDif - halfImageHightIfExpandedElseDoubleHeight - 26}`,
          bottomLeft: `${startAndStopTouchXDif + imageWidthIfNotExpanded}px, ${startAndStopTouchYDif - halfImageHightIfExpandedElseDoubleHeight - 26}`,
          topLeft: `${startAndStopTouchXDif + imageWidthIfNotExpanded}px, ${startAndStopTouchYDif}`,
        },
        topLeft: {
          bottomRight: `${startAndStopTouchXDif - imageWidthIfNotExpanded}px, ${startAndStopTouchYDif - halfImageHightIfExpandedElseDoubleHeight - 26}`,
          bottomLeft: `${startAndStopTouchXDif}px, ${startAndStopTouchYDif - halfImageHightIfExpandedElseDoubleHeight - 26}`,
          topRight: `${startAndStopTouchXDif - imageWidthIfNotExpanded}px, ${startAndStopTouchYDif}`,
        }
      }

      const floatingTestImageWrapEndTransform = ( transform ) => { return floatingTestImageWrap.style.transform = `translate3d(${transform}px, 0)` };

      const moveToDestination = ( fromArea = 'bottomRight', toArea ) => {
        addRightClassname( toArea );
        floatingTestImageWrapEndTransform( endTransforms[fromArea][toArea] );
        currentArea = toArea;
      }

      const directionHolds = ( direction ) => { return dragDirection.indexOf(direction) > -1 };

      if ( currentArea === 'bottomRight' ) {
        if ( directionHolds('left') && directionHolds('up') ) return moveToDestination( currentArea, 'topLeft' );
        else if ( directionHolds('left') ) return moveToDestination( currentArea, 'bottomLeft' );
        else if ( directionHolds('up') ) return moveToDestination( currentArea, 'topRight' );
      }
      if ( currentArea === 'bottomLeft' ) {
        if ( directionHolds('right') && directionHolds('up') ) return moveToDestination( currentArea, 'topRight' );
        else if ( directionHolds('right') ) return moveToDestination( currentArea, 'bottomRight' );
        else if ( directionHolds('up') ) return moveToDestination( currentArea, 'topLeft' );
      }
      if ( currentArea === 'topRight' ) {
        if ( directionHolds('left') && directionHolds('down') ) return moveToDestination( currentArea, 'bottomLeft' );
        else if ( directionHolds('left') ) return moveToDestination( currentArea, 'topLeft' );
        else if ( directionHolds('down') ) return moveToDestination( currentArea, 'bottomRight' );
      }
      if ( currentArea === 'topLeft' ) {
        if ( directionHolds('right') && directionHolds('down') ) return moveToDestination( currentArea, 'bottomRight' );
        else if ( directionHolds('right') ) return moveToDestination( currentArea, 'topRight' );
        else if ( directionHolds('down') ) return moveToDestination( currentArea, 'bottomLeft' );
      }

      dragDirection = '';

      // OLD CODE FOR DECIDING THE DESTINATION BASED ON WHICH CORNER OF THE SCREEN THE TOUCHEND OCCURS (CAN STILL BE ENABLED BY UNCOMMENTING THE CODE --> BUT SURPLUS AS THE NEW CODE DOES THE JOB IN A MORE SMOOTH WAY)
      // THE NEW CODE REGISTERS IN WHICH DIRECTION THE TOUCH IS GOING AND SENDS THE IMAGE IN THE CORNER OF THAT DIRECTION IF A DRAGGING DISTANCE THRESHOLD IS REACHED
      // if ( touch.pageX > window.innerWidth / 2 && touch.pageY > window.innerHeight / 2 ) {
      //   addRightClassname( 'bottomRight' );
      //   if ( currentArea === 'bottomLeft' ) {
      //     floatingTestImageWrap.style.transform = `translate3d(
      //       ${startAndStopTouchXDif - imageWidthIfNotExpanded}px,
      //       ${startAndStopTouchYDif}px, 0)`;
      //   } else if ( currentArea === 'topRight' ) {
      //     floatingTestImageWrap.style.transform = `translate3d(
      //       ${startAndStopTouchXDif}px,
      //       ${startAndStopTouchYDif - halfImageHightIfExpandedElseDoubleHeight - 26}px, 0)`;
      //   } else if ( currentArea === 'topLeft' ) {
      //     floatingTestImageWrap.style.transform = `translate3d(
      //       ${startAndStopTouchXDif - imageWidthIfNotExpanded}px,
      //       ${startAndStopTouchYDif - halfImageHightIfExpandedElseDoubleHeight - 26}px, 0)`;
      //   }
      //   currentArea = 'bottomRight';
      // }
      // else if ( touch.pageX < window.innerWidth / 2 && touch.pageY > window.innerHeight / 2 ) {
      //   addRightClassname( 'bottomLeft' );
      //   if ( currentArea === 'bottomRight' ) {
      //     floatingTestImageWrap.style.transform = `translate3d(
      //       ${startAndStopTouchXDif + imageWidthIfNotExpanded}px,
      //       ${startAndStopTouchYDif}px, 0)`;
      //   } else if ( currentArea === 'topRight' ) {
      //     floatingTestImageWrap.style.transform = `translate3d(
      //       ${startAndStopTouchXDif + imageWidthIfNotExpanded}px,
      //       ${startAndStopTouchYDif - halfImageHightIfExpandedElseDoubleHeight - 26}px, 0)`;
      //   } else if ( currentArea === 'topLeft' ) {
      //     floatingTestImageWrap.style.transform = `translate3d(
      //       ${startAndStopTouchXDif}px,
      //       ${startAndStopTouchYDif - halfImageHightIfExpandedElseDoubleHeight - 26}px, 0)`;
      //   }
      //   currentArea = 'bottomLeft';
      // }
      // else if ( touch.pageX > window.innerWidth / 2 && touch.pageY < window.innerHeight / 2 ) {
      //   addRightClassname( 'topRight' );
      //   if ( currentArea === 'bottomRight' ) {
      //     floatingTestImageWrap.style.transform = `translate3d(
      //       ${startAndStopTouchXDif}px,
      //       ${startAndStopTouchYDif + halfImageHightIfExpandedElseDoubleHeight + 26}px, 0)`;
      //   } else if ( currentArea === 'bottomLeft' ) {
      //     floatingTestImageWrap.style.transform = `translate3d(
      //       ${startAndStopTouchXDif - imageWidthIfNotExpanded}px,
      //       ${startAndStopTouchYDif + halfImageHightIfExpandedElseDoubleHeight + 26}px, 0)`;
      //   } else if ( currentArea === 'topLeft' ) {
      //     floatingTestImageWrap.style.transform = `translate3d(
      //       ${startAndStopTouchXDif - imageWidthIfNotExpanded}px,
      //       ${startAndStopTouchYDif}px, 0)`;
      //   }
      //   currentArea = 'topRight';
      // } else {
      //   addRightClassname( 'topLeft' );
      //   if ( currentArea === 'bottomRight' ) {
      //     floatingTestImageWrap.style.transform = `translate3d(
      //       ${startAndStopTouchXDif + imageWidthIfNotExpanded}px,
      //       ${startAndStopTouchYDif + halfImageHightIfExpandedElseDoubleHeight + 26}px, 0)`;
      //   } else if ( currentArea === 'bottomLeft' ) {
      //     floatingTestImageWrap.style.transform = `translate3d(
      //       ${startAndStopTouchXDif}px,
      //       ${startAndStopTouchYDif + halfImageHightIfExpandedElseDoubleHeight + 26}px, 0)`;
      //   } else if ( currentArea === 'topRight' ) {
      //     floatingTestImageWrap.style.transform = `translate3d(
      //       ${startAndStopTouchXDif + imageWidthIfNotExpanded}px,
      //       ${startAndStopTouchYDif}px, 0)`;
      //   }
      //   currentArea = 'topLeft';
      // }
    }
    decideDestination();
  }

  setTimeout( () => {
    floatingTestImageWrap.style.transition = 'transform 600ms cubic-bezier(0.23, 1, 0.32, 1)';
    floatingTestImageWrap.style.transform = 'translate3d(0, 0, 0)';
  }, 20); // Timeout to put transition in next callstack as it will otherwise make the image jump due to the image having new position properties applied

}) : null;

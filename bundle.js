(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

// ########## STATE ##########

var state = {
  thumbnailsVisible: null,
  explanationVisible: null,
  personalInfoDialogVisible: null,
  boxUserMetaVisible: null,
  breadcrumbWrapVisible: true
};

// ########## GENERIC ##########

// Message: Clear other messages than the current
function removeClassFromAllSimilarElementsApartFromThis(elementToShow, className, similarElementsIds) {
  for (var i = 0; i < similarElementsIds.length; i++) {
    if (similarElementsIds[i].id != elementToShow.id) {
      similarElementsIds[i].classList.remove(className);
    }
  }
}

var toggleClassTimeout;
function toggleClassTemporarily(elementNamedSameAsElementId, className, showtime, remove, similarElementsToToggleOff) {
  removeClassFromAllSimilarElementsApartFromThis(elementNamedSameAsElementId, className, similarElementsToToggleOff);
  clearTimeout(toggleClassTimeout);
  if (remove) elementNamedSameAsElementId.classList.remove(className);else elementNamedSameAsElementId.classList.add(className);
  toggleClassTimeout = window.setTimeout(function () {
    if (remove) elementNamedSameAsElementId.classList.add(className);else elementNamedSameAsElementId.classList.remove(className);
  }, showtime);
}

function toggle(elementToggled) {
  var className = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'display-none';
  elementToggled.classList.toggle(className);
}

// ########## UNDERVISNING ##########

/* ----- Dialogs ----- */
// ----- Personal info
var dialogPersonalInfo = document.getElementById('dialogPersonalInfo');
var btnShowPersonalInfo = document.getElementById('menuItem-personalInfo');
var btnShowPersonalInfoBoxUserMeta = document.getElementById('btnShowPersonalInfoBoxUserMeta');
var dialogPersonalInfoClose = document.getElementById('dialogPersonalInfoClose'); // Cross-icon in upper left corner
var btnSavePersonalInfo = document.getElementById('btnSavePersonalInfo');
var btnCancelPersonalInfo = document.getElementById('btnCancelPersonalInfo');
var btnClosePersonalInfo = document.getElementById('btnClosePersonalInfo');
var messageElements = document.getElementsByClassName('message');

var dialogIsOpen = false;

var togglePersonalInfoDialog = function togglePersonalInfoDialog(dialog) {
  state.personalInfoDialogVisible ? null : toggleMenu();
  toggle(dialog, 'dialog-hidden');
  state.personalInfoDialogVisible = !state.personalInfoDialogVisible;
};

btnShowPersonalInfo ? btnShowPersonalInfo.addEventListener('click', function () {
  togglePersonalInfoDialog(dialogPersonalInfo);
}) : null;
btnShowPersonalInfoBoxUserMeta ? btnShowPersonalInfoBoxUserMeta.addEventListener('click', function () {
  togglePersonalInfoDialog(dialogPersonalInfo);
}) : null;
dialogPersonalInfoClose ? dialogPersonalInfoClose.addEventListener('click', function () {
  togglePersonalInfoDialog(dialogPersonalInfo);
}) : null;
btnCancelPersonalInfo ? btnCancelPersonalInfo.addEventListener('click', function () {
  togglePersonalInfoDialog(dialogPersonalInfo);
}) : null;
btnClosePersonalInfo ? btnClosePersonalInfo.addEventListener('click', function () {
  togglePersonalInfoDialog(dialogPersonalInfo);
}) : null;

// Change "Annuller" to "Luk when "Gem" is clicked
btnSavePersonalInfo ? btnSavePersonalInfo.addEventListener('click', function () {
  if (btnClosePersonalInfo.classList.contains('display-none')) {
    toggle(btnCancelPersonalInfo);
    toggle(btnClosePersonalInfo);
  }
}) : null;

// Message: Input-info
var inputInfoLabels = document.getElementsByClassName('label-info');
var messageInputInfo = document.getElementById('messageInputInfo');

var inputInfoTexts = {};

var personalInfoInputs = document.getElementsByClassName('input-personalInfo');
for (var i = 0; i < personalInfoInputs.length; i++) {
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

if (inputInfoLabels) {
  for (var i = 0; i < inputInfoLabels.length; i++) {
    inputInfoLabels[i].addEventListener('click', function (e) {
      messageInputInfo.innerText = inputInfoTexts[e.target.previousElementSibling.id];
      toggleClassTemporarily(messageInputInfo, 'message-showing', 5000, null, messageElements);
    });
  }
}

// Message: Saved personal info successfully OR error message when e-mail is not sufficiently provided OR warning if no city provided
var messageSuccess = document.getElementById('messageSuccess');
var messageWarning = document.getElementById('messageWarning');
var inputEmail = document.getElementById('email');
var inputCity = document.getElementById('city');
var emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function emailValidator(string) {
  return emailRegExp.exec(string);
}

btnSavePersonalInfo ? btnSavePersonalInfo.addEventListener('click', function () {
  if (!emailValidator(inputEmail.value)) {
    inputEmail.classList.add('input-error');
    toggleClassTemporarily(messageError, 'message-showing', 5000, null, messageElements);
  } else if (!inputCity.value) {
    toggleClassTemporarily(messageWarning, 'message-showing', 5000, null, messageElements);
  } else {
    for (var i = 0; i < personalInfoInputs.length; i++) {
      personalInfoInputs[i].classList.remove('input-error');
    }
    toggleClassTemporarily(messageSuccess, 'message-showing', 5000, null, messageElements);
  }
}) : null;

// Change password box
var btnShowChangePassword = document.getElementById('btnShowChangePassword');
var boxChangePassword = document.getElementById('boxChangePassword');
var btnSavePassword = document.getElementById('btnSavePassword');
var btnCancelPassword = document.getElementById('btnCancelPassword');
var btnClosePassword = document.getElementById('btnClosePassword');

btnShowChangePassword ? btnShowChangePassword.addEventListener('click', function () {
  if (!btnClosePassword.classList.contains('display-none')) {
    // Make sure "Annuller" is shown on every visit
    toggle(btnCancelPassword);
    toggle(btnClosePassword);
  }
  toggle(boxChangePassword);
}) : null;

btnCancelPassword ? btnCancelPassword.addEventListener('click', function () {
  toggle(boxChangePassword);
}) : null;
btnClosePassword ? btnClosePassword.addEventListener('click', function () {
  toggle(boxChangePassword);
}) : null;

btnSavePassword ? btnSavePassword.addEventListener('click', function () {
  if (btnClosePassword.classList.contains('display-none')) {
    toggle(btnCancelPassword);
    toggle(btnClosePassword);
  }
  toggleClassTemporarily(messageSuccess, 'message-showing', 5000, null, messageElements);
}) : null;

// Milestone completed
var controlBarBtnNext = document.getElementById('controlBarBtnNext');
var dialogMilestoneCompleted = document.getElementById('dialogMilestoneCompleted');
var dialogMilestoneCompletedCheckmark = document.getElementById('dialogMilestoneCompletedCheckmark');
var dialogMilestoneCompletedBtnNo = document.getElementById('dialogMilestoneCompletedBtnNo');

var toggleMilestoneCompletedDialog = function toggleMilestoneCompletedDialog() {
  dialogMilestoneCompleted.classList.toggle('dialog-hidden');
  dialogMilestoneCompletedCheckmark.classList.toggle('slideDown');
  dialogMilestoneCompletedCheckmark.classList.toggle('slideDown-slow');
};

controlBarBtnNext ? controlBarBtnNext.addEventListener('click', toggleMilestoneCompletedDialog) : null;
dialogMilestoneCompletedBtnNo ? dialogMilestoneCompletedBtnNo.addEventListener('click', toggleMilestoneCompletedDialog) : null;

// Loading spinner disc
var controlBarBtnRestart = document.getElementById('controlBarBtnRestart');
var dialogLoadingSpinner = document.getElementById('dialogLoadingSpinner');

controlBarBtnRestart ? controlBarBtnRestart.addEventListener('click', function () {
  toggleClassTemporarily(dialogLoadingSpinner, 'dialog-hidden', 4000, true, messageElements);
}) : null;

/* ----- Boxes ----- */
// Thumbnails AND Explanation AND Breadcrumb
var controlBarBtnThumbnails = document.getElementById('controlBarBtnThumbnails');
var thumbnailPanel = document.getElementsByClassName('thumbnailPanel');
var thumbnailPanelClose = document.getElementById('thumbnailPanelClose');
var btnShowExplanation = document.getElementById('btnShowExplanation');
var boxExplanation = document.getElementById('boxExplanation');
var boxExplanationClose = document.getElementById('boxExplanationClose');
var breadcrumbWrap = document.getElementById('breadcrumbWrap');

var toggleThumbnailPanel = function toggleThumbnailPanel() {
  thumbnailPanel[0].classList.toggle('thumbnailPanel-hidden');
};

controlBarBtnThumbnails ? controlBarBtnThumbnails.addEventListener('click', function () {
  if (state.explanationVisible) {
    toggle(boxExplanation);
    state.explanationVisible = null;
  } else {
    toggle(breadcrumbWrap);
    state.breadcrumbWrapVisible = !state.breadcrumbWrapVisible;
  }
  toggleThumbnailPanel();
  state.thumbnailsVisible = !state.thumbnailsVisible;
}) : null;

thumbnailPanelClose ? thumbnailPanelClose.addEventListener('click', function () {
  toggle(breadcrumbWrap);
  state.breadcrumbWrapVisible = true;
  toggleThumbnailPanel();
  state.thumbnailsVisible = null;
}) : null;

btnShowExplanation ? btnShowExplanation.addEventListener('click', function () {
  if (state.thumbnailsVisible) {
    toggleThumbnailPanel();
    state.thumbnailsVisible = null;
  } else {
    toggle(breadcrumbWrap);
    state.breadcrumbWrapVisible = !state.breadcrumbWrapVisible;
  }
  toggle(boxExplanation);
  state.explanationVisible = !state.explanationVisible;
}) : null;

boxExplanationClose ? boxExplanationClose.addEventListener('click', function () {
  toggle(breadcrumbWrap);
  state.breadcrumbWrapVisible = true;
  toggle(boxExplanation);
  state.explanationVisible = null;
}) : null;

var buildArray = function buildArray(domArray, emptyArray) {
  for (var i = 0; i < domArray.length; i++) {
    emptyArray.push(domArray[i]);
  }
};

// When hovering over a thumbnail the corresponding progressbar step has a class added or removed
var thumbnails = document.getElementsByClassName('thumbnail');
var thumbnailsWithText = document.getElementsByClassName('thumbnail-withText');
var progressBarSteps = document.getElementsByClassName('progressBar_step');
var thumbnailsArray = [];
var thumbnailsWithTextArray = [];
var progressBarStepsArray = [];
buildArray(thumbnails, thumbnailsArray);
buildArray(thumbnailsWithText, thumbnailsWithTextArray);
buildArray(progressBarSteps, progressBarStepsArray);

var toggleCorrespondingProgressStep = function toggleCorrespondingProgressStep(e) {
  for (var i = 0; i < progressBarStepsArray.length; i++) {
    if (thumbnailsArray.indexOf(e.target) === progressBarStepsArray.indexOf(progressBarStepsArray[i])) {
      if (e.type === 'mouseenter') {
        progressBarStepsArray[i].classList.add('active');
      } else {
        progressBarStepsArray[i].classList.remove('active');
      }
    }
  }
};

var addEventListenersToThumbnails = function () {
  for (var i = 0; i < thumbnailsArray.length; i++) {
    thumbnailsArray[i].addEventListener('mouseenter', toggleCorrespondingProgressStep);
    thumbnailsArray[i].addEventListener('mouseleave', toggleCorrespondingProgressStep);
  }
}();

var toggleCorrespondingThumbnail = function toggleCorrespondingThumbnail(e) {
  for (var i = 0; i < thumbnailsWithTextArray.length; i++) {
    if (progressBarStepsArray.indexOf(e.target) === thumbnailsWithTextArray.indexOf(thumbnailsWithTextArray[i])) {
      if (e.type === 'mouseenter') {
        thumbnailsWithTextArray[i].classList.add('active');
      } else {
        thumbnailsWithTextArray[i].classList.remove('active');
      }
    }
  }
};

var addEventListenersToProgressSteps = function () {
  for (var i = 0; i < progressBarStepsArray.length; i++) {
    progressBarSteps[i].addEventListener('mouseenter', toggleCorrespondingThumbnail);
    progressBarSteps[i].addEventListener('mouseleave', toggleCorrespondingThumbnail);
  }
}();

// User meta (toggled by avatar)
var btnShowBoxUserMeta = document.getElementById('btnShowBoxUserMeta');
var boxUserMeta = document.getElementById('boxUserMeta');
var boxUserMetaClose = document.getElementById('boxUserMetaClose');

btnShowBoxUserMeta ? btnShowBoxUserMeta.addEventListener('click', function () {
  toggle(boxUserMeta);
  state.boxUserMetaVisible = true;
}) : null;

boxUserMetaClose ? boxUserMetaClose.addEventListener('click', function () {
  toggle(boxUserMeta);
  state.boxUserMetaVisible = null;
}) : null;

/* ----- Menu ----- */
// Toggle
var menu = document.getElementsByClassName('menu');
var menuBackground = document.getElementsByClassName('menuBackground');
var burgerIcon = document.getElementById('burger');
var htmlTag = document.getElementsByTagName('html')[0];

var toggleMenu = function toggleMenu() {
  menu[0].classList.toggle('menu-hidden');
  menuBackground[0].classList.toggle('menuBackground-hidden');
  burgerIcon.classList.toggle('burger-active');
  if (htmlTag.className === 'overflow-hidden') {
    // Check if <html> has already 'overflow-hidden' applied (meaning the menu is visible)
    setTimeout(function () {
      // If so then wait for the closing animation of the menu, so that ugly scrollbars don't appear and makes content jump
      htmlTag.classList.toggle('overflow-hidden');
    }, 600); // Menu animation duration
  } else {
    // Else just apply immediately, so that content doesn't jump on opening animation
    htmlTag.classList.toggle('overflow-hidden');
  }
};

burgerIcon ? burgerIcon.addEventListener('click', toggleMenu) : null;

// Open/close lists
var menuItemKurser = document.getElementById('menuItem-kurser');
var menuListKurser = document.getElementById('menuList-kurser');
var menuItemKategoriB = document.getElementById('menuItem-kategoriB');
var menuListKategoriB = document.getElementById('menuList-kategoriB');
var menuItemLektion1Og2 = document.getElementById('menuItem-lektion1Og2');
var menuListLektion1Og2 = document.getElementById('menuList-lektion1Og2');
var menuItemDiverse = document.getElementById('menuItem-diverse');
var menuListDiverse = document.getElementById('menuList-diverse');

var toggleList = function toggleList(list) {
  list.classList.toggle('level-closed');
};

menuItemKurser ? menuItemKurser.addEventListener('click', function () {
  toggleList(menuListKurser);
}) : null;
menuItemKategoriB ? menuItemKategoriB.addEventListener('click', function () {
  toggleList(menuListKategoriB);
}) : null;
menuItemLektion1Og2 ? menuItemLektion1Og2.addEventListener('click', function () {
  toggleList(menuListLektion1Og2);
}) : null;
menuItemDiverse ? menuItemDiverse.addEventListener('click', function () {
  toggleList(menuListDiverse);
}) : null;

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
var controlBarBtnLeftRight = document.getElementById('controlBarBtnLeftRight');
var leftRightMarkers = document.getElementById('leftRightMarkers');

controlBarBtnLeftRight ? controlBarBtnLeftRight.addEventListener('click', function () {
  leftRightMarkers.classList.toggle('display-none');
}) : null;

// ########## TEST-01 ##########

/* ----- Dialogs ----- */
// Answers
var btnShowAnswers = document.getElementById('btnShowAnswers');
var dialogAnswers = document.getElementById('dialogAnswers');
var dialogAnswersClose = document.getElementById('dialogAnswersClose');

btnShowAnswers ? btnShowAnswers.addEventListener('click', function () {
  toggle(dialogAnswers, 'dialog-hidden');
}) : null;
dialogAnswersClose ? dialogAnswersClose.addEventListener('click', function () {
  toggle(dialogAnswers, 'dialog-hidden');
}) : null;

/* ----- Answers pagination ----- */
var answersBlock1 = document.getElementById('answersBlock-01');
var answersBlock2 = document.getElementById('answersBlock-02');
var btnAnswersNext = document.getElementById('btnAnswersNext');
var btnAnswersPrevious = document.getElementById('btnAnswersPrevious');

var nextAnswersBlock = function nextAnswersBlock() {
  answersBlock1.classList.add('display-none');
  answersBlock2.classList.remove('display-none');
};

var previousAnswersBlock = function previousAnswersBlock() {
  answersBlock1.classList.remove('display-none');
  answersBlock2.classList.add('display-none');
};

btnAnswersNext ? btnAnswersNext.addEventListener('click', nextAnswersBlock) : null;
btnAnswersPrevious ? btnAnswersPrevious.addEventListener('click', previousAnswersBlock) : null;

// ########## TEST-01-UNDERVISER ##########

/* ----- Dialogs ----- */
// ----- Bug report
var btnShowBugReport = document.getElementById('btnShowBugReport');
var dialogBugReport = document.getElementById('dialogBugReport');
var dialogBugReportClose = document.getElementById('dialogBugReportClose');
var btnSendBugReport = document.getElementById('btnSendBugReport');
var btnCancelBugReport = document.getElementById('btnCancelBugReport');

btnShowBugReport ? btnShowBugReport.addEventListener('click', function () {
  toggle(dialogBugReport, 'dialog-hidden');
}) : null;
dialogBugReportClose ? dialogBugReportClose.addEventListener('click', function () {
  toggle(dialogBugReport, 'dialog-hidden');
}) : null;
btnCancelBugReport ? btnCancelBugReport.addEventListener('click', function () {
  toggle(dialogBugReport, 'dialog-hidden');
}) : null;

btnSendBugReport ? btnSendBugReport.addEventListener('click', function () {
  toggleClassTemporarily(messageSuccess, 'message-showing', 5000, null, messageElements);
  toggle(dialogBugReport, 'dialog-hidden');
}) : null;

},{}]},{},[1]);

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global content */

"use strict";

const {classes: Cc, interfaces: Ci, utils: Cu, results: Cr} = Components;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");

XPCOMUtils.defineLazyModuleGetter(this, "FormAutofillHeuristics",
                          "resource://formautofill/FormAutofillHeuristics.jsm");

const formFillController = Cc["@mozilla.org/satchel/form-fill-controller;1"]
                             .getService(Ci.nsIFormFillController);

let isContentLoaded = false;

function determineAutofillField(element) {
  let info = FormAutofillHeuristics.getInfo(element);
  if (!info) {
    return;
  }

  formFillController.markAsAutofillField(element);
}

addEventListener("DOMContentLoaded", (evt) => {
  if (!evt.isTrusted) {
    return;
  }
  Array.from(content.document.getElementsByTagName("input"))
    .forEach(determineAutofillField);
  isContentLoaded = true;
});

addEventListener("DOMInputAdded", (evt) => {
  if (!evt.isTrusted || !isContentLoaded) {
    return;
  }
  determineAutofillField(evt.target);
});

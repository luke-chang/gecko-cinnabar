/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const {classes: Cc, interfaces: Ci, utils: Cu, results: Cr} = Components;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");

XPCOMUtils.defineLazyModuleGetter(this, "FormAutofillHandler",
                            "resource://formautofill/FormAutofillHandler.jsm");

const formFillController = Cc["@mozilla.org/satchel/form-fill-controller;1"]
                           .getService(Ci.nsIFormFillController);

const VALID_FIELDS = [
  "organization",
  "street-address",
  "address-level2",
  "address-level1",
  "postal-code",
  "country",
  "tel",
  "email",
];

function markAutofillField(element) {
  let info = element.getAutocompleteInfo();
  if (!info || !info.fieldName || !VALID_FIELDS.includes(info.fieldName)) {
    return;
  }

  formFillController.markAsAutofillField(element);
}

addEventListener("DOMContentLoaded", () => {
  Array.from(content.document.getElementsByTagName("input"))
    .forEach(markAutofillField);
});

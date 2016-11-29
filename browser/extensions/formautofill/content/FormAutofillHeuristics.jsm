/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* exported FormAutofillHeuristics */

"use strict";

const {classes: Cc, interfaces: Ci, utils: Cu, results: Cr} = Components;

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

let FormAutofillHeuristics = {
  getInfo: function(element) {
    if (!(element instanceof Ci.nsIDOMHTMLInputElement)) {
      return null;
    }

    let info = element.getAutocompleteInfo();
    if (!info || !info.fieldName || !VALID_FIELDS.includes(info.fieldName)) {
      return null;
    }

    return info;
  },
};

this.EXPORTED_SYMBOLS = ["FormAutofillHeuristics"];

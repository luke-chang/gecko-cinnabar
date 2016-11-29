/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

/* exported startup, shutdown, install, uninstall */

const {classes: Cc, interfaces: Ci, results: Cr, utils: Cu} = Components;

Cu.import("resource://gre/modules/Services.jsm");

function startup() {
  let enabled = Services.prefs.getBoolPref("dom.forms.autocomplete.experimental");
  if (!enabled) {
    return;
  }
  Services.mm.loadFrameScript("resource://formautofill/FormAutofillContent.js", true);
}

function shutdown() {

}

function install() {

}

function uninstall() {

}

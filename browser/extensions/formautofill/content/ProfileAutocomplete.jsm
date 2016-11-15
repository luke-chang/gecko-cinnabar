/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

this.EXPORTED_SYMBOLS = ["ProfileAutocomplete"];

const {classes: Cc, interfaces: Ci, manager: Cm, results: Cr, utils: Cu} = Components;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");

let {FormAutoCompleteResult} = Cu.import("resource://gre/modules/nsFormAutoCompleteResult.jsm", {});

// Register/unregister a constructor as a factory.
function AutocompleteFactory() {}
AutocompleteFactory.prototype = {
  register(targetConstructor) {
    let proto = targetConstructor.prototype;
    this._classID = proto.classID;

    let factory = XPCOMUtils._getFactory(targetConstructor);
    this._factory = factory;

    let registrar = Cm.QueryInterface(Ci.nsIComponentRegistrar);
    registrar.registerFactory(proto.classID, proto.classDescription,
                              proto.contractID, factory);

    if (proto.classID2) {
      this._classID2 = proto.classID2;
      registrar.registerFactory(proto.classID2, proto.classDescription,
                                proto.contractID2, factory);
    }
  },

  unregister() {
    let registrar = Cm.QueryInterface(Ci.nsIComponentRegistrar);
    registrar.unregisterFactory(this._classID, this._factory);
    if (this._classID2) {
      registrar.unregisterFactory(this._classID2, this._factory);
    }
    this._factory = null;
  },
};


/**
 * @constructor
 *
 * @implements {nsIAutoCompleteSearch}
 */
function AutofillProfileAutoCompleteSearch() {

}
AutofillProfileAutoCompleteSearch.prototype = {
  classID: Components.ID("4f9f1e4c-7f2c-439e-9c9e-566b68bc187d"),
  contractID: "@mozilla.org/autocomplete/search;1?name=autofill-profiles",
  classDescription: "AutofillProfileAutoCompleteSearch",
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIAutoCompleteSearch]),

  // Begin nsIAutoCompleteSearch implementation

  /**
   * Searches for a given string and notifies a listener (either synchronously
   * or asynchronously) of the result
   *
   * @param {string} searchString the string to search for
   * @param searchParam
   * @param previousResult a previous result to use for faster searchinig
   * @param listener the listener to notify when the search is complete
   */
  startSearch(searchString, searchParam, previousResult, listener) {
    // TODO: These mock data should be replaced by form autofill API
    let labels = ["Mary", "John"];
    let values = ["Mary S.", "John S."];
    let comments = ["123 Sesame Street.", "331 E. Evelyn Avenue"];
    let result = new FormAutoCompleteResult(searchString,
                                            Ci.nsIAutoCompleteResult.RESULT_SUCCESS,
                                            0, "", values, labels,
                                            comments);

    listener.onSearchResult(this, result);
  },

  /**
   * Stops an asynchronous search that is in progress
   */
  stopSearch() {
  },
};

this.NSGetFactory = XPCOMUtils.generateNSGetFactory([AutofillProfileAutoCompleteSearch]);

let ProfileAutocomplete = {
  _registered: false,
  _factory: null,

  ensureRegistered() {
    if (this._registered) {
      return;
    }

    this._factory = new AutocompleteFactory();
    this._factory.register(AutofillProfileAutoCompleteSearch);
    this._registered = true;
  },

  ensureUnregistered() {
    if (!this._registered) {
      return;
    }

    this._factory.unregister();
    this._factory = null;
    this._registered = false;
  },
};

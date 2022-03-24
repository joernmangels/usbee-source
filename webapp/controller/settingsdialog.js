sap.ui.define([
	"jquery.sap.global",
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/Device",
	"sap/m/MessageBox"

], function (jquery, UI5Object, JSONModel, MessageToast, Device, MessageBox) {
	"use strict";

	return UI5Object.extend("de.enercon.usbee.controller.settingsdialog", {

		constructor: function (oView) {
			//this._oView = oView;
		},

		open: function (_soView, gsettings, COMP) {
			var oView = _soView;

			// var title = oView.getModel("i18n").getResourceBundle().getText("pic-head") + " " + FILENAME;
			// var buttontext = oView.getModel("i18n").getResourceBundle().getText("foto-close");
			// var oViewModel = new JSONModel({
			// 	_url: URL,
			// 	_filename: FILENAME,
			// 	_mimetype: MIMETYPE,
			// 	_title: title,
			// 	_buttontext: buttontext
			// });
			//if (!this.oDialogFragment) {

			//var oModelSettings = this.getOwnerComponent().getSettings();
			oView.setModel(gsettings, "gsettings");

			var rapid_old = gsettings.getProperty("/_rapid");
			var picu_old = gsettings.getProperty("/_picu");
			var autoreload_old = gsettings.getProperty("/_autoreload");
			var autoreload_min_old = gsettings.getProperty("/_autoreload_min");
			var growingThreshold_old = gsettings.getProperty("/_growingThreshold");
			var piclist_old = gsettings.getProperty("/_piclist");
			var filterzr_old = gsettings.getProperty("/_filterzr");

			var oModelSettingsOld = new JSONModel({
				_rapid_old: rapid_old,
				_picu_old: picu_old,
				_autoreload_old: autoreload_old,
				_autoreload_min_old: autoreload_min_old,
				_growingThreshold_old: growingThreshold_old,
				_piclist_old: piclist_old,
				_filterzr_old: filterzr_old
			});
			oView.setModel(oModelSettingsOld, "gsettings_old");

			var oDialog;

			var oFragmentController = {
				handleClose: function (oEvent) {
					var gsettings = oView.getModel("gsettings");
					var gsettings_old = oView.getModel("gsettings_old");

					var rapid_old = gsettings_old.getProperty("/_rapid_old");
					var picu_old = gsettings_old.getProperty("/_picu_old");
					var autoreload_old = gsettings_old.getProperty("/_autoreload_old");
					var autoreload_min_old = gsettings_old.getProperty("/_autoreload_min_old");
					var growingThreshold_old = gsettings_old.getProperty("/_growingThreshold_old");
					var piclist_old = gsettings_old.getProperty("/_piclist_old");
					var filterzr_old = gsettings_old.getProperty("/_filterzr_old");

					gsettings.setProperty("/_rapid", rapid_old);
					gsettings.setProperty("/_picu", picu_old);
					gsettings.setProperty("/_autoreload", autoreload_old);
					gsettings.setProperty("/_autoreload_min", autoreload_min_old);
					gsettings.setProperty("/_growingThreshold", growingThreshold_old);
					gsettings.setProperty("/_piclist", piclist_old);
					gsettings.setProperty("/_filterzr", filterzr_old);

					oDialog.destroy();
				},
				handleConfirm: function (oEvent) {
					// var oModel = oEvent.getSource().getModel("gsettings");
					// var oFileUploader = this.byId("RAPID");

					// //var sg = oEvent.getSource().byId("RAPID");
					// var ct = oEvent.getSource().getCustomTabs();
					COMP.handleautoreload_new();

					COMP.save_settings(gsettings);

					oDialog.destroy();

				},
				onRapidChange: function (oEvent) {
					var oModel = oEvent.getSource().getModel("gsettings");
					var key = oEvent.getParameter('item').getKey();
					switch (key) {
					case "rapid_on":
						oModel.setProperty("/_rapid", true);
						break;
					case "rapid_off":
						oModel.setProperty("/_rapid", false);
						break;
					}
				},
				onPicuChange: function (oEvent) {
					var oModel = oEvent.getSource().getModel("gsettings");
					var key = oEvent.getParameter('item').getKey();
					switch (key) {
					case "picu_on":
						oModel.setProperty("/_picu", true);
						break;
					case "picu_off":
						oModel.setProperty("/_picu", false);
						break;
					}
				},
				onAutoreloadChange: function (oEvent) {
					var oModel = oEvent.getSource().getModel("gsettings");
					var key = oEvent.getParameter('item').getKey();
					switch (key) {
					case "autoreload_on":
						oModel.setProperty("/_autoreload", true);
						break;
					case "autoreload_off":
						oModel.setProperty("/_autoreload", false);
						break;
					}
				},
				onPicListChange: function (oEvent) {
					var oModel = oEvent.getSource().getModel("gsettings");
					var key = oEvent.getParameter('item').getKey();
					switch (key) {
					case "piclist_on":
						oModel.setProperty("/_piclist", true);
						break;
					case "piclist_off":
						oModel.setProperty("/_piclist", false);
						break;
					}
				},
				onFilterzrChange: function (oEvent) {
					var oModel = oEvent.getSource().getModel("gsettings");
					var key = oEvent.getParameter('item').getKey();
					switch (key) {
					case "zr_on":
						oModel.setProperty("/_filterzr", true);
						break;
					case "zr_off":
						oModel.setProperty("/_filterzr", false);
						break;
					}
				},
			};

			oDialog = sap.ui.xmlfragment(oView.getId(), "de.enercon.usbee.view.settingsdialog", oFragmentController);
			// var i18nModel = new sap.ui.model.resource.ResourceModel({
			// 		bundleUrl: "i18n/appTexts_fr.properties"
			// 	});
			// oDialog.setModel(i18nModel, "i18n");
			//oDialog.setModel(oViewModel, "img");

			// Damit steht auch i18n zur Verfügung
			oView.addDependent(oDialog);

			oDialog.open();
		}

	}); //end extend
}); //end
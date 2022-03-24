sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/Device",
	"sap/m/MessageBox"

], function (UI5Object, JSONModel, MessageToast, Device, MessageBox) {
	"use strict";

	return UI5Object.extend("de.enercon.usbee.controller.fotodialog", {

		constructor: function (oView) {
			this._oView = oView;

		},

		open: function (_soView, _scurrentdata, title) {

			var oView = this._oView;
			var oDialog = oView.byId("textDialog");

			var jModel  = new sap.ui.model.json.JSONModel();
			jModel.setData(_scurrentdata);
			
			var jModel2 = new JSONModel({
				_TITLE: title
			});


			// var bIsPhone = Device.system.phone;
			// var jModel2 = new sap.ui.model.json.JSONModel({
			// 	imageWidth: bIsPhone ? "5em" : "10em",
			// 	visible: false
			// });

			// create dialog lazily
			if (!oDialog) {
				var oFragmentController = {
					onCloseDialog: function (oEvent) {
						var title = oView.getModel("i18n").getResourceBundle().getText("text-titleMK");
						var message = oView.getModel("i18n").getResourceBundle().getText("foto-confirmclose");
						// var img = oView.byId("image1");
						// var src = img.getProperty("src");
						oDialog.close();
						oDialog.destroy();
					}

				};
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "de.enercon.usbee.view.textdialog", oFragmentController);

				//oDialog.setModel(oModel, "data");
				oDialog.setModel(jModel, "data");
				oDialog.setModel(jModel2, "data2");
				// connect dialog to the root view of this component (models, lifecycle)
				oView.addDependent(oDialog);
			} else {
				oDialog.setModel(jModel, "data");
				oDialog.setModel(jModel2, "data2");
			}
			oDialog.open();
		}

	}); //end extend
}); //end
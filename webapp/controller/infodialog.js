sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel"
], function (UI5Object, JSONModel) {
	"use strict";

	return UI5Object.extend("de.enercon.usbee.controller.infodialog", {

		constructor: function (oView) {
			this._oView = oView;
		},

		open: function (comp) {
			var oView = this._oView;
			var oDialog = oView.byId("infoDialog");
			//var oImage = oView.byId("img1");

			var imagepath;
			var path = jQuery.sap.getModulePath("de.enercon.usbee");
			switch (path) {
			case ".":
				imagepath = "./image/en_logo.png";
				break;
			default:
				imagepath = path + "/image/en_logo.png";
				break;
			}
			var oModel = new sap.ui.model.json.JSONModel({
				_IPATH: imagepath
			});
			
			var oModel2 = comp.getModel("GLOBAL");
			var oModel3 = comp.getModel("GSETTINGS");

			// create dialog lazily
			if (!oDialog) {
				var oFragmentController = {
					onCloseDialog: function () {
						oDialog.close();
					}
				};
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "de.enercon.usbee.view.infodialog", oFragmentController);
				// connect dialog to the root view of this component (models, lifecycle)
				oView.addDependent(oDialog);
			}
			oDialog.setModel(oModel, "global_logo");
			oDialog.setModel(oModel2, "glo");
			oDialog.setModel(oModel3, "GLOSET");
			oDialog.open();

			setTimeout(function () {
				//oView.byId("img1").focus();
				oView.byId("ScrollContainer").scrollTo(0, 0);
			}, 500);

			//var oItemDomRef = oImage.getDomRef();
			//oItemDomRef.focus();
			//oDialog.scrollTo(0,0); 
			//window.scrollTo(0,0);
		}
	});

});
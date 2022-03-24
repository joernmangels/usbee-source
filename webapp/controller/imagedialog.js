sap.ui.define([
	"jquery.sap.global",
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/Device",
	"sap/m/MessageBox"

], function (jquery, UI5Object, JSONModel, MessageToast, Device, MessageBox) {
	"use strict";

	return UI5Object.extend("de.enercon.usbee.controller.imagedialog", {

		constructor: function (oView) {
			//this._oView = oView;
		},

		open: function (_soView, URL, FILENAME, MIMETYPE) {
			var oView = _soView;
			

			var title = oView.getModel("i18n").getResourceBundle().getText("pic-head") + " " + FILENAME;
			var buttontext = oView.getModel("i18n").getResourceBundle().getText("foto-close");
			var oViewModel = new JSONModel({
				_url: URL,
				_filename: FILENAME,
				_mimetype: MIMETYPE,
				_title: title,
				_buttontext: buttontext
			});

			var oScreenContainer = {
				screenSizes: [
					"200px",
					// "300px",
					// "400px",
					// "500px",
					"600px",
					// "700px",
					// "800px",
					// "900px",
					"1000px",
					"1400px",
					"1800px"
				]
			};
			var oScreenSizesModel = new JSONModel(oScreenContainer);

			var oScreenContainer2 = {
				screenSizes: [
					"20%",
					"40%",
					"60%",
					"80%",
					"100%",
					"120%",
					"140%",
					"160%",
					"180%",
					"200%"
				]
			};
			var oScreenSizesModel2 = new JSONModel(oScreenContainer2);

			var oDialog;

			var oFragmentController = {
				handleClose: function (oEvent) {
					oDialog.destroy();
				},
				onSliderMoved: function (oEvent) {
					
					var odialog = oEvent.getSource().getParent().getParent();
					var oview = odialog.getParent();
					var oImage = oview.byId("imageD");
					var oText = oview.byId("textD");
					
					//var screenSizesJSON = odialog.getModel("ScreenSizesModel").getData();
					var screenSizesJSON2 = odialog.getModel("ScreenSizesModel2").getData();
					
					var iValue = oEvent.getParameter("value");
					// var screenWidth = screenSizesJSON.screenSizes[Number(iValue) - 1];
					//odialog.setContentWidth(screenWidth);
                    

					//var origingalHeight = 650;
					//var origingalHeight = 400;
					//var screenHeight = origingalHeight * parseFloat(screenWidth) / 1000;
					// odialog.setContentHeight(screenHeight + 'px');
					
					var screenWidth = screenSizesJSON2.screenSizes[Number(iValue) - 1];
					oImage.setWidth(screenWidth);
					//oImage.setHeight(screenHeight + 'px');
					
					oText.setText(screenWidth);
				}
			};

			oDialog = sap.ui.xmlfragment(oView.getId(), "de.enercon.usbee.view.imagedialog", oFragmentController);
			_soView.addDependent(oDialog);
			oDialog.setModel(oViewModel, "img");
			oDialog.setModel(oScreenSizesModel, "ScreenSizesModel");
			oDialog.setModel(oScreenSizesModel2, "ScreenSizesModel2");
			oDialog.open();
		}

	}); //end extend
}); //end
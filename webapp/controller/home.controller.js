sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"sap/ui/core/Fragment",
	"de/enercon/usbee/controller/utils/Formatter"

], function (Controller, MessageToast, JSONModel, Device, Fragment, Formatter) {
	"use strict";
	return Controller.extend("de.enercon.usbee.controller.home", {

		// handleFullscreen: function(oEvent) {
		// 	var oButton = oEvent.getSource();
		// 	if (!this._actionSheet) {
		// 		this._actionSheet = sap.ui.xmlfragment(
		// 			"de.enercon.view.Fullscreen",
		// 			this
		// 		);
		// 		this.getView().addDependent(this._actionSheet);
		// 	}
		// 	this._actionSheet.openBy(oButton);
		// },
		handleSettings: function (evt) {
			this.getOwnerComponent().openSettingsDialog(this.getView());
		},
		handleReload: function (evt) {
			var oView = this.getView();
			this.getOwnerComponent().handleReload(evt, oView);
		},
		onOpenDialog: function () {
			this.getOwnerComponent().openInfoDialog();
		},
		handleFullscreen1: function (evt) {
			this.getOwnerComponent().handleFullscreen(evt);
			// 	var oCore = sap.ui.getCore();
			// 	if (!this._oShell) {
			// 	//	this._oShell = sap.ui.getCore().byId("Shell1");
			// 	    this._oShell = oCore.byId("Shell1");
			// 	}
			// 	if (!this._oSplit) {
			// 		this._oSplit = oCore.byId("Split1");
			// 	}
			// 	if (evt.getSource().getPressed()) {
			// 		//MessageToast.show(evt.getSource().getId() + " Pressed");
			// 		this._oShell.setAppWidthLimited(false);
			// 		this._getSplitApp().setMode('HideMode');
			// 	} else {
			// 		//MessageToast.show(evt.getSource().getId() + " Unpressed");
			// 		this._oShell.setAppWidthLimited(true);
			// 		this._getSplitApp().setMode('ShowHideMode');				
			// 	}
		},
		onInit: function () {

			var oModel = this.getOwnerComponent().getModel("GLOBAL");
			//var route = oModel.getProperty("/_route");
			this.getView().setModel(oModel, "glo");

			var oModelSettings = this.getOwnerComponent().getSettings();
			this.getView().setModel(oModelSettings, "GLOSET");

			//UserAccessLog schreiben, falls gewünscht pro User (QM039)
			// var that = this;
			// var oModel1 = this.getOwnerComponent().getModel("pl");
			// oModel1.attachBatchRequestCompleted(function () {
			// 	if (oModelSettings.getProperty("/_settings_read") && oModelSettings.getProperty("/_Log_Active")) {
			// 		//console.log(oModelSettings.getProperty("/_settings_read"));
			// 		//console.log(oModelSettings.getProperty("/_Log_Active"));
			// 		that.getOwnerComponent()._create_user_access_log(oModel, oModelSettings);
			// 	}
			// });

			var that = this;
			var oModel1 = this.getOwnerComponent().getModel("pl");
			
			
			
			// Jeder Einstieg wird geloggt sofern in  Userettings gewünscht
			// unabhängig von der Kachel
			
			// oModel1.attachBatchRequestCompleted(function () {
			// 	if (oModelSettings.getProperty("/_settings_read")) {
			// 		if (!oModelSettings.getProperty("/_Log_Deactive")) {

			// 			if (!oModelSettings.getProperty("/_Log_Done")) {
			// 				oModelSettings.setProperty("/_Log_Done", true);
			// 				that.getOwnerComponent()._create_user_access_log(oModel, oModelSettings);
			// 			}

			// 		}
			// 	}
			// });




			oModel1.attachRequestSent(function () {
				that.getView().setBusy(true);
				//sap.ui.core.BusyIndicator.show();
				// var myBI = new sap.ui.core.BusyIndicator();
				// myBI.show();
			});
			oModel1.attachRequestCompleted(function () {
				that.getView().setBusy(false);
				//sap.ui.core.BusyIndicator.hide();
			});

			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("appHome").attachMatched(this._onRouteMatched, this);

			// //TODO IN COMPONENT EINARBEITEN ->onRefreshTriggered_new
			// var interval = 1200;
			// var timer = setInterval(this.startCountDown(), interval);

			// var oHtml = this.getView().byId("idFrame");
			// oHtml.setContent("<iframe src='https://www.trainning.com.br/download/sap4_basic.pdf' height='700' width='1300'></iframe>");

			// var bIsPhone = Device.system.phone;
			// this.getView().setModel(new JSONModel({
			// 	imageWidth: bIsPhone ? "3em" : "8em"
			// }));

			// set explored app's demo model on this sample
			// var oImgModel = new JSONModel(jQuery.sap.getModulePath("de.varelmann.model", "/img.json"));
			// this.getView().setModel(oImgModel, "img");
		},
		handleImage3Press: function (evt) {
			//MessageToast.show("The ImageContent is pressed.");
			this.getOwnerComponent().openInfoDialog();
		},
		handleDokuPress: function (evt) {
			this.getOwnerComponent().openDokuDialog(this.getView());
		},
		startCountDown: function () {
			var oProgressIndicator = this.getView().byId("pgt");

			var totalTime = 120000; //2 minutes
			var percent = oProgressIndicator.getPercentValue();
			var newPercent = percent - 1;
			var timePassed = (totalTime * newPercent) / 100;
			var milliseconds = (timePassed % 1000);
			timePassed = Math.floor(timePassed / 1000);
			var seconds = (timePassed % 60);
			timePassed = Math.floor(timePassed / 60);
			var minutes = (timePassed % 60);
			timePassed = Math.floor(timePassed / 60);

			if (minutes.toString().length == 1) {
				minutes = "0" + minutes;
			}

			if (seconds.toString().length == 1) {
				seconds = "0" + seconds;
			}

			if (newPercent >= 0) {
				oProgressIndicator.setPercentValue(newPercent);
				//Change bar color to negative in last 30 seconds
				if (newPercent <= 25) {
					oProgressIndicator.setBarColor(sap.ui.core.BarColor.NEGATIVE);
				}
				//Change bar color to critical in last 1 minute
				else if (newPercent <= 50) {
					oProgressIndicator.setBarColor(sap.ui.core.BarColor.CRITICAL);
				}
				//Update current time left
				//oLabelTimeLeft.setText(minutes + ":" + seconds);
			} else {
				//Stop timer after 2 minutes
				//clearInterval(timer);
			}
		},
		_onRouteMatched: function (oEvent) {
			var oModelSettings = this.getOwnerComponent().getSettings();
			// Jeder Einstieg über eine Kachel wird geloggt sofern in 
			// Userettings gewünscht
			if (oModelSettings.getProperty("/_settings_read")) {
				if (!oModelSettings.getProperty("/_Log_Deactive")) {
					oModelSettings.setProperty("/_Log_Done", false);
				}
			}

		}
	});
});
sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast',
	'de/enercon/usbee/controller/utils/Formatter'

], function (jQuery, Controller, JSONModel, MessageToast, Formatter) {
	"use strict";

	var PageController = Controller.extend("de.enercon.usbee.controller.home_tilemenu", {

		onInit: function (evt) {

			var oModel = this.getOwnerComponent().getModel("GLOBAL");
			this.getView().setModel(oModel, "glo");

			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("appHome").attachMatched(this._onRouteMatchedHome, this);

			//var oModel1 = this.getView().getModel("pl");

			// var oModel1 = this.getOwnerComponent().getModel("pl");
			// //var oView = this.getView();
			// var that = this;
			// oModel1.attachRequestSent(function () {
			// 	that.getView().setBusy(true);
			// 	//sap.ui.core.BusyIndicator.show();
			// 	// var myBI = new sap.ui.core.BusyIndicator();
			// 	// myBI.show();
			// });
			// oModel1.attachRequestCompleted(function () {
			// 	that.getView().setBusy(false);
			// 	//sap.ui.core.BusyIndicator.hide();
			// });

			// oModel1.attachBatchRequestCompleted(function () {
			// 	that.getView().setBusy(false);
			// 	//sap.ui.core.BusyIndicator.hide();
			// });

			// set mock model
			// var sPath = jQuery.sap.getModulePath("de.varelmann.model", "/TileMenu.json");
			// var oModel = new JSONModel(sPath);
			// this.getView().setModel(oModel);
			// var modelUrl = "/TileMenuSet/$count";
			// oModel1.read(modelUrl, {
			// 	success: function (oData) {
			// 	var num = oData.results.length;
			// 	}
			// });
		},
		_onRouteMatchedHome: function (oEvent) {
			// var oTileContainer = this.getView().byId("container");
			// var newValue = !oTileContainer.getBusy();
			// oTileContainer.setBusy(newValue);
			// var ct = this.getView().byId("container");
			// var a = new sap.m.BusyDialog();
			// a.open();
			// a.setBusyIndicatorDelay(40000);
			// //write your odata code 
			// //after getting the values you have close the dialog
			// a.close();
			// var oArgs, oView;
			// oArgs = oEvent.getParameter("arguments");
			// oView = this.getView();
			// oView.setBusy(true);

			//var url = "pl>/PruefloseSet('" + oArgs.orderId + "')/TOVORG";

			// var nav = "Prueflos='" + oArgs.pl + "'," + "Prueflos_Key_Modus='" + oArgs.pl_key_modus + "'," + "Prueflos_Key_Object='" + oArgs.pl_key_object +
			// 	"'";

			// oView.bindElement({
			// 	//https:../PruefloseSet(Prueflos='2914',Prueflos_Key_Modus='S1',Prueflos_Key_Object='JM_2')?$format=json
			// 	path: "pl>/PruefloseSet(" + nav + ")",
			// 	//path: "pl>/PruefloseSet('" + oArgs.pl + oArgs.pl_key_modus + oArgs.pl_key_object + "')",
			// 	// /sap/opu/odata/WIND/QM_RESULTS_SRV/PrueflosVorgaengeSet?$filter=Prueflos eq '553'
			// 	//path: "pl>/PrueflosVorgaengeSet?$filter=Prueflos eq '" + oArgs.orderId + "'",
			// 	events: {
			// 		change: this._onBindingChange.bind(this),
			// 		dataRequested: function (oEvent) {
			// 			oView.setBusy(true);
			// 		},
			// 		dataReceived: function (oEvent) {
			// 			oView.setBusy(false);
			// 		}
			// 	}
			// });

		},
		// 	press: function(evt) {
		// 		// Navigation bei Klick auf Menü-Tile
		// 		var oContext = evt.getSource().getBindingContext("menu");
		// 		var oModel = evt.getSource().getModel("menu");
		// 		var target = oModel.getProperty(oContext.getPath()).target;

		// 		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		// 		oRouter.navTo(target);
		// 	}

		// });
		// Funktioniert nicht
		// onAfterRendering: function () {
		// 	var oModel1 = this.getView().getModel("pl");
		// 	var array = oModel1.oData;
		// 	if (array && array.length) {
		// 		sap.m.MessageToast.show("JA");
		// 	} else {
		// 		sap.m.MessageToast.show("NEIN");
		// 	}

		// },
		onTilePress: function (oEvent) {

			// Navigation bei Klick auf Menü-Tile
			// var oContext = oEvent.getSource().getBindingContext("menu");
			// var oModel = oEvent.getSource().getModel("menu");
			// var target = oModel.getProperty(oContext.getPath()).target;

			var oContext = oEvent.getSource().getBindingContext("pl");
			var oModel = oEvent.getSource().getModel("pl");
			var target = oModel.getProperty(oContext.getPath()).Target;

			// var Number = oModel.getProperty(oContext.getPath()).Number;
			// if (parseInt(Number) > 100) {
			// 	oModel.setSizeLimit(parseInt(Number));
			// }


			// Jeder Einstieg über eine Kachel wird geloggt sofern in 
			// Userettings gewünscht
			if (typeof target != "undefined") {

				var oModelG = this.getOwnerComponent().getModel("GLOBAL");
				var oModelSettings = this.getOwnerComponent().getSettings();

				if (oModelSettings.getProperty("/_settings_read")) {
					if (!oModelSettings.getProperty("/_Log_Deactive")) {

						if (!oModelSettings.getProperty("/_Log_Done")) {
							oModelSettings.setProperty("/_Log_Done", true);
							this.getOwnerComponent()._create_user_access_log(target, oModelG, oModelSettings);
						}

					}
				}

				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo(target);
			}

			var oItem, oCtx;
			oItem = oEvent.getSource();
			oCtx = oItem.getProperty("title");

			// if (oCtx == "Wareneingang zur Bestellung buchen") {
			// 	//MessageToast.show(oCtx);
			// 	// 	this.getRouter().navTo("employee",{
			// 	// 	employeeId : oCtx.getProperty("EmployeeID")
			// 	// });
			// 	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// 	oRouter.navTo("MasterDetail");
			// }
			if (oCtx == "Einstellungen") {
				MessageToast.show(oCtx);
			}
		}

	});
	return PageController;

});
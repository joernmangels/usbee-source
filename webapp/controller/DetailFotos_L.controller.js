sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/core/routing/History",
	"de/enercon/usbee/controller/FotoFunctions"

], function (Controller, JSONModel, MessageBox, MessageToast, History, FotoFunctions) {
	"use strict";

	return Controller.extend("de.enercon.usbee.controller.DetailFotos_L", {

		onInit: function () {

			var oModelSettings = this.getOwnerComponent().getSettings();
			this.getView().setModel(oModelSettings, "gsettings");

			var oModel = this.getOwnerComponent().getModel("GLOBAL");
			this.getView().setModel(oModel, "glo");

			var oRouter = this.getOwnerComponent().getRouter();

			//LightBox View
			oRouter.getRoute("Merkmal_Fotos_L").attachMatched(this._onRouteMatched_L, this);
			oRouter.getRoute("Merkmal_Fotos_list_L").attachMatched(this._onRouteMatched_L, this);
			FotoFunctions.onInitLightBox(this);

		},
		onNavBack: function (oEvent) {
			FotoFunctions.onNavBack(oEvent, this);
		},
		_onRouteMatched_L: function (oEvent) {
			FotoFunctions.onRouteMatched_L(oEvent, this);
		},
		_onBindingChange: function (oEvent) {
			// No data for the binding
			// if (!this.getView().getBindingContext()) {
			// TODO: Display not found detail
			// this.getOwnerComponent().getRouter().getTargets().display("notFound");
		},
		onFotoPress: function (oEvent) {
			FotoFunctions.onFotoPress('L', oEvent, this);
		},
		onFotoDelete: function (oEvent) {
			FotoFunctions.onFotoDelete_L(oEvent, this);
		},
		handleUplChange: function (oEvent) {
			FotoFunctions.handleUplChange(oEvent, this);
		},
		handleUplComplete: function (oEvent) {
			FotoFunctions.handleUplComplete('L', oEvent, this);
		},
		onTableItemPressed: function (oEvent) {
				FotoFunctions.showPicture(oEvent, this);
			}
			// End
	});
});
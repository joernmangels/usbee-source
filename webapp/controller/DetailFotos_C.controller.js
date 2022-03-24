sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/core/routing/History",
	"de/enercon/usbee/controller/FotoFunctions"

], function (Controller, JSONModel, MessageBox, MessageToast, History, FotoFunctions) {
	"use strict";

	return Controller.extend("de.enercon.usbee.controller.DetailFotos_C", {

		onInit: function () {
			
			var oModelSettings = this.getOwnerComponent().getSettings();
			this.getView().setModel(oModelSettings, "gsettings");
			
			var oModel = this.getOwnerComponent().getModel("GLOBAL");
			this.getView().setModel(oModel, "glo");
			
			var oRouter = this.getOwnerComponent().getRouter();
			//Carousell View
			oRouter.getRoute("Merkmal_Fotos_C").attachMatched(this._onRouteMatched_C, this);
			oRouter.getRoute("Merkmal_Fotos_list_C").attachMatched(this._onRouteMatched_C, this);
			FotoFunctions.onInitCaroussel(this);

			//LightBox View
			// oRouter.getRoute("Merkmal_Fotos").attachMatched(this._onRouteMatched_LB, this);
			// FotoFunctions.onInitLightBox(this);

		},
		onNavBack: function (oEvent) {
			FotoFunctions.onNavBack(oEvent, this);
		},
		_onRouteMatched_LB: function (oEvent) {
			FotoFunctions.onRouteMatched_LB(oEvent, this);
		},		
		_onRouteMatched_C: function (oEvent) {
			FotoFunctions.onRouteMatched_C(oEvent, this);
		},
		// onBeforeRendering: function () {
		// 	this._setImagesInCarousel();
		// },
		_onBindingChange: function (oEvent) {
			// No data for the binding
			// if (!this.getView().getBindingContext()) {
			// TODO: Display not found detail
			// this.getOwnerComponent().getRouter().getTargets().display("notFound");
		},
		// _setImagesInCarousel: function (para) {
		// 	FotoFunctions.setImagesInCarousel(para, this);
		// },
		onSliderMoved: function (oEvent) {
			FotoFunctions.onSliderMoved(oEvent, this);
		},
		onFotoPress: function (oEvent) {
			FotoFunctions.onFotoPress('C', oEvent, this);
		},
		onFotoDelete: function (oEvent) {
			FotoFunctions.onFotoDelete_C(oEvent, this);
		},
		handleUplChange: function (oEvent) {
			FotoFunctions.handleUplChange(oEvent, this);
		},
		handleUplComplete: function (oEvent) {
			FotoFunctions.handleUplComplete('C', oEvent, this);
		}
			// End
	});
});
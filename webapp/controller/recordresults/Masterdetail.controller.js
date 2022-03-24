sap.ui.define([
	"sap/ui/core/mvc/Controller"

], function (Controller) {
	"use strict";

	return Controller.extend("de.enercon.usbee.controller.recordresults.Masterdetail", {

		onInit: function (evt) {
			var oRouter = this.getOwnerComponent().getRouter();

			var oModel = this.getOwnerComponent().getModel("GLOBAL");
			this.getView().setModel(oModel, "glo");

			var oModelSettings = this.getOwnerComponent().getSettings();
			this.getView().setModel(oModelSettings, "GLOSET");
			
			// The attachMatched function gets called everytime you navigate between pages. 
			//You can explicitly call your onafterrendering and onbeforerendering there
			//oRouter.getRoute("appHome").attachMatched(this._onRouteMatched, this);

			// var that = this;
			// var oModel1 = this.getOwnerComponent().getModel("pl");
			// oModel1.attachBatchRequestCompleted(function () {
			// 	if (oModelSettings.getProperty("/_settings_read")) {
			// 		if (!oModelSettings.getProperty("/_Log_Deactive")) {

			// 			if (!oModelSettings.getProperty("/_Log_Done")) {
			// 				oModelSettings.setProperty("/_Log_Done", true);
			// 				that.getOwnerComponent()._create_user_access_log('M', oModel, oModelSettings);
			// 			}

			// 		}
			// 	}
			// });

		},
		_onRouteMatched: function (oEvent) {},
		onNavBack: function (oEvent) {
			// var oCore = sap.ui.getCore();
			// var oView1 = oCore.byId("Master");			
			// var oView = oEvent.getSource().getParent();
			// var oList = oView.byId("MasterList");
			// oList.getBinding("items").refresh(true);
			//var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			//oRouter.navTo("appHome", true);
			// var aTarget;
			// aTarget = ["home"];
			// this.getOwnerComponent().getRouter().getTargets().display(aTarget);
			this.getOwnerComponent().getRouter().navTo("appHome", {}, false);

		},
		handleHome: function (oEvent) {
			this.getOwnerComponent().jumphome();
		},
		handleImage3Press: function (evt) {
			//var oSplit = new sap.m.SplitContainer(this);
			// var oSplit = evt.getSource().get
			// getBindingContext("menu");
			// oSplit.hideMaster();

			//MessageToast.show("The ImageContent is pressed.");
			this.getOwnerComponent().openInfoDialog();
		},
		// handleRapidNav: function (evt) {
		// 	var oView = this.getView();
		// 	this.getOwnerComponent().handleRapidNav(evt, oView);
		// },
		handleAutoreload: function (evt) {
			var oView = this.getView();
			this.getOwnerComponent().handleautoreload(evt, oView);
		},
		handleReload: function (evt) {
			var oView = this.getView();
			this.getOwnerComponent().handleReload(evt, oView);
		},

		handleFullscreen2: function (evt) {
			//var oView = this.getView();
			//this.getOwnerComponent().handleFullscreen(evt, oView);
			this.getOwnerComponent().handleFullscreen(evt);
		},
		handleHideMaster2: function (evt) {
			var oView = this.getView();
			this.getOwnerComponent().handleHideMaster(evt, oView);
		},
		onAfterMasterNavigate: function (oEvent) {
			//var oListItem = oEvent.getParameter("listItem") || oEvent.getSource();
			//oEvent.getSource().hideMaster(); //Hide
			//oEvent.getSource().setMode(sap.m.SplitAppMode.ShowHideMode);
		},
		onAfterDetailNavigate: function (oEvent) {
			//oEvent.getSource().hideMaster(); //Hide
			//oEvent.getSource().setMode(sap.m.SplitAppMode.ShowHideMode);
		},
		onmasterNavigate: function (oEvent) {
			oEvent.getSource().hideMaster(); //Hide
			//oEvent.getSource().setMode(sap.m.SplitAppMode.ShowHideMode);
		},
		handleDokuPress: function (evt) {
			this.getOwnerComponent().openDokuDialog(this.getView());
		},
		handleSettings: function (evt) {
			this.getOwnerComponent().openSettingsDialog(this.getView());
		}
	});

});
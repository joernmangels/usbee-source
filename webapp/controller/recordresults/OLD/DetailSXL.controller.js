sap.ui.define([
	"sap/ui/core/mvc/Controller"

], function (Controller) {
	"use strict";

	return Controller.extend("de.enercon.usbee.controller.recordresults.DetailSXL", {

		onInit: function () {

			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("Merkmal_SX_Qual").attachMatched(this._onRouteMatched, this);

		},
		onNavBack: function (oEvent) {
			this.getOwnerComponent().viewNavBack(this);
		},
		_onRouteMatched: function (oEvent) {
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();

			var path1 = "pl>/PruefMerkmaleSet(Prueflos='" + oArgs.pl + "',Prueflos_Key_Modus='" + oArgs.pl_key_modus +
				"',Prueflos_Key_Object='" + oArgs.pl_key_object + "',Vornr='" + oArgs.vornr + "',Merknr='" + oArgs.merknr + "')";

			oView.bindElement({
				path: path1,

				parameters: {
					expand: "TOVORG,TOPLM,TORESU/TOBEWERTE"
				},
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function (oEvent) {
						oView.setBusy(true);
					},
					dataReceived: function (oEvent) {
						oView.setBusy(false);
					}
				}
			});

			// register for metadata loaded events
			//var oModel = this.getModel();
			//oModel.metadataLoaded().then(this._onMetadataLoaded.bind(this));

		},
		_onBindingChange: function (oEvent) {
			// No data for the binding
			// if (!this.getView().getBindingContext()) {
			// TODO: Display not found detail
			//this.getOwnerComponent().getRouter().getTargets().display("notFound");
		},
		onSave: function () {
			//var sernr = this.getView().byId("SernrInput").getValue();
			//if (sernr === "") {
			//	this.getView().byId("SernrInput").setValueState(sap.ui.core.ValueState.Error);
			//} else {
				this.getOwnerComponent().onSave(this);
			//}
		},
		onMessagePopoverPress: function (oEvent) {
			//this.getOwnerComponent().onMessagePopoverPress(oEvent, this);
			this._getMessagePopover().openBy(oEvent.getSource());
		},
		_getMessagePopover: function () {
			// create popover lazily (singleton)
			if (!this._oMessagePopover) {
				// create popover lazily (singleton)
				this._oMessagePopover = sap.ui.xmlfragment(this.getView().getId(),
					"de.enercon.usbee.view.recordresults.MessagePopover", this);
				this.getView().addDependent(this._oMessagePopover);
			}
			return this._oMessagePopover;
		},
		validate_sernr: function () {
			var sernr = this.getView().byId("SernrInput").getValue();
			if (sernr === "") {
				this.getView().byId("SernrInput").setValueState(sap.ui.core.ValueState.Error);
			}
			//var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
			//if (!mailregex.test(email)) {
			//	alert(email + " is not a valid email address");
			//	this.getView().byId("emailInput").setValueState(sap.ui.core.ValueState.Error);
			//}
		}

	});
});
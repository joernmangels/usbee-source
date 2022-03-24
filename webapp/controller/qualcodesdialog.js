sap.ui.define([
	"jquery.sap.global",
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/Device",
	"sap/m/MessageBox"

], function (jquery, UI5Object, JSONModel, MessageToast, Device, MessageBox) {
	"use strict";
//
	return UI5Object.extend("de.enercon.usbee.controller.qualcodesdialog", {

		constructor: function (oView) {},

		open: function (OVIEW, OMODEL, CURRENTDATA, PFAD) {

			//var oView = this._oView;
			var oView = OVIEW;
			var path1 = "pl>" + PFAD;
			var oDialog = oView.byId("qcDialog");

			var oFragmentController = {
				handleSearch: function (oEvent) {
					// var sValue = oEvent.getParameter("value");
					// var oFilter = new sap.ui.model.Filter("Filename", sap.ui.model.FilterOperator.Contains, sValue);
					// var oBinding = oEvent.getSource().getBinding("items");
					// oBinding.filter([oFilter]);

					var sValue = oEvent.getParameter("value");
					sValue = sValue.replace(new RegExp("_", "g"), "*");
					// var oFilter = new sap.ui.model.Filter("Filename", sap.ui.model.FilterOperator.Contains, sValue);
					// var oBinding = oEvent.getSource().getBinding("items");
					// oBinding.filter([oFilter]);

					if (sValue && sValue.length > 0) {
						//var oFilter1 = new sap.ui.model.Filter("Fhmar", sap.ui.model.FilterOperator.Contains, sValue);
						var oFilter1 = new sap.ui.model.Filter("Bewertung1", sap.ui.model.FilterOperator.Contains, sValue);
						var oFilter2 = new sap.ui.model.Filter("Langtext", sap.ui.model.FilterOperator.Contains, sValue);

						var oFilters = new sap.ui.model.Filter({
							filters: [
								oFilter1,
								oFilter2
							],
							and: false
						});
					}

					var oBinding = oEvent.getSource().getBinding("items");
					oBinding.filter(oFilters);
				},
				handleClose: function (oEvent) {
					oDialog.destroy();
				},
				handleConfirm: function (oEvent) {
					var oSelectedItem = oEvent.getParameter("selectedItem");
					//Daten setzen
					var path = oSelectedItem.getBindingContextPath();
					var cdata = OMODEL.getProperty(path);

					OMODEL.setProperty(PFAD + "/Bewertung", cdata.Key_Qual);
					OMODEL.setProperty(PFAD + "/Bewertung_Text", cdata.Bewertung1);
					oDialog.destroy();
				},
				handleValueHelpClose: function (oEvent) {
					var oSelectedItem = oEvent.getParameter("selectedItem"),
						oInput = this.byId("productInput");

					if (oSelectedItem) {
						this.byId("productInput").setValue(oSelectedItem.getTitle());
					}

					if (!oSelectedItem) {
						oInput.resetProperty("value");
					}
				}
			};

			oDialog = sap.ui.xmlfragment(oView.getId(), "de.enercon.usbee.view.qualcodesdialog", oFragmentController);
			oDialog.setMultiSelect(false);

			oDialog.bindElement({
				path: path1,
				// parameters: {
				// 	expand: "TOBEWERTE"
				// },
				events: {
					dataRequested: function (oEvent) {
						oDialog.setBusy(true);
					},
					dataReceived: function (oEvent) {
						oDialog.setBusy(false);
					}
				}
			});

			oView.addDependent(oDialog);
			oDialog.open();
		}

	}); //end extend
}); //end
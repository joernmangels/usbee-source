sap.ui.define([
	"jquery.sap.global",
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/Device",
	"sap/m/MessageBox"

], function (jquery, UI5Object, JSONModel, MessageToast, Device, MessageBox) {
	"use strict";

	return UI5Object.extend("de.enercon.usbee.controller.fhmdialog", {

		constructor: function (oView) {
			//this._oView = oView;
		},

		open: function (ART, PFAD, title, _soView, oModel, oModel_g, fnResolve, fnReject) {

			var oView = _soView;
			var oDialog = oView.byId("fhmDialog");
			//var that = this;
			//var path1 = PFAD + "/TOFHM_V";
			var path1 = "pl>" + PFAD;

			// if (!oDialog) {
			var oFragmentController = {
				handleSearch: function (oEvent) {
					var sValue = oEvent.getParameter("value");
					sValue = sValue.replace(new RegExp("_", "g"), "*");
					// var oFilter = new sap.ui.model.Filter("Filename", sap.ui.model.FilterOperator.Contains, sValue);
					// var oBinding = oEvent.getSource().getBinding("items");
					// oBinding.filter([oFilter]);

					if (sValue && sValue.length > 0) {
						//var oFilter1 = new sap.ui.model.Filter("Fhmar", sap.ui.model.FilterOperator.Contains, sValue);
						var oFilter1 = new sap.ui.model.Filter("Filename", sap.ui.model.FilterOperator.Contains, sValue);
						var oFilter2 = new sap.ui.model.Filter("Fhktx", sap.ui.model.FilterOperator.Contains, sValue);
						var oFilter3 = new sap.ui.model.Filter("Fhmnr", sap.ui.model.FilterOperator.Contains, sValue);

						var oFilters = new sap.ui.model.Filter({
							filters: [
								oFilter1,
								oFilter2,
								oFilter3
								//oFilter4
							],
							and: false
						});
					}

					var oBinding = oEvent.getSource().getBinding("items");
					oBinding.filter(oFilters);
				},
				handleClose: function (oEvent) {
					// oDialog.close();
					// if (oDialog._pdfViewer) {
					// 	oDialog._pdfViewer.destroy();
					// }
					oDialog.destroy();
				},
				handleConfirm: function (oEvent) {
					var aContexts = oEvent.getParameter("selectedContexts");
					var path = aContexts[0].sPath;
					var strs, picpfad, pdfSrc1, file, mime;

					oModel.read(path, {
						success: function (oData) {

							var fhmnodok = oView.getModel("i18n").getResourceBundle().getText("fhm-nodok");
							if (oData.Filename === "") {
								MessageToast.show(fhmnodok);
								oModel_g.setProperty("/_displayfile/url", "");
								oModel_g.setProperty("/_displayfile/file", "");
								oModel_g.setProperty("/_displayfile/mimetype", "");
								fnResolve("reject");
							} else {
								strs = oData.__metadata.media_src.split("/sap");
								picpfad = "/sap" + strs[1];
								pdfSrc1 = picpfad;
								file = oData.Filename;
								mime = oData.Mimetype;
								oModel_g.setProperty("/_displayfile/url", pdfSrc1);
								oModel_g.setProperty("/_displayfile/file", file);
								oModel_g.setProperty("/_displayfile/mimetype", mime);
								fnResolve("success");
							}
							oDialog.destroy();
						}

					});

					//var pdf = imagepath + "/Entwicklungsrichtlinien.pdf";
					// oDialog._pdfViewer.setSource(sSource);
					// var title = oView.getModel("i18n").getResourceBundle().getText("dokutitle");
					// oDialog._pdfViewer.setTitle(title);
					// oDialog._pdfViewer.open();
				},
				handleValueHelp: function () {
					var sInputValue = this.byId("productInput").getValue(),
						oModel = this.getView().getModel(),
						aProducts = oModel.getProperty("/ProductCollection");

					if (!this._oValueHelpDialog) {
						this._oValueHelpDialog = sap.ui.xmlfragment("sap.m.sample.SelectDialog.ValueHelp", this);
						this.getView().addDependent(this._oValueHelpDialog);
					}

					aProducts.forEach(function (oProduct) {
						oProduct.selected = (oProduct.Name === sInputValue);
					});
					oModel.setProperty("/ProductCollection", aProducts);

					this._oValueHelpDialog.open();
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
			
			switch (ART) {
			case "VG":
				oDialog = sap.ui.xmlfragment(oView.getId(), "de.enercon.usbee.view.fhmdialog_v", oFragmentController);
				break;
			case "MK":
				oDialog = sap.ui.xmlfragment(oView.getId(), "de.enercon.usbee.view.fhmdialog_m", oFragmentController);
				break;
			}

			oDialog.setMultiSelect(false);
			oDialog.setTitle(title);

			oDialog.bindElement({
				path: path1,

				// parameters: {
				// 	expand: "TOFHM_V"
				// },
				events: {
					//change: this._onBindingChange.bind(this),
					dataRequested: function (oEvent) {
						oDialog.setBusy(true);
					},
					dataReceived: function (oEvent) {
						oDialog.setBusy(false);
					}
				}
			});

			oView.addDependent(oDialog);

			// } else {
			// 	//oDialog.setModel(oModel);
			// 	// oDialog.setMultiSelect(false);
			// 	// oDialog.setTitle(title);
			// 	// oDialog.bindElement({
			// 	// 	path: path1,

			// 	// 	parameters: {
			// 	// 		expand: "TOFHM_V"
			// 	// 	},
			// 	// 	events: {
			// 	// 		//change: this._onBindingChange.bind(this),
			// 	// 		dataRequested: function (oEvent) {
			// 	// 			oDialog.setBusy(true);
			// 	// 		},
			// 	// 		dataReceived: function (oEvent) {
			// 	// 			oDialog.setBusy(false);
			// 	// 		}
			// 	// 	}
			// 	// });
			// }
			oDialog.open();
		}

	}); //end extend
}); //end
sap.ui.define([
	"jquery.sap.global",
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/Device",
	"sap/m/MessageBox",
	"sap/m/PDFViewer"

], function (jquery, UI5Object, JSONModel, MessageToast, Device, MessageBox, PDFViewer) {
	"use strict";

	return UI5Object.extend("de.enercon.usbee.controller.dokudialog", {

		constructor: function (oView) {
			// this._oView = oView;
			// this._pdfViewer = new PDFViewer();
			// oView.addDependent(this._pdfViewer);
		},

		open: function (_soView, oModel, oModel_g, fnResolve, fnReject) {
			//return new Promise(function (resolve, reject) {

			//var oView = this._oView;
			var oView = _soView;
			var that = this;
			// var pdfv = this._pdfViewer;
			var oDialog = oView.byId("dokuDialog");

			if (!oDialog) {
				var oFragmentController = {
					handleSearch: function (oEvent) {
						var sValue = oEvent.getParameter("value");
						var oFilter = new sap.ui.model.Filter("Filename", sap.ui.model.FilterOperator.Contains, sValue);
						var oBinding = oEvent.getSource().getBinding("items");
						oBinding.filter([oFilter]);
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
						// if (aContexts && aContexts.length) {
						// 	MessageToast.show("You have chosen " + aContexts.map(function (oContext) {
						// 		return oContext.getObject().Name;
						// 	}).join(", "));
						// } else {
						// 	MessageToast.show("No new item was selected.");
						// }
						//oEvent.getSource().getBinding("items").filter([]);
						//var sSource = oEvent.getSource().getModel().getData().Source;
						//var sSource = sap.ui.require.toUrl("sap/m/sample/PDFViewerPopup") + "/sample1.pdf";
						//var sSource = "test-resources/sap/m/demokit/sample/PDFViewerPopup/sample1.pdf";

						// TEST
						// var imagepath;
						// var path = jQuery.sap.getModulePath("de.enercon.usbee");
						// switch (path) {
						// case ".":
						// 	imagepath = "image";
						// 	break;
						// default:
						// 	imagepath = path + "/image";
						// 	break;
						// }
						// var pdf = imagepath + "/Entwicklungsrichtlinien.pdf";
						var oModel = oView.getModel("pl");
						//var path = "/sap/opu/odata/WIND/QM_RESULTS_SRV" + aContexts[0].sPath + "/$value";
						var path = aContexts[0].sPath;

						oModel.read(path, {
							success: function (oData) {

								//var pdfSrc1 = oData.__metadata.media_src;
								var strs = oData.__metadata.media_src.split("/sap");
								var picpfad = "/sap" + strs[1];
								var pdfSrc1 = picpfad;

								//ab 1.58
								//var pdfSrc = sap.ui.require.toUrl(pdfSrc1);
								//Old
								//var pdfSrc = jQuery.sap.getResourcePath(pdfSrc1);

								// oDialog._pdfViewer.setSource(pdfSrc1);
								// var title = oView.getModel("i18n").getResourceBundle().getText("dokutitle");
								// oDialog._pdfViewer.setTitle(title);
								// oDialog._pdfViewer.setShowDownloadButton(false);
								// //oDialog._pdfViewer.setDisplayType(sap.m.PDFViewerDisplayType.Link);
								// oDialog._pdfViewer.open();

								//pdfv.setSource(pdfSrc1);
								//var title = oView.getModel("i18n").getResourceBundle().getText("dokutitle");
								
								//oDialog._pdfViewer.setDisplayType(sap.m.PDFViewerDisplayType.Link);
								// In chrome open popup
								// if (sap.ui.Device.browser.name === "cr") {
								// 	pdfv.setTitle(title);
								// 	pdfv.setShowDownloadButton(false);
								// 	pdfv.open();
								// } else {
								// 	pdfv.downloadPDF();
								// }
								
								//that.getOwnerComponent().showPDF(pdfSrc1);
								// var dokut = oView.getModel("i18n").getResourceBundle().getText("dokuload");
								// MessageToast.show(dokut + " " + oData.Filename);
								
								// oModel_g.setProperty("/_doku_url", pdfSrc1);
								// oModel_g.setProperty("/_doku_file", oData.Filename);
								
								oModel_g.setProperty("/_displayfile/url", pdfSrc1);
								oModel_g.setProperty("/_displayfile/file", oData.Filename);
								oModel_g.setProperty("/_displayfile/mimetype", oData.Mimetype);
								
								fnResolve("success");
								oDialog.destroy();
								//return pdfSrc1;
								//fnResolve(pdfSrc1);
								
								
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

				oDialog = sap.ui.xmlfragment(oView.getId(), "de.enercon.usbee.view.dokudialog", oFragmentController);
				oDialog.setMultiSelect(false);

				// oDialog._pdfViewer = new PDFViewer();
				// oDialog.setModel(oModel);

				// oDialog.attachConfirm(function () {
				// 	oDialog.setBusy(false);
				// });

				oView.addDependent(oDialog);

			} else {
				oDialog.setModel(oModel);
				oDialog.setMultiSelect(false);
				// oDialog._pdfViewer = new PDFViewer();
			}
			oDialog.open();
		}

	}); //end extend
}); //end
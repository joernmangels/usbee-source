sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/Device",
	"sap/m/MessageBox"

], function (UI5Object, JSONModel, MessageToast, Device, MessageBox) {
	"use strict";

	return UI5Object.extend("de.enercon.usbee.controller.textdialog", {

		constructor: function (oView) {
			this._oView = oView;

		},

		open: function (_soView, _scurrentdata, fnResolve, fnReject) {
			//return new Promise(function (resolve, reject) {

			var oView = this._oView;
			var oDialog = oView.byId("fotoDialog");

			var jModel = new sap.ui.model.json.JSONModel();
			// model.setData({ 
			// arrayName: [
			//   		{ name: "First Item", value: 100 },
			//     	{ name: "Second Item", value: 123 }
			// 	]
			// });
			// var model = new JSONModel({
			// _MERKNR: _scurrentdata.Merknr
			// });

			//var oModel = _soView.getModel("pl");

			jModel.setData(_scurrentdata);

			var bIsPhone = Device.system.phone;
			var jModel2 = new sap.ui.model.json.JSONModel({
				imageWidth: bIsPhone ? "8em" : "16em",
				visible: false
			});

			///sap/opu/odata/WIND/QM_RESULTS_SRV/PruefMerkmaleSet(Prueflos='000002854018',Prueflos_Key_Modus='S1',Prueflos_Key_Object='TJM_2854018',Vornr='0010',Merknr='0010')/TOFOTO
			var path = "/sap/opu/odata/WIND/QM_RESULTS_SRV/PruefMerkmaleSet(Prueflos='" + _scurrentdata.Prueflos + "',Prueflos_Key_Modus='" +
				_scurrentdata.Prueflos_Key_Modus +
				"',Prueflos_Key_Object='" + _scurrentdata.Prueflos_Key_Object + "',Vornr='" + _scurrentdata.Vornr + "',Pruefpunkt='" + _scurrentdata.Pruefpunkt + "',Merknr='" +
				_scurrentdata.Merknr +
				"')/TOFOTO";

			//var upl = "your_service/UserSet('"+ user[0].getValue() +"')/Photo"

			var headerparas = oView.getModel("pl").getHeaders();
			var token = headerparas["x-csrf-token"];

			var jModel3 = new sap.ui.model.json.JSONModel({
				uploadurl: path,
				xcsrftoken: token
			});

			// create dialog lazily
			if (!oDialog) {
				var oFragmentController = {
					onCloseDialog: function (oEvent) {
						var title = oView.getModel("i18n").getResourceBundle().getText("foto-titleMK");
						var message = oView.getModel("i18n").getResourceBundle().getText("foto-confirmclose");
						var img = oView.byId("image1");
						var src = img.getProperty("src");

						if (src === "") {
							oDialog.close();
							oDialog.destroy();
						} else {

							MessageBox.confirm(
								message, {
									icon: sap.m.MessageBox.Icon.QUESTION,
									title: title,
									actions: [sap.m.MessageBox.Action.YES,
										sap.m.MessageBox.Action.NO
									],
									onClose: function (oAction) {
										if (oAction === sap.m.MessageBox.Action.YES) {
											oDialog.close();
											oDialog.destroy();
										}
									}
								});
						}
					},
					handleUploadPress: function (oEvent) {
						var oView = oEvent.getSource().getParent().getParent().getParent();
						var oDia = oEvent.getSource().getParent().getParent();
						//var diaView = oEvent.getSource().getParent().getParent();
						//oEvent.getSource().setBusy(true);
						// oEvent.getSource().setVisible(false);
						// var cbutton = oView.byId("CButton");
						// cbutton.setVisible(false);
						oDia.setBusy(true);

						var oFileUploader = oView.byId("fileUploader1");
						// if (!oFileUploader.getValue()) {
						// 	MessageToast.show("Choose a file first");
						// 	return;
						// }
						var headerpara = new sap.ui.unified.FileUploaderParameter({
							name: "slug",
							value: oFileUploader.getValue()
						});
						oFileUploader.insertHeaderParameter(headerpara);
						oFileUploader.upload();
					},
					handleFotoUploadComplete: function (oEvent) {
						var error = oView.getModel("i18n").getResourceBundle().getText("foto-uplerror");
						var success = oView.getModel("i18n").getResourceBundle().getText("foto-succerror");
						var oDia = oEvent.getSource().getParent().getParent();
						oDia.setBusy(false);

						var sResponse = oEvent.getParameter("status");
						if (sResponse === 201) {
							oDialog.close();
							oDialog.destroy();
							MessageToast.show(success);
							fnResolve("success");
						} else {
							var cbutton = oView.byId("CButton");
							// cbutton.setVisible(true);
							// MessageToast.show(error);
						}
						// var sResponse = oEvent.getParameter("response");
						// if (sResponse) {
						// 	var sMsg = "";
						// 	var m = /^\[(\d\d\d)\]:(.*)$/.exec(sResponse);
						// 	if (m[1] == "200") {
						// 		sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Success)";
						// 		oEvent.getSource().setValue("");
						// 	} else {
						// 		sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Error)";
						// 	}

						// 	MessageToast.show(sMsg);
						// }
					},

					handleFotoUploadPress: function (oEvent) {
						var oFileUploader = this.byId("fileUploader");
						if (!oFileUploader.getValue()) {
							MessageToast.show("Choose a file first");
							return;
						}
						oFileUploader.upload();
					},

					handleFotoTypeMissmatch: function (oEvent) {
						// var aFileTypes = oEvent.getSource().getFileType();
						// jQuery.each(aFileTypes, function (key, value) {
						// 	aFileTypes[key] = "*." + value;
						// });
						// var sSupportedFileTypes = aFileTypes.join(", ");
						// MessageToast.show("The file type *." + oEvent.getParameter("fileType") +
						// 	" is not supported. Choose one of the following types: " +
						// 	sSupportedFileTypes);
					},

					handleFotoValueChange: function (oEvent) {
						var oView = oEvent.getSource().getParent().getParent().getParent();
						var img = oView.byId("image1");

						var files = oEvent.getParameter("files");
						var path = window.URL.createObjectURL(files[0]); // here we are generating the URL based on the local file system and will pass the url in to path
						if (path != "") {
							img.setSrc(path); //we are setting the source of the path to the image to display the image
							var oView2 = oEvent.getSource().getParent().getParent();
							var oModel = oView2.getModel("img");
							oModel.setProperty("/visible", true);
						}

					}
				};
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "de.enercon.usbee.view.fotodialog", oFragmentController);

				//oDialog.setModel(oModel, "data");
				oDialog.setModel(jModel, "data");
				oDialog.setModel(jModel2, "img");
				oDialog.setModel(jModel3, "upl");

				// connect dialog to the root view of this component (models, lifecycle)
				oView.addDependent(oDialog);
			} else {
				oDialog.setModel(jModel, "data");
				oDialog.setModel(jModel2, "img");
				oDialog.setModel(jModel3, "upl");
			}
			oDialog.open();
		}

	}); //end extend
}); //end
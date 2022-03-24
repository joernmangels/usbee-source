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

		open: function (_soView, _scurrentdata, oModel, fnResolve, fnReject) {
			//return new Promise(function (resolve, reject) {

			var oView = this._oView;
			var oDialog = oView.byId("ppDialog");

			// var jModel = new sap.ui.model.json.JSONModel();
			// jModel.setData(_scurrentdata);

			var nav = "Prueflos='" + _scurrentdata.Prueflos + "'," + "Prueflos_Key_Modus='" + _scurrentdata.Prueflos_Key_Modus + "'," +
				"Prueflos_Key_Object='" + _scurrentdata.Prueflos_Key_Object + "'";
			var path = "/sap/opu/odata/wind/qm_results_srv/PruefloseSet(" + nav + ")";

			//var oModel = new sap.ui.model.odata.v2.ODataModel("http://myserver/MyService.svc/?myParam=value&myParam2=value");
			var oModel1 = new sap.ui.model.odata.v2.ODataModel({serviceUrl: path});
			//oModel.getObject(path);
			//var oModel = new sap.ui.model.odata.v2.ODataModel();
			//       var helpURL = "http:///sap/opu/odata/sap//MaterialSet";
			//       var queryString =”$select=Matnr,Descr&$format=json”;
			//oModel.loadData( path, false);

			// oDialog.bindElement({
			// 	//https:../PruefloseSet(Prueflos='2914',Prueflos_Key_Modus='S1',Prueflos_Key_Object='JM_2')?$format=json
			// 	path: "/sap/opu/odata/WIND/QM_RESULTS_SRV/PruefloseSet(" + nav + ")",
			// 	//path: "pl>/PruefloseSet('" + oArgs.pl + oArgs.pl_key_modus + oArgs.pl_key_object + "')",
			// 	// /sap/opu/odata/WIND/QM_RESULTS_SRV/PrueflosVorgaengeSet?$filter=Prueflos eq '553'
			// 	//path: "pl>/PrueflosVorgaengeSet?$filter=Prueflos eq '" + oArgs.orderId + "'",
			// 	events: {
			// 		change: this._onBindingChange.bind(this),
			// 		dataRequested: function (oEvent) {
			// 			//that.getOwnerComponent().setBusyView(oView, true);
			// 		},
			// 		dataReceived: function (oEvent) {
			// 			//that.getOwnerComponent().setBusyView(oView, false);
			// 		}
			// 	}
			// });

			// 			  if (DATABINDING) {
			//     console.log("Gateway Databinding for Value Help");
			// // http:///sap/opu/odata/sap//MaterialSet?$select=Matnr,Descr&$format=json
			//       var helpURL = "http:///sap/opu/odata/sap//MaterialSet";
			//       var queryString =”$select=Matnr,Descr&$format=json”;
			//       oHelpModel.loadData( helpURL, queryString, false);
			//   }
			//   else {
			//       console.log("Local Databinding for Value Help");
			//       oHelpData =
			//           {"d":{"results":[
			//                         {"Matnr":"4711","Descr":"Snowboard"},
			//                         {"Matnr":"4712","Descr":"Mountain Ski"},
			//                         {"Matnr":"4713","Descr":"Backcountry Ski"},
			//                         {"Matnr":"4714","Descr":"Freeride Ski"},
			//                         {"Matnr":"2011001","Descr":"Ski Boots"},
			//                         {"Matnr":"2011002","Descr":"Ski Poles"},
			//                         {"Matnr":"2011003","Descr":"Rucksack"},
			//                         {"Matnr":"5550001","Descr":"Ski Googles"},
			//                         {"Matnr":"5550002","Descr":"Ski Helmet"},
			//                         {"Matnr":"5550007","Descr":"GPS Unit"}
			//       ]}};
			//       oHelpModel.setData(oHelpData);
			//   }

			//   oHelpTable.setModel(oHelpModel);
			//   oHelpTable.bindAggregation("rows", "/d/results");

			if (!oDialog) {
				var oFragmentController = {
					onCloseDialog: function (oEvent) {
						var title = oView.getModel("i18n").getResourceBundle().getText("foto-titleMK");
						var message = oView.getModel("i18n").getResourceBundle().getText("foto-confirmclose");
						// var img = oView.byId("image1");
						// var src = img.getProperty("src");

						// if (src === "") {
							oDialog.close();
							oDialog.destroy();
						// } else {

						// 	MessageBox.confirm(
						// 		message, {
						// 			icon: sap.m.MessageBox.Icon.QUESTION,
						// 			title: title,
						// 			actions: [sap.m.MessageBox.Action.YES,
						// 				sap.m.MessageBox.Action.NO
						// 			],
						// 			onClose: function (oAction) {
						// 				if (oAction === sap.m.MessageBox.Action.YES) {
						// 					oDialog.close();
						// 					oDialog.destroy();
						// 				}
						// 			}
						// 		});
						// }
					},
					// handleUploadPress: function (oEvent) {
					// 	var oView = oEvent.getSource().getParent().getParent().getParent();
					// 	var oDia = oEvent.getSource().getParent().getParent();
					// 	//var diaView = oEvent.getSource().getParent().getParent();
					// 	//oEvent.getSource().setBusy(true);
					// 	// oEvent.getSource().setVisible(false);
					// 	// var cbutton = oView.byId("CButton");
					// 	// cbutton.setVisible(false);
					// 	oDia.setBusy(true);

					// 	var oFileUploader = oView.byId("fileUploader1");
					// 	// if (!oFileUploader.getValue()) {
					// 	// 	MessageToast.show("Choose a file first");
					// 	// 	return;
					// 	// }
					// 	var headerpara = new sap.ui.unified.FileUploaderParameter({
					// 		name: "slug",
					// 		value: oFileUploader.getValue()
					// 	});
					// 	oFileUploader.insertHeaderParameter(headerpara);
					// 	oFileUploader.upload();
					// },
					// handleFotoUploadComplete: function (oEvent) {
					// 	var error = oView.getModel("i18n").getResourceBundle().getText("foto-uplerror");
					// 	var success = oView.getModel("i18n").getResourceBundle().getText("foto-succerror");
					// 	var oDia = oEvent.getSource().getParent().getParent();
					// 	oDia.setBusy(false);

					// 	var sResponse = oEvent.getParameter("status");
					// 	if (sResponse === 201) {
					// 		oDialog.close();
					// 		oDialog.destroy();
					// 		MessageToast.show(success);
					// 		fnResolve("success");
					// 	} else {
					// 		var cbutton = oView.byId("CButton");
					// 		// cbutton.setVisible(true);
					// 		// MessageToast.show(error);
					// 	}
					// 	// var sResponse = oEvent.getParameter("response");
					// 	// if (sResponse) {
					// 	// 	var sMsg = "";
					// 	// 	var m = /^\[(\d\d\d)\]:(.*)$/.exec(sResponse);
					// 	// 	if (m[1] == "200") {
					// 	// 		sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Success)";
					// 	// 		oEvent.getSource().setValue("");
					// 	// 	} else {
					// 	// 		sMsg = "Return Code: " + m[1] + "\n" + m[2] + "(Upload Error)";
					// 	// 	}

					// 	// 	MessageToast.show(sMsg);
					// 	// }
					// },

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
				oDialog = sap.ui.xmlfragment(oView.getId(), "de.enercon.usbee.view.ppdialog", oFragmentController);

				oDialog.setModel(oModel1);
				//oDialog.setModel(jModel, "data");
				// oDialog.setModel(jModel2, "img");
				// oDialog.setModel(jModel3, "upl");
				// connect dialog to the root view of this component (models, lifecycle)
				//oDialog.setModel(OMODEL, "pl");
				oView.addDependent(oDialog);
			} else {
				oDialog.setModel(oModel1);
				//oDialog.setModel(jModel, "data");
				// oDialog.setModel(jModel2, "img");
				// oDialog.setModel(jModel3, "upl");
				//oDialog.setModel(OMODEL, "pl");
			}
			oDialog.open();
		}

	}); //end extend
}); //end
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/IconPool"
	// "sap/m/MessagePopover",
	// "sap/m/MessagePopoverItem"

], function (Controller, History, JSONModel, Filter, FilterOperator, MessageToast, MessageBox, IconPool) {
	"use strict";

	return Controller.extend("de.enercon.usbee.controller.recordresults.Detail2", {

		onInit: function () {
			IconPool.addIcon('formel2', 'customfont', 'saptnt', 'e04b');
			IconPool.addIcon('sad2', 'customfont', 'sapbusiness', 'e087');

			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("vorgang").attachMatched(this._onRouteMatched, this);
			
			var oModel2 = this.getOwnerComponent().getModel("GSETTINGS");
			this.getView().setModel(oModel2, "gsettings");
			
			//var omodel = this.getOwnerComponent().getModel("pl");
			//this.getView().setModel(omodel, "headdata");
			//var context = selectedItem.getBindingContext("modelPath");
			//var detail1_view =  this.getView().byId("Detail1");
		},
		// onBeforeRendering: function () {
		// // 	this._setImagesInCarousel();
		// 	this.getView().setBusy(false);
		// },
		onTextPress: function (oEvent) {
			this.getOwnerComponent().handleTextMK_L(oEvent, this.getView());
		},		
		onFotoPress: function (oEvent) {
			this.getOwnerComponent().handleFotoUploadMK('MD', 'L', oEvent, this.getView());
		},
		onListItemPress: function (oEvent) {
			// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
			//var oListItem = oEvent.getParameter("listItem") || oEvent.getSource();
			var oSelectedListItem = oEvent.getParameter("listItem");
			this._showDetail(oSelectedListItem);
		},
		_showDetail: function (oItem) {
			this.getOwnerComponent().detail2_navto(oItem, 'M');
		},
		rowSelectionChanged: function (event) {

			//console.log(oevent.getSource().getSelectedItem().getKey()); 

			// var oList = oItem.getSource();
			// var bcontext = oList.getBindingContext("pl");
			// var merknr = bcontext.getProperty("Merknr");

			// var aTarget = ["plMaster", "plMerkmal"];
			// oItem.mParameters.listItem.setSelected(true);
			// this.getOwnerComponent().getRouter().getTargets().display(aTarget);

			// // "pattern": "prueflosmerkmal/:pl:,:pl_key_modus:,:pl_key_object:,:vornr:,:merknr:",
			// var prueflos = oItem.oSource.getBindingContext("pl").getProperty("Prueflos");
			// var prueflos_key_modus = oItem.oSource.getBindingContext("pl").getProperty("Prueflos_Key_Modus");
			// var prueflos_key_object = oItem.oSource.getBindingContext("pl").getProperty("Prueflos_Key_Object");
			// var vornr = oItem.oSource.getBindingContext("pl").getProperty("Vornr");
			// var merknr = oItem.oSource.getBindingContext("pl").getProperty("Merknr");

			// this.getOwnerComponent().getRouter().navTo("merkmal", {
			// 	pl: prueflos,
			// 	pl_key_modus: prueflos_key_modus,
			// 	pl_key_object: prueflos_key_object,
			// 	vornr: vornr,
			// 	merknr: merknr
			// }, false);

		},
		_onRouteMatched: function (oEvent) {
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();
			//oView.setBusy(false);
			var that = this;
			that.getOwnerComponent().setBusyView(oView, false);

			// /sap/opu/odata/WIND/QM_RESULTS_SRV/PrueflosVorgaengeSet(Prueflos='000002385735',Prueflos_Key_Modus='S1',Prueflos_Key_Object='TEST_0603_1',Vornr='0010')/TOMERK?$format=json

			//var path1 = "pl>/PrueflosVorgaengeSet(Prueflos='" + oArgs.orderId + "',Vornr='" + oArgs.vorgang + "')";
			var path1 = "pl>/PrueflosVorgaengeSet(Prueflos='" + oArgs.pl + "',Prueflos_Key_Modus='" + oArgs.pl_key_modus +
				"',Prueflos_Key_Object='" + oArgs.pl_key_object + "',Vornr='" + oArgs.vornr + "',Pruefpunkt='" + oArgs.pruefpunkt + "')";

			oView.bindElement({
				path: path1,
				parameters: {
					expand: "TOPL,TOMERK"
				},
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function (oEvent) {
						that.getOwnerComponent().setBusyView(oView, true);
					},
					dataReceived: function (oEvent) {
						that.getOwnerComponent().setBusyView(oView, false);
					}
				}
			});

			// register for metadata loaded events
			//var oModel = this.getModel();
			//oModel.metadataLoaded().then(this._onMetadataLoaded.bind(this));

		},
		onAfterRendering: function () {
			//var oTable1 = this.byId("MerkmaleL");
			//var haveToChange = oTable1.getSelectedIndices();
			//var rows = oTable1.getRows();
			//var oTable1 = this.getView().byId("MerkmaleL");
			//var rows = oTable1.getRows();
			//				vorgang: oItem.getBindingContext("pl").getProperty("Vornr")
			//var 

		},
		_onBindingChange: function (oEvent) {
			// No data for the binding
			// if (!this.getView().getBindingContext()) {
			// 	// TODO: Display not found detail
			// 	//this.getOwnerComponent().getRouter().getTargets().display("notFound");
			// }
			var olist = this.byId("Merkmale");
			var oBinding = olist.getBinding("items");
			oBinding.refresh();
		},

		onNavBack: function (oEvent) {
			// var sPreviousHash = History.getInstance().getPreviousHash();
			// if (sPreviousHash !== undefined) {
			// 	window.history.go(-1);
			// } else {
			// 	window.history.go(-2);
			// }
			var oView = this.getView();
			var oModel = oView.getModel("pl");
			var path = oView.getBindingContext("pl").sPath;
			var currentdata = oModel.getProperty(path);

			this.getOwnerComponent().getRouter().navTo("prueflos", {
				pl: currentdata.Prueflos,
				pl_key_modus: currentdata.Prueflos_Key_Modus,
				pl_key_object: currentdata.Prueflos_Key_Object,
			}, false);

		}

		//_onMetadataLoaded: function () {
		//},
		// onSave: function () {
		// 	var title = this.getView().getModel("i18n").getResourceBundle().getText("detail2-saveconfirm-title");
		// 	var message = this.getView().getModel("i18n").getResourceBundle().getText("detail2-saveconfirm-message");
		// 	var nosave = this.getView().getModel("i18n").getResourceBundle().getText("detail2-nosave");
		// 	var _this = this;

		// 	var oModel = this.getView().getModel("pl");
		// 	if (oModel.hasPendingChanges()) {
		// 		MessageBox.confirm(
		// 			message, {
		// 				icon: sap.m.MessageBox.Icon.QUESTION,
		// 				title: title,
		// 				actions: [sap.m.MessageBox.Action.YES,
		// 					sap.m.MessageBox.Action.NO
		// 				],
		// 				onClose: function (oAction) {
		// 					if (oAction === sap.m.MessageBox.Action.YES) {
		// 						//_this.getModel("detailView").setProperty("/busy", true);
		// 						_this._SaveConfirm();
		// 					}
		// 				}
		// 			});
		// 	} else {
		// 		sap.m.MessageToast.show(nosave);
		// 	}

		// },

		// onMessagePopoverPress: function (oEvent) {
		// 	this._getMessagePopover().openBy(oEvent.getSource());
		// },

		// onDelete: function (oEvent) {
		// 	var sPath = this.getView().getBindingContext().getPath();
		// 	this.getView().getModel().remove(sPath);
		// },

		// onClearPress: function () {
		// 	sap.ui.getCore().getMessageManager().removeAllMessages();
		// },

		// _getMessagePopover: function () {
		// 	// create popover lazily (singleton)
		// 	if (!this._oMessagePopover) {
		// 		// create popover lazily (singleton)
		// 		this._oMessagePopover = sap.ui.xmlfragment(this.getView().getId(),
		// 			"de.enercon.view.recordresults.MessagePopover", this);
		// 		this.getView().addDependent(this._oMessagePopover);
		// 	}
		// 	return this._oMessagePopover;
		// },

		// _SaveConfirm: function () {
		// 	//var oView = this.getView();
		// 	var oModel = this.getView().getModel("pl");
		// 	var success = this.getView().getModel("i18n").getResourceBundle().getText("detail2-savesuccess");
		// 	var error = this.getView().getModel("i18n").getResourceBundle().getText("detail2-saveerror");
		// 	var title = this.getView().getModel("i18n").getResourceBundle().getText("detail2-saveconfirm-title");

		// 	sap.ui.getCore().getMessageManager().removeAllMessages();

		// 	oModel.submitChanges({
		// 		//success: function(oData) {
		// 		success: function (oData, oResponse) {
		// 			//console.log(oData);
		// 			//console.log(oResponse);

		// 			var lv_success = true;

		// 			var obj = oData.__batchResponses;
		// 			for (var i in obj) {
		// 				//console.log(obj[i]);
		// 				if ('message' in obj[i]) {
		// 					if (obj[i].message === "HTTP request failed") {
		// 						if (obj[i].response.statusCode === "400") {
		// 							//console.log(obj[i].response.statusCode);
		// 							MessageToast.show(error);
		// 							lv_success = false;
		// 							break;
		// 						}
		// 					}
		// 				}
		// 			}

		// 			if (lv_success) {
		// 				MessageToast.show(success);
		// 			}

		// 		},

		// 		error: function (oData) {
		// 			//console.log(oData);

		// 			MessageBox.error(error, {
		// 				title: title,
		// 				onClose: null,
		// 				styleClass: "",
		// 				initialFocus: null,
		// 				textDirection: sap.ui.core.TextDirection.Inherit
		// 			});
		// 			oModel.refresh();
		// 		}
		// 	});

		// },
		// onButtonBook: function (oEvent) {
		// 	var oView = this.getView();
		// 	var oModel = oView.getBindingContext().getModel();

		// 	if (oModel.hasPendingChanges()) {
		// 		oModel.submitChanges({
		// 			success: function (oData, oResponse) {
		// 				//debugger;
		// 				sap.m.MessageToast.show("Saved");
		// 				//console.log(oData);
		// 			},
		// 			error: function (oData) {
		// 				sap.m.MessageToast.show("Failed to save");
		// 				//console.log(oData);
		// 			}
		// 		});
		// 	} else {
		// 		sap.m.MessageToast.show("There is nothing to save");
		// 	}
		// }

	});
});
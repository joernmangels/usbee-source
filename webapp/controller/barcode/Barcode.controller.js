sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox"

], function (Controller, MessageToast, JSONModel, Device, Fragment, MessageBox) {
	"use strict";
	return Controller.extend("de.enercon.usbee.controller.barcode.Barcode", {

		onInit: function (evt) {

			var oViewModel = new JSONModel({
				_INPUT: ""
			});
			this.getView().setModel(oViewModel, "inputdata");

			var oModel = this.getOwnerComponent().getModel("GLOBAL");
         	this.getView().setModel(oModel, "glo");
         	
			// var oRouter = this.getOwnerComponent().getRouter();
			// oRouter.getRoute("go_barcode").attachMatched(this._onRouteMatched1, this);

		},
		onExit: function (evt) {

		},
		onAfterRendering: function (evt) {

		},
		onBeforeRendering: function (evt) {},
		onBarcode: function (oEvent) {

            jQuery.sap.require("sap.ndc.BarcodeScanner");

			var that = this;
			var oModel = that.getOwnerComponent().getModel("pl");
			var oView = this.getView();
			var oTable = this.getView().byId("foundPLs");

			// 88891;HWHX-01
			//var searchField = this.getView().byId("Scan");

			sap.ndc.BarcodeScanner.scan(
				//function a(mresult) {searchField.setValue(mresult.text);}
				function a(mresult) {

					that._setfilter(mresult.text);

					var oModelInput = oView.getModel("inputdata");
					oModelInput.setProperty("/_INPUT", mresult.text);

				}
			);
		},
		onScanFieldChange: function (oEvent) {
			var oSource = oEvent.getSource();
			var scan = oSource.getValue();

			this._setfilter(scan);

		},
		_setfilter: function (filter) {
			var oTable = this.getView().byId("foundPLs");
			var oFilters = [new sap.ui.model.Filter("Scanner_Eingabe", sap.ui.model.FilterOperator.EQ, filter)];
			var binding = oTable.getBinding("items");
			binding.filter(oFilters);
		},
		onTablePress: function (oEvent) {
			// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
			//var oListItem = oEvent.getParameter("listItem") || oEvent.getSource();
			var oSelectedListItem = oEvent.getParameter("listItem");
			this._showDetail(oSelectedListItem);
		},
		_showDetail: function (oItem) {
			var oBindingContext = oItem.getBindingContext("pl");
			var oPath = oBindingContext.getPath();
			var oModel = oBindingContext.getModel().getProperty(oPath);

			var prueflos = oModel.Prueflos;
			var sernr = oModel.Sernr;
			var charg = oModel.Charg;
			var prueflos_key_modus;
			var prueflos_key_object;
			var aTarget;
			var nav;

			oItem.setSelected(true);

			var aTarget = ["plMaster", "plDetail"];
			//this.getOwnerComponent().getRouter().getTargets().display(aTarget);
			console.log(oItem.getBindingContext("pl"));

			//var prueflos = oItem.getBindingContext("pl").getProperty("Prueflos");
			// var prueflos_key_modus = oItem.getBindingContext("pl").getProperty("Prueflos_Key_Modus");
			// var prueflos_key_object = oItem.getBindingContext("pl").getProperty("Prueflos_Key_Object");

			if (sernr === "" && charg === "") {
				prueflos_key_modus = "NN";
				prueflos_key_object = "-";
			}
			if (sernr !== "" && charg === "") {
				prueflos_key_modus = "S1";
				prueflos_key_object = sernr;
			}
			if (sernr === "" && charg !== "") {
				prueflos_key_modus = "CH";
				prueflos_key_object = charg;
			}

			console.log(prueflos);
			console.log(prueflos_key_modus);
			console.log(prueflos_key_object);

			var oView = this.getView();
			this.getOwnerComponent().saveViewPos(oView.getViewName());

			this.getOwnerComponent().getRouter().navTo("prueflos_list", {
				pl: prueflos,
				pl_key_modus: prueflos_key_modus,
				pl_key_object: prueflos_key_object
			}, false);

		},
		_onBindingChange: function (oEvent) {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				//this._skip_list();
			}
		},
		_onRouteMatched1: function (oEvent) {
			// var oArgs, oView;
			// oArgs = oEvent.getParameter("arguments");
			// oView = this.getView();

			// // var text1 = "Scanner-Eingabe..";
			// // var nav = "Scanner_Eingabe='" + text1 + "'";
			// //var nav = "Scanner_Eingabe=''";
			// var nav = "pl>/BarcodeSet?$filter=Scanner_Eingabe eq ''";

			// oView.bindElement({
			// 	path: nav,
			// 	events: {
			// 		//change: this._onBindingChange.bind(this),
			// 		dataRequested: function (oEvent) {
			// 			oView.setBusy(true);
			// 		},
			// 		dataReceived: function (oEvent) {
			// 			oView.setBusy(false);
			// 		}
			// 	}

			// });
		},
		onSave: function (evt) {
			var title = this.getView().getModel("i18n").getResourceBundle().getText("SerialTitle");
			var message = this.getView().getModel("i18n").getResourceBundle().getText("sernrsaveconfirm");
			var nosave = this.getView().getModel("i18n").getResourceBundle().getText("detail2-nosave");
			var _this = this;

			var sernr = this.getView().getModel("inputdata").getProperty("/_SERNR");
			//var matnr =	this.getView().getModel("pl>MaterialSet").getProperty("/Matnr");
			//var pl = oList.getBindingContext("pl").getProperty("Prueflos");

			var oList = this.byId("selectID"),
				oBinding = oList.getBinding("items");
			var item = oList.getSelectedItem();
			var matnr = item.mProperties.key;

			if (sernr && matnr) {
				MessageBox.confirm(
					message, {
						icon: sap.m.MessageBox.Icon.QUESTION,
						title: title,
						actions: [sap.m.MessageBox.Action.YES,
							sap.m.MessageBox.Action.NO
						],
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.YES) {
								sap.ui.getCore().getMessageManager().removeAllMessages();
								_this.commit_save_sernr(sernr, matnr);
							}
						}
					});
			} else {
				sap.m.MessageToast.show(nosave);
			}

		},
		commit_save_sernr: function (sernr, matnr) {
			var oModel = this.getOwnerComponent().getModel("pl");
			var _this = this;

			sap.ui.getCore().getMessageManager().removeAllMessages();

			var oEntry = {};
			oEntry.Sernr = sernr;
			oEntry.Matnr = matnr;

			oModel.create("/SerialnummerSet", oEntry, {
				method: "POST",
				success: function (data) {
					//alert("success");
					//Wenn erfolgreich Matnr/Sernr merken 
					var oModelSernr = _this.getOwnerComponent().getModel("lastsernr");
					oModelSernr.setProperty("/_LASTSERNR", oEntry.Sernr);
					oModelSernr.setProperty("/_LASTMATNR", oEntry.Matnr);

				},
				error: function (e) {
					//alert("error");
				}
			});

		},
		onMessagePopoverPress: function (oEvent) {
			this._getMessagePopover().openBy(oEvent.getSource());
		},

		onClearPress: function () {
			sap.ui.getCore().getMessageManager().removeAllMessages();
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

		onNavBack: function (oEvent) {
			sap.ui.getCore().getMessageManager().removeAllMessages();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("appHome", true);
		},
		handleImage3Press: function (evt) {
			this.getOwnerComponent().openInfoDialog();
		},

		handleFullscreen: function (evt) {
			this.getOwnerComponent().handleFullscreen(evt);
		}

	});
});
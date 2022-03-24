sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox"

], function(Controller, MessageToast, JSONModel, Device, Fragment, MessageBox) {
	"use strict";
	return Controller.extend("de.enercon.usbee.controller.insplot.Insplot", {

		onInit: function(evt) {

			//var sernr =  this.getOwnerComponent().getModel("lastsernr").getProperty("/_LASTSERNR");
			//var matnr =  this.getOwnerComponent().getModel("lastsernr").getProperty("/_LASTMATNR");

			// var oViewModel = new JSONModel({
			// 	_SERNR: sernr,
			// 	_MATNR: matnr
			// });
			// this.getView().setModel(oViewModel, "inputdata");

			this.getView().setModel(this.getOwnerComponent().getModel("lastsernr"), "inputdata");
		},
		onSave: function(evt) {
			var title = this.getView().getModel("i18n").getResourceBundle().getText("InsplotTitle");
			var message = this.getView().getModel("i18n").getResourceBundle().getText("prueflossaveconfirm");
			var nosave = this.getView().getModel("i18n").getResourceBundle().getText("detail2-nosave");
			var _this = this;

			var sernr = this.getView().getModel("inputdata").getProperty("/_LASTSERNR");

			var oList = this.byId("selectPID"),
				oBinding = oList.getBinding("items");
			var item = oList.getSelectedItem();
			var matnr = item.mProperties.key;
			var fields = item.mProperties.additionalText.split(' ');
			var werks = fields[1];


			if (sernr && matnr) {
				MessageBox.confirm(
					message, {
						icon: sap.m.MessageBox.Icon.QUESTION,
						title: title,
						actions: [sap.m.MessageBox.Action.YES,
							sap.m.MessageBox.Action.NO
						],
						onClose: function(oAction) {
							if (oAction === sap.m.MessageBox.Action.YES) {
								sap.ui.getCore().getMessageManager().removeAllMessages();
								_this.commit_save_prueflos(sernr, matnr, werks);
							}
						}
					});
			} else {
				sap.m.MessageToast.show(nosave);
			}

		},
		commit_save_prueflos: function(sernr, matnr, werks) {
			var oModel = this.getOwnerComponent().getModel("pl");
			var _this = this;

			sap.ui.getCore().getMessageManager().removeAllMessages();

			sap.ui.getCore().getMessageManager().removeAllMessages();
			var oEntry = {};
			oEntry.Sernr = sernr;
			oEntry.Matnr = matnr;
			oEntry.Werk = werks;

			oModel.create("/PruefloseSet", oEntry, {
				method: "POST",
				success: function(data) {
					//alert("success");
					//Wenn erfolgreich Matnr/Sernr merken 
					var oModelSernr = _this.getOwnerComponent().getModel("lastsernr");
					oModelSernr.setProperty("/_LASTSERNR", oEntry.Sernr);
					oModelSernr.setProperty("/_LASTMATNR", oEntry.Matnr);

				},
				error: function(e) {
					//alert("error");
				}
			});

		},
		onMessagePopoverPress: function(oEvent) {
			this._getMessagePopover().openBy(oEvent.getSource());
		},

		onClearPress: function() {
			sap.ui.getCore().getMessageManager().removeAllMessages();
		},

		_getMessagePopover: function() {
			// create popover lazily (singleton)
			if (!this._oMessagePopover) {
				// create popover lazily (singleton)
				this._oMessagePopover = sap.ui.xmlfragment(this.getView().getId(),
					"de.enercon.usbee.view.recordresults.MessagePopover", this);
				this.getView().addDependent(this._oMessagePopover);
			}
			return this._oMessagePopover;
		},
		onNavBack: function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("appHome", true);
		},
		handleImage3Press: function(evt) {
			this.getOwnerComponent().openInfoDialog();
		},

		handleFullscreen: function(evt) {
			this.getOwnerComponent().handleFullscreen(evt);
		}

	});
});
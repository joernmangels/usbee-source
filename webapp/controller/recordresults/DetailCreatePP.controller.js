sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/core/routing/History"

], function (Controller, JSONModel, MessageBox, MessageToast, History) {
	"use strict";

	return Controller.extend("de.enercon.usbee.controller.recordresults.DetailCreatePP", {

		onInit: function () {
			var oModel = this.getOwnerComponent().getModel("GLOBAL");
			this.getView().setModel(oModel, "glo");

			var oViewModel = new JSONModel({
				_readypp: false,
				_prueflos: "",
				_SLWBEZ_KURZTEXT: "",
				_nosave: false
					// _pruefpunkt: ""
					// _SLWBEZ_SELECT: false,
					// _vornr: "",
					// _vorktxt: "",
					// _SLWBEZ: "",
					// _SLWBEZ_SELECT: false
			});
			this.getView().setModel(oViewModel, "inputdata");

			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("Prueflos_CreatePP").attachMatched(this._onRouteMatched1, this);

		},
		handleImage3Press: function (evt) {
			this.getOwnerComponent().openInfoDialog();
		},
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
		onNavBack: function (oEvent) {
			sap.ui.getCore().getMessageManager().removeAllMessages();
			var oModel = this.getOwnerComponent().getModel("pl");
			//oModel.refresh(true);
			oModel.resetChanges();
			
			
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				window.history.go(-2);
			}
		},
		_onRouteMatched1: function (oEvent) {
			var oArgs = oEvent.getParameter("arguments");
			var oView = this.getView();
			var that = this;
			


			var oModel1 = this.getView().getModel("inputdata");
			sap.ui.getCore().getMessageManager().removeAllMessages();

			// PL
			var oModel = this.getOwnerComponent().getModel("pl");
			//oModel.refresh(true);
			oModel.resetChanges();
			var pathm = oModel.createKey("PruefloseSet", {
				Prueflos: oArgs.pl,
				Prueflos_Key_Modus: oArgs.pl_key_modus,
				Prueflos_Key_Object: oArgs.pl_key_object
			});
			var pathmm = "/" + pathm;
			var cpl = oModel.getProperty(pathmm);

			oModel1.setProperty("/_prueflos", cpl.Prueflos);
			oModel1.setProperty("/_SLWBEZ_KURZTEXT", cpl.SLWBEZ_KURZTEXT);
			oModel1.setProperty("/_readypp", false);
			oModel1.setProperty("/_nosave", false);

			var oList = this.byId("vorgaengeListPP");

			var nav = "Prueflos='" + oArgs.pl + "'," + "Prueflos_Key_Modus='" + oArgs.pl_key_modus + "'," + "Prueflos_Key_Object='" + oArgs.pl_key_object +
				"'";

			//oView.bindElement({
			oList.bindElement({
				//https:../PruefloseSet(Prueflos='2914',Prueflos_Key_Modus='S1',Prueflos_Key_Object='JM_2')?$format=json
				path: "pl>/PruefloseSet(" + nav + ")",
				//path: "pl>/PruefloseSet('" + oArgs.pl + oArgs.pl_key_modus + oArgs.pl_key_object + "')",
				// /sap/opu/odata/WIND/QM_RESULTS_SRV/PrueflosVorgaengeSet?$filter=Prueflos eq '553'
				//path: "pl>/PrueflosVorgaengeSet?$filter=Prueflos eq '" + oArgs.orderId + "'",
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

		},
		onUpdateFinishedList: function (oEvent) {
			var oList = oEvent.getSource();
			var oItems = oList.getItems();
			var anzahl = oItems.length;
			// Panel bei Vorgänge = 1 gleich hell schalten			
			if (anzahl === 1) {
				var oModel1 = this.getView().getModel("inputdata");
				oModel1.setProperty("/_readypp", true);
				this._showSelectVorg(oItems[0]);
			}
		},
		onListVorgSelect: function (oEvent) {
			this._showSelectVorg(oEvent.getSource());
		},
		_showSelectVorg: function (oItem) {
			var oView = this.getView();
			var that = this;
			oItem.setSelected(true);
			var oModel = this.getView().getModel("inputdata");
			oModel.setProperty("/_readypp", true);

			//oModel.setProperty("/_pruefpunkt", "");
			// var vornr = oItem.getBindingContext("pl").getProperty("Vornr");
			// oModel.setProperty("/_vornr", vornr);
			// var vorktxt = oItem.getBindingContext("pl").getProperty("Vorktxt");
			// oModel.setProperty("/_vorktxt", vorktxt);
			// // oModel.setProperty("/_SLWBEZ", currentdata.SLWBEZ);
			// // oModel.setProperty("/_SLWBEZ_SELECT", currentdata.SLWBEZ_SELECT);
			// var oList = this.byId("vorgaengeListPP");
			// var oModelPL = oList.getModel("pl");

			var oModelPL = this.getOwnerComponent().getModel("pl");
			var path = oItem.getBindingContextPath();
			var cdata = oModelPL.getProperty(path);

			// PL-Vorg
			var pathm = oModelPL.createKey("PrueflosVorgaengeSet", {
				Prueflos: cdata.Prueflos,
				Prueflos_Key_Modus: cdata.Prueflos_Key_Modus,
				Prueflos_Key_Object: cdata.Prueflos_Key_Object,
				Vornr: cdata.Vornr,
				Pruefpunkt: cdata.Pruefpunkt
			});
			var pathmm = "/" + pathm;
			var cplv = oModelPL.getProperty(pathmm);
			oModel.setProperty("/_SLWBEZ_SELECT", cplv.SLWBEZ_SELECT);

			//var oselect = this.byId("selectPPP");
			var path1 = "pl>/PrueflosVorgaengeSet(Prueflos='" + cdata.Prueflos + "',Prueflos_Key_Modus='" + cdata.Prueflos_Key_Modus +
				"',Prueflos_Key_Object='" + cdata.Prueflos_Key_Object + "',Vornr='" + cdata.Vornr + "',Pruefpunkt='" + cdata.Pruefpunkt + "')";

			//oselect.bindElement({
			oView.bindElement({
				path: path1,
				// parameters: {
				// 	expand: "TOPL"
				// },
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

		},
		_onBindingChange: function (oEvent) {
			var olist = this.byId("selectPPP");
			var oBinding = olist.getBinding("items");
			oBinding.refresh();
		},
		onPPCreate: function () {
			// var message = this.getView().getModel("i18n").getResourceBundle().getText("detail1-nobewert");
			// var messageD = this.getView().getModel("i18n").getResourceBundle().getText("detail1-nodocu");
			var nosave = this.getView().getModel("i18n").getResourceBundle().getText("detail2-nosave");
			var oModelPL = this.getView().getModel("pl");

			var oModel = this.getView().getModel("inputdata");
			var _nosave = oModel.getProperty("/_nosave");

			if (!_nosave) {

				if (oModelPL.hasPendingChanges()) {

					this.getOwnerComponent().onSavePP(this);

				} else {
					MessageToast.show(nosave);
				}

			}
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
		onDateInput: function (oEvent) {
			var valid = this.getView().getModel("i18n").getResourceBundle().getText("detail1-ppdavalid");
			// var datum = this.byId("DA");
			// //oText.setText("Value is: " + ((oDP.isValidValue()) ? "valid" : "not valid"));
			// if (!datum._bValid) {
			// 	MessageToast.show(valid);
			// }
			var oDP = oEvent.getSource();
			var sValue = oEvent.getParameter("value");
			var bValid = oEvent.getParameter("valid");

			//oText.setText("Change - Event " + this._iEvent + ": DatePicker " + oDP.getId() + ":" + sValue);

			var oModel1 = this.getView().getModel("inputdata");

			if (bValid) {
				oDP.setValueState(sap.ui.core.ValueState.None);
				oModel1.setProperty("/_nosave", false);
			} else {
				oDP.setValueState(sap.ui.core.ValueState.Error);
				oModel1.setProperty("/_nosave", true);
				MessageToast.show(valid);
			}
		}
	});
});
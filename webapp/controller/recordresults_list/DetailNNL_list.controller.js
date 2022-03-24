sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"

], function (Controller, MessageToast) {
	"use strict";

	return Controller.extend("de.enercon.usbee.controller.recordresults_list.DetailNNL_list", {

		onInit: function () {
			this.getView().setModel(this.getOwnerComponent().getModel("GLOBAL"), "global");
			this.getView().setModel(this.getOwnerComponent().getModel("GSETTINGS"), "GSETT");
			
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("Merkmal_NN_Qual_list").attachMatched(this._onRouteMatched, this);

			var oTable = this.getView().byId("idresuTableL");
			var that = this;
			oTable.attachUpdateFinished(function () {
				var promise1 = new Promise(function (resolve, reject) {
					setTimeout(function () {
						resolve('resolved');
					}, 500);
				});
				promise1.then(function (value) {
					if (that.getOwnerComponent()._tablehaslines(oTable)) {
						that.getOwnerComponent()._scrollEndList(oTable);
						that.getOwnerComponent().attachBrowserEventVIEW(that, "LS");
						that.getOwnerComponent().check_all2(that, "LS");
					} else {
						that.getOwnerComponent()._navBack_empty_list();
					}
				});
			});

			// this.getView().attachBrowserEvent(
			// 	"swiperight", function(oEvent) {
			// 		that.getOwnerComponent().handleMKSwipe_list(oEvent, that.getView(), that);
			// 	}
			// );
			// this.getView().attachBrowserEvent(
			// 	"swipeleft", function(oEvent) {
			// 		that.getOwnerComponent().handleMKSwipe_list(oEvent, that.getView(), that);
			// 	}
			// );
			//this.getOwnerComponent().attachBrowserEventVIEW(this, "LS");

		},
		// onBeforeRendering: function () {
		// 	var aItems = this.getView().byId("idresuTableL").getItems();
		// 	for (var i = 0; i < aItems.length; i++) {
		// 		var aCells = aItems[i].getCells();
		// 		// I know select is at 0th cell, so I can use aCells[0].
		// 		var rowSelectedKey = aCells[0].getSelectedItem().getKey();
		// 		// once you have the selcetedKey, you can save them in a local array or //      model   and after the loop, you can work with them
		// 	}
		// 	var selectbar = this.getView().byId("selectPIDNNL");
		// 	//var items = selectbar.getItems();
		// 	var list = selectbar.getList();

		// },
		handleHome: function (oEvent) {
			this.getOwnerComponent().jumphome();
		},
		onFHMPress: function (oEvent) {
			this.getOwnerComponent().onMKFHM(this.getView(), oEvent);
		},
		onBemerkungChange: function (oEvent) {
			this.getOwnerComponent().handleBemerkungInput(oEvent, this.getView());
		},
		onStepInputChange: function (oEvent) {
			//Nur für Qual -> Klass
			this.getOwnerComponent().handleStepInputChange(oEvent, this.getView());
		},
		onValidChange: function (oEvent) {
			this.getOwnerComponent().handleValidChange(oEvent, this.getView());
		},
		onTextPress: function (oEvent) {
			this.getOwnerComponent().handleTextMK(oEvent, this.getView());
		},
		onMerknrFirst: function (oEvent) {
			this.getOwnerComponent().handleMerkmalNav_list('F', oEvent, this);
		},
		onMerknrLast: function (oEvent) {
			this.getOwnerComponent().handleMerkmalNav_list('L', oEvent, this);
		},
		onMerknrDown: function (oEvent) {
			this.getOwnerComponent().handleMerkmalNav_list('D', oEvent, this);
		},
		onMerknrUp: function (oEvent) {
			this.getOwnerComponent().handleMerkmalNav_list('U', oEvent, this);
		},
		onFotoPress: function (oEvent) {
			this.getOwnerComponent().handleFotoUploadMK('L', 'D', oEvent, this.getView());
		},
		onNavBack: function (oEvent) {
			this.getOwnerComponent().viewNavBack_list(this);
		},
		_onRouteMatched: function (oEvent) {
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();
			var that = this;

			var oModelSettings = this.getOwnerComponent().getSettings();
			oModelSettings.setProperty("/_autoreload_except_recordresults", true);

			// var oemptylistmodel = this.getOwnerComponent().getModel("empty_list");
			// oemptylistmodel.setProperty("/_called", false);
			
			var path = "/PruefMerkmaleSet(Prueflos='" + oArgs.pl + "',Prueflos_Key_Modus='" + oArgs.pl_key_modus +
				"',Prueflos_Key_Object='" + oArgs.pl_key_object + "',Vornr='" + oArgs.vornr + "',Pruefpunkt='" + oArgs.pruefpunkt + "',Merknr='" +
				oArgs.merknr + "')";
			var path1 = "pl>" + path;

			var oModel = oView.getModel("pl");

			// Die Modeldaten wurden bereits geladen dann klappt dies:
			var currentdata = oModel.getProperty(path);
			if (currentdata !== undefined) {
				this._do_binding(currentdata, oView, path1);
			} else {

				// Wenn noch nicht geladen dann mit read erst laden
				var promise1 = new Promise(function (resolve, reject) {
					oModel.read(path, {
						success: function (oRetrievedResult) {
							currentdata = oRetrievedResult;
							resolve("success");
						},
						error: function (oError) {
							resolve("error");
						}
					});
				});

				promise1.then(function (result) {
					if (result === "success") {
						that._do_binding(currentdata, oView, path1);
					}
				});
			}
		},
		_do_binding: function (data, VIEW, PATH) {
			var oView = VIEW;
			//var currentdata = data;
			var path1 = PATH;

			var that = this;

			oView.bindElement({
				path: path1,

				parameters: {
					expand: "TOVORG,TOPLM,TORESU/TOBEWERTE,TORESU/TOMERKMALE"
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
		},
		_onBindingChange: function (oEvent) {
			// No data for the binding
			// if (!this.getView().getBindingContext()) {
			// TODO: Display not found detail
			//this.getOwnerComponent().getRouter().getTargets().display("notFound");
			this.byId("KidresuTableL").getBinding("items").refresh();
			this.byId("idresuTableL").getBinding("items").refresh();
		},
		onSave: function () {
			// var message = this.getView().getModel("i18n").getResourceBundle().getText("detail1-nobewert");
			// var messageD = this.getView().getModel("i18n").getResourceBundle().getText("detail1-nodocu");
			var nosave = this.getView().getModel("i18n").getResourceBundle().getText("detail2-nosave");
			var oModel = this.getView().getModel("pl");

			if (oModel.hasPendingChanges()) {
				var check_result = this.getOwnerComponent().check_all(this);

				if (check_result) {
					this.getOwnerComponent().onSave(this);
				}
				// //var check_result = this._checkbeforesavesernr();
				// var check_result = this.getOwnerComponent().checkbeforesavebewert(this);
				// if (!check_result) {
				// 	MessageToast.show(message);
				// 	return;
				// }

				// //DokuPflicht
				// var check_result2 = this.getOwnerComponent().checkbeforesavedocu(this, "L");
				// if (!check_result2) {
				// 	MessageToast.show(messageD);
				// 	return;
				// }

				// if (check_result && check_result2) {
				// 	this.getOwnerComponent().onSave(this);
				// }

			} else {
				MessageToast.show(nosave);
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
		onLineAdd: function (oItem) {
			this.getOwnerComponent().onViewAddLine(this, oItem);
		},
		onLineDel: function (oItem) {
			this.getOwnerComponent().onViewDelLine(this, oItem);
		},
		handleImage3Press: function (evt) {
			//var oSplit = new sap.m.SplitContainer(this);
			// var oSplit = evt.getSource().get
			// getBindingContext("menu");
			// oSplit.hideMaster();

			//MessageToast.show("The ImageContent is pressed.");
			this.getOwnerComponent().openInfoDialog();
		},
		handleRapidNav: function (evt) {
			var oView = this.getView();
			this.getOwnerComponent().handleRapidNav(evt, oView);
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
		handleHideMaster2: function (evt) {
			var oView = this.getView();
			this.getOwnerComponent().handleHideMaster(evt, oView);
		},
		handleDokuPress: function (evt) {
			this.getOwnerComponent().openDokuDialog(this.getView());
		},
		handleSettings: function (evt) {
			this.getOwnerComponent().openSettingsDialog(this.getView());
		},
		handleInputQualCode: function (evt) {
			this.getOwnerComponent().InputQualCode(evt, this.getView(), this.byId("InputQualCode"));
		}

	});
});
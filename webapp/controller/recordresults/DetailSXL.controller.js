sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"

], function (Controller, MessageToast) {
	"use strict";

	return Controller.extend("de.enercon.usbee.controller.recordresults.DetailSXL", {

		onInit: function () {

			this.getView().setModel(this.getOwnerComponent().getModel("GLOBAL"), "global");

			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("Merkmal_SX_Qual").attachMatched(this._onRouteMatched, this);

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
						that.getOwnerComponent().attachBrowserEventVIEW(that, "MD");
						that.getOwnerComponent().check_all2(that, "MD");
					} else {
						that.getOwnerComponent()._navBack_empty_list();
					}
				});
			});

			// this.getView().attachBrowserEvent(
			// 	"swiperight", function(oEvent) {
			// 		that.getOwnerComponent().handleMKSwipe(oEvent, that.getView(), that);
			// 	}
			// );
			// this.getView().attachBrowserEvent(
			// 	"swipeleft", function(oEvent) {
			// 		that.getOwnerComponent().handleMKSwipe(oEvent, that.getView(), that);
			// 	}
			// );
			//this.getOwnerComponent().attachBrowserEventVIEW(this, "MD");

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
			this.getOwnerComponent().handleMerkmalNav('F', oEvent, this);
		},
		onMerknrLast: function (oEvent) {
			this.getOwnerComponent().handleMerkmalNav('L', oEvent, this);
		},
		onMerknrDown: function (oEvent) {
			this.getOwnerComponent().handleMerkmalNav('D', oEvent, this);
		},
		onMerknrUp: function (oEvent) {
			this.getOwnerComponent().handleMerkmalNav('U', oEvent, this);
		},
		onFotoPress: function (oEvent) {
			this.getOwnerComponent().handleFotoUploadMK('MD', 'D', oEvent, this.getView());
		},
		onNavBack: function (oEvent) {
			this.getOwnerComponent().viewNavBack(this);
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
			var nosave = this.getView().getModel("i18n").getResourceBundle().getText("detail2-nosave");
			var oModel = this.getView().getModel("pl");

			if (oModel.hasPendingChanges()) {
				var check_result = this.getOwnerComponent().check_all(this);

				if (check_result) {
					this.getOwnerComponent().onSave(this);
				}
			} else {
				MessageToast.show(nosave);
			}
		},
		_checkbeforesavesernr: function () {
			var oTable = this.getView().byId("idresuTableL");
			var items = oTable.getItems();
			var oModel = this.getView().getModel("pl");
			var path;
			var data;
			var result = true;
			//var path = item.getSource().getParent().getParent().getBindingContextPath();
			//var currentdata = oModel.getProperty(path);

			var i;
			for (i = 0; i < items.length; i++) {
				path = items[i].getBindingContextPath();
				data = oModel.getProperty(path);
				if (data.visible === "X") {
					if (data.Serialnr === "") {
						result = false;
						break;
					}
				}
			}
			return result;
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
		handleInputQualCode: function (evt) {
			this.getOwnerComponent().InputQualCode(evt, this.getView(), this.byId("InputQualCode"));
		}

	});
});
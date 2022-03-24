sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
	//"sap/ui/model/Filter"

], function (Controller, History, JSONModel, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("de.enercon.usbee.controller.recordresults.Detail1", {

		onInit: function () {

			var oViewModel,
				oList = this.byId("vorgaengeList");

			// this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// this._oRouter.attachRouteMatched(this.view_every_time, this);
			var oRouter1 = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter1.attachRouteMatched(this._routeMatched, this);

			var oModel2 = this.getOwnerComponent().getModel("GSETTINGS");
			this.getView().setModel(oModel2, "gsettings");

			this._oList = oList;
			//this._oTableSearchState = [];
			var that = this;
			oList.attachUpdateFinished(function () {
				that._view_every_time(that._oList);
			});
			
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("prueflos").attachMatched(this._onRouteMatched1, this);

			oViewModel = new JSONModel({
				_alle: 0,
				_nichterfasst: 0,
				_teilweise: 0,
				_vollstaendig: 0
			});

			//this.setModel(oViewModel, "vorgaengeList");
			//sap.ui.getCore().setModel(oViewModel);
			// this.getView().setModel(oViewModel, "vorgaengeList");
			this.getView().setModel(oViewModel, "zahlen");

			// var typN = "N";
			// var typT = "T";
			// var typV = "V";
			// var typN = '%4E'; //N
			// var typT = '%54'; //T
			// var typV = '%56'; //V

			this._mFilters = {
				// "nichterfasst": [new sap.ui.model.Filter("StandVg", sap.ui.model.FilterOperator.EQ, typN)],
				// "teilweise": [new sap.ui.model.Filter("StandVg", sap.ui.model.FilterOperator.EQ, typT)],
				// "vollstaendig": [new sap.ui.model.Filter("StandVg", sap.ui.model.FilterOperator.EQ, typV)],
				"nichterfasst": [new sap.ui.model.Filter("StandVg", sap.ui.model.FilterOperator.EQ, 'N')],
				"teilweise": [new sap.ui.model.Filter("StandVg", sap.ui.model.FilterOperator.EQ, 'T')],
				"vollstaendig": [new sap.ui.model.Filter("StandVg", sap.ui.model.FilterOperator.EQ, 'V')],
				"alle": []
			};

		},
		onTextPress: function (oItem) {
			//this.getOwnerComponent().onViewAddLine(this, oItem);
			this.getOwnerComponent().onVorgLangtext(this, oItem);
			// onTextPress: function (oEvent) {
			// 	this.getOwnerComponent().handleTextMK(oEvent, this.getView());
			// },
		},
		onFHMPress: function (oItem) {
			this.getOwnerComponent().onVorgFHM(this.getView(), oItem);
		},
		_routeMatched: function (oEvent) {
			// Wir merken uns jede Route siehe init attachRouteMatched
			// brauchen wir für _view_every_time: Nur bei einer bestimmten Route soll
			// automatisch navigiert werden
			var oParameters = oEvent.getParameters();
			var sRouteName = oParameters.name;
			//var oModel = this.getView().getModel("applicationModel");
			var oModel = this.getOwnerComponent().getModel("GLOBAL");
			oModel.setProperty("/_route", sRouteName);
		},
		_view_every_time: function (LIST) {
			//You code here to run every time when your detail page is called.
			//var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// var route_call = oEvent.getParameter("name");
			// if (route_call === "prueflos") {
			// 	var oItems = this.getView().byId("vorgaengeList").getItems();
			// 	if (oItems.length === 1) {
			// 		this._showObject(oItems[0]);
			// 	}
			// }
			
			//var rapid_button = this.getOwnerComponent()._rapid;
			
			var oModelSettings = this.getOwnerComponent().getSettings();
			var rapid_button = oModelSettings.getProperty("/_rapid");

			if (rapid_button) {
				var oModel = this.getOwnerComponent().getModel("GLOBAL");
				var route = oModel.getProperty("/_route");
				if (route === "prueflos" || route === "go_recordresults") {
					var oItems = LIST.getItems();
					if (oItems.length === 1) {
						this._showObject(oItems[0]);
					}
				}
			}
		},
		// onAfterRendering: function () {
		// },
		_onRouteMatched_back: function (oEvent) {
			var oView = this.getView();
			var oModel = this.getOwnerComponent().getModel("pl");
			var oList = oView.byId("vorgaengeList");
			//oList.removeSelections(true);
			oList.removeAllItems();

			// var binding = oList.getBinding("items");
			// binding.aFilters = null;
			// binding.filter(binding.aFilters);
			oModel.refresh(true);
		},
		_onRouteMatched1: function (oEvent) {
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();
			//var url = "pl>/PruefloseSet('" + oArgs.orderId + "')/TOVORG";
			var that = this;

			var nav = "Prueflos='" + oArgs.pl + "'," + "Prueflos_Key_Modus='" + oArgs.pl_key_modus + "'," + "Prueflos_Key_Object='" + oArgs.pl_key_object +
				"'";

			oView.bindElement({
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
			
			this._oList.fireUpdateFinished();
			// this._view_every_time(this._oList);
		},
		_onBindingChange: function (oEvent) {
			// No data for the binding
			// if (!this.getView().getBindingContext()) {
			// 	// TODO: Display not found detail
			// 	//this.getOwnerComponent().getRouter().getTargets().display("notFound");
			// }
			var olist = this.byId("vorgaengeList");
			var oBinding = olist.getBinding("items");
			oBinding.refresh();
		},
		// onselectionChange: function (oEvent) {
		// },
		onUpdateFinished: function (oEvent) {
			var oList = oEvent.getSource(),
				oViewModel = this.getView().getModel("zahlen"),
				//mFilters = this.getView()._mFilters,
				//iTotalItems = oEvent.getParameter("total"),
				oModel = this.getView().getModel("pl");

			//var oView = this.getView();

			// var oItems = oList.getItems();
			// if (oItems.length === 1) {
			// 	this._showObject(oItems[0]);
			// }
			//vorgexist = oList.getBinding("items").isLengthFinal();
			//oEvent.getBindingContext("pl").getProperty("Prueflos"));

			var model = oList.getBindingContext("pl");

			var nav = "Prueflos='" + model.getProperty("Prueflos") + "'," + "Prueflos_Key_Modus='" + model.getProperty("Prueflos_Key_Modus") +
				"'," + "Prueflos_Key_Object='" + model.getProperty("Prueflos_Key_Object") + "'";

			//var pl = oList.getBindingContext("pl").getProperty("Prueflos");
			var modelUrl = "/PruefloseSet(" + nav + ")/TOVORG/$count";
			//pl = Number(pl);
			// pl = parseFloat(${pl});

			//oViewModel.setProperty("/_alle", iTotalItems);

			oModel.read(modelUrl, {
				success: function (oData) {
					oViewModel.setProperty("/_alle", oData);
				}
			});

			oModel.read(modelUrl, {
				success: function (oData) {
					oViewModel.setProperty("/_nichterfasst", oData);
				},
				filters: this._mFilters.nichterfasst
			});

			oModel.read(modelUrl, {
				success: function (oData) {
					oViewModel.setProperty("/_teilweise", oData);
				},
				filters: this._mFilters.teilweise
			});

			oModel.read(modelUrl, {
				success: function (oData) {
					oViewModel.setProperty("/_vollstaendig", oData);
				},
				filters: this._mFilters.vollstaendig
			});

			// var anzahl = oList.getBinding("items").length;
			// // Get the count for all the products and set the value to 'countAll' property
			// //this.getModel().read("/TOVORG/$count", {
			// //this.getView().getModel().read("/TOVORG/$count", {
			// //oModel.read("/PrueflosVorgaengeSet?$filter=Prueflos eq 'Prueflos 1'", {
			// oList.getBinding("items").read("", {
			// 	success: function (oData) {
			// 		oViewModel.setProperty("/_alle", oData);
			// 	}
			// });
			// if (iTotalItems && vorgexist) {
			// } else {
			// 	oViewModel.setProperty("/_alle", "0");
			// 	oViewModel.setProperty("/_nichterfasst", "0");
			// 	oViewModel.setProperty("/_vollstaendig", "0");
			// 	oViewModel.setProperty("/_teilweise", "0");
			// }
		},
		onQuickFilter: function (oEvent) {
			var oBinding = this._oList.getBinding("items"),
				sKey = oEvent.getParameter("selectedKey");

			oBinding.filter(this._mFilters[sKey]);
		},
		onListItemPressed: function (oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},
		_showObject: function (oItem) {
			// this.getRouter().navTo("object", {
			// 	objectId: oItem.getBindingContext().getProperty("ProductID")
			// });

			//Nur navigieren wenn nicht gesperrt ansonsten Messagetoast
			var locked = oItem.getBindingContext("pl").getProperty("StandVg");
			var pp = oItem.getBindingContext("pl").getProperty("Pruefpunkt");
			var SLWBEZ = oItem.getBindingContext("pl").getProperty("SLWBEZ");
			if (SLWBEZ !== "") {
				if (pp === '-' || pp === '') {
					var text_pp = this.getView().getModel("i18n").getResourceBundle().getText("detail1-nopp");
					MessageToast.show(text_pp);
					return;
				}
			}

			if (locked !== 'L') {
				var aTarget = ["plMaster", "plVorgang"];
				oItem.setSelected(true);
				//this.getOwnerComponent().getRouter().getTargets().display(aTarget);

				//"pattern": "prueflosvorgang/:pl:,:pl_key_modus:,:pl_key_object:,:vornr:",
				var prueflos = oItem.getBindingContext("pl").getProperty("Prueflos");
				var prueflos_key_modus = oItem.getBindingContext("pl").getProperty("Prueflos_Key_Modus");
				var prueflos_key_object = oItem.getBindingContext("pl").getProperty("Prueflos_Key_Object");
				var vornr = oItem.getBindingContext("pl").getProperty("Vornr");
				var pruefpunkt = oItem.getBindingContext("pl").getProperty("Pruefpunkt");
				var standvg = oItem.getBindingContext("pl").getProperty("StandVg");

				// console.log(prueflos);
				// console.log(prueflos_key_modus);
				// console.log(prueflos_key_object);
				// console.log(vornr);
				// console.log(standvg);

				this.getOwnerComponent().getRouter().navTo("vorgang", {
					pl: prueflos,
					pl_key_modus: prueflos_key_modus,
					pl_key_object: prueflos_key_object,
					vornr: vornr,
					pruefpunkt: pruefpunkt
				}, false);
			} else {
				var text_locked = this.getView().getModel("i18n").getResourceBundle().getText("detail1-locked");
				MessageToast.show(text_locked);
			}

		},
		onPPCreate: function (oEvent) {
			//	this.handlePPCreate(oEvent, this.getView());
			this.getOwnerComponent().handlePPCreate(oEvent, this.getView());
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf ui5-workshop.view.OrdersDetail
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf ui5-workshop.view.OrdersDetail
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf ui5-workshop.view.OrdersDetail
		 */
		//	onExit: function() {
		//
		//	}
		onSelect: function (oEvent) {
			//var ctx = this.getView().getBindingContext();
			//debugger;
		},
		onTableItemPressed: function (oEvent) {
			// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
			var oListItem = oEvent.getParameter("listItem") || oEvent.getSource();
			//this._showDetail(oListItem);
			this._showObject(oListItem);
		},
		onPPInfoZBV: function () {
			var text_zpv = this.getView().getModel("i18n").getResourceBundle().getText("pruefpunkt-zpv");
			MessageBox.information(text_zpv);
		}

	});
});
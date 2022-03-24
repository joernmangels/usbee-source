sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
	//"sap/ui/model/Filter"

], function (Controller, History, JSONModel, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("de.enercon.usbee.controller.recordresults_list.Detail1_list", {

		onInit: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("prueflos_list").attachMatched(this._onRouteMatched1, this);

			var oModel = this.getOwnerComponent().getModel("GLOBAL");
			this.getView().setModel(oModel, "glo");

			var oModel2 = this.getOwnerComponent().getModel("GSETTINGS");
			this.getView().setModel(oModel2, "gsettings");

			var oViewModel,
				oList = this.byId("vorgaengeList");

			this._oList = oList;
			var that = this;
			oList.attachUpdateFinished(function () {
				that._view_every_time(that._oList);
			});

			// oViewModel = new JSONModel({
			// 	_alle: 0,
			// 	_nichterfasst: 0,
			// 	_teilweise: 0,
			// 	_vollstaendig: 0
			// });

			//this.setModel(oViewModel, "vorgaengeList");
			//sap.ui.getCore().setModel(oViewModel);
			// this.getView().setModel(oViewModel, "vorgaengeList");
			//this.getView().setModel(oViewModel, "zahlen");

			// var typN = "N";
			// var typT = "T";
			// var typV = "V";
			// var typN = '%4E'; //N
			// var typT = '%54'; //T
			// var typV = '%56'; //V

			// this._mFilters = {
			// 	// "nichterfasst": [new sap.ui.model.Filter("StandVg", sap.ui.model.FilterOperator.EQ, typN)],
			// 	// "teilweise": [new sap.ui.model.Filter("StandVg", sap.ui.model.FilterOperator.EQ, typT)],
			// 	// "vollstaendig": [new sap.ui.model.Filter("StandVg", sap.ui.model.FilterOperator.EQ, typV)],
			// 	"nichterfasst": [new sap.ui.model.Filter("StandVg", sap.ui.model.FilterOperator.EQ, 'N')],
			// 	"teilweise": [new sap.ui.model.Filter("StandVg", sap.ui.model.FilterOperator.EQ, 'T')],
			// 	"vollstaendig": [new sap.ui.model.Filter("StandVg", sap.ui.model.FilterOperator.EQ, 'V')],
			// 	"alle": []
			// };

		},
		handleHome: function (oEvent) {
			// this._oList.removeAllItems();
			// var oModel = this.getOwnerComponent().getModel("pl");
			// oModel.refresh();
			this.getOwnerComponent().getRouter().navTo("appHome", {}, false);
		},
		_view_every_time: function (LIST) {
			this._skip_list();

			// var oModel = this.getView().getModel("pl");
			// var model = LIST.getBindingContext("pl");
			// var nav = "Prueflos='" + model.getProperty("Prueflos") + "'," + "Prueflos_Key_Modus='" + model.getProperty("Prueflos_Key_Modus") +
			// 	"'," + "Prueflos_Key_Object='" + model.getProperty("Prueflos_Key_Object") + "'";
			// var modelUrl = "/PruefloseSet(" + nav + ")/TOVORG/$count";
			// var that = this;
			// oModel.read(modelUrl, {
			// 	success: function (oData) {
			// 		if (oData === "1") {
			// 			var oItems = LIST.getItems();
			// 			that._showObject(oItems[0]);
			// 			//this.getOwnerComponent().saveViewPos("");
			// 		}
			// 	}
			// });
		},
		_skip_list: function () {
			//var rapid_button = this.getOwnerComponent()._rapid;
			var oModelSettings = this.getOwnerComponent().getSettings();
			var rapid_button = oModelSettings.getProperty("/_rapid");

			if (rapid_button) {
				var oModel = this.getOwnerComponent().getModel("GLOBAL");
				var viewpos = oModel.getProperty("/_LastViewPos");
				var viewname = viewpos.split(".")[5];
				if (viewname === "Listentry") {
					var oItems = this._oList.getItems();
					if (oItems.length === 1) {
						this._showObject(oItems[0]);
						this.getOwnerComponent().saveViewPos("");
					}
				}
			}
		},
		onAfterRendering: function () {},
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
			var that = this;

			//Wir merken uns die aktuelle Route
			//this.getOwnerComponent().saveRouting(oEvent, oView);
			//Wir merken uns den aktuellen View
			//this.getOwnerComponent().saveViewPos(oEvent, "");

			//var url = "pl>/PruefloseSet('" + oArgs.orderId + "')/TOVORG";

			var nav = "Prueflos='" + oArgs.pl + "'," + "Prueflos_Key_Modus='" + oArgs.pl_key_modus + "'," + "Prueflos_Key_Object='" + oArgs.pl_key_object +
				"'";

			//Bewwirkt, dass UpdateFineshed immer gefeuert wird
			oView.unbindObject("pl");

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

			//this._oList.fireUpdateFinished();
			//this._skip_list();
			// this._view_every_time(this._oList);

			// var oModelSettings = this.getOwnerComponent().getSettings();
			// var rapid_button = oModelSettings.getProperty("/_rapid");

			// if (rapid_button) {
			// 	var oModel = this.getView().getModel("pl");
			// 	var modelUrl = "/PruefloseSet(" + nav + ")/TOVORG/$count";
			// 	var that = this;

			// 	oModel.read(modelUrl, {
			// 		success: function (oData) {
			// 			if (oData === "1") {

			// 				var oModelRapid = new JSONModel({
			// 					_ANZ: oData
			// 				});
			// 				that.getView().setModel(oModelRapid, "ANZ");

			// 			}
			// 		}
			// 	});
			// }

		},
		_onBindingChange: function (oEvent) {
			//this._oList.fireUpdateFinished();
			// No data for the binding
			// if (!this.getView().getBindingContext()) {
			// 	//this._skip_list();
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

				oItem.setSelected(true);
				// var aTarget = ["plMaster", "plVorgang"];
				// this.getOwnerComponent().getRouter().getTargets().display(aTarget);

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

				this.getOwnerComponent().getRouter().navTo("vorgang_list", {
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
		onNavBack: function (oEvent) {
			// var sPreviousHash = History.getInstance().getPreviousHash();
			// if (sPreviousHash !== undefined) {
			// 	window.history.go(-1);
			// } else {
			// 	window.history.go(-2);
			// }
			//var oView = this.getView();

			// var oList = this.getView().byId("vorgaengeList");
			// oList.removeAllItems();
			var target;
			var oModel1 = this.getOwnerComponent().getModel("GLOBAL");
			var viewpos = oModel1.getProperty("/_LastViewPos");
			var viewname = viewpos.split(".")[5];
			if (viewname === "Barcode") {
				target = "go_barcode";
			} else {
				target = "go_recordresults_list";
			}

			// var oModel = oView.getModel("pl");
			// var path = oView.getBindingContext("pl").sPath;
			// var currentdata = oModel.getProperty(path);
			// go_recordresults_list
			this.getOwnerComponent().getRouter().navTo(target);
			// this.getOwnerComponent().getRouter().navTo("prueflos_list", {
			// 		pl: currentdata.Prueflos,
			// 		pl_key_modus: currentdata.Prueflos_Key_Modus,
			// 		pl_key_object: currentdata.Prueflos_Key_Object,
			// 	}, false);

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
		onPPCreate: function (oEvent) {
			//	this.handlePPCreate(oEvent, this.getView());
			this.getOwnerComponent().handlePPCreate_list(oEvent, this.getView());
		},
		onTableItemPressed: function (oEvent) {
			// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
			var oListItem = oEvent.getParameter("listItem") || oEvent.getSource();
			//this._showDetail(oListItem);
			this._showObject(oListItem);
		},
		handleDokuPress: function (evt) {
			this.getOwnerComponent().openDokuDialog(this.getView());
		},
		handleSettings: function (evt) {
				this.getOwnerComponent().openSettingsDialog(this.getView());
		},
		onPPInfoZBV: function () {
			var text_zpv = this.getView().getModel("i18n").getResourceBundle().getText("pruefpunkt-zpv");
			MessageBox.information(text_zpv);
		}
			// handlePPCreate: function (OEVENT, OVIEW) {
			// 	var oModel = OVIEW.getModel("pl");
			// 	var path = OVIEW.getBindingContext("pl").sPath;
			// 	var currentdata = oModel.getProperty(path);
			// 	var that = this;
			// 	var promise1 = new Promise(function (resolve, reject) {
			// 		that.getOwnerComponent()._ppDialog.open(OVIEW, currentdata, oModel, resolve, reject);
			// 	});

		// 	promise1.then(function (value) {
		// 		//var jcurrent = OVIEW.getModel("current");
		// 		//that._setImagesInCarousel(jcurrent.oData);
		// 		oModel.refresh(true);
		// 	});

		// }
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

		// onSelect: function (oEvent) {
		// 	//var ctx = this.getView().getBindingContext();
		// 	//debugger;
		// }

	});
});
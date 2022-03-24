sap.ui.define([
	"de/enercon/usbee/controller/utils/Formatter",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
	// "sap/ui/core/IntervalTrigger"

], function (Formatter, Controller, JSONModel, IntervalTrigger) {
	"use strict";

	return Controller.extend("de.enercon.usbee.controller.recordresults_list.Listentry", {

		onInit: function (evt) {
			//	debugger;
			//old
			// this._trigger = new IntervalTrigger(1 * 60 * 1000 /* 3 Minuten */ );
			// //this._trigger = new IntervalTrigger(10 * 1000 /* 10 Sekunden */ );
			// this._trigger.addListener(this.onRefreshTriggered, this);
			
			var oModel = this.getOwnerComponent().getModel("GLOBAL");
			this.getView().setModel(oModel, "glo");

          //var oLabel = this.getView().byId("oLabel");
          //var result = this.GetClock();
          //oLabel.setText(result);

			var oModelSettings = this.getOwnerComponent().getSettings();
			this.getView().setModel(oModelSettings, "GLOSET");
			
			// var barcode = this.getView().byId("bc");
			// barcode.setProvideFallback(false);

			//var oRouter = this.getOwnerComponent().getRouter();
			//oRouter.getRoute("appHome").attachMatched(this._onRouteMatched, this);
			var oModelStat = new JSONModel({
				_loaded: 0,
				_gesamt: 0,
				_prozent: 0
			});
			this.getView().setModel(oModelStat, "statistic");

			// var that = this;
			// var oModel1 = this.getOwnerComponent().getModel("pl");
			// oModel1.attachRequestCompleted(function (oEvent) {
			// 	that._update_stat(oEvent, that);
			// });
			
			
			// var that = this;
			// var oModel1 = this.getOwnerComponent().getModel("pl");
			// oModel1.attachBatchRequestCompleted(function () {
			// 	if (oModelSettings.getProperty("/_settings_read")) {
			// 		if (!oModelSettings.getProperty("/_Log_Deactive")) {

			// 			if (!oModelSettings.getProperty("/_Log_Done")) {
			// 				oModelSettings.setProperty("/_Log_Done", true);
			// 				that.getOwnerComponent()._create_user_access_log('L', oModel, oModelSettings);
			// 			}
						
			// 		}
			// 	}
			// });
			
			
			
			
			
			
		},
		_update_stat: function (oEvent, THAT) {
			var loadedsets = THAT.byId("PLLIST")._oGrowingDelegate._iRenderedDataItems + 10;
			var oModelStat = THAT.getView().getModel("statistic");
			oModelStat.setProperty("/_loaded", loadedsets);
		},
		_onRouteMatched: function (oEvent) {
			//location.reload();
			var oView = this.getView();
			var oModel = this.getOwnerComponent().getModel("pl");
			var oList = oView.byId("MasterList");
			oList.removeSelections(true);
			//oList.removeAllItems();

			var binding = oList.getBinding("items");
			binding.aFilters = null;
			binding.filter(binding.aFilters);
			oModel.refresh(true);
			oModel.resetChanges();
			// if(oModel){
			// 			oModel.setData(null);
			// 			oModel.updateBindings(true);
			// }

			var sfield = oView.byId("SearchFieldMaster");
			sfield.setValue("");

		},
		// onRefreshTriggered: function() {
		// 	this.byId("List").getBinding("items" /* or "rows" */ ).refresh();
		// },
		// handleFilter: function (oEvent) {
		// 	if (!this._oDialog) {
		// 		this._oDialog = sap.ui.xmlfragment("de.enercon.usbee.view.recordresults_list.filterdialog", this);
		// 	}
		// 	this._oDialog.open();
		// },
		onNavBack: function (oEvent) {
			this.getOwnerComponent().getRouter().navTo("appHome", {}, false);
		},
		onRefreshTriggered: function () {
			// (this.byId("List").getItems() || []).forEach(function(oItem) {
			// 	oItem.getElementBinding( "pl" ).refresh();
			// });
			//var oView = this.byId();
			// var oModel = oView.getBindingContext().getModel();
			// oModel.refresh();

			// Wenn der Reload-Button aktiviert wurde dann reload
			var al_button = this.getOwnerComponent()._autoreload;

			if (al_button) {
				var autoreload = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("autoreload");
				var oModel = this.getOwnerComponent().getModel("pl");
				if (!oModel.hasPendingChanges()) {
					oModel.refresh(true);
					sap.m.MessageToast.show(autoreload);
				}
			}
		},

		onListItemPress: function (oEvent) {
			// var oListItem1 = oEvent.getParameter("listItem") || oEvent.getSource();
			// //var oColumnListItem = oEvent.getSource();
			// console.log(oListItem1.getMetadata())
			// var oTable = oListItem1.getParent();
			// oTable.setSelectedItem(oListItem1);
			
			// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
			var oListItem = oEvent.getParameter("listItem") || oEvent.getSource();
			this._showDetail(oListItem);
		},

		_showDetail: function (oItem) {

			var StandPl = oItem.getBindingContext("pl").getProperty("StandPl");

			if (StandPl === 'L') {
				var locked_text = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("Locked.text");
			}
			if (StandPl === 'A') {
				var locked_text = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("Locked.textTL");
			}

			// Nur Navigieren wenn PL nicht gesperrt
			if (StandPl !== 'L' && StandPl !== 'A') {
				oItem.setSelected(true);

				//var aTarget = ["plMaster", "plDetail"];
				var aTarget = "plVorg_list";
				//this.getOwnerComponent().getRouter().getTargets().display(aTarget);
				console.log(oItem.getBindingContext("pl"));

				var prueflos = oItem.getBindingContext("pl").getProperty("Prueflos");
				var prueflos_key_modus = oItem.getBindingContext("pl").getProperty("Prueflos_Key_Modus");
				var prueflos_key_object = oItem.getBindingContext("pl").getProperty("Prueflos_Key_Object");

				console.log(prueflos);
				console.log(prueflos_key_modus);
				console.log(prueflos_key_object);

				//				"pattern": "prueflos/:pl:,:pl_key_modus:,:pl_key_object:",
				var oView = this.getView();
				this.getOwnerComponent().saveViewPos(oView.getViewName());

				this.getOwnerComponent().getRouter().navTo("prueflos_list", {
					pl: prueflos,
					pl_key_modus: prueflos_key_modus,
					pl_key_object: prueflos_key_object
				}, false);

			} else {
				// 	var aTarget = ["plMaster", "plLocked"];
				// 	this.getOwnerComponent().getRouter().getTargets().display(aTarget);
				// 	this.getOwnerComponent().getRouter().navTo("plLocked", {
				// 		orderId: oItem.getBindingContext("pl").getProperty("Prueflos")
				// 	}, false);
				//locked_text = locked_text + ":" + Number(oItem.getBindingContext("pl").getProperty("Prueflos"));
				//locked_text = locked_text + ":" + Number(oItem.getBindingContext("pl").getProperty("LockedByUser"));
				locked_text = locked_text + oItem.getBindingContext("pl").getProperty("LockedByUser");
				sap.m.MessageToast.show(locked_text);
			}
		},
		onBarcode: function (oEvent) {
			this.getOwnerComponent().onBarcodeEntry(oEvent, this.getView(), "PLLIST");
		},
		onBarcodeNew: function (oEvent) {
			this.getOwnerComponent().onBarcodeEntryNew(oEvent, this.getView(), "PLLIST");
		},
		handleSearch: function (evt) {
			//Are you using OData model or JSON model? If using OData model, 
			// you can't use client filtering (it should be trigered on the server)
			// One query for multiple fields
			var query = evt.getParameter("query");
			//query.replace(/_/g,"%");
			// Der Unterstrich erteugt ein ESCAPE im Suchstring
			query = query.replace(new RegExp("_", "g"), "*");

			if (query && query.length > 0) {
				var oFilter1 = new sap.ui.model.Filter("Prueflos", sap.ui.model.FilterOperator.Contains, query);
				var oFilter2 = new sap.ui.model.Filter("Ktextmat", sap.ui.model.FilterOperator.Contains, query);
				// var oFilter3 = new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.Contains, query);
				// //var oFilter4 = new sap.ui.model.Filter("Sernr", sap.ui.model.FilterOperator.Contains, query);
				var oFilter3 = new sap.ui.model.Filter("Masterstring1", sap.ui.model.FilterOperator.Contains, query);
				var oFilter4 = new sap.ui.model.Filter("Masterstring2", sap.ui.model.FilterOperator.Contains, query);
				var oFilter5 = new sap.ui.model.Filter("Masterstring4", sap.ui.model.FilterOperator.Contains, query);

				var oFilter6 = new sap.ui.model.Filter("Ebeln", sap.ui.model.FilterOperator.Contains, query);
				var oFilter7 = new sap.ui.model.Filter("Aufnr", sap.ui.model.FilterOperator.Contains, query);
				var oFilter8 = new sap.ui.model.Filter("Ls_vbeln", sap.ui.model.FilterOperator.Contains, query);
				var oFilter9 = new sap.ui.model.Filter("Art", sap.ui.model.FilterOperator.Contains, query);

				var oFilters = new sap.ui.model.Filter({
					filters: [
						oFilter1,
						oFilter2,
						oFilter3,
						oFilter4,
						oFilter5,
						oFilter6,
						oFilter7,
						oFilter8,
						oFilter9
					],
					and: false
				});
			}
			//evt.getSource().getBinding("items").filter(oFilters, sap.ui.model.FilterType.Application);
			// update list binding
			var list = this.getView().byId("PLLIST");
			var binding = list.getBinding("items");
			//this.getView().setBusy(true);
			binding.filter(oFilters);
			//this.getView().setBusy(false);

			// Single query One field
			// //create model filter
			// var filters = [];
			// var query = evt.getParameter("query");
			// if (query && query.length > 0) {
			// 	var filter1 = new sap.ui.model.Filter("Ktextmat", sap.ui.model.FilterOperator.Contains, query);
			// 	filters.push(filter1);
			// }

			// // update list binding
			// var list = this.getView().byId("List");
			// var binding = list.getBinding("items");
			// binding.filter(filters);
		},
		handleImage3Press: function (evt) {
			//var oSplit = new sap.m.SplitContainer(this);
			// var oSplit = evt.getSource().get
			// getBindingContext("menu");
			// oSplit.hideMaster();

			//MessageToast.show("The ImageContent is pressed.");
			this.getOwnerComponent().openInfoDialog();
		},
		// handleRapidNav: function (evt) {
		// 	var oView = this.getView();
		// 	this.getOwnerComponent().handleRapidNav(evt, oView);
		// },
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
		onConfirm: function (oEvent) {
			var oView = this.getView();
			var oTable = oView.byId("PLLIST");
			var mParams = oEvent.getParameters();
			var oBinding = oTable.getBinding("items");
			// apply grouping 
			// var aSorters = [];
			// if (mParams.groupItem) {
			// 	var sPath = mParams.groupItem.getKey();
			// 	var bDescending = mParams.groupDescending;
			// 	var vGroup = function (oContext) {
			// 		var name = oContext.getProperty("Address/City");
			// 		return {
			// 			key: name,
			// 			text: name
			// 		};
			// 	};
			// 	aSorters.push(new sap.ui.model.Sorter(sPath, bDescending, vGroup));
			// }
			// apply sorter 
			// var sPath = mParams.sortItem.getKey();
			// var bDescending = mParams.sortDescending;
			// aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
			// oBinding.sort(aSorters);

			// apply filters 
			// var aFilters = [];
			// for (var i = 0, l = mParams.filterItems.length; i < l; i++) {
			// 	var oItem = mParams.filterItems[i];
			// 	var aSplit = oItem.getKey().split("___");
			// 	var sPath = aSplit[0];
			// 	var vOperator = aSplit[1];
			// 	var vValue1 = aSplit[2];
			// 	var vValue2 = aSplit[3];
			// 	var oFilter = new sap.ui.model.Filter(sPath, vOperator, vValue1, vValue2);
			// 	aFilters.push(oFilter);
			// }
			//oBinding.filter(aFilters);
			// apply filters 
			var aFilters = [];
			for (var i = 0, l = mParams.filterItems.length; i < l; i++) {
				var oItem = mParams.filterItems[i];
				var aSplit = oItem.getKey().split("___");
				var sPath = aSplit[0];
				var vOperator = aSplit[1];
				var vValue1 = aSplit[2];
				var oFilter = new sap.ui.model.Filter(sPath, vOperator, vValue1);
				aFilters.push(oFilter);
			}
			//oBinding.filter(aFilters);
			oBinding.filter(aFilters);
		},
		handlePullRefresh: function (evt) {
			setTimeout(function () {
				this.byId("pullToRefresh2").hide();
				this.handleReload(evt);
			}.bind(this), 1000);
		},
		onUpdateFinished: function (oEvent) {
			//var sTitle = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("detail1-liststatus");
			var sTitle = "";
			var sTitleAV = "";
			var oTable = this.getView().byId("PLLIST");
			var items = oTable.getItems();

			//var maxlines = items[0].getBindingContext("pl").getProperty("Maxlines");
			//if (maxlines === 0) {
			//	maxlines = oEvent.getParameter("total");
			//}
			//if (oTable.getBinding("items").isLengthFinal()) {
			// var iCount = oEvent.getParameter("total"),
			// 	iItems = oTable.getItems().length;
			// sTitle += "( " + iItems + " / " + iCount + " )";
			//}

			//Statistik-Model
			var oModelStat = this.getView().getModel("statistic");

			//Geladene Sätze
			var iItems = oTable.getItems().length;
			oModelStat.setProperty("/_loaded", iItems);

			//Maximale Sätze AV
			var maxlines = oModelStat.getProperty("/_gesamt");
			//if (maxlines === 0) {
				maxlines = items[0].getBindingContext("pl").getProperty("Maxlines");
				oModelStat.setProperty("/_gesamt", maxlines);
			//}

			// PI-Text
			sTitle += "( " + iItems + " / " + maxlines + " )";
			oModelStat.setProperty("/_text", sTitle);

			//Label
			sTitleAV += "List-AV:";
			this.getView().byId("quan_lines").setText(sTitleAV);

			//PI-Proz-Value
			if (maxlines !== 0 && iItems !== 0) {
				var proz = iItems / maxlines * 100;
				oModelStat.setProperty("/_prozent", proz);
			}

		},
		handleDokuPress: function (evt) {
			this.getOwnerComponent().openDokuDialog(this.getView());
		},
		handleSettings: function (evt) {
			this.getOwnerComponent().openSettingsDialog(this.getView());
		},
		handleHome: function (oEvent) {
			this.getOwnerComponent().getRouter().navTo("appHome", {}, false);
		},
		onSearchInfo: function (oEvent) {
			// create popover
			if (!this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("de.enercon.usbee.view.searchinfo", this);
				this.getView().addDependent(this._oPopover);
				//this._oPopover.bindElement("/ProductCollection/0");
			}

			this._oPopover.openBy(oEvent.getSource());
		},
		onNavToSearchInfo: function (oEvent) {
			var oCtx = oEvent.getSource().getBindingContext();
			//var oNavCon = sap.ui.core.Fragment.byId("de.enercon.usbee.view.searchinfo", "navCon");
			//var oNavCon = sap.ui.core.Fragment.byId("SEA", "navCon");
			//oEvent.getSource().getParent().getParent().getParent().getParent();
			//var oDetailPage = sap.ui.core.Fragment.byId("searchinfo", "detail");
			//var oNavCon = this._oPopover.byId("navCon");
			var oNavCons = this._oPopover.getContent();
			var oNavCon = oNavCons[0];
			//var pages = oNavCon.getPages();
			var oDetailPage = oNavCon.getPage("search");
			//var oDetailPage = pagesthis._oPopover.byId("detail1");
			oNavCon.to(oDetailPage);
			// 	oDetailPage.bindElement(oCtx.getPath());
		},
		onNavToBarcodeInfo: function (oEvent) {
			var oNavCons = this._oPopover.getContent();
			var oNavCon = oNavCons[0];
			var oDetailPage = oNavCon.getPage("barcode");
			oNavCon.to(oDetailPage);
		},
		onNavBackSearch: function (oEvent) {
			// 	var oNavCon = Fragment.byId("popoverNavCon", "navCon");
			var oNavCons = this._oPopover.getContent();
			var oNavCon = oNavCons[0];
			oNavCon.back();
		}

	});

});
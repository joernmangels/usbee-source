sap.ui.define([
	"de/enercon/usbee/controller/utils/Formatter",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/IntervalTrigger"

], function (Formatter, Controller, JSONModel, IntervalTrigger) {
	"use strict";

	return Controller.extend("de.enercon.usbee.controller.recordresults.Master", {

		onInit: function (evt) {
			//	debugger;
			this._trigger = new IntervalTrigger(1 * 60 * 1000 /* 3 Minuten */ );
			//this._trigger = new IntervalTrigger(10 * 1000 /* 10 Sekunden */ );
			this._trigger.addListener(this.onRefreshTriggered, this);

			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("appHome").attachMatched(this._onRouteMatched, this);
			
			var oModelSettings = this.getOwnerComponent().getSettings();
			this.getView().setModel(oModelSettings, "GLOSET");
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

				var aTarget = ["plMaster", "plDetail"];
				//this.getOwnerComponent().getRouter().getTargets().display(aTarget);
				console.log(oItem.getBindingContext("pl"));

				var prueflos = oItem.getBindingContext("pl").getProperty("Prueflos");
				var prueflos_key_modus = oItem.getBindingContext("pl").getProperty("Prueflos_Key_Modus");
				var prueflos_key_object = oItem.getBindingContext("pl").getProperty("Prueflos_Key_Object");

				console.log(prueflos);
				console.log(prueflos_key_modus);
				console.log(prueflos_key_object);

				//				"pattern": "prueflos/:pl:,:pl_key_modus:,:pl_key_object:",

				this.getOwnerComponent().getRouter().navTo("prueflos", {
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

		handleSearch: function (evt) {
			//Are you using OData model or JSON model? If using OData model, 
			// you can't use client filtering (it should be trigered on the server)
			// One query for multiple fields
			var query = evt.getParameter("query");
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
			var list = this.getView().byId("MasterList");
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
		onBarcode: function (oEvent) {
			this.getOwnerComponent().onBarcodeEntry(oEvent, this.getView(), "MasterList");
		},
		onBarcodeNew: function (oEvent) {
			this.getOwnerComponent().onBarcodeEntryNew(oEvent, this.getView(), "MasterList");
		},
		handlePullRefresh: function (evt) {
			setTimeout(function () {
				this.byId("pullToRefresh1").hide();
				// this.handleReload(evt);
				this.getOwnerComponent().handleReload(evt, this.getView());
			}.bind(this), 1000);
		}


	});

});
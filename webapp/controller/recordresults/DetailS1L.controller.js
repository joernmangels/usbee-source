sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"

], function (Controller, MessageToast) {
	"use strict";

	return Controller.extend("de.enercon.usbee.controller.recordresults.DetailS1L", {

		onInit: function () {

			this.getView().setModel(this.getOwnerComponent().getModel("GLOBAL"), "global");

			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("Merkmal_S1_Qual").attachMatched(this._onRouteMatched, this);

			//Neue Syntax
			//var oTable = this.getView().byId("idresuTableL");
			// oTable.attachUpdateFinished(function () {
			// 	new Promise(resolve => {
			// 		setTimeout(() => {
			// 			resolve('resolved');
			// 		}, 1000);
			// 	}).then(function() {
			// 		this.getOwnerComponent()._scrollEndList(oTable);
			// 	}.bind(this));
			// }.bind(this));
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

			//this.getOwnerComponent().attachBrowserEventVIEW(this, "MD");

			// var oHeader = this.byId("oh1");
			// oHeader.attachBrowserEvent(
			// 	"swiperight", function(oEvent) {
			// 		//that.getOwnerComponent().handleMKSwipe(oEvent, that.getView(), that);
			// 		that.getOwnerComponent().handleMerkmalNav('U', oEvent, that);
			// 	}
			// );
			// oHeader.attachBrowserEvent(
			// 	"swipeleft", function(oEvent) {
			// 		//that.getOwnerComponent().handleMKSwipe(oEvent, that.getView(), that);
			// 		that.getOwnerComponent().handleMerkmalNav('D', oEvent, that);
			// 	}
			// );
			// this.getView().attachBrowserEvent(
			// 	"swiperight", function(oEvent) {
			// 		//that.getOwnerComponent().handleMKSwipe(oEvent, that.getView(), that);
			// 		that.getOwnerComponent().handleMerkmalNav('U', oEvent, that);
			// 	}
			// );
			// this.getView().attachBrowserEvent(
			// 	"swipeleft", function(oEvent) {
			// 		//that.getOwnerComponent().handleMKSwipe(oEvent, that.getView(), that);
			// 		that.getOwnerComponent().handleMerkmalNav('D', oEvent, that);
			// 	}
			// );

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
		onLineCopy: function (oItem) {
			//var oTable = this.byId("idresuTableL");
			//var oTable = this.getView().byId("idresuTableL");

			// Das hier ermittelt den Index der gedrückten Zeile
			// var context = oTable.getBinding("items").getContexts();
			// var line = oItem.getParameter("id");
			// var fields = line.split('-');
			// var index = fields["7"];
			//var binding = oTable.getBinding("items");

			// Model besorgen 
			var oModel = this.getView().getModel("pl");
			// Der Parent des Buttons ist die Box dessen Parent ist die Zeile und die enhält den Binding path
			var path = oItem.getSource().getParent().getParent().getBindingContextPath();
			// Daten der Zeile
			var currentdata = oModel.getProperty(path);
			var lfdnr = parseInt(currentdata.Lfdnr, 4) + 1;
			var Lfdnr = ("0000" + lfdnr).slice(-4);

			var path2 = oModel.createKey("PruefErgebnisseSet", {
				Prueflos: currentdata.Prueflos,
				Prueflos_Key_Modus: currentdata.Prueflos_Key_Modus,
				Prueflos_Key_Object: currentdata.Prueflos_Key_Object,
				Vornr: currentdata.Vornr,
				Pruefpunkt: currentdata.Pruefpunkt,
				Merknr: currentdata.Merknr,
				Lfdnr: Lfdnr
			});

			oModel.setProperty("/" + path2 + "/visible", 'X');
			//getParent().getBindingContext().getProperty("Prueflos")

			// + 1 =  where we want to add the row
			//var index = oItem.getSource().getParent().getIndex() + 1;

			// var newData = new Array();
			// // for (var i=0; i<currentdata.length; i++){
			////     	if (i===index){
			////                 //add an empty line
			//                 newData.push(currentdata);
			//       //}else{
			//       //          newData.push(currentdata);
			//       //}
			// oModel.setData(newData);  
			// oTable.setModel(oModel);

			//var path2 =
			//	"/PruefErgebnisseSet(Prueflos='000002857513',Prueflos_Key_Modus='S1',Prueflos_Key_Object='AB330137593',Vornr='0010',Merknr='0010',Lfdnr='0003')";
			// oModel.setProperty(path2, {visible: 'X'});

			//oModel.setProperty(path2 + "/visible", 'X');

			//var oContext = oModel.createEntry(path2, { groupId: "createEntry", properties: { Prueflos:currentdata.Prueflos, Prueflos_Key_Modus:currentdata.Prueflos_Key_Modus} });
			//var oContext = oModel.createEntry(path2, currentdata);
			//oTable.setModel(oModel);
			//oModel.setProperty(path2, data);
			//Table.bindRows(path2);
			//debugger;

		},
		onLineDele: function (oItem) {
			// Model besorgen 
			var oModel = this.getView().getModel("pl");
			// Der Parent des Buttons ist die Box dessen Parent ist die Zeile und die enhält den Binding path
			var path = oItem.getSource().getParent().getParent().getBindingContextPath();
			// Daten der Zeile
			var currentdata = oModel.getProperty(path);

			oModel.setProperty(path + "/visible", ' ');
			//getParent().getBindingContext().getProperty("Prueflos")

			// + 1 =  where we want to add the row
			//var index = oItem.getSource().getParent().getIndex() + 1;

			// var newData = new Array();
			// // for (var i=0; i<currentdata.length; i++){
			////     	if (i===index){
			////                 //add an empty line
			//                 newData.push(currentdata);
			//       //}else{
			//       //          newData.push(currentdata);
			//       //}
			// oModel.setData(newData);  
			// oTable.setModel(oModel);

			//var path2 =
			//	"/PruefErgebnisseSet(Prueflos='000002857513',Prueflos_Key_Modus='S1',Prueflos_Key_Object='AB330137593',Vornr='0010',Merknr='0010',Lfdnr='0003')";
			// oModel.setProperty(path2, {visible: 'X'});

			//oModel.setProperty(path2 + "/visible", 'X');

			//var oContext = oModel.createEntry(path2, { groupId: "createEntry", properties: { Prueflos:currentdata.Prueflos, Prueflos_Key_Modus:currentdata.Prueflos_Key_Modus} });
			//var oContext = oModel.createEntry(path2, currentdata);
			//oTable.setModel(oModel);
			//oModel.setProperty(path2, data);
			//Table.bindRows(path2);
			//debugger;

		},
		handleInputQualCode: function (evt) {
			this.getOwnerComponent().InputQualCode(evt, this.getView(), this.byId("InputQualCode"));
		}

	});
});
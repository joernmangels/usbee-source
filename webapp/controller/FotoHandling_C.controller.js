sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/core/routing/History",
	"de/enercon/usbee/controller/FotoFunctions"

], function (Controller, JSONModel, MessageBox, MessageToast, History, FotoFunctions) {
	"use strict";

	return Controller.extend("de.enercon.usbee.controller.FotoHandling_C", {

		onInit: function () {

			var oModelSettings = this.getOwnerComponent().getSettings();
			this.getView().setModel(oModelSettings, "gsettings");

			var oRouter = this.getOwnerComponent().getRouter();
			//Carousell View
			oRouter.getRoute("Merkmal_Fotos_list_C").attachMatched(this._onRouteMatched_C, this);
			FotoFunctions.onInitCaroussel(this);

		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf ui5-workshop.view.ordersDetailInit
		 */
		onBeforeRendering: function () {},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf ui5-workshop.view.ordersDetailInit
		 */
		onAfterRendering: function () {},
		onNavBack: function (oEvent) {
			FotoFunctions.onNavBack(oEvent, this);
		},
		_onRouteMatched_C: function (oEvent) {
			FotoFunctions.onRouteMatched_C(oEvent, this);
			// var oArgs, oView;
			// oArgs = oEvent.getParameter("arguments");
			// oView = this.getView();

			// var jcurrent = new sap.ui.model.json.JSONModel();
			// jcurrent.setData(oArgs);
			// oView.setModel(jcurrent, "current");

			// this.setImagesInCarousel(oArgs);
			// FotoFunctions.prepareUpload(oArgs, this);

			// var path1 = "pl>/PruefMerkmaleSet(Prueflos='" + oArgs.pl + "',Prueflos_Key_Modus='" + oArgs.pl_key_modus +
			// 	"',Prueflos_Key_Object='" + oArgs.pl_key_object + "',Vornr='" + oArgs.vornr + "',Pruefpunkt='" + oArgs.pruefpunkt + "',Merknr='" +
			// 	oArgs.merknr + "')";

			// oView.bindElement({
			// 	path: path1,

			// 	parameters: {
			// 		expand: "TOFOTO"
			// 	},
			// 	events: {
			// 		//change: THIS._onBindingChange.bind(this),
			// 		dataRequested: function (oEvent) {
			// 			oView.setBusy(true);
			// 		},
			// 		dataReceived: function (oEvent) {
			// 				oView.setBusy(false);
			// 			}
			// 			//dataReceived: this._setImagesInCarousel(oArgs).bind(this)
			// 	}
			// });

			// var oModelSettings = THIS.getOwnerComponent().getSettings();
			// oView.setModel(oModelSettings, "gsettings");

			//oView._setImagesInCarousel();
			// register for metadata loaded events
			//var oModel = this.getModel();
			//oModel.metadataLoaded().then(this._onMetadataLoaded.bind(this));
		},
		// onBeforeRendering: function () {
		// 	this._setImagesInCarousel();
		// },
		_onBindingChange: function (oEvent) {
			// No data for the binding
			// if (!this.getView().getBindingContext()) {
			// TODO: Display not found detail
			// this.getOwnerComponent().getRouter().getTargets().display("notFound");
		},
		onSliderMoved: function (oEvent) {
			FotoFunctions.onSliderMoved(oEvent, this);
		},
		onFotoPress: function (oEvent) {
			FotoFunctions.onFotoPress(oEvent, this);
		},
		onFotoDelete: function (oEvent) {
			FotoFunctions.onFotoDelete(oEvent, this);
		},
		handleUplChange: function (oEvent) {
			FotoFunctions.handleUplChange(oEvent, this);
		},
		handleUplComplete: function (oEvent) {
			FotoFunctions.handleUplComplete(oEvent, this);
		},
		setImagesInCarousel: function (para) {
			// if (!numberOfImages || numberOfImages < 1 || numberOfImages > 9) {
			// 	return;
			// }
			// var oviewdispmodel = this.getView().getModel("viewdisp");
			// var uploadchange = oviewdispmodel.getProperty("/_uploadchange");
			// if (uploadchange) {
			// 	oviewdispmodel.setProperty("/_uploadchange", false);
			// 	return;
			// }

			var strs;
			var picpfad;
			var oView = this.getView();
			var oCarousel = this.byId("carouselMK");
			oCarousel.setBusy(true);
			oCarousel.destroyPages();
			//oCarousel.removeAllPages();

			var oModel = oView.getModel("pl");
			var oviewdispmodel = oView.getModel("viewdisp");

			//var fotos = oModel.read("/PruefMerkmaleSet(Prueflos='000002866086',Prueflos_Key_Modus='S1',Prueflos_Key_Object='TJM3_20180918',Vornr='0010',Merknr='0010')/TOFOTO");
			//oModel.getObject("/PruefMerkmaleSet(Prueflos='000002866086',Prueflos_Key_Modus='S1',Prueflos_Key_Object='TJM3_20180918',Vornr='0010',Merknr='0010')");

			var path = "/PruefMerkmaleSet(Prueflos='" + para.pl + "',Prueflos_Key_Modus='" + para.pl_key_modus +
				"',Prueflos_Key_Object='" + para.pl_key_object + "',Vornr='" + para.vornr + "',Pruefpunkt='" + para.pruefpunkt + "',Merknr='" +
				para.merknr + "')/TOFOTO";

			oModel.read(path, {
				success: function (oData) {
					var num = oData.results.length;
					//var num = oData;
					oviewdispmodel.setProperty("/_numpics", num);

					for (var i = 0; i < num; i++) {
						var imgId = "img" + (i + 1);
						//var imgSrc = oData.results[i].__metadata.media_src;
						//var imgSrc = "/sap/opu/odata/WIND/QM_RESULTS_SRV/PruefMerkmaleFotosSet(Prueflos='000002866086',Prueflos_Key_Modus='S1',Prueflos_Key_Object='TJM3_20180918',Vornr='0010',Merknr='0010',Filename='IMG_5833.jpg')/$value";
						strs = oData.results[i].__metadata.media_src.split("/sap");
						picpfad = "/sap" + strs[1];
						var imgSrc = picpfad;
						var imgAlt = oData.results[i].Filename;
						// var img = new sap.m.Image(imgId, {
						var img = new sap.m.Image({
							src: imgSrc,
							alt: imgAlt,
							densityAware: false,
							decorative: false
						});

						oCarousel.addPage(img);
						oCarousel.setActivePage(img);
					}
				}

			});

			oCarousel.setBusy(false);

		}

	});

});
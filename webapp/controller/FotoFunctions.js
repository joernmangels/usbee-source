sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/core/routing/History"

], function (JSONModel, MessageBox, MessageToast, History) {
	"use strict";

	return {
		onInitCaroussel: function (THIS) {
			// DIese Funktion bei jedem Start des Views ausführen
			// var target = oRouter.getTarget("plMerkmal_Fotos");
			// target.attachDisplay(this._setImagesInCarousel, this);

			// set the possible screen sizes
			var oCarouselContainer = {
				screenSizes: [
					"350px",
					"420px",
					"555px",
					"743px",
					"908px"
				]
			};
			var oScreenSizesModel = new JSONModel(oCarouselContainer);
			THIS.getView().setModel(oScreenSizesModel, "ScreenSizesModel");

			var oModelView = new JSONModel({
				_numpics: 0,
				_uploadurl: "",
				_xcsrftoken: ""
			});
			THIS.getView().setModel(oModelView, "viewdisp");

		},
		onInitLightBox: function (THIS) {

			var oModelView = new JSONModel({
				_numpics: 0,
				_uploadurl: "",
				_xcsrftoken: ""
			});
			THIS.getView().setModel(oModelView, "viewdisp");

			var oModelPics = new JSONModel({
				pictures: [{
					_imgId: "",
					_imgSrc: "",
					_imgSrcb: "",
					_imgAlt: ""
				}]
			});
			THIS.getView().setModel(oModelPics, "viewpics");

			// var oModeltest = new JSONModel(
			// {
			// 	companies : [
			// 		{
			// 			name : "Acme Inc.",
			// 			city: "Belmont",
			// 			state: "NH",
			// 			county: "Belknap",
			// 			revenue : "123214125.34"  
			// 		},{
			// 			name : "Beam Hdg.",
			// 			city: "Hancock",
			// 			state: "NH",
			// 			county: "Belknap",
			// 			revenue : "3235235235.23"  
			// 		},{
			// 			name : "Carot Ltd.",
			// 			city: "Cheshire",
			// 			state: "NH",
			// 			county: "Sullivan",
			// 			revenue : "Not Disclosed"  
			// 		}]
			// });
			// var oModeltest = new JSONModel(

			// 	{
			// 		name: "Acme Inc.",
			// 		city: "Belmont",
			// 		state: "NH",
			// 		county: "Belknap",
			// 		revenue: "123214125.34"
			// 	}, {
			// 		name: "Beam Hdg.",
			// 		city: "Hancock",
			// 		state: "NH",
			// 		county: "Belknap",
			// 		revenue: "3235235235.23"
			// 	}, {
			// 		name: "Carot Ltd.",
			// 		city: "Cheshire",
			// 		state: "NH",
			// 		county: "Sullivan",
			// 		revenue: "Not Disclosed"
			// 	}
			// );
			// THIS.getView().setModel(oModeltest, "TEST");

		},
		onNavBack: function (oEvent, THIS) {
			// //this.getOwnerComponent().viewNavBack(this);
			// var aTarget;
			// var nav;
			// var oModel = this.getView().getModel("pl");
			// var path = this.getView().getBindingContext("pl").sPath;
			// var currentdata = oModel.getProperty(path);

			// aTarget = ["plMaster", "plVorgang"];
			// // this.getRouter().getTargets().display(aTarget);

			// // this.getRouter().navTo("vorgang", {
			// // 		pl: currentdata.Prueflos,
			// // 		pl_key_modus: currentdata.Prueflos_Key_Modus,
			// // 		pl_key_object: currentdata.Prueflos_Key_Object,
			// // 		vornr: currentdata.Vornr
			// // }, false);	

			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				window.history.go(-2);
			}
		},
		onRouteMatched_L: function (oEvent, THIS) {
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			oView = THIS.getView();

			var jcurrent = new sap.ui.model.json.JSONModel();
			jcurrent.setData(oArgs);
			oView.setModel(jcurrent, "current");

			this.setImagesInList(oArgs, THIS);
			this.prepareUpload(oArgs, THIS);

			var path1 = "pl>/PruefMerkmaleSet(Prueflos='" + oArgs.pl + "',Prueflos_Key_Modus='" + oArgs.pl_key_modus +
				"',Prueflos_Key_Object='" + oArgs.pl_key_object + "',Vornr='" + oArgs.vornr + "',Pruefpunkt='" + oArgs.pruefpunkt + "',Merknr='" +
				oArgs.merknr + "')";

			oView.bindElement({
				path: path1,

				// parameters: {
				// 	expand: "TOFOTO"
				// },
				events: {
					//change: THIS._onBindingChange.bind(this),
					dataRequested: function (oEvent) {
						oView.setBusy(true);
					},
					dataReceived: function (oEvent) {
							oView.setBusy(false);
						}
						//dataReceived: this._setImagesInCarousel(oArgs).bind(this)
				}
			});

			// var oModelSettings = THIS.getOwnerComponent().getSettings();
			// oView.setModel(oModelSettings, "gsettings");

		},
		onRouteMatched_C: function (oEvent, THIS) {
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			oView = THIS.getView();

			var jcurrent = new sap.ui.model.json.JSONModel();
			jcurrent.setData(oArgs);
			oView.setModel(jcurrent, "current");

			this.setImagesInCarousel(oArgs, THIS);
			this.prepareUpload(oArgs, THIS);

			var path1 = "pl>/PruefMerkmaleSet(Prueflos='" + oArgs.pl + "',Prueflos_Key_Modus='" + oArgs.pl_key_modus +
				"',Prueflos_Key_Object='" + oArgs.pl_key_object + "',Vornr='" + oArgs.vornr + "',Pruefpunkt='" + oArgs.pruefpunkt + "',Merknr='" +
				oArgs.merknr + "')";

			oView.bindElement({
				path: path1,

				parameters: {
					expand: "TOFOTO"
				},
				events: {
					change: THIS._onBindingChange.bind(this),
					dataRequested: function (oEvent) {
						oView.setBusy(true);
					},
					dataReceived: function (oEvent) {
							oView.setBusy(false);
						}
						//dataReceived: this._setImagesInCarousel(oArgs).bind(this)
				}
			});

			// var oModelSettings = THIS.getOwnerComponent().getSettings();
			// oView.setModel(oModelSettings, "gsettings");

			//oView._setImagesInCarousel();
			// register for metadata loaded events
			//var oModel = this.getModel();
			//oModel.metadataLoaded().then(this._onMetadataLoaded.bind(this));

		},
		setImagesInCarousel: function (para, THIS) {
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
			var oView = THIS.getView();
			var oCarousel = THIS.byId("carouselMK");
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

		},
		setImagesInList: function (para, THIS) {

			var strs;
			var picpfad;
			var oView = THIS.getView();

			var oList = THIS.byId("PICLIST");
			//oList.setBusy(true);
			//oList.removeAllItems();
			// var oBinding = oList.getBinding("items");
			// oBinding.refresh();

			var oModel = oView.getModel("pl");
			var oviewdispmodel = oView.getModel("viewdisp");

			var oviewpicsmodel = oView.getModel("viewpics");
			oviewpicsmodel.setProperty("/pictures", []);
			var itemData = oviewpicsmodel.getProperty("/pictures");
			// oviewpicsmodel.setData({
			// 				pictures: []
			// });
			//oviewpicsmodel.setData(null);

			var path = "/PruefMerkmaleSet(Prueflos='" + para.pl + "',Prueflos_Key_Modus='" + para.pl_key_modus +
				"',Prueflos_Key_Object='" + para.pl_key_object + "',Vornr='" + para.vornr + "',Pruefpunkt='" + para.pruefpunkt + "',Merknr='" +
				para.merknr + "')/TOFOTO";

			oModel.read(path, {
				success: function (oData) {
					var num = oData.results.length;
					//var num = oData;
					oviewdispmodel.setProperty("/_numpics", num);

					//var oEntry = {};
					for (var i = 0; i < num; i++) {

						var imgId = "img" + (i + 1);
						strs = oData.results[i].__metadata.media_src.split("/sap");
						picpfad = "/sap" + strs[1];
						var imgSrc = picpfad;
						var imgAlt = oData.results[i].Filename;
						//var imgSrcb = oData.results[i].__metadata.uri;
						// var img = new sap.m.Image(imgId, {
						//  var img = new sap.m.Image({
						//  	src: imgSrc,
						//  	alt: imgAlt,
						//  	densityAware: false,
						//  	decorative: false
						// });
						// oCarousel.addPage(img);
						// oCarousel.setActivePage(img);
						//oEntry.imgSrc = imgSrc;
						//oEntry.imgAlt = imgAlt;
						// oviewpicsmodel.setData(oEntry);
						//var pics = new sap.ui.model.json.JSONModel();
						//pics.setData(oEntry, true);
						//oviewpicsmodel.createEntry(oEntry);
						// var pics = new sap.ui.model.json.JSONModel({
						// 				imgSrc: imgSrc,
						// 				imgAlt: imgAlt
						// });
						var pics = {
							_imgId: imgId,
							_imgSrc: imgSrc,
							_imgSrcb: imgSrc,
							_imgAlt: imgAlt
						};
						itemData.push(pics);
						//oviewpicsmodel.setData(pics, true);
						oviewpicsmodel.setData({
							pictures: itemData
						});

					}
					//oList.bindElement(oviewpicsmodel);
					//oList.bindElement("/");
				}

			});
			//oviewpicsmodel.refresh();
			oList.setBusy(false);
		},
		onSliderMoved: function (oEvent, THIS) {
			//var origingalHeight = 650;
			var origingalHeight = 1000;

			var screenSizesJSON = THIS.getView().getModel("ScreenSizesModel").getData();
			var iValue = oEvent.getParameter("value");
			var screenWidth = screenSizesJSON.screenSizes[Number(iValue) - 1];
			var oCarouselContainer = THIS.byId("carouselContainer");
			oCarouselContainer.setWidth(screenWidth);
			var screenHeight = origingalHeight * parseFloat(screenWidth) / 1000;
			oCarouselContainer.setHeight(screenHeight + 'px');
		},
		onFotoPress: function (ART, oEvent, THIS) {
			//Mit Dialog

			// //this.getOwnerComponent().handleFotoUploadFT(oEvent, this.getView());
			// this.handleFotoUploadFT(oEvent, this.getView());
			// // var jcurrent = this.getView().getModel("current");
			// // this._setImagesInCarousel(jcurrent.oData);
			// var that = this;

			// var promise1 = new Promise(function (resolve, reject) {
			// 	that.handleFotoUploadFT(oEvent, that.getView());
			// 	//resolve("reload");
			// });

			// promise1.then(function (value) {
			// 	var jcurrent = that.getView().getModel("current");
			// 	that._setImagesInCarousel(jcurrent.oData);
			// });
			//console.log(promise1);
			this.handleFotoUploadFT(ART, oEvent, THIS.getView(), THIS);
		},
		handleFotoUploadFT: function (ART, OEVENT, OVIEW, THIS) {
			var oModel = OVIEW.getModel("pl");

			//var oButton = OEVENT.getSource();
			// Der Parent des Buttons ist die Box dessen Parent ist die Zeile und die enhält den Binding path
			var path = OVIEW.getBindingContext("pl").sPath;
			// Daten der Zeile
			var currentdata = oModel.getProperty(path);

			var that1 = THIS;
			var that2 = this;
			var promise1 = new Promise(function (resolve, reject) {
				that1.getOwnerComponent()._fotoDialog.open(OVIEW, currentdata, resolve, reject);
			});

			promise1.then(function (value) {
				var jcurrent = OVIEW.getModel("current");
				if (ART === 'C') {
					that2.setImagesInCarousel(jcurrent.getData(), THIS);
				}
				if (ART === 'L') {
					that2.setImagesInList(jcurrent.getData(), THIS);
				}
				oModel.refresh(true);
			});

			// var that = OVIEW;
			// this.getOwnerComponent()._fotoDialog.open(OVIEW, currentdata).then(function (value) {
			//  	var jcurrent = that.getModel("current");
			//  	that._setImagesInCarousel(jcurrent.oData);
			//  });
		},
		onFotoDelete_L: function (oEvent, THIS) {
			var _c_this = this;
			var oView = THIS.getView();
			var oModel = oView.getModel("pl");

			var title = oView.getModel("i18n").getResourceBundle().getText("foto-del");
			var message = oView.getModel("i18n").getResourceBundle().getText("foto-confirmdel");
			var error = oView.getModel("i18n").getResourceBundle().getText("foto-uplerrord");
			var success = oView.getModel("i18n").getResourceBundle().getText("foto-succerrord");

			// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
			var oItem = oEvent.getParameter("listItem") || oEvent.getSource();

			var jcurrent = {};
			jcurrent.pl = oItem.getBindingContext("pl").getProperty("Prueflos");
			jcurrent.pl_key_modus = oItem.getBindingContext("pl").getProperty("Prueflos_Key_Modus");
			jcurrent.pl_key_object = oItem.getBindingContext("pl").getProperty("Prueflos_Key_Object");
			jcurrent.vornr = oItem.getBindingContext("pl").getProperty("Vornr");
			jcurrent.pruefpunkt = oItem.getBindingContext("pl").getProperty("Pruefpunkt");
			jcurrent.merknr = oItem.getBindingContext("pl").getProperty("Merknr");
			jcurrent.filename = oItem.getBindingContext("viewpics").getProperty("_imgAlt");
			// var prueflos = oItem.getBindingContext("pl").getProperty("Prueflos");
			// var prueflos_key_modus = oItem.getBindingContext("pl").getProperty("Prueflos_Key_Modus");
			// var prueflos_key_object = oItem.getBindingContext("pl").getProperty("Prueflos_Key_Object");
			// var vornr = oItem.getBindingContext("pl").getProperty("Vornr");
			// var pruefpunkt = oItem.getBindingContext("pl").getProperty("Pruefpunkt");
			// var merknr = oItem.getBindingContext("pl").getProperty("Merknr");
			// var filename = oItem.getBindingContext("viewpics").getProperty("_imgAlt");

			var headerparas = oView.getModel("pl").getHeaders();
			var token = headerparas["x-csrf-token"];

            message = message + " " + jcurrent.filename;

			MessageBox.confirm(
				message, {
					icon: sap.m.MessageBox.Icon.QUESTION,
					title: title,
					actions: [sap.m.MessageBox.Action.YES,
						sap.m.MessageBox.Action.NO
					],
					onClose: function (oAction) {
						if (oAction === sap.m.MessageBox.Action.YES) {

							var path = "/PruefMerkmaleFotosSet(Prueflos='" + jcurrent.pl + "',Prueflos_Key_Modus='" + jcurrent.pl_key_modus +
								"',Prueflos_Key_Object='" + jcurrent.pl_key_object + "',Vornr='" + jcurrent.vornr + "',Pruefpunkt='" +
								jcurrent.pruefpunkt + "',Merknr='" + jcurrent.merknr + "',Filename='" + jcurrent.filename + "')";

							oModel.remove(path, {
								method: "DELETE",
								headers: {
									"X-Requested-With": "XMLHttpRequest",
									"Content-Type": "application/atom+xml",
									"DataServiceVersion": "2.0",
									"X-CSRF-Token": token
								},

								success: function (oData) {
									_c_this.setImagesInList(jcurrent, THIS);
									MessageToast.show(success);
									oModel.refresh(true);
								},
								error: function (e) {
									MessageToast.show(error);
								}
							});

						}
					}
				});

		},

		onFotoDelete_C: function (oEvent, THIS) {
			var _c_this = this;
			var oView = THIS.getView();
			var title = oView.getModel("i18n").getResourceBundle().getText("foto-del");
			var message = oView.getModel("i18n").getResourceBundle().getText("foto-confirmdel");
			var error = oView.getModel("i18n").getResourceBundle().getText("foto-uplerrord");
			var success = oView.getModel("i18n").getResourceBundle().getText("foto-succerrord");
			//this.getOwnerComponent().handleFotoDeleteFT(oEvent,this.getView());

			var oModel = oView.getModel("pl");
			//var oButton = OEVENT.getSource();
			// Der Parent des Buttons ist die Box dessen Parent ist die Zeile und die enhält den Binding path
			// var path = oView.getBindingContext("pl").sPath;
			// var currentdata = oModel.getProperty(path);
			var jcurrent = oView.getModel("current");

			var oCarousel = oView.byId("carouselMK");
			var active = oCarousel.getActivePage();
			var pages = oCarousel.getPages();

			var headerparas = oView.getModel("pl").getHeaders();
			var token = headerparas["x-csrf-token"];

			// var path =
			// 	"/PruefMerkmaleFotosSet(Prueflos='000002866086',Prueflos_Key_Modus='S1',Prueflos_Key_Object='TJM3_20180918',Vornr='0010',Merknr='0010',Filename='DEEUU.jpg')";

			for (var i = 0; i < pages.length; i++) {
				var id = pages[i].sId;
				if (id === active) {
					var src = pages[i].getProperty("src");
					message = message + " " + pages[i].getProperty("alt");
					var filename = pages[i].getProperty("alt");

					MessageBox.confirm(
						message, {
							icon: sap.m.MessageBox.Icon.QUESTION,
							title: title,
							actions: [sap.m.MessageBox.Action.YES,
								sap.m.MessageBox.Action.NO
							],
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.YES) {

									var path = "/PruefMerkmaleFotosSet(Prueflos='" + jcurrent.oData.pl + "',Prueflos_Key_Modus='" + jcurrent.oData.pl_key_modus +
										"',Prueflos_Key_Object='" + jcurrent.oData.pl_key_object + "',Vornr='" + jcurrent.oData.vornr + "',Pruefpunkt='" +
										jcurrent.oData.pruefpunkt +
										"',Merknr='" + jcurrent.oData.merknr + "',Filename='" + filename + "')";

									oModel.remove(path, {
										method: "DELETE",
										headers: {
											"X-Requested-With": "XMLHttpRequest",
											"Content-Type": "application/atom+xml",
											"DataServiceVersion": "2.0",
											"X-CSRF-Token": token
										},

										success: function (oData) {
											_c_this.setImagesInCarousel(jcurrent.getData(), THIS);
											MessageToast.show(success);
											oModel.refresh(true);
										},
										error: function (e) {
											MessageToast.show(error);
										}
									});

								}
							}
						});
					break;
				}
			}

		},
		handleUplChange: function (oEvent, THIS) {
			THIS.getView().setBusy(true);
			// var oviewdispmodel = this.getView().getModel("viewdisp");
			// var headerparas = this.getView().getModel("pl").getHeaders();
			// var token = headerparas["x-csrf-token"];
			// oviewdispmodel.setProperty("/_xcsrftoken", token);

			var oFileUploader = THIS.byId("fileUploader1");
			var headerpara = new sap.ui.unified.FileUploaderParameter({
				name: "slug",
				value: oFileUploader.getValue()
			});
			oFileUploader.insertHeaderParameter(headerpara);
		},
		handleUplComplete: function (ART, oEvent, THIS) {
			THIS.getView().setBusy(false);
			var jcurrent = THIS.getView().getModel("current");
			if (ART === 'C') {
				this.setImagesInCarousel(jcurrent.getData(), THIS);
			}
			if (ART === 'L') {
				this.setImagesInList(jcurrent.getData(), THIS);
			}
			THIS.getView().getModel("pl").refresh(true);
			var oFileUploader = THIS.byId("fileUploader1");
			oFileUploader.clear();
		},
		prepareUpload: function (ARGS, THIS) {
			var oviewdispmodel = THIS.getView().getModel("viewdisp");

			var headerparas = THIS.getView().getModel("pl").getHeaders();
			var token = headerparas["x-csrf-token"];
			oviewdispmodel.setProperty("/_xcsrftoken", token);

			var Upath = "/sap/opu/odata/WIND/QM_RESULTS_SRV/PruefMerkmaleSet(Prueflos='" + ARGS.pl + "',Prueflos_Key_Modus='" +
				ARGS.pl_key_modus + "',Prueflos_Key_Object='" + ARGS.pl_key_object + "',Vornr='" + ARGS.vornr + "',Pruefpunkt='" +
				ARGS.pruefpunkt + "',Merknr='" + ARGS.merknr + "')/TOFOTO";

			oviewdispmodel.setProperty("/_uploadurl", Upath);
		},
		showPicture: function (oEvent, THIS) {
			var oItem = oEvent.getParameter("listItem") || oEvent.getSource();
			var oView = THIS.getView();
			
			//var oModel = oView.getModel("pl");

			var filename = oItem.getBindingContext("viewpics").getProperty("_imgAlt");
			var url      = oItem.getBindingContext("viewpics").getProperty("_imgSrc");
			
		    THIS.getOwnerComponent().showIMAGE(oView, url, filename, 'jpg');
		}
	};
});
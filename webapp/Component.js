sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/Device",
	"sap/ui/model/resource/ResourceModel",
	"de/enercon/usbee/controller/infodialog",
	"de/enercon/usbee/controller/fotodialog",
	"de/enercon/usbee/controller/textdialog",
	"de/enercon/usbee/controller/dokudialog",
	"de/enercon/usbee/controller/fhmdialog",
	"de/enercon/usbee/controller/imagedialog",
	"de/enercon/usbee/controller/settingsdialog",
	"de/enercon/usbee/controller/qualcodesdialog",
	//"de/enercon/usbee/controller/ppdialog"

], function (Controller, UIComponent, History, JSONModel, MessageBox, MessageToast, Device, ResourceModel, InfoDialog, FotoDialog,
	TextDialog, DokuDialog, FhmDialog, ImageDialog, SettingsDialog, QualCodesDialog) {
	"use strict";
	return UIComponent.extend("de.enercon.usbee.Component", {
		metadata: {
			manifest: "json"
				// config: {
				// 	fullWidth: true //Set your fullscreen parameter here!
				// }
		},

		init: function () {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

			// set message model
			this.setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "message");

			// create the views based on the url/hash
			this.getRouter().initialize();

			var oChgModel = new JSONModel(jQuery.sap.getModulePath("de.enercon.usbee.model.Changelog", "/Changelog.json"));
			this.setModel(oChgModel, "chl");

			//Last created Serialnr
			var oModelSernr = new JSONModel({
				_LASTSERNR: "",
				_LASTMATNR: ""
			});
			this.setModel(oModelSernr, "lastsernr");

			var oModel_empty_list = new JSONModel({
				_active: false
			});
			this.setModel(oModel_empty_list, "empty_list");

			var masterModel = this.getModel("pl");
			masterModel.setSizeLimit(500);
			var errormess = this.getModel("i18n").getResourceBundle().getText("errorodata");
			masterModel.attachMetadataFailed(function () {
				MessageBox.error(errormess);
			});
			//masterModel.setSizeLimit(100);
			//masterModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
			// masterModel.attachRequestSent(function () {
			// 	sap.ui.core.BusyIndicator.show(0);
			// });
			// masterModel.attachRequestCompleted(function () {
			// 	sap.ui.core.BusyIndicator.hide();
			// });

			this._create_load_usersettings();
			// this.handleautoreload_new();

			//////////////////// ENTER VERSION HERE
			//var appVersion = "0.2.2";
			var appVersion = this.getManifestEntry("/sap.app/applicationVersion/version");
			//////////////////// ENTER VERSION HERE
			var oModelGlobal = this.create_globalModel(masterModel, appVersion);
			this.setModel(oModelGlobal, "GLOBAL");
			this.setbooltiles(masterModel, oModelGlobal);
			// CLock
			var that = this;
			setInterval(function () {
				//	var result = that.GetClock();
				//	oLabel.setText(result);
				that.SetClock();
			}, 1000);

			// set dialog
			this._infoDialog = new InfoDialog(this.getAggregation("rootControl"));
			//FotoDialog used by DetailXXX
			this._fotoDialog = new FotoDialog(this.getAggregation("rootControl"));
			//TextDialog used by DetailXXX
			this._textDialog = new TextDialog(this.getAggregation("rootControl"));
			//PPDialog used by Detail1
			// this._ppDialog = new PPDialog(this.getAggregation("rootControl"));
			//DokuDialog
			this._dokuDialog = new DokuDialog(this.getAggregation("rootControl"));
			//FHMDialog
			this._fhmDialog = new FhmDialog(this.getAggregation("rootControl"));
			//IMAGEDialog
			this._imageDialog = new ImageDialog(this.getAggregation("rootControl"));
			//SettingsDialog
			this._settingsDialog = new SettingsDialog(this.getAggregation("rootControl"));
			//QualCodesDialog
			this._qualcodesDialog = new QualCodesDialog(this.getAggregation("rootControl"));
		},
		create_globalModel: function (mastermodel, version) {
			var complete_url = window.location.href;
			var pieces = complete_url.split("/");
			var url = pieces[2];

			// var system;
			// switch (url) {
			// 	//case 'webidetesting3260929-a29c1f2b9.dispatcher.hana.ondemand.com':
			// 	//default: system = 'WebIde-SCP';
			// 	default: system = ' ';
			// 	break;
			// case 'srv-sapeq4.enercon.de':
			// 		system = 'ENQ';
			// 	break;
			// case 'portal-qa.enercon.de':
			// 		system = 'ENQ';
			// 	break;
			// case 'portal.enercon.de':
			// 		system = 'ENP';
			// 	break;
			// }

			var language = sap.ui.getCore().getConfiguration().getLanguage();

			var imagepath;
			var launchpad = false;
			var path = jQuery.sap.getModulePath("de.enercon.usbee");
			switch (path) {
			case ".":
				imagepath = "image";
				break;
			default:
				imagepath = path + "/image";
				launchpad = true;
				break;
			}

			var oModelGlobal = new JSONModel({
				_navpanel_expanded: true,
				_autosave: false,
				_ViewPos: "",
				// _system: system,
				_url: url,
				_langu: language,
				_phone: Device.system.phone,
				_tablet: Device.system.tablet,
				_desktop: Device.system.desktop,
				_DisplayTiles: false,
				_DisplayNoTiles: false,
				_AppVersion: version,
				_imagepath: imagepath,
				_displayfile: {
					url: "",
					file: "",
					mimetype: ""
				},
				// _doku_url: "",
				// _doku_file: "",
				_launchpad: launchpad,
				_clock1: "",
				_clock2: ""
			});

			return oModelGlobal;

		},
		setbooltiles: function (mastermodel, oModelGlobal) {

			var displaytiles = false;
			var displaynotiles = false;

			var promise1 = new Promise(function (resolve, reject) {
				mastermodel.read("/TileMenuSet", {
					success: function (oRetrievedResult) {
						//console.log(oRetrievedResult);

						if (oRetrievedResult.results.length === 0) {
							resolve('NoTiles');
						} else {
							resolve('Tiles');
						}
					},
					error: function (oError) {
						//console.log(oError);
					}
				});
			});
			promise1.then(function (result) {
				switch (result) {
					default: displaytiles = true;
					displaynotiles = false;
					break;
				case 'Tiles':
						displaytiles = true;
					displaynotiles = false;
					break;
				case 'NoTiles':
						displaytiles = false;
					displaynotiles = true;
				}

				oModelGlobal.setProperty("/_DisplayTiles", displaytiles);
				oModelGlobal.setProperty("/_DisplayNoTiles", displaynotiles);
			});

		},
		handleMerkmalNav: function (ART, OEVENT, THIS) {
			var aTarget;
			var nav;
			var OVIEW = THIS.getView();
			var oModel = OVIEW.getModel("pl");

			var check_result = true;
			if (oModel.hasPendingChanges()) {
				check_result = this.check_all(THIS);

				if (!check_result) {
					return;
				}
			}

			var oModel = OVIEW.getBindingContext("pl");
			if (oModel !== undefined) {
				//var path = OVIEW.getBindingContext("pl").sPath;
				var path = oModel.sPath;
			} else {
				return;
			}
			// var path = OVIEW.getBindingContext("pl").sPath;
			// if (path === "") {
			// 	return;
			// }
			var currentdata = oModel.getProperty(path);

			switch (ART) {
			case 'F':
				var Merknr_Nav = currentdata.Merknr_first;
				break;
			case 'L':
				var Merknr_Nav = currentdata.Merknr_last;
				break;
			case 'D':
				var Merknr_Nav = currentdata.Merknr_down;
				// var toastart = "center bottom";
				// var toffset = "0 0";
				break;
			case 'U':
				var Merknr_Nav = currentdata.Merknr_up;
				// var toastart = "center bottom";
				// var toffset = "0 0";
			}

			if (Merknr_Nav === "") {
				return;
			}

			// Neues Merkmal lesen "/PruefMerkmaleSet(Prueflos='000002857513',Prueflos_Key_Modus='S1',Prueflos_Key_Object='AB330137593',Vornr='0010',Merknr='0030')"
			var newpath = "/PruefMerkmaleSet(Prueflos='" + currentdata.Prueflos + "',Prueflos_Key_Modus='" + currentdata.Prueflos_Key_Modus +
				"',Prueflos_Key_Object='" + currentdata.Prueflos_Key_Object + "',Vornr='" + currentdata.Vornr + "',Pruefpunkt='" + currentdata.Pruefpunkt +
				"',Merknr='" + Merknr_Nav + "')";
			// Die Methode getObject liefert genau dann ein Ergebnis ungleich null zurück, wenn die angeforderte Entität bereits im Frontend/Client/Browser vorhanden ist. 
			// Das ist genau dann der Fall, wenn diese über ein Binding oder ein vorheriges oModel.read() geladen wurde.
			var Merknr_Nav_Data = oModel.getObject(newpath);

			if (Merknr_Nav_Data.Merknr !== '') {

				switch (Merknr_Nav_Data.Prueflos_Key_Modus) {
				case 'S1': // Single Sernr
					if (Merknr_Nav_Data.ART_MERKMAL === "L") {
						aTarget = ["plMaster", "plMerkmal_S1_Qual"];
						nav = "Merkmal_S1_Qual";
					} else {
						aTarget = ["plMaster", "plMerkmal_S1_Quan"];
						nav = "Merkmal_S1_Quan";
					}
					break;
				case 'SX': // Sernr for Input
					if (Merknr_Nav_Data.ART_MERKMAL === "L") {
						aTarget = ["plMaster", "plMerkmal_SX_Qual"];
						nav = "Merkmal_SX_Qual";
					} else {
						aTarget = ["plMaster", "plMerkmal_SX_Quan"];
						nav = "Merkmal_SX_Quan";
					}
					break;
				case 'CH': // Charge
					if (Merknr_Nav_Data.ART_MERKMAL === "L") {
						aTarget = ["plMaster", "plMerkmal_CH_Qual"];
						nav = "Merkmal_CH_Qual";
					} else {
						aTarget = ["plMaster", "plMerkmal_CH_Quan"];
						nav = "Merkmal_CH_Quan";
					}
					break;
				case 'NN': // Weder Charge noch Sernr
					if (Merknr_Nav_Data.ART_MERKMAL === "L") {
						aTarget = ["plMaster", "plMerkmal_NN_Qual"];
						nav = "Merkmal_NN_Qual";
					} else {
						aTarget = ["plMaster", "plMerkmal_NN_Quan"];
						nav = "Merkmal_NN_Quan";
					}
					break;
				}

				// //Vor dem Navigieren das Merkmal speichern
				// var savenav = this.getModel("i18n").getResourceBundle().getText("detail2-savenav");
				// var oModel = this.getModel("pl");
				// if (oModel.hasPendingChanges()) {
				// 	//this.onSave(this);
				// 	MessageToast.show(savenav);
				// 	return;
				// }

				var changemess = this.getModel("i18n").getResourceBundle().getText("detail2-changemess");
				MessageToast.show(changemess + " " + Merknr_Nav_Data.Merknr);
				// MessageToast.show(changemess + " " + Merknr_Nav_Data.Merknr, {
				// 	duration: 1000, // default
				// 	width: "15em", // default
				// 	my: toastart, //"center center", // default
				// 	at: toastart, //center center", // default
				// 	of: window, // default
				// 	offset: toffset, // default
				// 	collision: "fit fit", // default
				// 	onClose: null, // default
				// 	autoClose: true, // default
				// 	animationTimingFunction: "ease", // default
				// 	animationDuration: 0, // default
				// 	closeOnBrowserNavigation: true // default
				// });

				//this.getRouter().getTargets().display(aTarget);
				this.getRouter().navTo(nav, {
					pl: Merknr_Nav_Data.Prueflos,
					pl_key_modus: Merknr_Nav_Data.Prueflos_Key_Modus,
					pl_key_object: Merknr_Nav_Data.Prueflos_Key_Object,
					vornr: Merknr_Nav_Data.Vornr,
					pruefpunkt: Merknr_Nav_Data.Pruefpunkt,
					merknr: Merknr_Nav_Data.Merknr
				}, true);
			}
		},
		handleMerkmalNav_list: function (ART, OEVENT, THIS) {
			var aTarget;
			var nav;
			var OVIEW = THIS.getView();
			var oModel = OVIEW.getModel("pl");

			var check_result = true;
			if (oModel.hasPendingChanges()) {
				check_result = this.check_all(THIS);

				if (!check_result) {
					return;
				}
			}

			var oModel = OVIEW.getBindingContext("pl");
			if (oModel !== undefined) {
				//var path = OVIEW.getBindingContext("pl").sPath;
				var path = oModel.sPath;
			} else {
				return;
			}
			// if (path === "") {
			// 	return;
			// }
			var currentdata = oModel.getProperty(path);

			switch (ART) {
			case 'F':
				var Merknr_Nav = currentdata.Merknr_first;
				break;
			case 'L':
				var Merknr_Nav = currentdata.Merknr_last;
				break;
			case 'D':
				var Merknr_Nav = currentdata.Merknr_down;
				var toastart = "left center";
				var toffset = "150 100";
				break;
			case 'U':
				var Merknr_Nav = currentdata.Merknr_up;
				var toastart = "right center";
				var toffset = "-150 100";
			}

			if (Merknr_Nav === "") {
				return;
			}

			// Neues Merkmal lesen "/PruefMerkmaleSet(Prueflos='000002857513',Prueflos_Key_Modus='S1',Prueflos_Key_Object='AB330137593',Vornr='0010',Merknr='0030')"
			var newpath = "/PruefMerkmaleSet(Prueflos='" + currentdata.Prueflos + "',Prueflos_Key_Modus='" + currentdata.Prueflos_Key_Modus +
				"',Prueflos_Key_Object='" + currentdata.Prueflos_Key_Object + "',Vornr='" + currentdata.Vornr + "',Pruefpunkt='" + currentdata.Pruefpunkt +
				"',Merknr='" + Merknr_Nav + "')";
			// Die Methode getObject liefert genau dann ein Ergebnis ungleich null zurück, wenn die angeforderte Entität bereits im Frontend/Client/Browser vorhanden ist. 
			// Das ist genau dann der Fall, wenn diese über ein Binding oder ein vorheriges oModel.read() geladen wurde.
			var Merknr_Nav_Data = oModel.getObject(newpath);

			if (Merknr_Nav_Data.Merknr !== '') {

				switch (Merknr_Nav_Data.Prueflos_Key_Modus) {
				case 'S1': // Single Sernr
					if (Merknr_Nav_Data.ART_MERKMAL === "L") {
						nav = "Merkmal_S1_Qual_list";
					} else {
						nav = "Merkmal_S1_Quan_list";
					}
					break;
				case 'SX': // Sernr for Input
					if (Merknr_Nav_Data.ART_MERKMAL === "L") {
						nav = "Merkmal_SX_Qual_list";
					} else {
						nav = "Merkmal_SX_Quan_list";
					}
					break;
				case 'CH': // Charge
					if (Merknr_Nav_Data.ART_MERKMAL === "L") {
						nav = "Merkmal_CH_Qual_list";
					} else {
						nav = "Merkmal_CH_Quan_list";
					}
					break;
				case 'NN': // Weder Charge noch Sernr
					if (Merknr_Nav_Data.ART_MERKMAL === "L") {
						nav = "Merkmal_NN_Qual_list";
					} else {
						nav = "Merkmal_NN_Quan_list";
					}
					break;
				}

				// //Vor dem Navigieren das Merkmal speichern
				// var savenav = this.getModel("i18n").getResourceBundle().getText("detail2-savenav");
				// var oModel = this.getModel("pl");
				// if (oModel.hasPendingChanges()) {
				// 	//this.onSave(this);
				// 	MessageToast.show(savenav);
				// 	return;
				// }

				var changemess = this.getModel("i18n").getResourceBundle().getText("detail2-changemess");
				MessageToast.show(changemess + " " + Merknr_Nav_Data.Merknr);
				// MessageToast.show(changemess + " " + Merknr_Nav_Data.Merknr, {
				// 	duration: 1000, // default
				// 	width: "15em", // default
				// 	my: toastart, //"center center", // default
				// 	at: toastart, //center center", // default
				// 	of: window, // default
				// 	offset: toffset, // default
				// 	collision: "fit fit", // default
				// 	onClose: null, // default
				// 	autoClose: true, // default
				// 	animationTimingFunction: "ease", // default
				// 	animationDuration: 0, // default
				// 	closeOnBrowserNavigation: true // default
				// });

				//this.getRouter().getTargets().display(aTarget);
				var oRouter = this.getRouter();
				oRouter.navTo(nav, {
					pl: Merknr_Nav_Data.Prueflos,
					pl_key_modus: Merknr_Nav_Data.Prueflos_Key_Modus,
					pl_key_object: Merknr_Nav_Data.Prueflos_Key_Object,
					vornr: Merknr_Nav_Data.Vornr,
					pruefpunkt: Merknr_Nav_Data.Pruefpunkt,
					merknr: Merknr_Nav_Data.Merknr
				}, false);
				// this.getRouter().navTo(nav, {
				// 	pl: Merknr_Nav_Data.Prueflos,
				// 	pl_key_modus: Merknr_Nav_Data.Prueflos_Key_Modus,
				// 	pl_key_object: Merknr_Nav_Data.Prueflos_Key_Object,
				// 	vornr: Merknr_Nav_Data.Vornr,
				// 	pruefpunkt: Merknr_Nav_Data.Pruefpunkt,
				// 	merknr: Merknr_Nav_Data.Merknr
				// }, false);
			}
		},
		openInfoDialog: function () {
			this._infoDialog.open(this);
		},
		showComingSoon: function (OVIEW) {
			var bCompact = !!OVIEW.$().closest(".sapUiSizeCompact").length;
			var message = OVIEW.getModel("i18n").getResourceBundle().getText("featurecomingsoon");
			MessageBox.information(message, {
				styleClass: bCompact ? "sapUiSizeCompact" : ""
			});
		},
		openDokuDialog: function (oview) {
			// this.showComingSoon(oview);
			// return;
			var oModel_pl = this.getModel("pl");
			var oModel_gl = this.getModel("GLOBAL");
			//var URL = this._dokuDialog.open(oview, oModel);

			var that = this;
			var URL;
			var promise_d = new Promise(function (resolve, reject) {
				that._dokuDialog.open(oview, oModel_pl, oModel_gl, resolve, reject);
			});
			promise_d.then(function (value) {
				var URL = oModel_gl.getProperty("/_displayfile/url");
				var FILE = oModel_gl.getProperty("/_displayfile/file");
				that.showPDF(URL, FILE);
				//that.showPDF("/sap/opu/odata/wind/qm_results_srv/DokumentationSet('004')/$value");
			});

		},
		handleFotoUploadMK: function (LIST, ART, OEVENT, OVIEW) {
			var oModel = OVIEW.getModel("pl");
			//var oButton = OEVENT.getSource();

			if (ART === 'D') {
				// Der Parent des Buttons ist die Box dessen Parent ist die Zeile und die enhält den Binding path
				var path = OVIEW.getBindingContext("pl").sPath;
			}
			if (ART === 'L') {
				var path = OEVENT.getSource().getParent().getBindingContextPath();
			}
			// Daten der Zeile
			var currentdata = oModel.getProperty(path);
			// this._fotoDialog.open(OVIEW,currentdata);

			// Usersettings Lightbox oder Caroussel
			var oModelSettings = this.getSettings();
			var _piclist = oModelSettings.getProperty("/_piclist");

			if (!_piclist) {
				// Call Foto View
				if (LIST === 'MD') {
					var aTarget = ["plMaster", "plMerkmal_Fotos_C"];
					var nav = "Merkmal_Fotos_C";
				}
				if (LIST === 'L') {
					var nav = "Merkmal_Fotos_list_C";
				}

			} else {
				// Call Foto View
				if (LIST === 'MD') {
					var aTarget = ["plMaster", "plMerkmal_Fotos_L"];
					var nav = "Merkmal_Fotos_L";
				}
				if (LIST === 'L') {
					var nav = "Merkmal_Fotos_list_L";
				}

			}

			//this.getRouter().getTargets().display(aTarget);
			this.getRouter().navTo(nav, {
				pl: currentdata.Prueflos,
				pl_key_modus: currentdata.Prueflos_Key_Modus,
				pl_key_object: currentdata.Prueflos_Key_Object,
				vornr: currentdata.Vornr,
				pruefpunkt: currentdata.Pruefpunkt,
				merknr: currentdata.Merknr
			}, false);
		},
		// handleFotoUploadMK_list: function (ART, OEVENT, OVIEW) {
		// 	var oModel = OVIEW.getModel("pl");
		// 	//var oButton = OEVENT.getSource();

		// 	if (ART === 'D') {
		// 		// Der Parent des Buttons ist die Box dessen Parent ist die Zeile und die enhält den Binding path
		// 		var path = OVIEW.getBindingContext("pl").sPath;
		// 	}
		// 	if (ART === 'L') {
		// 		var path = OEVENT.getSource().getParent().getBindingContextPath();
		// 	}

		// 	// Daten der Zeile
		// 	var currentdata = oModel.getProperty(path);
		// 	// this._fotoDialog.open(OVIEW,currentdata);

		// 	// Call Foto View
		// 	//var aTarget = ["plMaster", "plMerkmal_Fotos"];
		// 	var nav = "Merkmal_Fotos_list";

		// 	//this.getRouter().getTargets().display(aTarget);
		// 	this.getRouter().navTo(nav, {
		// 		pl: currentdata.Prueflos,
		// 		pl_key_modus: currentdata.Prueflos_Key_Modus,
		// 		pl_key_object: currentdata.Prueflos_Key_Object,
		// 		vornr: currentdata.Vornr,
		// 		pruefpunkt: currentdata.Pruefpunkt,
		// 		merknr: currentdata.Merknr
		// 	}, false);
		// },
		handleBemerkungInput: function (OEVENT, OVIEW) {
			var mess = OVIEW.getModel("i18n").getResourceBundle().getText("detail2-noremark");
			var oModel = OVIEW.getModel("pl");
			// Daten der Zeile
			var path1 = OEVENT.getSource().getParent().getBindingContext("pl").sPath;
			var currentline = oModel.getProperty(path1);

			//Merkmal
			var pathm = oModel.createKey("PruefMerkmaleSet", {
				Prueflos: currentline.Prueflos,
				Prueflos_Key_Modus: currentline.Prueflos_Key_Modus,
				Prueflos_Key_Object: currentline.Prueflos_Key_Object,
				Vornr: currentline.Vornr,
				Pruefpunkt: currentline.Pruefpunkt,
				Merknr: currentline.Merknr
			});
			var pathmm = "/" + pathm;
			var currentdatam = oModel.getProperty(pathmm);

			if (currentline.ANZKLASEH !== 0) {
				// if (currentline.visible === "X" && currentline.Attribut === "G" &&
				// 	currentline.Pruefdatum === "" && currentdatam.DocuRequ !== "") {
				if (currentline.visible && currentline.Attribut === "G" &&
					currentline.Pruefdatum === "" && currentdatam.DocuRequ !== "") {

					var oSource = OEVENT.getSource();
					var bemerkung = oSource.getValue();

					if (bemerkung !== "") {
						oSource.setValueState("None");
					} else {
						oSource.setValueState("Error");
						oSource.setValueStateText(mess);
					}
				}
			} else {
				var oSource = OEVENT.getSource();
				oSource.setValueState("None");
			}

		},
		handleStepInputChange: function (OEVENT, OVIEW) {
			var overmax = OVIEW.getModel("i18n").getResourceBundle().getText("detail2-overmax");
			//MessageToast.show("Value changed to '" + OEVENT.getParameter("value") + "'");
			var oModel = OVIEW.getModel("pl");
			// Daten der Zeile
			var path1 = OEVENT.getSource().getParent().getBindingContext("pl").sPath;
			var currentline = oModel.getProperty(path1);

			if (currentline.ScopeInd === '=') {

				var oTable;
				if (currentline.Art_merkmal === "L") {
					oTable = OVIEW.byId("KidresuTableL");
				} else {
					oTable = OVIEW.byId("KidresuTableN");
				}
				var items = oTable.getItems();

				//Alle Werte addieren
				var line;
				var i;
				var path;
				var result = 'N';
				var anzahl = 0;
				for (i = 0; i < items.length; i++) {
					path = items[i].getBindingContextPath();
					line = oModel.getProperty(path);

					// if (line.visible === "X" && line.ANZKLASEH !== 0) {
					// 	anzahl = anzahl + parseInt(line.ANZKLASEH, 10);
					// }
					if (line.visible && line.ANZKLASEH !== 0) {
						anzahl = anzahl + parseInt(line.ANZKLASEH, 10);
					}
				}
				if (anzahl > currentline.SOLLSTPUMF) {
					sap.m.MessageToast.show(overmax);
					var back = currentline.ANZKLASEH - 1;
					oModel.setProperty(path1 + "/ANZKLASEH", back);
				}
			}
		},
		handleValidChange: function (OEVENT, OVIEW) {
			//	Diese Routine wurde für klass Merkmale geschrieben
			//  wird nach Konzeptwechsel nicht mehr benötigt
			// 	var savefirst = OVIEW.getModel("i18n").getResourceBundle().getText("detail2-savefirst");

			// 	var oModel = OVIEW.getModel("pl");

			// 	// Daten der Zeile
			// 	var path1 = OEVENT.getSource().getParent().getBindingContext("pl").sPath;
			// 	var currentline = oModel.getProperty(path1);

			// 	// User setzt bei Klassifizierten einen Code komplett auf ungültig
			// 	if (currentline.ESTUKZ === "*") {
			// 		var oTable;
			// 		if (currentline.Art_merkmal === "L") {
			// 			oTable = OVIEW.byId("idresuTableL");
			// 		} else {
			// 			oTable = OVIEW.byId("idresuTableN");
			// 		}
			// 		var items = oTable.getItems();

			// 		//Erst sichern wenn schon neue Zeile und dann vorhandenes invalid
			// 		var line;
			// 		var i;
			// 		var path;
			// 		var result = 'N';
			// 		for (i = 0; i < items.length; i++) {
			// 			path = items[i].getBindingContextPath();
			// 			line = oModel.getProperty(path);

			// 			if (line.visible === "X" && line.Pruefdatum === "" && line.Attribut === "G") {
			// 				result = 'J';
			// 				break;
			// 			}
			// 		}
			// 		if (result === "J") {
			// 			oModel.setProperty(path1 + "/Attribut", "G");
			// 			sap.m.MessageToast.show(savefirst);
			// 			return;
			// 		}

			// 		// Über alle sichtbaren/code schauen ob valid
			// 		result = 'N';
			// 		for (i = 0; i < items.length; i++) {
			// 			path = items[i].getBindingContextPath();
			// 			line = oModel.getProperty(path);

			// 			if (line.visible === "X" && line.Bewertung === currentline.Bewertung) {
			// 				if (line.Attribut === 'G') {
			// 					result = 'J';
			// 					break;
			// 				}
			// 			}
			// 		}
			// 		//Wenn result = N dann alle Codes markieren zum löschen

			// 		for (i = 0; i < items.length; i++) {
			// 			path = items[i].getBindingContextPath();
			// 			line = oModel.getProperty(path);

			// 			if (line.visible === "X" && line.Bewertung === currentline.Bewertung) {
			// 				if (result === 'N') {
			// 					oModel.setProperty(path + "/delete_code", true);
			// 				} else {
			// 					oModel.setProperty(path + "/delete_code", false);
			// 				}
			// 			}
			// 		}
			// 	}
		},
		handleTextMK: function (OEVENT, OVIEW) {
			var titleMK = this.getModel("i18n").getResourceBundle().getText("text-titleMK");
			var oModel = OVIEW.getModel("pl");
			//var oButton = OEVENT.getSource();
			// Der Parent des Buttons ist die Box dessen Parent ist die Zeile und die enhält den Binding path
			var path = OVIEW.getBindingContext("pl").sPath;
			// Daten der Zeile
			var currentdata = oModel.getProperty(path);
			// this._fotoDialog.open(OVIEW,currentdata);
			var title = titleMK + " " + Number(currentdata.Prueflos) + " - " + currentdata.Vornr + " - " + currentdata.Merknr;
			this._textDialog.open(OVIEW, currentdata, title);
		},
		handleTextMK_L: function (OEVENT, OVIEW) {
			var titleMK = this.getModel("i18n").getResourceBundle().getText("text-titleMK");
			var oModel = OVIEW.getModel("pl");
			//var oButton = OEVENT.getSource();
			// Der Parent des Buttons ist die Box dessen Parent ist die Zeile und die enhält den Binding path
			var path = OEVENT.getSource().getParent().getBindingContextPath();

			// Daten der Zeile
			var currentdata = oModel.getProperty(path);
			// this._fotoDialog.open(OVIEW,currentdata);
			var title = titleMK + " " + Number(currentdata.Prueflos) + " - " + currentdata.Vornr + " - " + currentdata.Merknr;
			this._textDialog.open(OVIEW, currentdata, title);
		},

		check_all: function (that) {
			var check_result = true;
			var art;
			var message;

			var oTableL = that.getView().byId("idresuTableL");
			var oTableN = that.getView().byId("idresuTableN");

			if (oTableL == undefined) {
				var oTable = oTableN;
				art = 'N';
			} else {
				var oTable = oTableL;
				art = 'L';
			}

			var items = oTable.getItems();
			var oModel = that.getView().getModel("pl");
			var path;
			var data;
			var result = true;

			path = items[0].getBindingContextPath();
			data = oModel.getProperty(path);
			var aktuell_tab = path.split(",Lfdnr=");
			var aktuell = aktuell_tab[0];
			//////////////////////////////////////////////////////////////////////
			//Wurde auf dem Aktuellen Bild überhaupt was geändert JA=Ende
			var oChanges = oModel.getPendingChanges();
			var aPendingChanges = $.map(oChanges, function (value, index) {
				return [index];
			});

			var aChange;
			var aModel_tab;
			var aModel;
			var aktscreenchanged = false;
			for (var i = 0; i < aPendingChanges.length; i++) {
				aChange = "/" + aPendingChanges[i].toString();
				var aModel_tab = aChange.split(",Lfdnr=");
				var aModel = aModel_tab[0];

				if (aModel === aktuell) {
					aktscreenchanged = true;
					break;
				}
			}
			if (!aktscreenchanged) {
				return true;
			}
			//////////////////////////////////////////////////////////////////////
			//Aktuelles Merkmal
			var pathm = oModel.createKey("PruefMerkmaleSet", {
				Prueflos: data.Prueflos,
				Prueflos_Key_Modus: data.Prueflos_Key_Modus,
				Prueflos_Key_Object: data.Prueflos_Key_Object,
				Vornr: data.Vornr,
				Pruefpunkt: data.Pruefpunkt,
				Merknr: data.Merknr
			});
			var pathmm = "/" + pathm;
			var currentdatam = oModel.getProperty(pathmm);

			//Bewertung
			if (art === 'L') {
				check_result = this._check_beforesavebewert(that, items, oModel);
				if (!check_result) {
					message = that.getView().getModel("i18n").getResourceBundle().getText("detail1-nobewert");
					MessageToast.show(message);
					return false;
				}
			}
			//DokuPflicht
			if (currentdatam.DocuRequ !== "") {
				check_result = this._check_beforesavedocu(that, items, oModel, currentdatam.DocuRequ);
				if (!check_result) {
					message = that.getView().getModel("i18n").getResourceBundle().getText("detail1-nodocu");
					MessageToast.show(message);
					return false;
				}
			}
			//Messwert
			if (art === 'N') {
				check_result = this._check_beforesavemess(that, items, oModel);
				if (!check_result) {
					message = that.getView().getModel("i18n").getResourceBundle().getText("detail1-nomess");
					MessageToast.show(message);
					return false;
				}
			}
			//SerialNr
			if (currentdatam.Prueflos_Key_Modus === 'SX') {
				check_result = this._check_beforesavesernr(that, items, oModel);
				if (!check_result) {
					message = that.getView().getModel("i18n").getResourceBundle().getText("detail3-noserial");
					MessageToast.show(message);
					return false;
				}
			}

			// if (art === 'L') {
			// 	//Warnung wenn exakt gleiche Zeile mit Kombi Fehlercode und Fehlerort muss identisch sein
			// 	var tocheck = this._checkidentical(that, items, oModel);
			// 	if (tocheck !== undefined) {
			// 		message = that.getView().getModel("i18n").getResourceBundle().getText("detail1-identical");
			// 		var messagetext = message + " " + tocheck.Merknr;
			// 		var weiter = that.getView().getModel("i18n").getResourceBundle().getText("barcode-weiter");

			// 		var oVC = that.byId("oVerticalContent");
			// 		oVC.setVisible(true);
			// 		var oMs = sap.ui.getCore().byId("msgStrip");
			// 		if (oMs) {
			// 			oMs.destroy();
			// 		}
			// 		var oMsgStrip = new sap.m.MessageStrip("msgStrip", {
			// 			text: messagetext,
			// 			showCloseButton: false,
			// 			showIcon: false,
			// 			type: "Warning"
			// 		});
			// 		oVC.addContent(oMsgStrip);

			// var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
			// MessageBox.warning(messagetext, {
			// 	styleClass: bCompact ? "sapUiSizeCompact" : ""
			// });

			// MessageBox.warning(message, {
			// 	actions: [weiter, sap.m.MessageBox.Action.CANCEL],
			// 	styleClass: bCompact ? "sapUiSizeCompact" : "",
			// 	onClose: function (sAction) {
			// 		// 		//MessageToast.show("Action selected: " + sAction);
			// 		switch (sAction) {
			// 		case weiter:
			// 			check_result = true;
			// 			break;
			// 		case sap.m.MessageBox.Action.CANCEL:
			// 			return false;
			// 		}
			// 	}
			// });
			// }

			// }

			if (check_result) {
				return true;
			} else {
				return false;
			}

		},
		check_all2: function (that, ART) {
			var check_result = true;
			var art;
			var message;

			var oTableL = that.getView().byId("idresuTableL");
			var oTableN = that.getView().byId("idresuTableN");

			if (oTableL == undefined) {
				var oTable = oTableN;
				art = 'N';
			} else {
				var oTable = oTableL;
				art = 'L';
			}

			var items = oTable.getItems();
			var oModel = that.getView().getModel("pl");
			var path;
			var data;
			var result = true;

			path = items[0].getBindingContextPath();
			data = oModel.getProperty(path);
			var aktuell_tab = path.split(",Lfdnr=");
			var aktuell = aktuell_tab[0];
			//////////////////////////////////////////////////////////////////////
			//Wurde auf dem Aktuellen Bild überhaupt was geändert JA=Ende
			var oChanges = oModel.getPendingChanges();
			var aPendingChanges = $.map(oChanges, function (value, index) {
				return [index];
			});

			var aChange;
			var aModel_tab;
			var aModel;
			var aktscreenchanged = false;
			for (var i = 0; i < aPendingChanges.length; i++) {
				aChange = "/" + aPendingChanges[i].toString();
				var aModel_tab = aChange.split(",Lfdnr=");
				var aModel = aModel_tab[0];

				if (aModel === aktuell) {
					aktscreenchanged = true;
					break;
				}
			}
			if (!aktscreenchanged) {
				return true;
			}
			//////////////////////////////////////////////////////////////////////
			//Aktuelles Merkmal
			var pathm = oModel.createKey("PruefMerkmaleSet", {
				Prueflos: data.Prueflos,
				Prueflos_Key_Modus: data.Prueflos_Key_Modus,
				Prueflos_Key_Object: data.Prueflos_Key_Object,
				Vornr: data.Vornr,
				Pruefpunkt: data.Pruefpunkt,
				Merknr: data.Merknr
			});
			var pathmm = "/" + pathm;
			var currentdatam = oModel.getProperty(pathmm);

			var oVC = that.byId("oVerticalContent");

			if (oVC !== undefined) {
				//Nicht bei Klass
				if (currentdatam.ESTUKZ !== '*') {
					if (art === 'L') {

						var messid = ART + "ID" + currentdatam.Merknr;

						//Warnung wenn exakt gleiche Zeile mit Kombi Fehlercode und Fehlerort muss identisch sein
						var tocheck = this._checkidentical(that, items, oModel);
						if (tocheck !== undefined) {
							message = that.getView().getModel("i18n").getResourceBundle().getText("detail1-identical");
							var messagetext = message + " " + tocheck.Merknr;
							//var weiter = that.getView().getModel("i18n").getResourceBundle().getText("barcode-weiter");

							oVC.setVisible(true);
							var oMs = sap.ui.getCore().byId(messid);
							if (oMs) {
								oMs.destroy();
							}
							var oMsgStrip = new sap.m.MessageStrip(messid, {
								text: messagetext,
								showCloseButton: false,
								showIcon: false,
								type: "Warning"
							});
							oVC.addContent(oMsgStrip);

						} else {
							//oVC.removeAllContent();
							oVC.removeContent(messid);
							var controls = oVC.getContent();
							if (controls.length === 0) {
								oVC.setVisible(false);
							}
						}
					}
				}
			}
		},
		_checkidentical: function (that, ITEMS, OMODEL) {
			var items = ITEMS;
			var oModel = OMODEL;
			var path;
			var data;
			//var result = true;
			var unsave = false;
			var tocheck;
			//var path = item.getSource().getParent().getParent().getBindingContextPath();
			//var currentdata = oModel.getProperty(path);

			// Nur ungesicherte Zeilen prüfen
			var i;
			for (i = 0; i < items.length; i++) {
				path = items[i].getBindingContextPath();
				data = oModel.getProperty(path);
				// if (data.Pruefdatum === "" && data.Attribut === "G" && data.visible === "X" && data.Auswahlmenge2 !== "U") {
				if (data.Pruefdatum === "" && data.Attribut === "G" && data.visible && data.Auswahlmenge2 !== "U") {
					unsave = true;
					tocheck = data;
					break;
				}
			}

			if (unsave) {
				for (i = 0; i < items.length; i++) {
					path = items[i].getBindingContextPath();
					data = oModel.getProperty(path);
					if (data.Lfdnr !== tocheck.Lfdnr) {
						// if (data.visible === "X" && data.Attribut === tocheck.Attribut && data.Bewertung === tocheck.Bewertung && data.Auswahlmenge2 ===
						if (data.visible && data.Attribut === tocheck.Attribut && data.Bewertung === tocheck.Bewertung && data.Auswahlmenge2 ===
							tocheck.Auswahlmenge2) {
							//result = false;
							return tocheck;
							//break;
						}
					}
				}
			}
			//return result;
		},
		_check_beforesavesernr: function (that, ITEMS, OMODEL) {
			//var oTable = that.getView().byId("idresuTableNL");
			//var items = oTable.getItems();
			// var items = OTABLE.getItems();
			// var oModel = that.getView().getModel("pl");

			var items = ITEMS;
			var oModel = OMODEL;
			var path;
			var data;
			var result = true;
			//var path = item.getSource().getParent().getParent().getBindingContextPath();
			//var currentdata = oModel.getProperty(path);

			var i;
			for (i = 0; i < items.length; i++) {
				path = items[i].getBindingContextPath();
				data = oModel.getProperty(path);
				// if (data.visible === "X") {
				if (data.visible) {
					if (data.Serialnr === "" && data.Prueflos_Key_Modus === "SX") {
						result = false;
						break;
					}
				}
			}
			return result;
		},
		_check_beforesavemess: function (that, ITEMS, OMODEL) {
			// var oTable = that.getView().byId("idresuTableN");
			// var items = oTable.getItems();
			// var oModel = that.getView().getModel("pl");
			var items = ITEMS;
			var oModel = OMODEL;
			var path;
			var data;
			var result = true;

			var i;
			for (i = 0; i < items.length; i++) {
				path = items[i].getBindingContextPath();
				data = oModel.getProperty(path);
				// if (data.visible === "X") {
				if (data.visible) {
					if (data.Messwert === "") {
						result = false;
						break;
					}
				}
			}
			return result;
		},
		_check_beforesavedocu: function (that, ITEMS, OMODEL, KZ) {
			// if (art === "L") {
			// 	var oTable = that.getView().byId("idresuTableL");
			// } else {
			// 	var oTable = that.getView().byId("idresuTableN");
			// }
			// var items = oTable.getItems();
			// var oModel = that.getView().getModel("pl");

			var items = ITEMS;
			var oModel = OMODEL;
			var path;
			var data;
			var result = true;

			// path = items[0].getBindingContextPath();
			// data = oModel.getProperty(path);

			// var pathm = oModel.createKey("PruefMerkmaleSet", {
			// 	Prueflos: data.Prueflos,
			// 	Prueflos_Key_Modus: data.Prueflos_Key_Modus,
			// 	Prueflos_Key_Object: data.Prueflos_Key_Object,
			// 	Vornr: data.Vornr,
			// 	Merknr: data.Merknr
			// });
			// var pathmm = "/" + pathm;
			// var currentdatam = oModel.getProperty(pathmm);

			var i;
			// Alles muss dokumentiert werden
			if (KZ === '+') {
				for (i = 0; i < items.length; i++) {
					path = items[i].getBindingContextPath();
					data = oModel.getProperty(path);
					// if (data.visible === "X") {					
					if (data.visible) {
						// Bei klassifizierten nur Menge > 0
						if (data.ESTUKZ === '*' && data.ANZKLASEH === 0) {
							continue;
						}
						if (data.Pb_text === "" && data.Attribut === "G" && data.Pruefdatum === "") {
							result = false;
							break;
						}
					}
				}
			}
			// Nur Rückweisungen müssen dokumentiert werden
			if (KZ === '.') {
				for (i = 0; i < items.length; i++) {
					path = items[i].getBindingContextPath();
					data = oModel.getProperty(path);
					var aSplit = data.Bewertung.split("@");
					var Bewert = aSplit[0];
					// if (data.visible === "X" && Bewert === "R") {
					if (data.visible && Bewert === "R") {
						// Bei klassifizierten nur Menge > 0
						if (data.ESTUKZ === '*' && data.ANZKLASEH === 0) {
							continue;
						}
						if (data.Pb_text === "" && data.Attribut === "G" && data.Pruefdatum === "") {
							result = false;
							break;
						}
					}
				}
			}

			return result;
		},
		_check_beforesavebewert: function (that, ITEMS, OMODEL) {
			//var oTable = that.getView().byId("idresuTableL");
			//var items = oTable.getItems();
			//var oModel = that.getView().getModel("pl");
			var items = ITEMS;
			var oModel = OMODEL;
			var path;
			var data;
			var result = true;

			var i;
			for (i = 0; i < items.length; i++) {
				path = items[i].getBindingContextPath();
				data = oModel.getProperty(path);
				// if (data.visible === "X") {
				if (data.visible) {
					if (data.Bewertung === "U") {
						result = false;
						break;
					}
				}
			}
			return result;
		},
		onViewAddLine: function (view, item) {
			var nolines = view.getView().getModel("i18n").getResourceBundle().getText("detail2-nolines");
			var savefirst = view.getView().getModel("i18n").getResourceBundle().getText("detail2-savefirst");
			// Model besorgen 
			var oModel = view.getView().getModel("pl");
			// Der Parent des Buttons ist die Box dessen Parent ist die Zeile und die enhält den Binding path
			var sitem = item.getSource().getParent().getParent();
			var path = sitem.getBindingContextPath();
			// Daten der Zeile
			var currentline = oModel.getProperty(path);
			// Merkmal
			var pathm = oModel.createKey("PruefMerkmaleSet", {
				Prueflos: currentline.Prueflos,
				Prueflos_Key_Modus: currentline.Prueflos_Key_Modus,
				Prueflos_Key_Object: currentline.Prueflos_Key_Object,
				Vornr: currentline.Vornr,
				Pruefpunkt: currentline.Pruefpunkt,
				Merknr: currentline.Merknr
			});
			var pathmm = "/" + pathm;
			var merkmal = oModel.getProperty(pathmm);

			var maxlines;
			if (merkmal.ScopeInd === ">") {
				maxlines = parseInt("999");
			} else {
				maxlines = parseInt(merkmal.SOLLSTPUMF);
			}

			var oTable;
			if (merkmal.ART_MERKMAL === "L") {
				oTable = view.getView().byId("idresuTableL");
			} else {
				oTable = view.getView().byId("idresuTableN");
			}
			var items = oTable.getItems();

			// if (currentline.ESTUKZ === "*") {
			// 	// Wenn das Flag delete_code irgendwo sitz dann erst sichern
			// 	// Besser noch wenn irgendwo was auf invalid steht dann erst sichern
			// 	var i;
			// 	var data;
			// 	var weiter = true;
			// 	for (i = 0; i < items.length; i++) {
			// 		path = items[i].getBindingContextPath();
			// 		data = oModel.getProperty(path);
			// 		if (data.visible === "X") {
			// 			if (data.Attribut !== 'G') {
			// 				weiter = false;
			// 				break;
			// 			}
			// 		}
			// 	}
			// 	if (!weiter) {
			// 		sap.m.MessageToast.show(savefirst);
			// 		return;
			// 	}
			// }

			//Zeilen auswählen
			var i;
			var line;
			var count = 0;
			for (i = 0; i < items.length; i++) {
				path = items[i].getBindingContextPath();
				line = oModel.getProperty(path);

				// if (line.visible !== "X") {
				if (!line.visible) {
					// oModel.setProperty(path + "/visible", 'X');
					oModel.setProperty(path + "/visible", true);
					oModel.setProperty(path + "/LINE_ADDED", true);
					if (currentline.SelSet2 !== "" && merkmal.ART_MERKMAL === "L") {
						oModel.setProperty(path + "/Messwert", currentline.Messwert);
						oModel.setProperty(path + "/Bewertung", currentline.Bewertung);
					}
					break;
				}
				count = count + 1;
				if (count === maxlines) {
					sap.m.MessageToast.show(nolines);
					break;
				}

			}

		},
		onViewAddLine_old: function (view, item) {
			var nolines = view.getView().getModel("i18n").getResourceBundle().getText("detail2-nolines");
			// Model besorgen 
			var oModel = view.getView().getModel("pl");
			// Der Parent des Buttons ist die Box dessen Parent ist die Zeile und die enhält den Binding path
			var sitem = item.getSource().getParent().getParent();
			var path = sitem.getBindingContextPath();

			// Daten der Zeile
			var currentdata = oModel.getProperty(path);

			var linestoopen = parseInt(currentdata.SOLLSTPUMF - currentdata.ANZWERTG);
			if (currentdata.ScopeInd === ">") {
				linestoopen = parseInt("999");
			}

			// var oTable = sitem.getParent();
			// oTable.attachUpdateFinished(function () {

			// 	new Promise(resolve => {
			// 		setTimeout(() => {
			// 			resolve('resolved');
			// 		}, 1000);
			// 	}).then(function() {
			// 		this._scrollToListItem(sitem);
			// 	}.bind(this));

			// 	//console.log("Called after Rendering");
			// }.bind(this));

			//  oTable.onAfterRendering(function () {
			//  	this._scrollToListItem(sitem);
			// }.bind(this));

			// oTable.addEventDelegate({
			// 	onAfterRendering: function () {
			// 		console.log("Called after Rendering");
			// 	}
			// });

			if (currentdata.ANZWERTG === " 0") {
				linestoopen = linestoopen - 1;
			}

			//var Lfdnr = "0100";
			var Lfdnr = "0001";
			lfdnr = parseInt(Lfdnr);
			Lfdnr = ("0000" + lfdnr).slice(-4);
			var weitersuchen = true;

			if (linestoopen > 0) {

				while (weitersuchen) {
					// Merkmal
					var pathm = oModel.createKey("PruefMerkmaleSet", {
						Prueflos: currentdata.Prueflos,
						Prueflos_Key_Modus: currentdata.Prueflos_Key_Modus,
						Prueflos_Key_Object: currentdata.Prueflos_Key_Object,
						Vornr: currentdata.Vornr,
						Pruefpunkt: currentdata.Pruefpunkt,
						Merknr: currentdata.Merknr
					});
					var pathmm = "/" + pathm;
					var currentdatam = oModel.getProperty(pathmm);
					// Ergebnis
					var path2 = oModel.createKey("PruefErgebnisseSet", {
						Prueflos: currentdata.Prueflos,
						Prueflos_Key_Modus: currentdata.Prueflos_Key_Modus,
						Prueflos_Key_Object: currentdata.Prueflos_Key_Object,
						Vornr: currentdata.Vornr,
						Pruefpunkt: currentdata.Pruefpunkt,
						Merknr: currentdata.Merknr,
						Lfdnr: Lfdnr
					});

					var path3 = "/" + path2;
					var currentdata2 = oModel.getProperty(path3);
					if (currentdata2 !== null && currentdata2 !== undefined) {

						// if (currentdata2.visible !== "X") {
						if (!currentdata2.visible) {
							oModel.setProperty(path3 + "/visible", true);
							if (currentdatam.SelSet2 !== "" && currentdatam.ART_MERKMAL === "L") {
								oModel.setProperty(path3 + "/Messwert", currentdata.Messwert);
								oModel.setProperty(path3 + "/Bewertung", currentdata.Bewertung);
							}
							break;
						}

						var lfdnr = parseInt(Lfdnr) + 1;
						Lfdnr = ("0000" + lfdnr).slice(-4);
						//if (Lfdnr == "0131") {
						//if (Lfdnr == "0114") {
						if (Lfdnr == "0051") {
							weitersuchen = false;
						}
						if (linestoopen === 0) {
							sap.m.MessageToast.show(nolines);
							break;
						}

						linestoopen = linestoopen - 1;
					}

				}

			}
		},
		onVorgLangtext: function (view, item) {
			var titleVG = this.getModel("i18n").getResourceBundle().getText("text-titleVG");
			// Model besorgen 
			var oModel = view.getView().getModel("pl");
			// Der Parent des Buttons ist die Box dessen Parent ist die Zeile und die enhält den Binding path
			//var sitem = item.getSource().getParent().getParent();
			var path = item.getSource().getParent().getBindingContextPath();
			// Daten der Zeile
			var currentdata = oModel.getProperty(path);
			//title="{i18n>text-titleMK} {path: 'data>/Prueflos', type : 'sap.ui.model.odata.type.String', constraints: { isDigitSequence : true }} / {data>/Vornr} / {data>/Merknr}">-->
			var title = titleVG + " " + Number(currentdata.Prueflos) + " - " + currentdata.Vornr;
			this._textDialog.open(view, currentdata, title);
		},

		// onViewAddLine: function (view, item) {
		// 	// Model besorgen 
		// 	var oModel = view.getView().getModel("pl");
		// 	// Der Parent des Buttons ist die Box dessen Parent ist die Zeile und die enhält den Binding path
		// 	var path = item.getSource().getParent().getParent().getBindingContextPath();
		// 	// Daten der Zeile
		// 	var currentdata = oModel.getProperty(path);
		// 	var lfdnr = parseInt(currentdata.Lfdnr) + 1;
		// 	var Lfdnr = ("0000" + lfdnr).slice(-4);

		// 	var path2 = oModel.createKey("PruefErgebnisseSet", {
		// 		Prueflos: currentdata.Prueflos,
		// 		Prueflos_Key_Modus: currentdata.Prueflos_Key_Modus,
		// 		Prueflos_Key_Object: currentdata.Prueflos_Key_Object,
		// 		Vornr: currentdata.Vornr,
		// 		Merknr: currentdata.Merknr,
		// 		Lfdnr: Lfdnr
		// 	});

		// 	oModel.setProperty("/" + path2 + "/visible", 'X');
		// },
		_scrollToListItem: function (ITEM) {
			//var oItemDomRef = VIEW.getView().byId("idresuTableL").getSelectedItem().getDomRef();
			//var oItemDomRef = ITEM.getSource().getDomRef();
			// TableItems
			//var oItems = ITEM.getSource().getParent().getParent().getTable().getItems();

			var oItems = ITEM.getParent().getItems();

			if (this._oItems !== oItems) {
				var oItems_des = oItems.reverse();
				var i;
				for (i = 0; i < oItems_des.length; i++) {
					if (oItems_des[i].getVisible) {
						//var index = i + 1;
						//oItems[index].focus();
						var oItemDomRef = oItems_des[i].getFocusDomRef();
						if (oItemDomRef) {
							oItemDomRef.focus();
							break;
						}
					}
				}
			}
			this._oItems = oItems;
		},
		_tablehaslines: function (TABLE) {
			var oItems = TABLE.getItems();
			if (oItems.length > 0) {
				return true;
			} else {
				return false;
			}
		},
		_tablehaslines_visible: function (TABLE) {
			var oItems = TABLE.getItems();
			var sicht1 = 0;
			var i, a;

			for (i = 0; i < oItems.length; i++) {
				if (oItems[i].getVisible()) {
					sicht1++;
				}
			}
			if (sicht1 > '0') {
				return true;
			} else {
				return false;
			}

		},
		_scrollEndList: function (TABLE) {
			var sicht1 = 0;
			var i, a;

			var oItems = TABLE.getItems();
			// Nur die sichtbaren
			for (i = 0; i < oItems.length; i++) {
				if (oItems[i].getVisible()) {

					// var cells = oItems[i].getCells();
					// var selectbar = cells[3];
					// var sitems = selectbar.getItems();
					// for (a = 0; a < sitems.length; a++) {
					// 	sitems[a].addStyleClass("cssGreen2");
					// 	//var oIcon = sitems[a];
					// 	//oIcon.setColor("#7ffe59");
					// }

					sicht1++;
				}
			}

			if (typeof this._visible === "undefined") {
				this._visible = sicht1;
				return;
			}

			if (this._visible !== sicht1) {
				var oItems_des = oItems.reverse();
				var i;
				for (i = 0; i < oItems_des.length; i++) {
					if (oItems_des[i].getVisible) {
						//var index = i + 1;
						//oItems[index].focus();
						var oItemDomRef = oItems_des[i].getFocusDomRef();
						if (oItemDomRef) {
							oItemDomRef.focus();
							break;
						}
					}
				}
				this._visible = sicht1;
			}

		},
		onViewDelLine: function (view, item) {
			// Model besorgen 
			var oModel = view.getView().getModel("pl");
			// Der Parent des Buttons ist die Box dessen Parent ist die Zeile und die enhält den Binding path
			var path = item.getSource().getParent().getParent().getBindingContextPath();
			// Daten der Zeile
			var currentdata = oModel.getProperty(path);
			// oModel.setProperty(path + "/visible", ' ');
			oModel.setProperty(path + "/visible", false);
			oModel.setProperty(path + "/LINE_ADDED", false);
			// Pending Changes zurücksetzen für diese Zeile
			var pending = [];
			pending.push(path);
			oModel.resetChanges(pending);
		},
		Frist_onSave: function (view) {
			var title = view.getView().getModel("i18n").getResourceBundle().getText("detail2-saveconfirm-title");
			var message = view.getView().getModel("i18n").getResourceBundle().getText("detail2-saveconfirm-message");
			var nosave = view.getView().getModel("i18n").getResourceBundle().getText("detail2-nosave");
			var _c_this = this;

			var oModel = view.getView().getModel("pl");
			if (oModel.hasPendingChanges()) {
				MessageBox.confirm(
					message, {
						icon: sap.m.MessageBox.Icon.QUESTION,
						title: title,
						actions: [sap.m.MessageBox.Action.YES,
							sap.m.MessageBox.Action.NO
						],
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.YES) {
								//_this.getModel("detailView").setProperty("/busy", true);
								_c_this.SaveConfirmed(view);
							}
						}
					});
			} else {
				sap.m.MessageToast.show(nosave);
			}
		},
		onSavePP: function (view) {
			var title = view.getView().getModel("i18n").getResourceBundle().getText("detail1-saveconfirm-title");
			var message = view.getView().getModel("i18n").getResourceBundle().getText("detail1-saveconfirm-message");
			var nosave = view.getView().getModel("i18n").getResourceBundle().getText("detail2-nosave");
			var _c_this = this;

			var oModel = view.getView().getModel("pl");
			if (oModel.hasPendingChanges()) {
				MessageBox.confirm(
					message, {
						icon: sap.m.MessageBox.Icon.QUESTION,
						title: title,
						actions: [sap.m.MessageBox.Action.YES,
							sap.m.MessageBox.Action.NO
						],
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.YES) {
								//_c_this.SaveConfirmed(view);
								var that = _c_this;
								var promise1 = new Promise(function (resolve, reject) {
									that.setBusyView(view.getView(), true);
									that.SaveConfirmedPP(view, resolve, reject);
								});
								promise1.then(function (value) {
									that.setBusyView(view.getView(), false);
								});
							}
						}
					});
			} else {
				sap.m.MessageToast.show(nosave);
			}

		},
		wait: function (timeout) {
			return new Promise(function (resolve, reject) {
				setTimeout(resolve, timeout);
			});
		},
		onSave: function (view) {
			var nosave = view.getView().getModel("i18n").getResourceBundle().getText("detail2-nosave");
			var _c_this = this;

			var oModel = view.getView().getModel("pl");
			//oModel.setUseBatch(false);

			if (oModel.hasPendingChanges()) {
				//_c_this.SaveConfirmed(view);

				var that = _c_this;
				var promise1 = new Promise(function (resolve, reject) {
					that.SaveConfirmed(view, resolve, reject);
				});
				// promise1.then(function (value) {
				// 	var promise2 = new Promise(function (resolve, reject) {
				// 		setTimeout(resolve, 3000);
				// 	});
				// 	promise2.then(function (value) {
				// 		that._navBackMerkmal_list(view);
				// 	});
				// });

			} else {
				sap.m.MessageToast.show(nosave);
			}
		},
		//SaveConfirmed: function (view) {
		SaveConfirmedPP: function (view, fnResolve, fnReject) {
			var oModel = view.getView().getModel("pl");
			var success = view.getView().getModel("i18n").getResourceBundle().getText("detail2-savesuccess");
			var error = view.getView().getModel("i18n").getResourceBundle().getText("detail2-saveerror");
			var title = view.getView().getModel("i18n").getResourceBundle().getText("detail1-newpp");
			var oView = view.getView();
			var oModelG = this.getModel("pl");

			sap.ui.getCore().getMessageManager().removeAllMessages();
			var oChanges = oModel.getPendingChanges();
			var aPendingChanges = $.map(oChanges, function (value, index) {
				return [index];
			});

			//oChanges["PrueflosVorgaengeSet(Prueflos='000002867458',Prueflos_Key_Modus='S1',Prueflos_Key_Object='KTA0133',Vornr='0010',Pruefpunkt='-')"].PP_New
			// Prueflos
			// Prueflos_Key_Modus
			// Prueflos_Key_Object
			// Vornr
			// Pruefpunkt
			// Lfdnr

			var currentdata, pp_new, path;
			var oEntry = {};

			for (var i = 0; i < aPendingChanges.length; i++) {
				path = "/" + aPendingChanges[i];
				currentdata = oModel.getProperty(path);
				pp_new = oChanges[aPendingChanges[i]].PP_New;

				oEntry = {};
				oEntry.Prueflos = currentdata.Prueflos;
				oEntry.Prueflos_Key_Modus = currentdata.Prueflos_Key_Modus;
				oEntry.Prueflos_Key_Object = currentdata.Prueflos_Key_Object;
				oEntry.Vornr = currentdata.Vornr;
				oEntry.Pruefpunkt = pp_new;
				oEntry.Lfdnr = "1";

				oModelG.create("/PruefPunkteSet", oEntry, {
					method: "POST",
					success: function (oData, oResponse) {

						var lv_success = true;

						var obj = oData.__batchResponses;
						for (var i in obj) {
							if ('message' in obj[i]) {
								if (obj[i].message === "HTTP request failed") {
									if (obj[i].response.statusCode === "400") {
										MessageToast.show(error);
										lv_success = false;
										break;
									}
								}
							}
						}

						if (lv_success) {
							//oModel.setProperty("/visible", true);
							var oModelI = view.getView().getModel("inputdata");
							oModelI.setProperty("/_readypp", false);
							MessageToast.show(success);
							fnResolve("success");
							oModel.refresh(true);
						}

					},

					error: function (oData) {
						fnResolve("success");
						MessageBox.error(error, {
							title: title,
							onClose: null,
							styleClass: "",
							initialFocus: null,
							textDirection: sap.ui.core.TextDirection.Inherit
						});
					}

				});

			}
		},
		// onMessagePopoverPress: function (oEvent, view) {
		// 	this._getMessagePopover().openBy(oEvent.getSource());
		// },
		// _getMessagePopover: function () {
		// 	// create popover lazily (singleton)
		// 	if (!this._oMessagePopover) {
		// 		// create popover lazily (singleton)
		// 		this._oMessagePopover = sap.ui.xmlfragment(this.getView().getId(),
		// 			"de.enercon.usbee.view.recordresults.MessagePopover", this);
		// 		this.getView().addDependent(this._oMessagePopover);
		// 	}
		// 	return this._oMessagePopover;
		// },
		SaveConfirmed: function (view, fnResolve, fnReject) {
			var oModel = view.getView().getModel("pl");
			var success = view.getView().getModel("i18n").getResourceBundle().getText("detail2-savesuccess");
			var error = view.getView().getModel("i18n").getResourceBundle().getText("detail2-saveerror");
			var title = view.getView().getModel("i18n").getResourceBundle().getText("detail2-saveconfirm-title");
			var oView = view.getView();

			//oView.setBusy(true);

			var oemptylistmodel = this.getModel("empty_list");

			sap.ui.getCore().getMessageManager().removeAllMessages();

			oModel.submitChanges({
				success: function (oData, oResponse) {
					//console.log(oData);
					//console.log(oResponse);

					var lv_success = true;

					var obj = oData.__batchResponses;
					for (var i in obj) {
						//console.log(obj[i]);
						if ('message' in obj[i]) {
							if (obj[i].message === "HTTP request failed") {
								if (obj[i].response.statusCode === "400") {
									//console.log(obj[i].response.statusCode);
									MessageToast.show(error);
									lv_success = false;
									break;
								}
							}
						}
					}

					if (lv_success) {
						oemptylistmodel.setProperty("/_active", true);
						MessageToast.show(success);
						fnResolve("success");
						oModel.refresh(true);
						//oView.setBusy(false);
					}

				},

				error: function (oData) {
					//console.log(oData);
					MessageBox.error(error, {
						title: title,
						onClose: null,
						styleClass: "",
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});
					//oModel.refresh();
				}
			});

		},
		viewNavBack: function (_this) {
			var oModel = _this.getView().getModel("pl");
			var message = _this.getView().getModel("i18n").getResourceBundle().getText("detail2-saveconfirm-message");
			var title = _this.getView().getModel("i18n").getResourceBundle().getText("detail2-saveconfirm-title");
			var _c_this = this;

			if (oModel.hasPendingChanges()) {

				var check_result = this.check_all(_this);
				if (!check_result) {
					return;
				}

				MessageBox.confirm(
					message, {
						icon: sap.m.MessageBox.Icon.QUESTION,
						title: title,
						actions: [sap.m.MessageBox.Action.YES,
							sap.m.MessageBox.Action.NO
						],
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.YES) {
								//_c_this.SaveConfirmed(_this);
								//_c_this._navBackMerkmal(_this);
								var that = _c_this;
								var promise1 = new Promise(function (resolve, reject) {
									that.SaveConfirmed(_this, resolve, reject);
								});
								promise1.then(function (value) {
									if (value === "success") {
										that._navBackMerkmal(_this);
										//oModel.refresh(true);
									}
								});

							} else {
								var oModel2 = _this.getView().getModel("pl");
								//oModel2.refresh(true);
								oModel2.resetChanges();
								_c_this._navBackMerkmal(_this);
							}
						}
					});
			} else {
				this._navBackMerkmal(_this);
			}
		},
		_navBackMerkmal: function (THIS) {
			var nav;
			var oModel = THIS.getView().getModel("pl");
			var path = THIS.getView().getBindingContext("pl").sPath;
			//Von diesem Merkmal kommen wir, dann zurück in die Vorgangsliste
			var currentdata = oModel.getProperty(path);

			var oModelSettings = this.getSettings();
			oModelSettings.setProperty("/_autoreload_except_recordresults", false);

			this.getRouter().navTo("vorgang", {
				pl: currentdata.Prueflos,
				pl_key_modus: currentdata.Prueflos_Key_Modus,
				pl_key_object: currentdata.Prueflos_Key_Object,
				vornr: currentdata.Vornr,
				pruefpunkt: currentdata.Pruefpunkt
			}, false);

			// var aTarget;
			// aTarget = ["plMaster", "plVorgang"];
			// this.getRouter().getTargets().display(aTarget);

		},
		viewNavBack_list: function (_this) {
			var oModel = _this.getView().getModel("pl");
			var message = _this.getView().getModel("i18n").getResourceBundle().getText("detail2-saveconfirm-message");
			var title = _this.getView().getModel("i18n").getResourceBundle().getText("detail2-saveconfirm-title");
			var _c_this = this;

			if (oModel.hasPendingChanges()) {

				var check_result = this.check_all(_this);
				if (!check_result) {
					return;
				}

				MessageBox.confirm(
					message, {
						icon: sap.m.MessageBox.Icon.QUESTION,
						title: title,
						actions: [sap.m.MessageBox.Action.YES,
							sap.m.MessageBox.Action.NO
						],
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.YES) {
								//_c_this.SaveConfirmed(_this);
								//_c_this._navBackMerkmal(_this);
								var that = _c_this;
								var promise1 = new Promise(function (resolve, reject) {
									that.SaveConfirmed(_this, resolve, reject);
								});
								promise1.then(function (value) {
									if (value === "success") {
										that._navBackMerkmal_list(_this);
										//oModel.refresh(true);
									}
								});

							} else {
								var oModel2 = _this.getView().getModel("pl");
								//oModel2.refresh(true);
								oModel2.resetChanges();
								_c_this._navBackMerkmal_list(_this);
							}
						}
					});
			} else {
				this._navBackMerkmal_list(_this);
			}
		},
		_navBackMerkmal_list: function (THIS) {
			//var nav;
			var oModel = THIS.getView().getModel("pl");
			var path = THIS.getView().getBindingContext("pl").sPath;
			// Von diesem Merkmal kommen wir, dann zurück in die Vorgangsliste
			var currentdata = oModel.getProperty(path);

			//Besser wegen Busy nach Speichern
			// var aTarget;
			// aTarget = ["plVorg_list"];
			// this.getRouter().getTargets().display(aTarget);

			var oModelSettings = this.getSettings();
			oModelSettings.setProperty("/_autoreload_except_recordresults", false);

			this.getRouter().navTo("vorgang_list", {
				pl: currentdata.Prueflos,
				pl_key_modus: currentdata.Prueflos_Key_Modus,
				pl_key_object: currentdata.Prueflos_Key_Object,
				vornr: currentdata.Vornr,
				pruefpunkt: currentdata.Pruefpunkt
			}, false);
		},
		_navBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				window.history.go(-2);
			}
		},
		handleautoreload: function (evt, oView) {
			if (oView) {
				var autoreload = false;
				if (!this._autoreload) {
					this._autoreload = autoreload;
				}
				if (evt.getSource().getPressed()) {
					this._autoreload = true;
				} else {
					this._autoreload = false;
				}
			}

		},
		// handleRapidNav: function (evt, oView) {
		// 	if (oView) {
		// 		var rapid = false;
		// 		if (!this._rapid) {
		// 			this._rapid = rapid;
		// 		}
		// 		if (evt.getSource().getPressed()) {
		// 			this._rapid = true;
		// 		} else {
		// 			this._rapid = false;
		// 		}
		// 	}
		// },
		handleReload: function (evt, oView) {
			var reloaded = this.getModel("i18n").getResourceBundle().getText("reloaded");
			var oModel = this.getModel("pl");
			//if (!oModel.hasPendingChanges()) {
			//oModel.destroy();
			//oModel.updateBindings(true);
			//oView.byId("Merkmale").getBinding("items").refresh();

			sap.ui.getCore().getMessageManager().removeAllMessages();
			//oModel.refresh(true, true);
			oModel.refresh(true);
			oModel.resetChanges();
			sap.m.MessageToast.show(reloaded);
			//}
		},
		handleFullscreen: function (evt) {

			var path = jQuery.sap.getModulePath("de.enercon.usbee");
			switch (path) {
			case ".":
				var oCore = sap.ui.getCore();
				if (!this._oShell) {
					//	this._oShell = sap.ui.getCore().byId("Shell1");
					this._oShell = oCore.byId("Shell1");
				}

				if (evt.getSource().getPressed()) {
					//MessageToast.show(evt.getSource().getId() + " Pressed");
					this._oShell.setAppWidthLimited(false);
				} else {
					//MessageToast.show(evt.getSource().getId() + " Unpressed");
					this._oShell.setAppWidthLimited(true);
					//this._getSplitApp().setMode('ShowHideMode');
				}

				break;
			default:
				var config = sap.ushell.services.AppConfiguration;

				if (evt.getSource().getPressed()) {
					config.setApplicationFullWidth(true);
				} else {
					config.setApplicationFullWidth(false);
				}

				break;
			}

		},
		handleHideMaster: function (evt, oView) {
			//Hide Master
			if (oView) {
				var oSplit1 = oView.byId("Split1");
				if (!this._oSplit) {
					this._oSplit = oSplit1;
				}
				if (evt.getSource().getPressed()) {
					this._oSplit.setMode('HideMode');
				} else {
					this._oSplit.setMode('ShowHideMode');
				}
			}
		},
		// saveRouting: function (evt, oView) {
		// 	var oParameters = evt.getParameters();
		// 	var sRouteName = oParameters.name;
		// 	var oModel = this.getModel("GLOBAL");
		// 	oModel.setProperty("/_route", sRouteName);
		// },
		saveViewPos: function (name) {
			//var name = oView.getViewName();
			var oModel = this.getModel("GLOBAL");
			oModel.setProperty("/_LastViewPos", name);
		},
		onBarcodeEntry: function (oEvent, oView, LIST) {

			//88891;GM002115090

			jQuery.sap.require("sap.ndc.BarcodeScanner");

			//var that = this;
			//var oModel = that.getOwnerComponent().getModel("pl");
			//var oView = this.getView();
			//var oTable = this.getView().byId("foundPLs");

			// 88891;HWHX-01
			//var searchField = this.getView().byId("Scan");
			//var status = sap.ndc.BarcodeScanner.getStatusModel();

			sap.ndc.BarcodeScanner.scan(
				//function a(mresult) {searchField.setValue(mresult.text);}
				function a(mresult) {

					if (mresult.text !== "") {
						//var oFilters = [new sap.ui.model.Filter("Scanner_Eingabei.model.FilterOperator.EQ, mresult.text)];
						var scan = "1LSCAN:" + mresult.text;
						var oFilter1 = new sap.ui.model.Filter("Scanner_Eingabe", sap.ui.model.FilterOperator.Contains, scan);
						var oFilters = new sap.ui.model.Filter({
							filters: [
								oFilter1
							],
							and: false
						});
						var list = oView.byId(LIST);
						var binding = list.getBinding("items");
						binding.filter(oFilters);
					}
				}
			);
		},
		onBarcodeEntryNew: function (oEvent, oView, LIST) {

			//console.log("handleBarcodeScannerSuccess " + JSON.stringify(event.mParameters));

			if (!oEvent.mParameters.cancelled) {

				if (oEvent.mParameters.text !== "") {
					//var oFilters = [new sap.ui.model.Filter("Scanner_Eingabei.model.FilterOperator.EQ, mresult.text)];
					var scan = "1LSCAN:" + oEvent.mParameters.text;
					var oFilter1 = new sap.ui.model.Filter("Scanner_Eingabe", sap.ui.model.FilterOperator.Contains, scan);
					var oFilters = new sap.ui.model.Filter({
						filters: [
							oFilter1
						],
						and: false
					});
					var list = oView.byId(LIST);
					var binding = list.getBinding("items");
					binding.filter(oFilters);
				}

				// Make sure you update the path below to your formatter function:
				// var sEntityPath = pl.arvato.tut00mat00.util.Formatter.encodeMaterialSetMatNr(event.mParameters.text);
				//var bReplace = jQuery.device.is.phone ? false : true;
				//this.showDetailForPath(sEntityPath, bReplace);
			}
		},
		setBusyView: function (oView, bool) {
			oView.setBusy(bool);
		},
		handlePPCreate: function (OEVENT, OVIEW) {
			var oModel = OVIEW.getModel("pl");
			//var oButton = OEVENT.getSource();
			// Der Parent des Buttons ist die Box dessen Parent ist die Zeile und die enhält den Binding path
			var path = OVIEW.getBindingContext("pl").sPath;
			// Daten der Zeile
			var currentdata = oModel.getProperty(path);
			// this._fotoDialog.open(OVIEW,currentdata);

			// Call Foto View
			var aTarget = ["plMaster", "plVorgang_CreatePP"];
			var nav = "Prueflos_CreatePP";

			//this.getRouter().getTargets().display(aTarget);
			this.getRouter().navTo(nav, {
				pl: currentdata.Prueflos,
				pl_key_modus: currentdata.Prueflos_Key_Modus,
				pl_key_object: currentdata.Prueflos_Key_Object
					// vornr: currentdata.Vornr,
					// pruefpunkt: currentdata.Pruefpunkt,
					// merknr: currentdata.Merknr
			}, false);
		},
		handlePPCreate_list: function (OEVENT, OVIEW) {
			var oModel = OVIEW.getModel("pl");
			//var oButton = OEVENT.getSource();
			// Der Parent des Buttons ist die Box dessen Parent ist die Zeile und die enhält den Binding path
			var path = OVIEW.getBindingContext("pl").sPath;
			// Daten der Zeile
			var currentdata = oModel.getProperty(path);
			// this._fotoDialog.open(OVIEW,currentdata);

			// Call Foto View
			//var aTarget = ["plMaster", "plMerkmal_Fotos"];
			var nav = "Prueflos_CreatePP_list";

			//this.getRouter().getTargets().display(aTarget);
			this.getRouter().navTo(nav, {
				pl: currentdata.Prueflos,
				pl_key_modus: currentdata.Prueflos_Key_Modus,
				pl_key_object: currentdata.Prueflos_Key_Object
					// vornr: currentdata.Vornr,
					// pruefpunkt: currentdata.Pruefpunkt,
					// merknr: currentdata.Merknr
			}, false);
		},
		handleMKSwipe: function (OEVENT, OVIEW, THIS) {
			switch (OEVENT.type) {
			case 'swiperight':
				this.handleMerkmalNav('U', OEVENT, THIS);
				break;
			case 'swipeleft':
				this.handleMerkmalNav('D', OEVENT, THIS);
				break;
			}
		},
		handleMKSwipe_list: function (OEVENT, OVIEW, THIS) {
			switch (OEVENT.type) {
			case 'swiperight':
				this.handleMerkmalNav_list('U', OEVENT, THIS);
				break;
			case 'swipeleft':
				this.handleMerkmalNav_list('D', OEVENT, THIS);
				break;
			}
		},
		attachBrowserEventVIEW: function (THIS, ART) {
			return;

			var oHeader = THIS.byId("oh1");
			var that = THIS;
			var oView = that.getView();

			oHeader.attachBrowserEvent(
				"swiperight",
				function (oEvent) {
					//that.getOwnerComponent().handleMKSwipe(oEvent, that.getView(), that);
					if (ART === 'MD') {
						that.getOwnerComponent().handleMerkmalNav('U', oEvent, that);
					} else {
						that.getOwnerComponent().handleMerkmalNav_list('U', oEvent, that);
					}
					//that.getOwnerComponent().setBusyView(oView, false);
				}
			);
			oHeader.attachBrowserEvent(
				"swipeleft",
				function (oEvent) {
					//that.getOwnerComponent().handleMKSwipe(oEvent, that.getView(), that);
					if (ART === 'MD') {
						that.getOwnerComponent().handleMerkmalNav('D', oEvent, that);
					} else {
						that.getOwnerComponent().handleMerkmalNav_list('D', oEvent, that);
					}
					//that.getOwnerComponent().setBusyView(oView, false);
				}
			);
		},
		showPDF: function (URL, FILENAME) {
			var title = this.getModel("i18n").getResourceBundle().getText("dokutitle");
			var dokut = this.getModel("i18n").getResourceBundle().getText("dokuload");
			MessageToast.show(dokut + " " + FILENAME);

			var _pdfv = new sap.m.PDFViewer();

			// TEST
			// var imagepath;
			// var path = jQuery.sap.getModulePath("de.enercon.usbee");
			// switch (path) {
			// case ".":
			// 	imagepath = "image";
			// 	break;
			// default:
			// 	imagepath = path + "/image";
			// 	break;
			// }
			// var URL = imagepath + "/Entwicklungsrichtlinien.pdf";

			_pdfv.setSource(URL);

			// In chrome open popup
			// if (sap.ui.Device.browser.name === "cr") {
			title = title + ": " + FILENAME;
			_pdfv.setTitle(title);
			_pdfv.setShowDownloadButton(false);
			_pdfv.open();
			// } else {
			// _pdfv.setDisplayType(sap.m.PDFViewerDisplayType.Link);
			//_pdfv.downloadPDF();
			//}
		},
		showIMAGE: function (OVIEW, URL, FILENAME, MIMETYPE) {
			this._imageDialog.open(OVIEW, URL, FILENAME, MIMETYPE);
		},
		onMKFHM: function (oview, evt) {
			var titleMK = this.getModel("i18n").getResourceBundle().getText("detail2-FHMMK");
			var oModel_pl = this.getModel("pl");
			var oModel_gl = this.getModel("GLOBAL");
			//var URL = this._dokuDialog.open(oview, oModel);

			var path = oview.getBindingContext("pl").sPath;
			var currentdata = oModel_pl.getProperty(path);
			var title = titleMK + " " + Number(currentdata.Prueflos) + " - " + currentdata.Vornr + " - " + currentdata.Merknr;

			// var path = item.getSource().getParent().getBindingContextPath();
			// var currentdata = oModel_pl.getProperty(path);
			// var title = titleVG + " " + Number(currentdata.Prueflos) + " - " + currentdata.Vornr;

			var that = this;
			var URL;
			var promise_d = new Promise(function (resolve, reject) {
				that._fhmDialog.open("MK", path, title, oview, oModel_pl, oModel_gl, resolve, reject);
			});
			promise_d.then(function (value) {
				if (value === "success") {
					var URL = oModel_gl.getProperty("/_displayfile/url");
					var FILE = oModel_gl.getProperty("/_displayfile/file");
					var mime = oModel_gl.getProperty("/_displayfile/mimetype");

					switch (mime) {
					case "application/pdf":
						that.showPDF(URL, FILE);
						break;
					case "image/x-ms-bmp":
						that.showIMAGE(oview, URL, FILE, mime);
					case "image/png":
						that.showIMAGE(oview, URL, FILE, mime);
					case "image/gif":
						that.showIMAGE(oview, URL, FILE, mime);
					case "image/tiff":
						that.showIMAGE(oview, URL, FILE, mime);
					case "image/jpeg":
						that.showIMAGE(oview, URL, FILE, mime);
					}

				}
			});

		},
		onVorgFHM: function (oview, item) {
			//var titleVG = this.getModel("i18n").getResourceBundle().getText("text-titleVG");
			// // Model besorgen 
			// var oModel = view.getView().getModel("pl");
			// // Der Parent des Buttons ist die Box dessen Parent ist die Zeile und die enhält den Binding path
			// //var sitem = item.getSource().getParent().getParent();
			// var path = item.getSource().getParent().getBindingContextPath();
			// // Daten der Zeile
			// var currentdata = oModel.getProperty(path);
			// //title="{i18n>text-titleMK} {path: 'data>/Prueflos', type : 'sap.ui.model.odata.type.String', constraints: { isDigitSequence : true }} / {data>/Vornr} / {data>/Merknr}">-->
			// var title = titleVG + " " + Number(currentdata.Prueflos) + " - " + currentdata.Vornr;
			// this._textDialog.open(view, currentdata, title);
			//////////////////////////////////////////////////////////////////
			// this.showComingSoon(oview);
			// return;

			var titleVG = this.getModel("i18n").getResourceBundle().getText("detail2-FHMVG");
			var oModel_pl = this.getModel("pl");
			var oModel_gl = this.getModel("GLOBAL");
			//var URL = this._dokuDialog.open(oview, oModel);

			var path = item.getSource().getParent().getBindingContextPath();
			// Daten der Zeile
			var currentdata = oModel_pl.getProperty(path);
			var title = titleVG + " " + Number(currentdata.Prueflos) + " - " + currentdata.Vornr;

			//var VIEW = oview.getView();
			var that = this;
			var URL;
			var promise_d = new Promise(function (resolve, reject) {
				that._fhmDialog.open("VG", path, title, oview, oModel_pl, oModel_gl, resolve, reject);
			});
			promise_d.then(function (value) {
				if (value === "success") {
					var URL = oModel_gl.getProperty("/_displayfile/url");
					var FILE = oModel_gl.getProperty("/_displayfile/file");
					var mime = oModel_gl.getProperty("/_displayfile/mimetype");

					switch (mime) {
					case "application/pdf":
						that.showPDF(URL, FILE);
						break;
					case "image/x-ms-bmp":
						that.showIMAGE(oview, URL, FILE, mime);
					case "image/png":
						that.showIMAGE(oview, URL, FILE, mime);
					case "image/gif":
						that.showIMAGE(oview, URL, FILE, mime);
					case "image/tiff":
						that.showIMAGE(oview, URL, FILE, mime);
					case "image/jpeg":
						that.showIMAGE(oview, URL, FILE, mime);
					}

				}

			});

		},
		jumphome: function () {
			var oModelSettings = this.getSettings();
			oModelSettings.setProperty("/_autoreload_except_recordresults", false);

			// var oemptylistmodel = this.getModel("empty_list");
			// oemptylistmodel.setProperty("/_called", false);

			this.getRouter().navTo("appHome", {}, false);
		},
		openSettingsDialog: function (OVIEW) {
			var oModelSettings = this.getModel("GSETTINGS");
			this._settingsDialog.open(OVIEW, oModelSettings, this);
			//this.handleautoreload_new();
		},
		getSettings: function () {
			return this.getModel("GSETTINGS");
		},
		onSecondTriggered: function () {
			var reload_text = this.getModel("i18n").getResourceBundle().getText("reload2");
			var oModelSettings = this.getSettings();
			var autoreload_min = oModelSettings.getProperty("/_autoreload_min");
			var time_fin = oModelSettings.getProperty("/_autoreload_fin_time");

			var time_now = new Date();
			var time_rest = time_fin - time_now;
			var time_total = 1000 * 60 * autoreload_min;

			var newPercent = (100 / time_total) * time_rest;
			newPercent = Math.round(newPercent);

			var rest_date = new Date(time_rest);
			var rest_mins = ("00" + rest_date.getMinutes()).slice(-2);
			var rest_secs = ("00" + rest_date.getSeconds()).slice(-2);

			if (newPercent >= 1) {
				oModelSettings.setProperty("/_autoreload_pg_percent", newPercent);
				//oModelSettings.setProperty("/_autoreload_pg_text", reload_text + " " + rest_mins + ":" + rest_secs);
				oModelSettings.setProperty("/_autoreload_pg_text", reload_text + " " + rest_mins + ":" + rest_secs);
			} else {
				oModelSettings.setProperty("/_autoreload_pg_text", "Refresh...");
				this._trigger_second.setInterval(0);

				// var that = this;
				// var promise1 = new Promise(function (resolve, reject) {
				// 	that.onRefreshTriggered_new();
				// 	that.waiting(7000);  //7 seconds in milliseconds
				// 	resolve("reload");
				// });
				// promise1.then(function (value) {
				// 	sap.ui.core.BusyIndicator.hide();
				// 	that.handleautoreload_new();
				// });

				var that = this;
				var promise1 = new Promise(function (resolve, reject) {
					sap.ui.core.BusyIndicator.show(0);
					that.onRefreshTriggered_new();
					setTimeout(function () {
						resolve("reload");
					}, 5000);
				});
				promise1.then(function (value) {
					sap.ui.core.BusyIndicator.hide();
					that.handleautoreload_new();
				});

			}
		},
		onRefreshTriggered_new: function () {
			var oModelSettings = this.getSettings();
			var autoreload = oModelSettings.getProperty("/_autoreload");
			var autoreload_min = oModelSettings.getProperty("/_autoreload_min");
			var autoreload_except_recordresults = oModelSettings.getProperty("/_autoreload_except_recordresults");

			var intervall = " " + autoreload_min + " min";

			if (autoreload) {
				if (!autoreload_except_recordresults) {
					var autoreload_text = this.getModel("i18n").getResourceBundle().getText("autoreload") + intervall;
					var oModel = this.getModel("pl");
					if (!oModel.hasPendingChanges()) {
						oModel.refresh(true);
						sap.m.MessageToast.show(autoreload_text);
					}
				}
			}
		},
		waiting: function (ms) {
			var start = new Date().getTime();
			var end = start;
			while (end < start + ms) {
				end = new Date().getTime();
			}
		},
		handleautoreload_new: function () {

			var oModelSettings = this.getSettings();
			var autoreload = oModelSettings.getProperty("/_autoreload");
			oModelSettings.getProperty("/_autoreload");
			var autoreload_min = parseInt(oModelSettings.getProperty("/_autoreload_min"));
			oModelSettings.setProperty("/_autoreload_pg_percent", parseFloat("100"));
			oModelSettings.setProperty("/_autoreload_pg_time", "");

			var jetzt = new Date();
			var jetztfin = new Date(jetzt.getTime() + autoreload_min * 60000);
			//Test
			//var jetztfin = new Date(jetzt.getTime() + 10000);
			oModelSettings.setProperty("/_autoreload_fin_time", jetztfin);

			if (autoreload) {
				//var intervall = 1000 * 60 * autoreload_min;
				//var intervall = 1000 * autoreload_min;

				this._trigger_second = new sap.ui.core.IntervalTrigger(1000);
				this._trigger_second.addListener(this.onSecondTriggered, this);

				// if (this._trigger) {
				// 	this._trigger.setInterval(intervall);
				// } else {
				// 	this._trigger = new sap.ui.core.IntervalTrigger(intervall);
				// 	this._trigger.addListener(this.onRefreshTriggered_new, this);
				// }
			} else {
				// if (this._trigger) {
				// 	this._trigger.setInterval(0);
				// }
				if (this._trigger_second) {
					this._trigger_second.setInterval(0);
				}
			}
		},
		_create_load_usersettings: function () {

			try {
				// Funktioniert nur über Launchpad (Shell)
				var Username = sap.ushell.Container.getService("UserInfo").getId();
			} catch (err) {
				Username = "SY-UNAME";
			}
			//var oModel1 = new sap.ui.model.json.JSONModel();
			//var oModel1 = new JSONModel;
			//oModel1.loadData("/sap/bc/ui2/start_up", "", false);
			//var systemid = oModel1.getProperty("/system");

			//oModel1.loadData("/sap/bc/ui2/start_up");
			// sap.ui.require([
			// 	'sap/ushell_abap/bootstrap/abap'
			// ], function () {
			// 	var sysinfo = window["sap-ushell-config"].services.Container.adapter.config;
			// 	console.log(sysinfo.id);
			// });

			var oModelSettings = new JSONModel({
				_Username: Username,
				_rapid: true,
				_picu: false,
				_autoreload: false,
				_autoreload_min: parseFloat("3"),
				_autoreload_except_recordresults: false,
				_autoreload_pg_percent: parseFloat("100"),
				_autoreload_pg_time: "",
				_autoreload_fin_time: new Date(),
				_growingThreshold: 15,
				_piclist: false,
				_settings_read: false,
				_Super_Access: false,
				_Log_Deactive: true,
				_Log_Done: false,
				_sysid: "",
				_filterzr: false
			});
			this.setModel(oModelSettings, "GSETTINGS");

			var that = this;
			var oModel = this.getModel("pl");

			var promise1 = new Promise(function (resolve, reject) {
				var path = "/UserSettingsSet('" + Username + "')";
				oModel.read(path, {
					success: function (oData) {
						var oModelSettings1 = that.getSettings();
						oModelSettings1.setProperty("/_Username", oData.Bname);
						oModelSettings1.setProperty("/_rapid", oData.SRapid);
						oModelSettings1.setProperty("/_picu", oData.SPicu);
						oModelSettings1.setProperty("/_autoreload", oData.SAutoreload);
						oModelSettings1.setProperty("/_autoreload_min", oData.SAutoreloadMin);
						oModelSettings1.setProperty("/_growingThreshold", oData.SGrowingthreshold);
						oModelSettings1.setProperty("/_piclist", oData.SPicList);
						oModelSettings1.setProperty("/_settings_read", true);
						oModelSettings1.setProperty("/_Super_Access", oData.Super_Access);
						oModelSettings1.setProperty("/_Log_Deactive", oData.Log_Deactive);
						oModelSettings1.setProperty("/_Log_Done", false);
						oModelSettings1.setProperty("/_sysid", oData.SysID);
						oModelSettings1.setProperty("/_filterzr", oData.SFilterZr);
						resolve('resolved');
					}

				});

			});
			promise1.then(function (value) {
				that.handleautoreload_new();
			});
			// this.setModel(oModelSettings, "GSETTINGS");
		},
		save_settings: function (gsettings) {
			var save_text = this.getModel("i18n").getResourceBundle().getText("settingssave");
			var oModel = this.getModel("pl");
			var that = this;

			var oEntry = {};
			oEntry.Bname = gsettings.getProperty("/_Username");
			oEntry.SRapid = gsettings.getProperty("/_rapid");
			oEntry.SPicu = gsettings.getProperty("/_picu");
			oEntry.SAutoreload = gsettings.getProperty("/_autoreload");
			oEntry.SAutoreloadMin = gsettings.getProperty("/_autoreload_min");
			oEntry.SGrowingthreshold = gsettings.getProperty("/_growingThreshold");
			oEntry.SPicList = gsettings.getProperty("/_piclist");
			oEntry.SFilterZr = gsettings.getProperty("/_filterzr");

			var path = "/UserSettingsSet('" + oEntry.Bname + "')";

			oModel.update(path, oEntry, {
				method: "PUT",
				success: function (data) {
					//alert("success");
					sap.m.MessageToast.show(save_text);
					//that.handleReload();
					oModel.refresh(true);
				},
				error: function (e) {
					//alert("error");
				}
			});

			//if (oEntry.SFilterZr) {
			//		this.handleautoreload();
			//}

		},
		_create_user_access_log: function (target, globalmodel, usersettingsmodel) {
			var dat = new Date();
			var jahr = dat.getFullYear();
			var monat = dat.getMonth() + 1;
			monat = ("0" + monat).slice(-2);
			var tag = dat.getDate();
			tag = ("0" + tag).slice(-2);
			var stunde = dat.getHours();
			stunde = ("0" + stunde).slice(-2);
			var minute = dat.getMinutes();
			minute = ("0" + minute).slice(-2);
			var sekunde = dat.getSeconds();
			sekunde = ("0" + sekunde).slice(-2);

			var oLog = {};
			oLog.Bname = usersettingsmodel.getProperty("/_Username");
			oLog.Adatum = jahr + monat + tag;
			oLog.Auzeit = stunde + minute + sekunde;
			oLog.Browser = sap.ui.Device.browser.name;
			oLog.Os = sap.ui.Device.os.name;

			if (sap.ui.Device.system.tablet) {
				oLog.Frontend = '1';
			}
			if (sap.ui.Device.system.phone) {
				oLog.Frontend = '2';
			}
			if (sap.ui.Device.system.desktop) {
				oLog.Frontend = '3';
			}
			if (sap.ui.Device.system.combi) {
				oLog.Frontend = '4';
			}

			oLog.Launchpad = globalmodel.getProperty("/_launchpad");
			oLog.URL = globalmodel.getProperty("/_url");

			// var system = globalmodel.getProperty("/_system");
			// if (system === 'WebIde-SCP') {
			// 	oLog.ERP = "IDE";
			// } else {
			// 	oLog.ERP = system;
			// }
			oLog.ERP = usersettingsmodel.getProperty("/_sysid");
			oLog.Target = target;

			var oModel = this.getModel("pl");

			oModel.create("/UserAccessLogSet", oLog, {
				method: "POST",
				success: function (data) {
					//alert("success");
					//Wenn erfolgreich Matnr/Sernr merken 
					// var oModelSernr = _this.getOwnerComponent().getModel("lastsernr");
					// oModelSernr.setProperty("/_LASTSERNR", oEntry.Sernr);
					// oModelSernr.setProperty("/_LASTMATNR", oEntry.Matnr);

				},
				error: function (e) {
					//alert("error");
				}
			});

		},
		SetClock: function () {
			// var tday = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
			// var tmonth = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November",
			// 	"December");
			// var d = new Date();
			// var nday = d.getDay(),
			// 	nmonth = d.getMonth(),
			// 	ndate = d.getDate(),
			// 	nyear = d.getYear(),
			// 	nhour = d.getHours(),
			// 	nmin = d.getMinutes(),
			// 	nsec = d.getSeconds(),
			// 	ap;
			// if (nhour === 0) {
			// 	ap = " AM";
			// 	nhour = 12;
			// } else if (nhour < 12) {
			// 	ap = " AM";
			// } else if (nhour == 12) {
			// 	ap = " PM";
			// } else if (nhour > 12) {
			// 	ap = " PM";
			// 	nhour -= 12;
			// }
			// if (nyear < 1000) nyear += 1900;
			// if (nmin <= 9) nmin = "0" + nmin;
			// if (nsec <= 9) nsec = "0" + nsec;
			// var result = "" + tday[nday] + ", " + tmonth[nmonth] + " " + ndate + ", " + nyear + " " + nhour + ":" + nmin + ":" + nsec + ap + "";
			//return result;

			//> zahl = 123
			//> ("00000" + zahl).slice(-5);
			//'00123'

			var datum = new Date();
			//datum.toLocaleString();
			var nhour = ("00" + datum.getHours()).slice(-2);
			var nmin = ("00" + datum.getMinutes()).slice(-2);
			var nsec = ("00" + datum.getSeconds()).slice(-2);

			var uhrzeit = nhour + ":" + nmin + ":" + nsec;

			var oModel = this.getModel("GLOBAL");
			oModel.setProperty("/_clock1", datum);
			oModel.setProperty("/_clock2", uhrzeit);
		},
		detail2_switch_to_sernr: function (data, nav) {
			var text_no = this.getModel("i18n").getResourceBundle().getText("detail2-sernrcomplete") + " " + data.RESULTS_SERNR;
			var text_cancel = this.getModel("i18n").getResourceBundle().getText("popup_cancel");
			var pu_full = this.getModel("i18n").getResourceBundle().getText("pu_full");
			var sResponsivePaddingClasses = "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer";
			var that = this;

			var serial_array = data.RESULTS_SERNR.split("/");
			serial_array.push(text_cancel);

			MessageBox.show(
				text_no, {
					icon: MessageBox.Icon.WARNING,
					title: pu_full, //'Prüfumfang erfüllt',
					actions: serial_array, //["Sernr1", "Sernr2"],
					emphasizedAction: text_cancel,
					initialFocus: text_cancel,
					styleClass: sResponsivePaddingClasses,
					onClose: function (oAction) {
						var pos = serial_array.indexOf(oAction);

						if (oAction !== text_cancel) {

							that.getRouter().navTo(nav, {
								pl: data.Prueflos,
								pl_key_modus: data.Prueflos_Key_Modus,
								pl_key_object: serial_array[pos],
								vornr: data.Vornr,
								pruefpunkt: data.Pruefpunkt,
								merknr: data.Merknr
							}, false);
						}
					}
				}
			);

		},
		detail2_navto: function (OITEM, ART, THIS) {
			var oItem = OITEM;

			var oBindingContext = oItem.getBindingContext("pl");
			var oPath = oBindingContext.getPath();
			var oModel = oBindingContext.getModel().getProperty(oPath);

			var pl = oModel.Prueflos;
			var modus = oModel.Prueflos_Key_Modus;
			var object = oModel.Prueflos_Key_Object;
			var vornr = oModel.Vornr;
			var merknr = oModel.Merknr;
			var pruefpunkt = oModel.Pruefpunkt;
			var art = oModel.ART_MERKMAL;
			var aTarget;
			var nav;

			switch (art) {
			case 'E':
				var text_no = this.getModel("i18n").getResourceBundle().getText("detail2-noleit");
				break;
			case 'X':
				var text_no = this.getModel("i18n").getResourceBundle().getText("detail2-nostich");
				break;
			case 'Y':
				var text_no = this.getModel("i18n").getResourceBundle().getText("detail2-nokata");
				break;
			case 'F':
				var text_no = this.getModel("i18n").getResourceBundle().getText("detail2-noform");
				break;
			case 'S':
				var text_no = this.getModel("i18n").getResourceBundle().getText("detail2-nosumm");
				break;
			case 'Z':
				var text_no = this.getModel("i18n").getResourceBundle().getText("detail2-sx");
				break;
			case 'Q':
				var text_no = this.getModel("i18n").getResourceBundle().getText("detail2-sernrcomplete") + " " + oModel.RESULTS_SERNR;
				break;
			case 'R':
				var text_no = this.getModel("i18n").getResourceBundle().getText("detail2-sernrcomplete") + " " + oModel.RESULTS_SERNR;

			}

			//if (art === 'F' || art === 'S' || art === 'E' || art === "X" || art === "Y" || art === "Z" || art === "Q" || art === "R") {
			if (art === 'F' || art === 'S' || art === 'E' || art === "X" || art === "Y" || art === "Z") {
				MessageToast.show(text_no);
				return;
			}
			/////////////////////////////////////////////////////////////////////////////////////
			if (ART === 'L') {
				switch (modus) {
				case 'S1': // Single Sernr
					if (art === "L") {
						nav = "Merkmal_S1_Qual_list";
					} else {
						nav = "Merkmal_S1_Quan_list";
					}
					break;
				case 'SX': // Sernr for Input
					if (art === "L") {
						nav = "Merkmal_SX_Qual_list";
					} else {
						nav = "Merkmal_SX_Quan_list";
					}
					break;
				case 'CH': // Charge
					if (art === "L") {
						nav = "Merkmal_CH_Qual_list";
					} else {
						nav = "Merkmal_CH_Quan_list";
					}
					break;
				case 'NN': // Weder Charge noch Sernr
					if (art === "L") {
						nav = "Merkmal_NN_Qual_list";
					} else {
						nav = "Merkmal_NN_Quan_list";
					}
					break;
				}
			}
			/////////////////////////////////////////////////////////////////////////////////////
			if (ART === 'M') {
				switch (modus) {
				case 'S1': // Single Sernr
					if (art === "L") {
						aTarget = ["plMaster", "plMerkmal_S1_Qual"];
						nav = "Merkmal_S1_Qual";
					} else {
						aTarget = ["plMaster", "plMerkmal_S1_Quan"];
						nav = "Merkmal_S1_Quan";
					}
					break;
				case 'SX': // Sernr for Input
					if (art === "L") {
						aTarget = ["plMaster", "plMerkmal_SX_Qual"];
						nav = "Merkmal_SX_Qual";
					} else {
						aTarget = ["plMaster", "plMerkmal_SX_Quan"];
						nav = "Merkmal_SX_Quan";
					}
					break;
				case 'CH': // Charge
					if (art === "L") {
						aTarget = ["plMaster", "plMerkmal_CH_Qual"];
						nav = "Merkmal_CH_Qual";
					} else {
						aTarget = ["plMaster", "plMerkmal_CH_Quan"];
						nav = "Merkmal_CH_Quan";
					}
					break;
				case 'NN': // Weder Charge noch Sernr
					if (art === "L") {
						aTarget = ["plMaster", "plMerkmal_NN_Qual"];
						nav = "Merkmal_NN_Qual";
					} else {
						aTarget = ["plMaster", "plMerkmal_NN_Quan"];
						nav = "Merkmal_NN_Quan";
					}
					break;
				}
			}
			/////////////////////////////////////////////////////////////////////////////////////
			// QuerNAv zur MK mit Sernr erfüllt, und zur Sernr springen
			if (art === "Q" || art === "R") {
				this.detail2_switch_to_sernr(oModel, nav);
				return;
			}
			/////////////////////////////////////////////////////////////////////////////////////
			if (typeof nav !== 'undefined') {
				this.getRouter().navTo(nav, {
					pl: pl,
					pl_key_modus: modus,
					pl_key_object: object,
					vornr: vornr,
					pruefpunkt: pruefpunkt,
					merknr: merknr
				}, false);
			}
			// else {
			// 	console.log(modus + "/" + art + "/" + "Es feht ein View!");
			// }
			// 	console.log(prueflos);
			// 	console.log(prueflos_key_modus);
			// 	console.log(prueflos_key_object);
			// } else {
			// 	// 	var aTarget = ["plMaster", "plLocked"];
			// 	// 	this.getOwnerComponent().getRouter().getTargets().display(aTarget);
			// 	// 	this.getOwnerComponent().getRouter().navTo("plLocked", {
			// 	// 		orderId: oItem.getBindingContext("pl").getProperty("Prueflos")
			// 	// 	}, false);
			// 	//locked_text = locked_text + ":" + Number(oItem.getBindingContext("pl").getProperty("Prueflos"));
			// 	//locked_text = locked_text + ":" + Number(oItem.getBindingContext("pl").getProperty("LockedByUser"));
			// 	locked_text = locked_text + oItem.getBindingContext("pl").getProperty("LockedByUser");
			// 	sap.m.MessageToast.show(locked_text);
			// }

		},
		InputQualCode: function (EVT, OVIEW, INPUT) {
			// Context und Datenbasis beschaffen
			var oModel = OVIEW.getModel("pl");
			var path = EVT.getSource().getParent().getBindingContextPath();
			var currentdata = oModel.getProperty(path);

			//POPUp für QualCodes
			this._qualcodesDialog.open(OVIEW, oModel, currentdata, path);
			//Daten setzen
			// oModel.setProperty(path + "/Bewertung", 'BUSKO');
			// oModel.setProperty(path + "/Bewertung_Text", 'BUSKO_TEXT');

			// var oSelectedItem = oEvent.getParameter("selectedItem"),
			// 	oInput = this.byId("productInput");

			// if (oSelectedItem) {
			// 	this.byId("productInput").setValue(oSelectedItem.getTitle());
			// }

			// if (!oSelectedItem) {
			// 	oInput.resetProperty("value");
			// }

			//this._fhmDialog.open("MK", path, title, oview, oModel_pl, oModel_gl, resolve, reject);

		},
		_navBack_empty_list: function () {
			// Diese Funktion brauchen wir wenn der ZR Filter nach dem SIchern
			// das Merkmal rausfiltert, dann muss das Bild verlassen werden.
			var oemptylistmodel = this.getModel("empty_list");
			var active = oemptylistmodel.getProperty("/_active");
			if (active) {
				//	var called = oemptylistmodel.getProperty("/_called");

				//	if (!called) {
				window.history.go(-1);
				//oemptylistmodel.setProperty("/_called", true);
				oemptylistmodel.setProperty("/_active", false);
				// } else {
				// 	oemptylistmodel.setProperty("/_called", false);
				// }
			}
		},

	});
});
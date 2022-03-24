sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (BaseController) {
	"use strict";

	return BaseController.extend("de.enercon.usbee.controller.app", {

		onInit: function () {
			// var oModel = this.getOwnerComponent().getModel("GLOBAL");
			// this.getView().setModel(oModel, "glo");
			var zahl = parseInt(((Math.random()) * 13 + 1));
			var filename = "background" + zahl + ".jpg";
   			
			var imagepath;
			var path = jQuery.sap.getModulePath("de.enercon.usbee");
			switch (path) {
			case ".":
				//imagepath = "./image/enercon_background.png";
				imagepath = "./image/" + filename;
				break;
			default:
				//imagepath = path + "/image/enercon_background.png";
				imagepath = path + "/image/" + filename;
				break;
			}
			var oModel = new sap.ui.model.json.JSONModel({
			  _IPATH: imagepath
			});
			this.getView().setModel(oModel, "global_pic");
   
		}

	});

});
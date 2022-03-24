sap.ui.define(function () {
		"use strict";

		var Formatter = {
			detail1_visible_zr: function (annahme, offen, rueckweisung, zr) {

				// // zr ist nicht gesetzt also line anzeigen
				if (!zr) {
					return true;
				} else {
					if (annahme > '0' && offen === '0' && rueckweisung === '0') {
						return false;
					} else {
						return true;
					}
				}
			},
			detail2_visible_zr: function (bewertung, status, zr) {

				// zr ist nicht gesetzt also line anzeigen
				if (!zr) {
					return true;
				} else {
					if (bewertung === 'A' && status === '5') {
						return false;
					} else {
						return true;
					}
				}
			},
			app_allowed_tm: function (read, launchpad, Super_Access) {
				if (!read) {
					return false;
				}
				if (launchpad) {
					return true;
				} else {
					if (Super_Access) {
						return true;
					} else {
						return false;
					}
				}
			},
			app_allowed_no: function (read, launchpad, Super_Access) {
				if (!read) {
					return false;
				}
				if (launchpad) {
					var booli = true;
				} else {
					if (Super_Access) {
						var booli = true;
					} else {
						var booli = false;
					}
				}
				return !booli;
			},
			gsettings_autoreload: function (reload) {
				if (reload) {
					return "autoreload_on";
				} else {
					return "autoreload_off";
				}
			},
			gsettings_rapid: function (rapid) {
				if (rapid) {
					return "rapid_on";
				} else {
					return "rapid_off";
				}
			},
			gsettings_picu: function (picu) {
				if (picu) {
					return "picu_on";
				} else {
					return "picu_off";
				}
			},
			gsettings_piclist: function (piclist) {
				if (piclist) {
					return "piclist_on";
				} else {
					return "piclist_off";
				}
			},
			gsettings_filterzr: function (zr) {
				if (zr) {
					return "zr_on";
				} else {
					return "zr_off";
				}
			},
			fhm_mimetype_text: function (filename, mimetype) {

				if (mimetype) {
					return filename;
				} else {
					return this.getModel("i18n").getResourceBundle().getText("fhm_nofile");
				}

			},
			fhm_mimetype: function (mimetype) {
				switch (mimetype) {
				case "":
					return "sap-icon://sys-cancel";
				case "application/pdf":
					return "sap-icon://pdf-attachment";
				case "image/x-ms-bmp":
					return "sap-icon://attachment-photo";
				case "image/png":
					return "sap-icon://attachment-photo";
				case "image/gif":
					return "sap-icon://attachment-photo";
				case "image/tiff":
					return "sap-icon://attachment-photo";
				case "image/jpeg":
					return "sap-icon://attachment-photo";
				}
			},
			fhmar_to_text: function (fhmar) {
				switch (fhmar) {
				case "M":
					return this.getModel("i18n").getResourceBundle().getText("fhmar-m");
				case "D":
					return this.getModel("i18n").getResourceBundle().getText("fhmar-d");
				case "E":
					return this.getModel("i18n").getResourceBundle().getText("fhmar-e");
				case "P":
					return this.getModel("i18n").getResourceBundle().getText("fhmar-p");
				case "S":
					return this.getModel("i18n").getResourceBundle().getText("fhmar-s");
				}

			},
			progress_color: function (annahme, rueck, offen, gesamt, rec_sernr, modus, pp) {
				// „grün“ nur dann setzen, wenn alle MUSS-Merkmale mit Annahme abgeschlossen sind;
				// „rot“ grundsätzlich dann setzen, wenn es Merkmalsergebnisse mit Bewertung Rückweisung gibt (unabhängig von der %-Zahl)
				// „gelb“ setzen, wenn es noch offene MUSS-Merkmale gibt, und die bisherigen Ergebnisse alle auf Annahme stehen
				// die Prozentzahl als Text ist damit überflüssig, sollte bei techn. Möglichkeit dann auch nicht mehr ausgegeben werden
				// - wenn das nicht geht: dann keine Grafik, sondern nur Textausgabe mit Überschrift:   „Ang./Rückg./offen“
				// A=nn/R=nn/offen=nn                   nn=tatsächliche Anzahl, keine %-Zahl,  Beispiel:   A=8/R=2/offen=23 
				//if (pp === '000000') {
				if (pp === '-') {
					if (modus === "S1" || modus === 'SX') {
						if (!rec_sernr) {
							return sap.ui.core.ValueState.None; //grau 
						}
					}
				}

				var ann = parseInt(annahme);
				var rue = parseInt(rueck);
				var off = parseInt(offen);
				var ges = parseInt(gesamt);

				if (rue > "0") {
					return sap.ui.core.ValueState.Error;
				}
				if (ann === ges) {
					return sap.ui.core.ValueState.Success;
				}
				if (off > "0") {
					//return sap.ui.core.ValueState.Warning;
					return sap.ui.core.ValueState.Information;
				}

			},
			progress_color1: function (annahme, rueck, offen, gesamt, rec_sernr, modus) {
				// „grün“ nur dann setzen, wenn alle MUSS-Merkmale mit Annahme abgeschlossen sind;
				// „rot“ grundsätzlich dann setzen, wenn es Merkmalsergebnisse mit Bewertung Rückweisung gibt (unabhängig von der %-Zahl)
				// „gelb“ setzen, wenn es noch offene MUSS-Merkmale gibt, und die bisherigen Ergebnisse alle auf Annahme stehen
				// die Prozentzahl als Text ist damit überflüssig, sollte bei techn. Möglichkeit dann auch nicht mehr ausgegeben werden
				// - wenn das nicht geht: dann keine Grafik, sondern nur Textausgabe mit Überschrift:   „Ang./Rückg./offen“
				// A=nn/R=nn/offen=nn                   nn=tatsächliche Anzahl, keine %-Zahl,  Beispiel:   A=8/R=2/offen=23 

				if (modus === "S1" || modus === 'SX') {
					if (!rec_sernr) {
						return sap.ui.core.ValueState.None; //grau 
					}
				}

				var ann = parseInt(annahme);
				var rue = parseInt(rueck);
				var off = parseInt(offen);
				var ges = parseInt(gesamt);

				if (rue > "0") {
					return sap.ui.core.ValueState.Error;
				}
				if (ann === ges) {
					return sap.ui.core.ValueState.Success;
				}
				if (off > "0") {
					//return sap.ui.core.ValueState.Warning;
					return sap.ui.core.ValueState.Information;
				}

			},
			progress_value: function (value1, value2, value3) {
				//return "Erledigt: " + value + "%" + " (" + value3 + "/" + value2 + ")";
				//return value + " %";

				//  A=nn/R=nn/offen=nn nn=tatsächliche Anzahl, keine %-Zahl,  Beispiel:   A=8/R=2/offen=23 
				return "A=" + value1 + "/R=" + value2 + "/O=" + value3;
			},
			showsecPP1_vorgang: function (SLWBEZ) {
				if (SLWBEZ === 'ZSN') {
					return false;
				} else {
					return true;
				}
			},
			typePP1_vorgang: function (TYPE) {
				switch (TYPE) {
				case "C1":
					return "Text";
				case "C2":
					return "Text";
				case "N1":
					return "Number";
				case "N2":
					return "Number";
				case "D1":
					return "Date";
				case "T1":
					return "Text";
				}
				return "Text";
			},
			datePP1_vorgang: function (SLWBEZ, SLWBEZ_SELECT, TYPE) {
				if (SLWBEZ === '') {
					return false;
				} else {
					if (SLWBEZ_SELECT) {
						return false;
					}
					switch (TYPE) {
					case "C1":
						return false;
					case "C2":
						return false;
					case "N1":
						return false;
					case "N2":
						return false;
					case "D1":
						return true;
					case "T1":
						return false;
					}
				}
				return false;
			},
			inputPP1_vorgang: function (SLWBEZ, SLWBEZ_SELECT, TYPE) {
				if (SLWBEZ === '') {
					return false;
				} else {
					if (SLWBEZ_SELECT) {
						return false;
					}
					switch (TYPE) {
					case "C1":
						return true;
					case "C2":
						return true;
					case "N1":
						return true;
					case "N2":
						return true;
					case "D1":
						return false;
					case "T1":
						return true;
					}
				}
				return false;
			},
			selectPP1_vorgang: function (pp, SLWBEZ_SELECT, SLWBEZ_KZNEW) {
				if (SLWBEZ_KZNEW) {
					return true;
				} else {
					return false;
				}
				// if (SLWBEZ_SELECT) {
				// 	if (pp === '-') {
				// 		return true;
				// 	} else {
				// 		return false;
				// 	}
				// } else {
				// 	return false;
				// }
			},
			vorgang_table_line: function (vornr, ktext, pp) {
				if (pp !== '-') {
					return vornr + ' - ' + ktext + ' - ' + pp;
				} else {
					return vornr + ' - ' + ktext;
				}
			},
			barcode_cs_string: function (value) {
				if (value === null) {
					return false;
				}

				if (value === '') {
					return false;
				} else {
					return true;
				}
			},
			barcode_weiter: function (success) {
				if (success) {
					return true;
				} else {
					return false;
				}
			},
			barcode_icon: function (success) {
				if (success) {
					return "sap-icon://sys-enter-2";
				} else {
					return "sap-icon://sys-cancel-2";
				}
			},
			barcode_color_icon: function (success) {
				if (success) {
					return "#1c9826";
				}
				if (!success) {
					return "#ed0404";
				}
			},
			stepinput_scope: function (scope_ind, scope) {
				if (scope_ind === '>') {
					return 999;
				} else {
					return parseFloat(scope);
				}
			},
			header_intro_line: function (s1, s2, s3, s4, s5, s6, s7, s8, s9) {
				var infostring = "";
				// var ss7 = s7.split('§');
				// var ss8 = s7.split('§');
				// var ss9 = s7.split('§');

				if (s7 !== "" && s7 !== null) {
					infostring = s7;
				}
				if (s8 !== "" && s8 !== null) {
					if (infostring !== "") {
						infostring = infostring + " / " + s8;
					} else {
						infostring = s8;
					}
				}
				if (s9 !== "" && s9 !== null) {
					if (infostring !== "") {
						infostring = infostring + " / " + s9;
					} else {
						infostring = s9;
					}
				}

				if (infostring !== "") {
					var infostring_o = s6 + ": " + infostring;
					return s1 + ":" + Number(s2) + " / " + s3 + s4 + " / " + s5 + " / " + infostring_o;
				} else {
					return s1 + ":" + Number(s2) + " / " + s3 + s4 + " / " + s5;
				}

			},
			button_addline_MK: function (pruefdatum, scope, scopeind, soll, ist, modus) {

				if (scopeind === ">") {
					return true;
				} else {

					// if (modus === 'S1' || modus === 'SX') {
					// 	return false;
					// } else {

					if (soll > ist) {
						return true;
					} else {
						return false;
					}

					// }
				}

			},
			button_delline_MK: function (pruefdatum, scope, scopeind, soll, ist) {

				var pist = parseInt(ist);
				if (pist === 0) {
					return false;
				}

				if (pruefdatum === "") {
					return true;
				} else {
					return false;
				}

			},
			detail_attribut_valid_icon: function (value) {
				switch (value) {
				case "":
					return "sap-icon://customfont/smile";
					break;
				case "/":
					return "sap-icon://customfont/sad2";
					break;
				case "Y":
					return "sap-icon://customfont/sad2";
					break;
				}
			},
			detail_attribut_valid: function (value) {
				var valid = this.getModel("i18n").getResourceBundle().getText("detailN-valid");
				var invalid = this.getModel("i18n").getResourceBundle().getText("detailN-invalid");

				switch (value) {
				case "":
					return valid;
					break;
				case "/":
					return invalid;
					break;
				case "Y":
					return invalid;
					break;
				}

			},
			round_full: function (value) {
				return Number(value);
			},
			listentry_bezug: function (value1, value2, value3, value4) {
				var nota = this.getModel("i18n").getResourceBundle().getText("detailN-sernotass");

				if (value1 === "S1") {
					return value2;
				}
				if (value1 === "CH") {
					return value3;
				}
				if (value1 === "SX") {
					var aSplit = value4.split(":");
					var val1 = aSplit[2];
					return nota + " " + val1;
				}

			},
			noTiles: function (value) {
				return value === 0;
			},
			detail3_visible_langtext: function (value) {

				if (value) {
					return true;
				} else {
					return false;
				}
			},
			detail3_color_langtext: function (value) {

				if (value) {
					return "Accept";
				} else {
					return "Reject";
				}
			},
			detail3_color_fotobutton: function (value) {
				var anzahl = parseFloat(value);

				if (anzahl > 0) {
					return "Accept";
				} else {
					return "Reject";
				}
			},
			detail3_icon_mbewertung: function (value) {

				var bew = value.charAt(0);

				if (bew === "A") {
					return "sap-icon://sys-enter-2";
				}
				if (bew === "R") {
					return "sap-icon://sys-cancel-2";
				}
				if (bew === "U") {
					return "sap-icon://document";
				}
				if (bew === "E") {
					//return "sap-icon://edit";
					return "sap-icon://request";
				}
				if (bew === "K") {
					return "sap-icon://blur";
				}
			},
			detail3_class_mbewertung: function (value) {

				var bew = value.charAt(0);

				if (bew === "A") {
					return "cssGreen1";
				}
				if (bew === "R") {
					return "";
				}
				if (bew === "U") {
					return "";
				}
				if (bew === "E") {
					return "";
				}
			},
			detail3_icon_artmerkmal: function (value) {

				var art = value.charAt(0);

				//Qualitatives Merkmal
				if (art === "L" || art === "Q") {
					return "sap-icon://task";
				}
				//Quantitatives merkmal
				if (art === "N" || art === "R") {
					return "sap-icon://number-sign";
				}
				//Formelmerkmal
				if (art === "F") {
					//return "sap-icon://SAP-icons-TNT/full-port";
					return "sap-icon://customfont/formel2";
				}
				//Leitmerkmal
				if (art === "E") {
					//return "sap-icon://BusinessSuiteInAppSymbols/icon-face-bad";
					return "sap-icon://sys-help";
				}
				////////////////////////////////////////////////////////////////////////
				//Zur Bearbeitung gesperrt
				// Summarisches Merkmal
				if (art === "S") {
					//return "sap-icon://BusinessSuiteInAppSymbols/icon-face-bad";
					return "sap-icon://customfont/sad2";
				}
				//ohne Stichprobenverfahren
				if (art === "X") {
					//return "sap-icon://BusinessSuiteInAppSymbols/icon-face-bad";
					return "sap-icon://customfont/sad2";
				}
				//Erfassung für qual. Merkmal ohne Merkmalsausprägung
				if (art === "Y") {
					//return "sap-icon://BusinessSuiteInAppSymbols/icon-face-bad";
					return "sap-icon://customfont/sad2";
				}
				// Wenn SERNP <> SPACE MK Ergebniserfassung nur mit SerialNr zum PL Kein SX
				if (art === "Z") {
					//return "sap-icon://BusinessSuiteInAppSymbols/icon-face-bad";
					return "sap-icon://customfont/sad2";
				}
			},
			detail3_icon_artmerkmaltext: function (value) {
				var text_q = this.getModel("i18n").getResourceBundle().getText("detail2-quals");
				var text_n = this.getModel("i18n").getResourceBundle().getText("detail2-quans");
				var text_f = this.getModel("i18n").getResourceBundle().getText("detail2-form");
				var text_s = this.getModel("i18n").getResourceBundle().getText("detail2-summ");
				var text_e = this.getModel("i18n").getResourceBundle().getText("detail2-leit");
				var text_z = this.getModel("i18n").getResourceBundle().getText("detail2-sx");

				var art = value.charAt(0);

				if (art === "L") {
					return text_q;
				}
				if (art === "N") {
					return text_n;
				}
				if (art === "F") {
					return text_f;
				}
				if (art === "S") {
					return text_s;
				}
				if (art === "E") {
					return text_e;
				}
				if (art === "Z") {
					return text_z;
				}
			},
			detail3_color_mbewertung: function (value, muss, rec_sernr, modus, pp) {

				var bew = value.charAt(0);

				if (pp === '000000') {
					if (modus === 'S1' || modus === 'SX') {
						if (!rec_sernr) {
							return "#BDBABA";
						}
					}
				}

				if (bew === "A") {
					// return "#1c9826";
					return sap.ui.core.IconColor.Positive;
				}
				if (bew === "R") {
					// return "#ed0404";
					return sap.ui.core.IconColor.Negative;
				}
				if (bew === "U") {
					return sap.ui.core.IconColor.Neutral;
					// if (muss) {
					// 	return "#E78C07";
					// } else {
					// 	return "#CCCCCC";
					// }
				}

			},
			detail3_color_result_N: function (value1, value2, value3, value4) {
				// value1 = Messwert
				// value2 = Attribut
				// value3 = tol unten
				// value4 = tol oben

				var mess = value1.replace(/,/, ".");
				var tolu = value3.replace(/,/, ".");
				var tolo = value4.replace(/,/, ".");
				var mess = parseFloat(mess);
				var tolu = parseFloat(tolu);
				var tolo = parseFloat(tolo);

				if (isNaN(mess)) {
					// Nichts eingegeben
					return "#000000";
				} else {

					if (isNaN(tolu)) {
						// keine untere Toleranz
						tolu = "N";
					}
					if (isNaN(tolo)) {
						// keine obere Toleranz
						tolo = "N";
					}

					if (tolu === "N" && tolo === "N") {
						//Keine Toleranzen
						return "#1c9826";
					}

					//Gültiges Ergebnis
					if (value2 === 'G') {

						// Nur obere Toleranz
						if (tolo != "N" && tolu === "N") {
							if (mess > tolo) {
								return "#ed0404";
							} else {
								return "#1c9826";
							}
						}
						// Nur untere Toleranz
						if (tolu != "N" && tolo === "N") {
							if (mess < tolu) {
								return "#ed0404";
							} else {
								return "#1c9826";
							}
						}
						// Beide Toleranzen vorhanden
						if (mess >= tolu && mess <= tolo) {
							return "#1c9826";
						} else {
							return "#ed0404";
						}

					} else {
						//Kein Gültiges Ergebnis
						return "#000000";
					}
				}
			},
			detail3_icon_result_N: function (value1, value2, value3, value4) {
				// value1 = Messwert
				// value2 = Attribut
				// value3 = tol unten
				// value4 = tol oben
				var mess = value1.replace(/,/, ".");
				var tolu = value3.replace(/,/, ".");
				var tolo = value4.replace(/,/, ".");
				var mess = parseFloat(mess);
				var tolu = parseFloat(tolu);
				var tolo = parseFloat(tolo);

				if (isNaN(mess)) {
					// Nichts eingegeben
					return "sap-icon://document";
				} else {

					if (isNaN(tolu)) {
						// keine untere Toleranz
						tolu = "N";
					}
					if (isNaN(tolo)) {
						// keine obere Toleranz
						tolo = "N";
					}

					if (tolu === "N" && tolo === "N") {
						//Keine Toleranzen
						return "sap-icon://sys-enter-2";
					}

					//Gültiges Ergebnis
					if (value2 === 'G') {

						// Nur obere Toleranz
						if (tolo != "N" && tolu === "N") {
							if (mess > tolo) {
								return "sap-icon://sys-cancel-2";
							} else {
								return "sap-icon://sys-enter-2";
							}
						}
						// Nur untere Toleranz
						if (tolu != "N" && tolo === "N") {
							if (mess < tolu) {
								return "sap-icon://sys-cancel-2";
							} else {
								return "sap-icon://sys-enter-2";
							}
						}
						// Beide Toleranzen vorhanden
						if (mess >= tolu && mess <= tolo) {
							return "sap-icon://sys-enter-2";
						} else {
							return "sap-icon://sys-cancel-2";
						}

					} else {
						//Kein Gültiges Ergebnis
						return "sap-icon://document";
					}
				}
			},
			detail3_color_result_N_BAK: function (value1, value2, value3, value4) {
				// value1 = Messwert
				// value2 = Attribut_valid
				// value3 = tol unten
				// value4 = tol oben

				var mess = value1.replace(/,/, ".");
				var tolu = value3.replace(/,/, ".");
				var tolo = value4.replace(/,/, ".");
				var mess = parseFloat(mess);
				var tolu = parseFloat(tolu);
				var tolo = parseFloat(tolo);

				if (isNaN(mess)) {
					// Nichts eingegeben
					return "#000000";
				} else {

					if (isNaN(tolu)) {
						// keine untere Toleranz
						tolu = "N";
					}
					if (isNaN(tolo)) {
						// keine obere Toleranz
						tolo = "N";
					}

					if (tolu === "N" && tolo === "N") {
						//Keine Toleranzen
						return "#1c9826";
					}

					//Gültiges Ergebnis
					if (value2) {

						// Nur obere Toleranz
						if (tolo != "N" && tolu === "N") {
							if (mess > tolo) {
								return "#ed0404";
							} else {
								return "#1c9826";
							}
						}
						// Nur untere Toleranz
						if (tolu != "N" && tolo === "N") {
							if (mess < tolu) {
								return "#ed0404";
							} else {
								return "#1c9826";
							}
						}
						// Beide Toleranzen vorhanden
						if (mess >= tolu && mess <= tolo) {
							return "#1c9826";
						} else {
							return "#ed0404";
						}

					} else {
						//Kein Gültiges Ergebnis
						return "#000000";
					}
				}
			},
			detail3_icon_result_N_BAK: function (value1, value2, value3, value4) {
				// value1 = Messwert
				// value2 = Attribut_valid
				// value3 = tol unten
				// value4 = tol oben
				var mess = value1.replace(/,/, ".");
				var tolu = value3.replace(/,/, ".");
				var tolo = value4.replace(/,/, ".");
				var mess = parseFloat(mess);
				var tolu = parseFloat(tolu);
				var tolo = parseFloat(tolo);

				if (isNaN(mess)) {
					// Nichts eingegeben
					return "sap-icon://document";
				} else {

					if (isNaN(tolu)) {
						// keine untere Toleranz
						tolu = "N";
					}
					if (isNaN(tolo)) {
						// keine obere Toleranz
						tolo = "N";
					}

					if (tolu === "N" && tolo === "N") {
						//Keine Toleranzen
						return "sap-icon://sys-enter-2";
					}

					//Gültiges Ergebnis
					if (value2) {

						// Nur obere Toleranz
						if (tolo != "N" && tolu === "N") {
							if (mess > tolo) {
								return "sap-icon://sys-cancel-2";
							} else {
								return "sap-icon://sys-enter-2";
							}
						}
						// Nur untere Toleranz
						if (tolu != "N" && tolo === "N") {
							if (mess < tolu) {
								return "sap-icon://sys-cancel-2";
							} else {
								return "sap-icon://sys-enter-2";
							}
						}
						// Beide Toleranzen vorhanden
						if (mess >= tolu && mess <= tolo) {
							return "sap-icon://sys-enter-2";
						} else {
							return "sap-icon://sys-cancel-2";
						}

					} else {
						//Kein Gültiges Ergebnis
						return "sap-icon://document";
					}
				}
			},
			detail3_icon_result_neu: function (value1, value2) {
				// value1 = Bewertung
				// value2 = Attribut
				var bew = value1.charAt(0);
				if (value2 === 'G') {

					if (bew === "A") {
						return "sap-icon://sys-enter-2";
					}
					if (bew === "R") {
						return "sap-icon://sys-cancel-2";
					}
					if (bew === "U") {
						return "sap-icon://document";
					}

				} else {
					return "sap-icon://document";
				}

				// if (value1 >= value2) {
				// 	return sap.ui.core.ValueState.Success;
				// } else {
				// 	return sap.ui.core.ValueState.Error;
				// }
			},
			detail3_icon_result: function (value1, value2) {
				// value1 = Bewertung
				// value2 = Attribut_valid
				var bew = value1.charAt(0);
				if (value2) {

					if (bew === "A") {
						return "sap-icon://sys-enter-2";
					}
					if (bew === "R") {
						return "sap-icon://sys-cancel-2";
					}
					if (bew === "U") {
						return "sap-icon://document";
					}

				} else {
					return "sap-icon://document";
				}

				// if (value1 >= value2) {
				// 	return sap.ui.core.ValueState.Success;
				// } else {
				// 	return sap.ui.core.ValueState.Error;
				// }
			},
			detailL_color_icon: function (value) {
				var bew = value.charAt(0);

				if (bew === "A") {
					return "#1c9826";
				}
				if (bew === "R") {
					return "#ed0404";
				}
				if (bew === "U") {
					return "#000000";
				}
			},
			detailL_color_state: function (value) {
				var bew = value.charAt(0);

				if (bew === "A") {
					return "Success";
				}
				if (bew === "R") {
					return "Error";
					//eturn "Warning";
				}
				if (bew === "U") {
					return "None";
				}
			},

			detail3_color_object_header: function (value1, value2) {
				if (value1 >= value2) {
					return sap.ui.core.ValueState.Success;
				} else {
					return sap.ui.core.ValueState.Error;
				}
			},
			detail2_expanded_panel: function (value1, value2) {
				// Enercon will die Panels immer expanded haben
				// if (value1 !== "0" && value2 === "0") {
				// 	return true;
				// } else {
				// 	return false;
				// }
				return true;
			},
			detail2_visible_panel: function (value) {
				if (value === "0") {
					return false;
				} else {
					return true;
				}
			},
			detail1_percentage_color: function (value) {
				var pr = parseInt(value);

				if (pr < "33") {
					return sap.ui.core.ValueState.Error;
				}
				if (pr >= "33" && pr <= "66") {
					return sap.ui.core.ValueState.Warning;
				}
				if (pr > "66") {
					return sap.ui.core.ValueState.Success;
				}
				return sap.ui.core.ValueState.None;
			},
			detail1_percentage_value: function (value, value2, value3) {
				var text_erl = this.getModel("i18n").getResourceBundle().getText("detail1-erl");
				return text_erl + ": " + value + "%" + " (" + value3 + "/" + value2 + ")";
			},
			master_percentage_value: function (value, value2, value3) {
				//return "Erledigt: " + value + "%" + " (" + value3 + "/" + value2 + ")";
				return value + " %";
			},
			string_to_float: function (value) {
				return parseFloat(value);
			},
			X_to_bool: function (value) {
				if (value === "X") {
					return true;
				} else {
					return false;
				}
			},
			X_to_text: function (value) {
				var ja = this.getModel("i18n").getResourceBundle().getText("detail1-ja");
				var nein = this.getModel("i18n").getResourceBundle().getText("detail1-nein");

				if (value === "X") {
					return ja;
				} else {
					return nein;
				}
			},
			detail1_key_art_header: function (art, object) {
				//var obj = Number(object);
				//var obj = parseInt(object, 10);
				var serial = this.getModel("i18n").getResourceBundle().getText("serialnummer");
				var charge = this.getModel("i18n").getResourceBundle().getText("detailN-charge");
				var ser_not_ass = this.getModel("i18n").getResourceBundle().getText("detailN-sernotass");

				if (!isNaN(object)) {
					// ist eine Zahl 
					var obj = parseInt(object, 10);
				} else {
					// ist keine Zahl 
					var obj = object;
				}

				//if (art === "S1" || art === "SX") {
				if (art === "S1") {
					return serial + ": " + obj;
				}
				if (art === "SX") {
					return ser_not_ass;
				}
				if (art === "CH") {
					return charge + ": " + obj;
				}
			},
			qual_key: function (sStatus) {
				// N=Nicht erfasst T=teilweise erfasst V=Vollständig erfasst
				if (sStatus === "U") {
					return true;
				} else {
					return false;
				}
			},
			mastericon: function (sStatus) {
				// N=Nicht erfasst T=teilweise erfasst V=Vollständig erfasst
				if (sStatus === "N") {
					return "sap-icon://document";
				}
				if (sStatus === "T") {
					return "sap-icon://edit";
				}
				if (sStatus === "V") {
					return "sap-icon://complete";
				}
				if (sStatus === "L") {
					return "sap-icon://locked";
				}
				if (sStatus === "A") {
					return "sap-icon://locked";
				}
			},
			mastericon_list: function (sStatus) {
				// N=Nicht erfasst T=teilweise erfasst V=Vollständig erfasst
				if (sStatus === "N") {
					//return "sap-icon://cancel";
					//return "sap-icon://document";
					return "image/neu.png";
				}
				if (sStatus === "T") {
					//return "sap-icon://alert";
					//return "sap-icon://edit";
					return "image/inArbeit.png";
				}
				if (sStatus === "V") {
					//return "sap-icon://complete";
					//return "sap-icon://complete";
					return "image/fertig.png";
				}
				if (sStatus === "L") {
					//return "sap-icon://locked";
					return "image/locked.png";
				}
			},
			mastericon_color: function (sStatus) {
				// N=Nicht erfasst T=teilweise erfasst V=Vollständig erfasst
				if (sStatus === "N") {
					return "#000000";
				}
				if (sStatus === "T") {
					return "#FFFF00";
				}
				if (sStatus === "V") {
					return "#1c9826";
				}
				if (sStatus === "L") {
					return "#ed0404";
				}
			},
			MSType: function (sStatus) {
				// N=Nicht erfasst T=teilweise erfasst V=Vollständig erfasst
				if (sStatus === "N") {
					return "Error";
				}
				if (sStatus === "T") {
					return "Warning";
				}
				if (sStatus === "V") {
					return "Success";
				}
			},
			MSText: function (sStatus) {
				// N=Nicht erfasst T=teilweise erfasst V=Vollständig erfasst
				if (sStatus === "N") {
					return "Der Vorgang wurde noch nicht erfasst";
				}
				if (sStatus === "T") {
					return "Der Vorgang wurde teilweise erfasst";
				}
				if (sStatus === "V") {
					return "Der Vorgang wurde vollständig erfasst";
				}
			},
			status: function (sStatus) {
				if (sStatus === "Available") {
					return "Success";
				} else if (sStatus === "Out of Stock") {
					return "Warning";
				} else if (sStatus === "Discontinued") {
					return "Error";
				} else {
					return "None";
				}
			},
			intBoolRandomizer: function (iRandom) {
				return iRandom % 2 === 0;
			},
			favorite: function (sStatus) {
				return sStatus.length % 2 === 0;
			}
		};

		return Formatter;

	},
	/* bExport= */
	true);
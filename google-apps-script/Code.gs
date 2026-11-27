// Script à coller dans Extensions > Apps Script du Google Sheet.
// Il enregistre les choix envoyés par le site et les renvoie en JSON.

const NOM_ONGLET = 'Choix';
const COLONNES = ['id', 'nom', 'formule', 'plat', 'fromage', 'allergies', 'maj'];

function onglet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(NOM_ONGLET);
  if (!sh) {
    sh = ss.insertSheet(NOM_ONGLET);
    sh.appendRow(COLONNES);
    sh.setFrozenRows(1);
  }
  return sh;
}

function lignes_() {
  const valeurs = onglet_().getDataRange().getValues();
  valeurs.shift();
  return valeurs
    .filter(r => r[0])
    .map(r => {
      const o = {};
      COLONNES.forEach((k, i) => { o[k] = String(r[i]).replace(/^'/, ''); });
      return o;
    });
}

function propre_(s) {
  s = String(s == null ? '' : s).slice(0, 200);
  // Empêche qu'un texte soit interprété comme une formule dans le tableur.
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function reponse_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return reponse_({ ok: true, rows: lignes_() });
}

function doPost(e) {
  const verrou = LockService.getScriptLock();
  verrou.waitLock(10000);
  try {
    const b = JSON.parse(e.postData.contents);
    const sh = onglet_();
    const ids = sh.getRange(1, 1, Math.max(sh.getLastRow(), 1), 1).getValues().map(r => String(r[0]));
    const idx = b.id ? ids.indexOf(String(b.id)) : -1;

    if (b.action === 'delete') {
      if (idx > 0) sh.deleteRow(idx + 1);
    } else {
      const ligne = [
        b.id ? propre_(b.id) : Utilities.getUuid(),
        propre_(b.nom), propre_(b.formule), propre_(b.plat),
        propre_(b.fromage), propre_(b.allergies), new Date().toISOString(),
      ];
      if (idx > 0) sh.getRange(idx + 1, 1, 1, ligne.length).setValues([ligne]);
      else sh.appendRow(ligne);
    }
    return reponse_({ ok: true, rows: lignes_() });
  } catch (err) {
    return reponse_({ ok: false, error: String(err) });
  } finally {
    verrou.releaseLock();
  }
}

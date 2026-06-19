// Módulo: Autoridad Certificadora (CA) — generación de llaves PKI y firma digital
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const PKI_DIR = path.join(__dirname, '..', '..', 'data', 'pki');
const PRIVATE_KEY_PATH = path.join(PKI_DIR, 'ca-private.pem');
const PUBLIC_KEY_PATH = path.join(PKI_DIR, 'ca-public.pem');

let caKeys = null;

// Custodia la llave privada de la Autoridad Certificadora del SICA.
// En este MVP se simula el HSM persistiendo el par de llaves en disco
// (fuera del control de versiones); nunca se expone la llave privada vía API.
function getCAKeyPair() {
  if (caKeys) return caKeys;

  if (fs.existsSync(PRIVATE_KEY_PATH) && fs.existsSync(PUBLIC_KEY_PATH)) {
    caKeys = {
      privateKey: fs.readFileSync(PRIVATE_KEY_PATH, 'utf8'),
      publicKey: fs.readFileSync(PUBLIC_KEY_PATH, 'utf8'),
    };
    return caKeys;
  }

  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

  fs.mkdirSync(PKI_DIR, { recursive: true });
  fs.writeFileSync(PRIVATE_KEY_PATH, privateKey, { mode: 0o600 });
  fs.writeFileSync(PUBLIC_KEY_PATH, publicKey);

  caKeys = { publicKey, privateKey };
  return caKeys;
}

function hashDocumento(documento) {
  return crypto.createHash('sha256').update(JSON.stringify(documento)).digest('hex');
}

function firmarHash(hashHex) {
  const { privateKey } = getCAKeyPair();
  const firma = crypto.sign('sha256', Buffer.from(hashHex), {
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
  });
  return firma.toString('base64');
}

function verificarFirma(hashHex, firmaBase64) {
  const { publicKey } = getCAKeyPair();
  try {
    return crypto.verify(
      'sha256',
      Buffer.from(hashHex),
      { key: publicKey, padding: crypto.constants.RSA_PKCS1_PSS_PADDING },
      Buffer.from(firmaBase64, 'base64')
    );
  } catch {
    return false;
  }
}

// Encadena cada certificado al hash del bloque anterior (simulación local
// de registro inmutable tipo Hyperledger/blockchain — F2-18).
function hashBloque({ hashDocumento, hashAnterior, numeroBloque, timestamp }) {
  return crypto
    .createHash('sha256')
    .update(`${hashDocumento}|${hashAnterior || 'GENESIS'}|${numeroBloque}|${timestamp}`)
    .digest('hex');
}

module.exports = { getCAKeyPair, hashDocumento, firmarHash, verificarFirma, hashBloque };

/**
 * Banco Inter API — PIX + Boleto
 * Docs: https://developers.inter.co/
 *
 * Required env vars:
 *   INTER_CLIENT_ID
 *   INTER_CLIENT_SECRET
 *   INTER_CERT       (PEM content of the client certificate)
 *   INTER_KEY        (PEM content of the private key)
 *   INTER_BASE_URL   (default: https://cdpj.partners.bancointer.com.br)
 *   INTER_CONTA      (number of the bank account)
 */

const BASE_URL = process.env.INTER_BASE_URL ?? 'https://cdpj.partners.bancointer.com.br'

// ── OAuth token cache ─────────────────────────────────────────────────────────
let _token: string | null = null
let _tokenExpiry = 0

async function getToken(): Promise<string> {
  if (_token && Date.now() < _tokenExpiry) return _token

  const params = new URLSearchParams({
    client_id:     process.env.INTER_CLIENT_ID!,
    client_secret: process.env.INTER_CLIENT_SECRET!,
    grant_type:    'client_credentials',
    scope:         'cobv.write cobv.read boleto-cobranca.write boleto-cobranca.read',
  })

  const res = await fetch(`${BASE_URL}/oauth/v2/token`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    params.toString(),
    // Note: In production, mTLS requires attaching the client cert/key.
    // With Node.js, use https.Agent({ cert, key }) or a proxy.
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Inter OAuth error: ${err}`)
  }

  const data = await res.json()
  _token = data.access_token
  _tokenExpiry = Date.now() + (data.expires_in - 60) * 1000
  return _token!
}

async function interFetch(path: string, options: RequestInit = {}) {
  const token = await getToken()
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type':  'application/json',
      'x-conta-corrente': process.env.INTER_CONTA ?? '',
      ...(options.headers ?? {}),
    },
  })
  const text = await res.text()
  let data: any
  try { data = JSON.parse(text) } catch { data = { raw: text } }
  if (!res.ok) throw new Error(data?.message ?? data?.raw ?? `Inter API error ${res.status}`)
  return data
}

// ── PIX (cobv = cobrança com vencimento) ──────────────────────────────────────
export interface PixPayload {
  orderId:    string
  amount:     number   // in BRL, e.g. 99.90
  dueDate:    string   // YYYY-MM-DD
  customer: {
    name:     string
    cpfCnpj:  string
    email?:   string
  }
  description?: string
}

export interface PixResult {
  txid:       string
  pixCopiaECola: string
  qrcode:     string   // base64 PNG
  location:   string
  status:     string
}

export async function createPix(payload: PixPayload): Promise<PixResult> {
  const isCpf = payload.customer.cpfCnpj.replace(/\D/g, '').length === 11
  const body = {
    calendario: {
      dataDeVencimento: payload.dueDate,
      validadeAposVencimento: 1,
    },
    devedor: {
      [isCpf ? 'cpf' : 'cnpj']: payload.customer.cpfCnpj.replace(/\D/g, ''),
      nome: payload.customer.name,
    },
    valor: {
      original: payload.amount.toFixed(2),
    },
    chave: process.env.INTER_PIX_KEY!,  // your PIX key (email, CPF, CNPJ, or random)
    solicitacaoPagador: payload.description ?? `Pedido #${payload.orderId.slice(0, 8)}`,
    infoAdicionais: [
      { nome: 'OrderID', valor: payload.orderId },
    ],
  }

  const data = await interFetch(`/cobranca/v3/cobv/${payload.orderId.replace(/-/g, '').slice(0, 35)}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })

  // Fetch QR code
  const qrData = await interFetch(`/cobranca/v3/cobv/${data.txid}/qrcode`)

  return {
    txid:          data.txid,
    pixCopiaECola: qrData.pixCopiaECola,
    qrcode:        qrData.imagemQrcode,
    location:      data.location,
    status:        data.status,
  }
}

export async function getPixStatus(txid: string): Promise<{ status: string; paidAt?: string }> {
  const data = await interFetch(`/cobranca/v3/cobv/${txid}`)
  return {
    status: data.status,
    paidAt: data.status === 'CONCLUIDA' ? data.pix?.[0]?.horario : undefined,
  }
}

// ── Boleto ────────────────────────────────────────────────────────────────────
export interface BoletoPayload {
  orderId:    string
  amount:     number
  dueDate:    string   // YYYY-MM-DD
  customer: {
    name:     string
    cpfCnpj:  string
    email?:   string
    address: {
      street:       string
      number:       string
      complement?:  string
      neighborhood: string
      city:         string
      state:        string
      zip:          string
    }
  }
  description?: string
}

export interface BoletoResult {
  nossoNumero:      string
  codigoBarras:     string
  linhaDigitavel:   string
  pdfUrl:           string
}

export async function createBoleto(payload: BoletoPayload): Promise<BoletoResult> {
  const isCpf = payload.customer.cpfCnpj.replace(/\D/g, '').length === 11
  const body = {
    pagador: {
      cpfCnpj:     payload.customer.cpfCnpj.replace(/\D/g, ''),
      tipoPessoa:  isCpf ? 'FISICA' : 'JURIDICA',
      nome:        payload.customer.name,
      email:       payload.customer.email ?? '',
      endereco:    payload.customer.address.street,
      numero:      payload.customer.address.number,
      complemento: payload.customer.address.complement ?? '',
      bairro:      payload.customer.address.neighborhood,
      cidade:      payload.customer.address.city,
      uf:          payload.customer.address.state,
      cep:         payload.customer.address.zip.replace(/\D/g, ''),
    },
    mensagem: {
      linha1: payload.description ?? `Pedido #${payload.orderId.slice(0, 8)}`,
      linha2: 'Hosteg — Infrastructure Cloud',
      linha3: '',
      linha4: '',
      linha5: '',
    },
    dataEmissao:    new Date().toISOString().slice(0, 10),
    dataVencimento: payload.dueDate,
    valorNominal:   payload.amount,
    numDiasAgenda:  0,
    seuNumero:      payload.orderId.replace(/-/g, '').slice(0, 15),
  }

  const data = await interFetch('/cobranca/v2/boletos', {
    method: 'POST',
    body: JSON.stringify(body),
  })

  return {
    nossoNumero:    data.nossoNumero,
    codigoBarras:   data.codigoBarras,
    linhaDigitavel: data.linhaDigitavel,
    pdfUrl:         `${BASE_URL}/cobranca/v2/boletos/${data.nossoNumero}/pdf`,
  }
}

export async function getBoletoStatus(nossoNumero: string): Promise<{ status: string }> {
  const data = await interFetch(`/cobranca/v2/boletos/${nossoNumero}`)
  return { status: data.situacao }  // EMABERTO | PAGO | CANCELADO | EXPIRADO
}

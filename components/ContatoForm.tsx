'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

const SETORES = ['Comercial', 'Suporte', 'Migração', 'Abuse', 'Denúncia', 'Jurídico'] as const

const DESTINO = 'suporte@hosteg.net.br'

export default function ContatoForm() {
  const [nome, setNome]         = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail]       = useState('')
  const [setor, setSetor]       = useState<string>('')
  const [mensagem, setMensagem] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const subject = `[${setor || 'Contato'}] Mensagem do site — ${nome}`
    const body =
      `Nome: ${nome}\n` +
      `WhatsApp: ${whatsapp}\n` +
      `E-mail: ${email}\n` +
      `Setor: ${setor}\n\n` +
      `Mensagem:\n${mensagem}\n`

    window.location.href = `mailto:${DESTINO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const fieldCls =
    'w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/15'
  const labelCls = 'block text-sm font-semibold text-zinc-700 mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="nome" className={labelCls}>Nome</label>
          <input id="nome" type="text" required value={nome} onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome completo" className={fieldCls} />
        </div>
        <div>
          <label htmlFor="whatsapp" className={labelCls}>WhatsApp</label>
          <input id="whatsapp" type="tel" required value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="(00) 00000-0000" className={fieldCls} />
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>E-mail</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@email.com" className={fieldCls} />
        </div>
        <div>
          <label htmlFor="setor" className={labelCls}>Setor</label>
          <select id="setor" required value={setor} onChange={(e) => setSetor(e.target.value)}
            className={`${fieldCls} ${setor ? 'text-zinc-900' : '!text-zinc-400'}`}>
            <option value="" disabled>Selecione o setor</option>
            {SETORES.map((s) => (
              <option key={s} value={s} className="text-zinc-900">{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="mensagem" className={labelCls}>Mensagem</label>
        <textarea id="mensagem" required rows={5} value={mensagem} onChange={(e) => setMensagem(e.target.value)}
          placeholder="Como podemos ajudar?" className={`${fieldCls} resize-y`} />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
        <button type="submit"
          className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-white rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] transition-all shadow-lg shadow-[#0EA5E9]/25">
          Enviar mensagem
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </button>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Abriremos seu aplicativo de e-mail com a mensagem já preenchida para {DESTINO}.
        </p>
      </div>
    </form>
  )
}

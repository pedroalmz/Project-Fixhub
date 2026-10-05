import { useState } from 'react'
import { useStore } from '../../data/store'
import { Avatar, Button, Card, Field, Input, PageHeader } from '../../components/ui'
import { fmtDate } from '../../lib/format'

export default function Profile() {
  const { currentCustomer: c } = useStore()
  const [form, setForm] = useState({ name: c.name, email: c.email, phone: c.phone, city: c.city })
  const [saved, setSaved] = useState(false)
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => { setSaved(false); setForm({ ...form, [k]: e.target.value }) }
  return (
    <>
      <PageHeader title="Perfil" subtitle={`Cliente desde ${fmtDate(c.since)}`} />
      <div className="max-w-2xl">
        <Card>
          <div className="mb-6 flex items-center gap-4"><Avatar name={form.name} /><p className="font-medium text-slate-900">{form.name}</p></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome"><Input value={form.name} onChange={set('name')} /></Field>
            <Field label="E-mail"><Input type="email" value={form.email} onChange={set('email')} /></Field>
            <Field label="Telefone / WhatsApp"><Input value={form.phone} onChange={set('phone')} /></Field>
            <Field label="Cidade"><Input value={form.city} onChange={set('city')} /></Field>
          </div>
          <div className="mt-6 flex items-center justify-end gap-3">
            {saved && <span className="text-sm text-emerald-700">Alterações salvas (somente nesta sessão)</span>}
            <Button onClick={() => setSaved(true)}>Salvar alterações</Button>
          </div>
        </Card>
      </div>
    </>
  )
}

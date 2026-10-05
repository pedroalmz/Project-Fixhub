import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Laptop, Monitor, Plus, Printer, HardDrive } from 'lucide-react'
import { useStore } from '../../data/store'
import type { Device } from '../../data/types'
import { Button, Card, EmptyState, Field, Input, PageHeader, Select, Textarea } from '../../components/ui'
import { fmtDate } from '../../lib/format'

export const deviceIcon = (t: Device['type']) => (t === 'notebook' ? Laptop : t === 'desktop' ? Monitor : t === 'impressora' ? Printer : HardDrive)

export default function ClientDevices() {
  const { devices, currentCustomer, actions } = useStore()
  const mine = devices.filter((d) => d.customerId === currentCustomer.id)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'desktop' as Device['type'], specs: '' })

  const save = () => {
    if (!form.name.trim()) return
    actions.addDevice(form)
    setForm({ name: '', type: 'desktop', specs: '' })
    setAdding(false)
  }

  return (
    <>
      <PageHeader title="Meus equipamentos" subtitle="Computadores e dispositivos cadastrados na sua conta." actions={<Button onClick={() => setAdding((v) => !v)}><Plus className="h-4 w-4" />Cadastrar equipamento</Button>} />

      {adding && (
        <Card title="Novo equipamento" className="mb-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome do equipamento"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex.: Notebook do trabalho" /></Field>
            <Field label="Tipo">
              <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Device['type'] })}>
                <option value="desktop">Computador (desktop)</option>
                <option value="notebook">Notebook</option>
                <option value="impressora">Impressora</option>
                <option value="outro">Outro</option>
              </Select>
            </Field>
            <div className="sm:col-span-2"><Field label="Especificações" hint="Uma por linha. Ex.: Ryzen 5 5500, 16 GB RAM"><Textarea value={form.specs} onChange={(e) => setForm({ ...form, specs: e.target.value })} /></Field></div>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setAdding(false)}>Cancelar</Button>
            <Button onClick={save} disabled={!form.name.trim()}>Salvar equipamento</Button>
          </div>
        </Card>
      )}

      {mine.length === 0 ? (
        <EmptyState icon={Laptop} title="Nenhum equipamento cadastrado" text="Cadastre seus computadores para abrir chamados e manter o histórico de manutenções." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mine.map((d) => {
            const Icon = deviceIcon(d.type)
            return (
              <Link key={d.id} to={`/app/equipamentos/${d.id}`} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100"><Icon className="h-5 w-5 text-slate-700" /></span>
                <h3 className="mt-4 font-semibold text-slate-900">{d.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{d.specs.slice(0, 4).map((s) => s.value).join(' · ') || 'Sem especificações'}</p>
                <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">{d.history[0] ? `Último serviço: ${d.history[0].title} (${fmtDate(d.history[0].date)})` : 'Sem histórico de serviços'}</p>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}

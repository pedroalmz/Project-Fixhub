import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Home, Monitor, Upload, X } from 'lucide-react'
import { useStore } from '../../data/store'
import type { Photo, Priority, ServiceMode } from '../../data/types'
import { Button, ButtonLink, Card, Field, Input, PageHeader, Select, Textarea } from '../../components/ui'

export default function NewTicket() {
  const { devices, currentCustomer, actions } = useStore()
  const mine = devices.filter((d) => d.customerId === currentCustomer.id)
  const navigate = useNavigate()
  const [deviceId, setDeviceId] = useState(mine[0]?.id ?? '')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [mode, setMode] = useState<ServiceMode>('presencial')
  const [priority, setPriority] = useState<Priority>('normal')
  const [photos, setPhotos] = useState<Photo[]>([])

  const addFiles = (files: FileList | null) => {
    if (!files) return
    const added = Array.from(files).map((f, i) => ({ id: `new${Date.now()}${i}`, caption: f.name, url: URL.createObjectURL(f) }))
    setPhotos((p) => [...p, ...added])
  }

  const submit = () => {
    const id = actions.addTicket({ deviceId, title: title.trim(), description: description.trim(), mode, priority, photos })
    navigate(`/app/chamados/${id}`)
  }
  const valid = deviceId && title.trim() && description.trim()

  const modeOption = (m: ServiceMode, Icon: typeof Home, label: string, text: string) => (
    <button type="button" onClick={() => setMode(m)} className={`flex-1 rounded-lg border p-4 text-left transition ${mode === m ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-slate-200 hover:border-slate-300'}`}>
      <Icon className="h-5 w-5 text-slate-700" />
      <p className="mt-2 text-sm font-medium text-slate-900">{label}</p>
      <p className="text-xs text-slate-500">{text}</p>
    </button>
  )

  return (
    <>
      <PageHeader back={<Link to="/app/chamados" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900"><ArrowLeft className="h-4 w-4" />Meus chamados</Link>} title="Abrir chamado" subtitle="Descreva o problema para que o técnico possa ajudar." />
      <div className="max-w-3xl space-y-6">
        <Card title="Equipamento e problema">
          <div className="space-y-4">
            <Field label="Equipamento">
              {mine.length ? (
                <Select value={deviceId} onChange={(e) => setDeviceId(e.target.value)}>{mine.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</Select>
              ) : (
                <p className="text-sm text-slate-500">Você ainda não tem equipamentos. <Link className="underline" to="/app/equipamentos">Cadastre um primeiro</Link>.</p>
              )}
            </Field>
            <Field label="Resumo do problema"><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Computador desliga sozinho" /></Field>
            <Field label="Descrição detalhada" hint="Quando começou? Aparece alguma mensagem de erro?"><Textarea value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
            <Field label="Urgência">
              <Select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
                <option value="baixa">Baixa</option><option value="normal">Normal</option><option value="alta">Alta</option>
              </Select>
            </Field>
          </div>
        </Card>

        <Card title="Fotos (opcional)">
          <label className="flex cursor-pointer flex-col items-center rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center hover:bg-slate-50">
            <Upload className="h-5 w-5 text-slate-500" />
            <span className="mt-2 text-sm font-medium text-slate-700">Clique para anexar fotos</span>
            <span className="text-xs text-slate-500">Os arquivos ficam apenas neste navegador (protótipo).</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
          </label>
          {photos.length > 0 && (
            <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {photos.map((p) => (
                <li key={p.id} className="relative overflow-hidden rounded-lg border border-slate-200">
                  <img src={p.url} alt={p.caption} className="h-20 w-full object-cover" />
                  <button aria-label="Remover foto" onClick={() => setPhotos((x) => x.filter((y) => y.id !== p.id))} className="absolute right-1 top-1 rounded-full bg-white/90 p-1"><X className="h-3 w-3" /></button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Tipo de atendimento">
          <div className="flex flex-col gap-3 sm:flex-row">
            {modeOption('presencial', Home, 'Presencial', 'Visita ou entrega na bancada')}
            {modeOption('remoto', Monitor, 'Remoto', 'Acesso remoto à tela')}
          </div>
        </Card>

        <div className="flex justify-end gap-2">
          <ButtonLink to="/app/chamados" variant="ghost">Cancelar</ButtonLink>
          <Button onClick={submit} disabled={!valid}>Enviar chamado</Button>
        </div>
      </div>
    </>
  )
}

import { Link } from 'react-router-dom'
import { Bell, Cpu, FileCheck2, HardDrive, History, Home, Monitor, MousePointerClick, Printer, ShieldCheck, Wifi, ClipboardList, Check } from 'lucide-react'
import { Logo } from '../components/layout/AppShell'
import { ButtonLink } from '../components/ui'

const steps = [
  { n: '01', title: 'Descreva o problema', text: 'Escolha o equipamento, conte o que está acontecendo e anexe fotos.' },
  { n: '02', title: 'Receba o diagnóstico', text: 'O técnico analisa o equipamento e registra o diagnóstico na plataforma.' },
  { n: '03', title: 'Aprove o orçamento', text: 'Veja peças e mão de obra detalhadas e aprove ou rejeite com um clique.' },
  { n: '04', title: 'Acompanhe o serviço', text: 'Veja cada etapa do atendimento até o equipamento voltar para você.' },
]

const services = [
  { icon: Monitor, title: 'Formatação e sistema', text: 'Instalação do Windows, drivers e backup dos seus arquivos.' },
  { icon: Cpu, title: 'Hardware e upgrades', text: 'Troca de peças, SSD, memória, fonte e montagem de PCs.' },
  { icon: ShieldCheck, title: 'Vírus e segurança', text: 'Remoção de malware, antivírus e proteção de contas.' },
  { icon: HardDrive, title: 'Recuperação de dados', text: 'Clonagem de discos e recuperação de arquivos importantes.' },
  { icon: Wifi, title: 'Redes e Wi-Fi', text: 'Configuração de roteadores, compartilhamento e conexão.' },
  { icon: Printer, title: 'Impressoras', text: 'Instalação, configuração e manutenção de impressoras.' },
]

const benefits = [
  { icon: ClipboardList, title: 'Tudo em um só lugar', text: 'Chamados, orçamentos e conversas deixam de ficar espalhados em mensagens.' },
  { icon: FileCheck2, title: 'Orçamento transparente', text: 'Cada peça e cada hora de trabalho listadas antes da sua aprovação.' },
  { icon: History, title: 'Histórico do equipamento', text: 'Saiba o que já foi feito em cada computador, com datas e detalhes.' },
  { icon: Bell, title: 'Notificações de status', text: 'Você sabe quando o diagnóstico ou o serviço muda de etapa.' },
]

export default function Landing() {
  return (
    <div className="bg-white">
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
          <Logo />
          <nav className="hidden gap-8 text-sm text-slate-600 md:flex">
            <a href="#como-funciona" className="hover:text-slate-900">Como funciona</a>
            <a href="#servicos" className="hover:text-slate-900">Serviços</a>
            <a href="#atendimento" className="hover:text-slate-900">Atendimento</a>
            <Link to="/tecnico" className="hover:text-slate-900">Para técnicos</Link>
          </nav>
          <ButtonLink to="/app" variant="secondary">Entrar</ButtonLink>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-8 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="mb-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">Suporte técnico e assistência de informática</p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl">Seu computador com problema?</h1>
          <p className="mt-5 max-w-lg text-lg text-slate-600">Encontre suporte técnico e acompanhe seu atendimento em um só lugar.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to="/app/chamados/novo" className="px-5 py-3">Solicitar atendimento</ButtonLink>
            <ButtonLink to="/app" variant="secondary" className="px-5 py-3">Entrar</ButtonLink>
          </div>
        </div>

        {/* Prévia do produto */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-xl shadow-slate-200/60 sm:p-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500">Chamado #1042</p>
                <p className="font-semibold text-slate-900">PC Gamer do Pedro</p>
              </div>
              <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700 ring-1 ring-inset ring-sky-200">Em diagnóstico</span>
            </div>
            <p className="mt-3 text-sm text-slate-600">"Meu computador desliga sozinho durante os jogos."</p>
            <div className="mt-5 flex gap-1.5">
              {[1, 1, 0, 0, 0, 0].map((d, i) => <span key={i} className={`h-1.5 flex-1 rounded-full ${d ? 'bg-slate-900' : 'bg-slate-200'}`} />)}
            </div>
            <div className="mt-5 rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">Orçamento disponível</p>
              <div className="mt-2 flex items-center justify-between text-sm"><span>Fonte 650 W + instalação</span><span className="font-semibold">R$ 539,00</span></div>
              <div className="mt-3 flex gap-2">
                <span className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white">Aprovar</span>
                <span className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700">Rejeitar</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="border-t border-slate-100 bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Como funciona</h2>
          <p className="mt-2 max-w-xl text-slate-600">Do primeiro contato à entrega, com cada etapa visível para você.</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="rounded-xl border border-slate-200 bg-white p-6">
                <span className="text-sm font-semibold text-slate-400">{s.n}</span>
                <h3 className="mt-3 font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="servicos" className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Principais serviços</h2>
          <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100"><s.icon className="h-5 w-5 text-slate-700" /></span>
                <div>
                  <h3 className="font-semibold text-slate-900">{s.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Benefícios</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {benefits.map((b) => (
              <div key={b.title} className="flex gap-4 rounded-xl border border-slate-200 bg-white p-6">
                <b.icon className="mt-0.5 h-5 w-5 shrink-0 text-slate-700" />
                <div>
                  <h3 className="font-semibold text-slate-900">{b.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{b.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="atendimento" className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Atendimento presencial e remoto</h2>
          <p className="mt-2 max-w-xl text-slate-600">Escolha a modalidade que faz mais sentido para o seu problema.</p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {[
              { icon: Home, title: 'Presencial', items: ['Visita no seu endereço ou entrega na bancada', 'Ideal para hardware, peças e equipamentos que não ligam', 'Orçamento com peças e mão de obra detalhadas'] },
              { icon: MousePointerClick, title: 'Remoto', items: ['Acesso à tela para configurar e resolver na hora', 'Ideal para software, vírus, drivers e configurações', 'Sem deslocamento, com agendamento rápido'] },
            ].map((m) => (
              <div key={m.title} className="rounded-xl border border-slate-200 p-7">
                <m.icon className="h-6 w-6 text-slate-800" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{m.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {m.items.map((i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-slate-600"><Check className="mt-0.5 h-4 w-4 shrink-0 text-slate-900" />{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-8">
        <div className="mx-auto max-w-6xl rounded-2xl bg-slate-900 px-8 py-14 text-center">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">Pronto para resolver o problema do seu computador?</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/app/chamados/novo" className="rounded-lg bg-white px-5 py-3 text-sm font-medium text-slate-900 hover:bg-slate-100">Solicitar atendimento</Link>
            <Link to="/tecnico" className="rounded-lg border border-slate-600 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800">Sou técnico</Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-8 text-center text-sm text-slate-500">FixHub · Protótipo com dados fictícios</footer>
    </div>
  )
}

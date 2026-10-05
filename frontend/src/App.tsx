import { Route, Routes, Navigate } from 'react-router-dom'
import { CalendarDays, ClipboardList, FileText, History, LayoutDashboard, Laptop, LifeBuoy, User, Users } from 'lucide-react'
import { AppShell, type NavItem } from './components/layout/AppShell'
import Landing from './pages/Landing'

// A aplicação possui duas áreas principais:
// - cliente: acompanha equipamentos, tickets e orçamentos
// - técnico: gerencia chamados, agenda, clientes e histórico
// Cada área recebe seu próprio menu lateral e conjunto de rotas.
import ClientDashboard from './pages/client/Dashboard'
import ClientDevices from './pages/client/Devices'
import DeviceDetail from './pages/client/DeviceDetail'
import NewTicket from './pages/client/NewTicket'
import ClientTickets from './pages/client/Tickets'
import ClientTicketDetail from './pages/client/TicketDetail'
import ClientQuotes from './pages/client/Quotes'
import ClientHistory from './pages/client/History'
import Profile from './pages/client/Profile'
import TechDashboard from './pages/technician/Dashboard'
import TechCustomers from './pages/technician/Customers'
import TechDevices from './pages/technician/Devices'
import TechTickets from './pages/technician/Tickets'
import TechTicketDetail from './pages/technician/TicketDetail'
import TechQuotes from './pages/technician/Quotes'
import WorkOrders from './pages/technician/WorkOrders'
import Agenda from './pages/technician/Agenda'
import TechHistory from './pages/technician/History'

const clientNav: NavItem[] = [
  { to: '/app', label: 'Início', icon: LayoutDashboard, end: true },
  { to: '/app/equipamentos', label: 'Meus equipamentos', icon: Laptop },
  { to: '/app/chamados', label: 'Meus chamados', icon: LifeBuoy },
  { to: '/app/orcamentos', label: 'Orçamentos', icon: FileText },
  { to: '/app/historico', label: 'Histórico', icon: History },
  { to: '/app/perfil', label: 'Perfil', icon: User },
]

const techNav: NavItem[] = [
  { to: '/tecnico', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/tecnico/chamados', label: 'Chamados', icon: LifeBuoy },
  { to: '/tecnico/clientes', label: 'Clientes', icon: Users },
  { to: '/tecnico/equipamentos', label: 'Equipamentos', icon: Laptop },
  { to: '/tecnico/orcamentos', label: 'Orçamentos', icon: FileText },
  { to: '/tecnico/ordens', label: 'Ordens de serviço', icon: ClipboardList },
  { to: '/tecnico/agenda', label: 'Agenda', icon: CalendarDays },
  { to: '/tecnico/historico', label: 'Histórico', icon: History },
]

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/app" element={<AppShell role="cliente" nav={clientNav} />}>
        <Route index element={<ClientDashboard />} />
        <Route path="equipamentos" element={<ClientDevices />} />
        <Route path="equipamentos/:id" element={<DeviceDetail />} />
        <Route path="chamados" element={<ClientTickets />} />
        <Route path="chamados/novo" element={<NewTicket />} />
        <Route path="chamados/:id" element={<ClientTicketDetail />} />
        <Route path="orcamentos" element={<ClientQuotes />} />
        <Route path="historico" element={<ClientHistory />} />
        <Route path="perfil" element={<Profile />} />
      </Route>

      <Route path="/tecnico" element={<AppShell role="tecnico" nav={techNav} />}>
        <Route index element={<TechDashboard />} />
        <Route path="chamados" element={<TechTickets />} />
        <Route path="chamados/:id" element={<TechTicketDetail />} />
        <Route path="clientes" element={<TechCustomers />} />
        <Route path="equipamentos" element={<TechDevices />} />
        <Route path="equipamentos/:id" element={<DeviceDetail base="/tecnico" />} />
        <Route path="orcamentos" element={<TechQuotes />} />
        <Route path="ordens" element={<WorkOrders />} />
        <Route path="agenda" element={<Agenda />} />
        <Route path="historico" element={<TechHistory />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}


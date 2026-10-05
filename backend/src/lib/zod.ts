import { z } from 'zod'

// Mensagens de erro padrão do Zod em português (as nossas, escritas nos schemas, têm prioridade).
z.config(z.locales.pt())

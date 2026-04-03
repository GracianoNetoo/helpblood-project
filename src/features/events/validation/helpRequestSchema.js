import { z } from 'zod';
import { isValidAngolaPhone } from '@/shared/utils/phone';

const validBloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

export const helpRequestSchema = z.object({
  anonimo: z.boolean(),
  nome: z.string().trim().max(80, 'Nome demasiado longo.'),
  tipo_sanguineo: z.string().refine((value) => validBloodTypes.includes(value), 'Tipo sanguineo e obrigatorio.'),
  localizacao: z.string().trim().min(1, 'Localizacao e obrigatoria.').max(80, 'Localizacao demasiado longa.'),
  volume: z.string().trim().max(20, 'Volume demasiado longo.'),
  urgencia: z.string().trim().min(1, 'Urgencia e obrigatoria.'),
  motivo: z.string().trim().min(1, 'Motivo e obrigatorio.').max(200, 'Motivo demasiado longo.'),
  contacto: z.string().trim().min(1, 'Contacto e obrigatorio.').refine(isValidAngolaPhone, 'Contacto invalido.')
}).superRefine((value, ctx) => {
  if (!value.anonimo && !value.nome.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['nome'],
      message: 'Nome e obrigatorio.'
    });
  }
});

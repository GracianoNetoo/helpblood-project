import { z } from 'zod';
import { angolaLocations } from '@/shared/utils/angolaLocations';
import { isValidAngolaPhone } from '@/shared/utils/phone';

export const profileSettingsSchema = z.object({
  email: z.string().trim().min(1, 'Informe o email.').email('Informe um email valido.'),
  telefone: z.string().trim().optional().or(z.literal('')),
  provincia: z.string().trim().min(1, 'Selecione a provincia e o municipio.'),
  municipio: z.string().trim().min(1, 'Selecione a provincia e o municipio.')
}).superRefine((value, ctx) => {
  if (value.telefone && !isValidAngolaPhone(value.telefone)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['telefone'],
      message: 'Use um numero valido com 9 digitos ou +244 seguido de 9 digitos.'
    });
  }

  if (!Object.keys(angolaLocations).includes(value.provincia)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['provincia'],
      message: 'Selecione a provincia e o municipio.'
    });
  }

  const municipios = angolaLocations[value.provincia] || [];
  if (!municipios.includes(value.municipio)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['municipio'],
      message: 'Selecione a provincia e o municipio.'
    });
  }
});

export const passwordSettingsSchema = z.object({
  nonce: z.string().trim().min(1, 'Informe o codigo de confirmacao enviado por email.'),
  password: z.string().min(8, 'A palavra-passe precisa de pelo menos 8 caracteres.'),
  confirmPassword: z.string().min(1, 'Preencha e confirme a nova palavra-passe.')
}).superRefine((value, ctx) => {
  if (value.password !== value.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['confirmPassword'],
      message: 'As palavras-passe nao coincidem.'
    });
  }
});

export const deleteAccountSchema = z.object({
  deleteConfirmation: z.string().trim().toUpperCase().refine((value) => value === 'ELIMINAR', 'Escreva ELIMINAR para confirmar.')
});

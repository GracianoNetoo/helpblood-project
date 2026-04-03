import { z } from 'zod';
import { angolaLocations } from '@/shared/utils/angolaLocations';
import { isValidAngolaPhone } from '@/shared/utils/phone';

const validBloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

export const registerDonorSchema = z.object({
  nome: z.string().trim().min(1, 'Nome e obrigatorio.').max(80, 'Nome demasiado longo.'),
  tipo_sanguineo: z.string().refine((value) => validBloodTypes.includes(value), 'Selecione o tipo sanguineo.'),
  rh: z.string().trim().min(1, 'Selecione o fator RH.'),
  doacao_sangue: z.string().trim().min(1, 'Indique se ja doou sangue.'),
  provincia: z.string().trim().min(1, 'Selecione a provincia.'),
  municipio: z.string().trim().min(1, 'Selecione o municipio.'),
  telefone: z.string().trim().min(1, 'Informe o telemovel.').refine(isValidAngolaPhone, 'Use 9 digitos ou o formato +244 seguido de 9 digitos.'),
  email: z.string().trim().min(1, 'Informe o email.').email('E-mail invalido.'),
  senha: z.string().min(8, 'Minimo 8 caracteres.'),
  confirmar_senha: z.string().min(1, 'Confirme a palavra-passe.')
}).superRefine((value, ctx) => {
  if (!Object.keys(angolaLocations).includes(value.provincia)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['provincia'],
      message: 'Selecione a provincia.'
    });
  }

  const municipios = angolaLocations[value.provincia] || [];
  if (!municipios.includes(value.municipio)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['municipio'],
      message: 'Selecione o municipio.'
    });
  }

  if (value.senha !== value.confirmar_senha) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['confirmar_senha'],
      message: 'As palavras-passe nao coincidem.'
    });
  }
});

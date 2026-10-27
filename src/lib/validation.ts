import { z } from 'zod'
import { INDIAN_STATES } from '@/data/states'

export const emailSchema = z
  .string()
  .trim()
  .min(1, 'Please enter your email address.')
  .email('Please enter a valid email address, like name@example.com.')

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number (starting with 6, 7, 8 or 9).')

export const pincodeSchema = z
  .string()
  .trim()
  .regex(/^[1-9]\d{5}$/, 'Enter a valid 6-digit pincode.')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .regex(/[A-Za-z]/, 'Include at least one letter.')
  .regex(/\d/, 'Include at least one number.')

export const nameSchema = z
  .string()
  .trim()
  .min(2, 'Please enter your full name.')
  .max(60, 'Name is too long.')
  .regex(/^[\p{L} .'-]+$/u, "Name can only contain letters, spaces and . ' -")

export const addressSchema = z.object({
  fullName: nameSchema,
  phone: phoneSchema,
  pincode: pincodeSchema,
  line1: z.string().trim().min(5, 'Enter your house / flat number and building or street.'),
  line2: z.string().trim().max(120).default(''),
  landmark: z.string().trim().max(80).default(''),
  city: z.string().trim().min(2, 'Enter your city or town.'),
  state: z.enum(INDIAN_STATES, { message: 'Please choose your state or union territory.' }),
  isDefault: z.boolean().default(false),
})

export type AddressFormValues = z.input<typeof addressSchema>

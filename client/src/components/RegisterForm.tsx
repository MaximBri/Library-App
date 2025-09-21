import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../hooks/useAuth'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type Form = z.infer<typeof schema>

export const RegisterForm: React.FC = () => {
  const { register: regFn } = useAuth()
  const { register, handleSubmit, formState } = useForm<Form>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: Form) => {
    try {
      await regFn(data.email, data.password)
      // redirect
    } catch (err: any) {
      alert(err?.response?.data?.error ?? err.message ?? 'Registration failed')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} placeholder='Email' />
      <input {...register('password')} type='password' placeholder='Password' />
      <button type='submit' disabled={formState.isSubmitting}>
        Register
      </button>
    </form>
  )
}

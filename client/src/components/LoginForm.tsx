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

export const LoginForm: React.FC = () => {
  const { login } = useAuth()
  const { register, handleSubmit, formState } = useForm<Form>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: Form) => {
    try {
      await login(data.email, data.password)
      // redirect or show success
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} placeholder='Email' />
      <input {...register('password')} type='password' placeholder='Password' />
      <button type='submit' disabled={formState.isSubmitting}>
        Login
      </button>
    </form>
  )
}

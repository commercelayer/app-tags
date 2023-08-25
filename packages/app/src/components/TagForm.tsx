import { Button, Spacer } from '@commercelayer/app-elements'
import {
  Form,
  Input,
  ValidationApiError
} from '@commercelayer/app-elements-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type UseFormSetError } from 'react-hook-form'
import { z } from 'zod'

const tagFormSchema = z.object({
  name: z
    .string()
    .refine(
      (value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value),
      'Name is invalid'
    )
})

export type TagFormValues = z.infer<typeof tagFormSchema>

interface Props {
  defaultValues: TagFormValues
  isSubmitting: boolean
  onSubmit: (
    formValues: TagFormValues,
    setError: UseFormSetError<TagFormValues>
  ) => void
  apiError?: any
}

export function TagForm({
  defaultValues,
  onSubmit,
  apiError,
  isSubmitting
}: Props): JSX.Element {
  const methods = useForm({
    defaultValues,
    resolver: zodResolver(tagFormSchema)
  })

  return (
    <Form
      {...methods}
      onSubmit={(formValues) => {
        onSubmit(formValues, methods.setError)
      }}
    >
      <Spacer bottom='8'>
        <Input name='name' label='Name' autoComplete='off' />
      </Spacer>

      <Spacer top='14'>
        <Button type='submit' disabled={isSubmitting} className='w-full'>
          {defaultValues.name.length === 0 ? 'Create' : 'Update'}
        </Button>
        <ValidationApiError apiError={apiError} />
      </Spacer>
    </Form>
  )
}

import { Form, useFormAction, useNavigation, useSearchParams, useSubmit } from '@remix-run/react'
import { useEffect, useId, useMemo, useRef } from 'react'
//import { useDebounce, useIsPending } from '~/utils/misc'
import { Icon } from '~/components/ui/icon'
import { Input } from '~/ui/input'
import { Label } from '~/ui/label'
import { StatusButton } from '~/components/ui/status-button'
import { useSpinDelay } from 'spin-delay'
import { TextField } from '@radix-ui/themes'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'

export function SearchBar({
  status,
  autoFocus = false,
  autoSubmit = false,
}: {
  status: 'idle' | 'pending' | 'success' | 'error'
  autoFocus?: boolean
  autoSubmit?: boolean
}) {
  const id = useId()
  const [searchParams] = useSearchParams()
  const submit = useSubmit()
  const isSubmitting = useIsPending({
    formMethod: 'GET',
    formAction: '/users',
  })

  const handleFormChange = useDebounce((form: HTMLFormElement) => {
    submit(form)
  }, 400)

  return (
    <Form
      method="GET"
      action="/users"
      className="flex flex-wrap items-center justify-center gap-2"
      onChange={e => autoSubmit && handleFormChange(e.currentTarget)}
    >
      <div className="flex-1">
        <Label htmlFor={id} className="sr-only">
          Search
        </Label>
        <Input
          type="search"
          name="search"
          id={id}
          defaultValue={searchParams.get('search') ?? ''}
          placeholder="Search"
          className="w-full"
          autoFocus={autoFocus}
        />
      </div>
      <div>
        <TextField.Root  >
          <TextField.Slot>
            <MagnifyingGlassIcon height="16" width="16" />
          </TextField.Slot>
          <TextField.Input name='search' placeholder="Search the docs…" id={id} defaultValue={searchParams.get('search') ?? ''} className="w-full" autoFocus={autoFocus} />
        </TextField.Root>
      </div>
      <div>
        <StatusButton
          type="submit"
          status={isSubmitting ? 'pending' : status}
          className="flex w-full items-center justify-center"
          size="sm"
        >
          <Icon name="magnifying-glass" />
          <span className="sr-only">Search</span>
        </StatusButton>
      </div>
    </Form>
  )
}



/**
 * Returns true if the current navigation is submitting the current route's
 * form. Defaults to the current route's form action and method POST.
 *
 * Defaults state to 'non-idle'
 *
 * NOTE: the default formAction will include query params, but the
 * navigation.formAction will not, so don't use the default formAction if you
 * want to know if a form is submitting without specific query params.
 */
export function useIsPending({
  formAction,
  formMethod = 'POST',
  state = 'non-idle',
}: {
  formAction?: string
  formMethod?: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'
  state?: 'submitting' | 'loading' | 'non-idle'
} = {}) {
  const contextualFormAction = useFormAction()
  const navigation = useNavigation()
  const isPendingState =
    state === 'non-idle'
      ? navigation.state !== 'idle'
      : navigation.state === state
  return (
    isPendingState &&
    navigation.formAction === (formAction ?? contextualFormAction) &&
    navigation.formMethod === formMethod
  )
}

/**
 * This combines useSpinDelay (from https://npm.im/spin-delay) and useIsPending
 * from our own utilities to give you a nice way to show a loading spinner for
 * a minimum amount of time, even if the request finishes right after the delay.
 *
 * This avoids a flash of loading state regardless of how fast or slow the
 * request is.
 */
export function useDelayedIsPending({
  formAction,
  formMethod,
  delay = 400,
  minDuration = 300,
}: Parameters<typeof useIsPending>[0] &
  Parameters<typeof useSpinDelay>[1] = {}) {
  const isPending = useIsPending({ formAction, formMethod })
  const delayedIsPending = useSpinDelay(isPending, {
    delay,
    minDuration,
  })
  return delayedIsPending
}

function callAll<Args extends Array<unknown>>(
  ...fns: Array<((...args: Args) => unknown) | undefined>
) {
  return (...args: Args) => fns.forEach(fn => fn?.(...args))
}


export function useDebounce<
  Callback extends (...args: Parameters<Callback>) => ReturnType<Callback>,
>(callback: Callback, delay: number) {
  const callbackRef = useRef(callback)
  useEffect(() => {
    callbackRef.current = callback
  })
  return useMemo(
    () =>
      debounce(
        (...args: Parameters<Callback>) => callbackRef.current(...args),
        delay,
      ),
    [delay],
  )
}

import React from 'react'

type Props = {
  indeterminate?: boolean
} & React.HTMLProps<HTMLInputElement>

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: Props) {
  const ref = React.useRef<HTMLInputElement>(null!)

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate])

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + 'size-sm peer shrink-0 rounded-sm border border-surface-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-700 dark:text-surface-50 dark:focus-visible:ring-surface-400 dark:focus-visible:ring-offset-surface-900'}
      {...rest}
    />
  )
}

export default IndeterminateCheckbox

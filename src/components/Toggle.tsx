interface Props {
  on: boolean
  onChange: () => void
  disabled?: boolean
}

export default function Toggle({ on, onChange, disabled }: Props) {
  return (
    <div
      className={`toggle-track ${on ? 'on' : 'off'} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
      onClick={disabled ? undefined : onChange}
      role="switch"
      aria-checked={on}
    >
      <div className="toggle-thumb" />
    </div>
  )
}

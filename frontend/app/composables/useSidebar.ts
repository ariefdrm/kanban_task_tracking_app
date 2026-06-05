export function useSidebar() {
  const open = useState<boolean>('sidebar:open', () => false)

  function toggle() {
    open.value = !open.value
  }

  function close() {
    open.value = false
  }

  return { open, toggle, close }
}

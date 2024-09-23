import * as React from 'react'

export function useEffectOnce(callback: () => void) {
  const isUsedRef = React.useRef(false)

  React.useEffect(() => {
    if (isUsedRef.current) {
      return
    }

    isUsedRef.current = true
    callback()
  }, [isUsedRef.current])
}

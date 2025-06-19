// Intersection Observer 커스텀 훅

import { useEffect, useRef, useState } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
) => {
  const { threshold = 0, rootMargin = '0px', triggerOnce = false } = options
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting
        setIsIntersecting(isElementIntersecting)

        if (isElementIntersecting && !hasIntersected) {
          setHasIntersected(true)
        }

        if (triggerOnce && isElementIntersecting) {
          observer.unobserve(element)
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, rootMargin, triggerOnce, hasIntersected])

  return {
    elementRef,
    isIntersecting,
    hasIntersected
  }
}

// 무한 스크롤을 위한 훅
export const useInfiniteScroll = (
  callback: () => void,
  hasMore: boolean = true
) => {
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 1.0,
    rootMargin: '100px'
  })

  useEffect(() => {
    if (isIntersecting && hasMore) {
      callback()
    }
  }, [isIntersecting, hasMore, callback])

  return elementRef
}

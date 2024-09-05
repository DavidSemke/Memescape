import { 
    useState, 
    useEffect, 
    useLayoutEffect, 
    MutableRefObject 
} from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function useContainerHeight(
    containerRef: MutableRefObject<HTMLElement | null>,
): number | null {
    const [
        containerHeight, 
        setContainerHeight
    ] = useState<number | null>(null);
    
    const onResize = useDebouncedCallback(() => {
        if (!containerRef.current) {
            return
        }

        setContainerHeight(null)
    }, 1000)
    
    useLayoutEffect(() => {
        if (!containerRef.current) {
            return
        }

        setContainerHeight(
            containerRef.current.offsetHeight
        )
    }, [containerHeight])

    useEffect(() => {
        window.addEventListener('resize', onResize)
        
        return () => {
          window.removeEventListener('resize', onResize)
        }
    }, []);

    return containerHeight
}
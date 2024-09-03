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
        updateHeight()
    }, 1000)
    
    useLayoutEffect(() => {
        updateHeight()
    }, [])

    useEffect(() => {
        window.addEventListener('resize', onResize)
        
        return () => {
          window.removeEventListener('resize', onResize)
        }
    }, []);

    function updateHeight() {
        if (!containerRef.current) {
            return
        }

        setContainerHeight(
            containerRef.current.offsetHeight
        )
    }

    return containerHeight
}
import { 
    useState, 
    useEffect, 
    useLayoutEffect, 
    MutableRefObject 
} from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function useContainerHeight(
    containerRef: MutableRefObject<HTMLElement | null>,
    bottomElementRef: MutableRefObject<HTMLElement | null>
): number | null {
    const [
        containerHeight, 
        setContainerHeight
    ] = useState<number | null>(null);

    function updateHeight() {
        const container = containerRef.current
        const bottomElement = bottomElementRef.current

        if (!container || !bottomElement) {
            return
        }

        setContainerHeight(
            bottomElement.getBoundingClientRect().top 
            - container.getBoundingClientRect().top
        )
    }
    
    const onResize = useDebouncedCallback(() => {
        updateHeight()
    }, 500)
    
    useLayoutEffect(() => {
        updateHeight()
    }, [])

    useEffect(() => {
        window.addEventListener('resize', onResize)
        
        return () => {
          window.removeEventListener('resize', onResize)
        }
    }, []);

    return containerHeight
}
import { useThree } from "@react-three/fiber";
import useStore from "../../store/store";

function useSection() {
  const offset = useStore((state) => state.offset)
  const sections = useStore((state) => state.sections)
  const pages = useStore((state) => state.pages)
  const zoom = useStore((state) => state.zoom)

  // const {sections, pages, zoom} = state;
  const {size, viewport} = useThree();
  const viewportWidth = viewport.width
  const viewportHeight = viewport.height
  const canvasWidth = viewportWidth / zoom
  const canvasHeight = viewportHeight / zoom
  const mobile = size.width < 768
  const margin = canvasWidth * (mobile ? 0.2 : 0.1)
  const contentMaxWidth = canvasWidth * (mobile ? 0.8 : 0.6)
  const sectionHeight = canvasHeight * ((pages - 1) / (sections - 1))
  const aspect = size.height / viewportHeight

  return {
    aspect,
    viewport,
    offset,
    viewportWidth,
    viewportHeight,
    canvasWidth,
    canvasHeight,
    mobile,
    margin,
    contentMaxWidth,
    sectionHeight,
  }
}

function lerp(start: number, end: number, alpha: number): number {
  return start + (end - start) * alpha;
}

export {
  useSection, lerp
}
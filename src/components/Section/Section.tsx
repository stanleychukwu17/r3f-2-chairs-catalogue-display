import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { useSection, lerp } from "./useSection"
import useStore from "../../store/store"

type SectionProps = {
  children: React.ReactNode,
  offset: number,
  factor: number,
}

function Section({children, offset, factor, ...props}: SectionProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const state = useStore((state) => state)
  const {offset: parentOffset, sectionHeight, aspect} = useSection()

  const resolvedOffset = offset !== undefined ? offset : parentOffset

  useFrame(() => {
    const curY = meshRef.current.position.y
    const curTop = state.top.current as number / aspect
    return meshRef.current.position.y = lerp(curY, (curTop/state.zoom) * factor, 0.1)
  })

  return (
    <group {...props}>
      <group ref={meshRef} position={[0, -sectionHeight * resolvedOffset * factor, 0]}>
        {children}
      </group>
    </group>
  )
}

export default Section
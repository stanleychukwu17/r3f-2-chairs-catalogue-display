import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { useSection, lerp } from "./useSection"
// import useStore from "../../store/store"

type SectionProps = {
  children: React.ReactNode,
  offset: number,
  factor: number,
}

function Section({children, offset, factor, ...props}: SectionProps) {
  const groupRef = useRef<THREE.Group>(null!);
  
  // const {offset: parentOffset, sectionHeight, aspect} = useSection()
  // const state = useStore((state) => state)

  // const resolvedOffset = offset !== undefined ? offset : parentOffset

  useFrame(() => {
    // const curY = groupRef.current.position.y
    // return groupRef.current.position.y = lerp(curY, (curTop/state.zoom) * factor, 0.1)
  })

  return (
    // <group {...props}>
    //   <group ref={groupRef} position={[0, -sectionHeight * resolvedOffset * factor, 0]}>
    //     {children}
    //   </group>
    // </group>
    <group {...props}>
      <group ref={groupRef} position={[0, -sectionHeight, 0]}>
        {children}
      </group>
    </group>
  )
}

export default Section
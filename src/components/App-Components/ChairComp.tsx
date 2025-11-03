import { useGLTF } from "@react-three/drei"

type ChairCompProps = {
  modelPath: string
}
const ChairComp = ({modelPath}: ChairCompProps) => {
  const gltf = useGLTF(modelPath, true)
  return (
    <primitive scale={1.5} position={[0, -15, 0]} object={gltf.scene} />
  )
}

export default ChairComp;
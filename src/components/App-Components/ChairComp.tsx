import { useGLTF } from "@react-three/drei"

type ChairCompProps = {
  modelPath: string
}
const ChairComp = ({modelPath}: ChairCompProps) => {
  const gltf = useGLTF(modelPath, true)
  return (
    <primitive object={gltf.scene} />
  )
}

export default ChairComp;
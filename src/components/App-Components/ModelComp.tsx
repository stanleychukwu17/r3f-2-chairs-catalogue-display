import { useGLTF } from "@react-three/drei"

type ModelCompProps = {
  modelPath: string
}
const ModelComp = ({modelPath}: ModelCompProps) => {
  const gltf = useGLTF(modelPath, true)
  return (
    <primitive object={gltf.scene} />
  )
}

export default ModelComp;
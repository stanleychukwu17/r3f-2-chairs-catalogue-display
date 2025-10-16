import * as THREE from 'three'
import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import {Html, useGLTF} from "@react-three/drei"

import Section from "./components/Section/Section"
import Header from "./components/Header/Header"
import './App.css'

const LightsComp = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight intensity={Math.PI/2} position={[10, 10, 5]} />
      <directionalLight intensity={Math.PI/2} position={[-10, 10, 0]} />
    </>
  )
}


type ModelCompProps = {
  modelPath: string
}
const ModelComp = ({modelPath}: ModelCompProps) => {
  const gltf = useGLTF(modelPath, true)
  return (
    <primitive object={gltf.scene} />
  )
}


type HtmlCompProps = {
  children: React.ReactNode,
  modelPath: string,
  positionY: number
}
const HtmlComponent = ({children, modelPath, positionY}: HtmlCompProps) => {
  const groupRef = useRef<THREE.Mesh>(null!);

  useFrame((_state, delta) => {
    return groupRef.current.rotation.y += delta / 2
  })

  return(
    <Section offset={0} factor={1}>
      <group ref={groupRef} position={[0, positionY, 0]}>
        <ModelComp modelPath={modelPath} />
        {children}
      </group>
    </Section>
  )
}


export default function App() {
  return (
    <div className="App">
      <Header />
      <Canvas
        camera={{
          // near: 0.1, far: 2000,
          position: [0, 0, 120], fov: 70
        }}
      >
        <LightsComp />
        <HtmlComponent modelPath="/grey.gltf" positionY={-20}>
          <Html fullscreen>
            <div className="title">Hello</div>
          </Html>
        </HtmlComponent>
      </Canvas>
    </div>
  )
}

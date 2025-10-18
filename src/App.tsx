import * as THREE from 'three'
import { useRef, useState, useEffect} from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {Html} from "@react-three/drei"
import { useMotionValueEvent, useScroll } from 'framer-motion'

import LightsComp from "./components/App-Components/LightsComp"
import ModelComp from "./components/App-Components/ModelComp"
// import Section from "./components/Section/Section"
import Header from "./components/Header/Header"
import './App.css'

const chairs: Record<string, {title: string, path: string}> = {
  "yellow": {
    title:"yellow", path:"/yellow.gltf"
  },
  "grey": {
    title:"grey", path:"/grey.gltf"
  },
  // "limegreen": {
  //   title:"limegreen", path:"/lime_green.gltf"
  // },
  // "pink": {
  //   title:"pink", path:"/candy_pink.gltf"
  // },
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
      <group ref={groupRef} position={[0, positionY, 0]}>
        <ModelComp modelPath={modelPath} />
        {children}
      </group>
  )
}

const TitleComp = ({title, offset}: {title: string, offset: number}) => {
  const containerRef = useRef<HTMLDivElement>(null!);
  const {scrollY} = useScroll({target: containerRef})
  const pageOffset = offset
  const [pageHeight, setPageHeight] = useState(0);
  const pageDistanceFromTheTop = pageOffset * pageHeight;

  const mySection = () => {
    const pageRange = {start: pageDistanceFromTheTop, end: pageDistanceFromTheTop + pageHeight, currentPage: ''}

    if (scrollY.get() >= pageRange.start && scrollY.get() <= pageRange.end) {
      pageRange.currentPage = title;
      console.log('now in current page', title)
    }
  
    return pageRange
  }


  useEffect(() => {
    if (containerRef.current) {
      setPageHeight(containerRef.current.getBoundingClientRect().height);
    }
  }, []);


  console.log({pageHeight, title, pageOffset, pageDistanceFromTheTop})
  useMotionValueEvent(scrollY, "change", (value) => {
    console.log({scrolled: Math.round(value), title, pageDistanceFromTheTop, "mySection": mySection()})
  })

  return (
    <div className='others' ref={containerRef}>
      <p>{title}</p>
    </div>
  )
}


export default function App() {
  return (
    <div className="App">
      <Header />
      <div className="three_cvr">
        <div className="three_Canvas">
          <Canvas
            camera={{
              // near: 0.1, far: 2000,
              position: [0, 0, 120], fov: 70
            }}
          >
            <LightsComp />

            {Object.keys(chairs).map((key, index) => {
              const chair = chairs[key].path
              const title = chairs[key].title

              return (
                <HtmlComponent modelPath={chair} positionY={-20 -(index * 60)}  key={key}>
                  <Html fullscreen>
                    <div className="title">{title}</div>
                  </Html>
                </HtmlComponent>
              )
            })}
          </Canvas>
        </div>

        {Object.keys(chairs).map((key, index) => {
          return <TitleComp title={chairs[key].title} offset={index} key={key} />
        })}
      </div>
    </div>
  )
}

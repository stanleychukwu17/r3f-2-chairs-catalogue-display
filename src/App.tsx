import * as THREE from 'three'
import { useRef, useState, useEffect} from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {Html} from "@react-three/drei"
import { useMotionValueEvent, useScroll, useTransform } from 'framer-motion'

import LightsComp from "./components/App-Components/LightsComp"
import ModelComp from "./components/App-Components/ModelComp"
// import Section from "./components/Section/Section"
import Header from "./components/Header/Header"
import './App.css'
// import { useStore } from "./store/store";

const chairs: Record<string, {title: string, path: string}> = {
  "yellow": {
    title:"yellow", path:"/yellow.gltf"
  },
  "grey": {
    title:"grey", path:"/grey.gltf"
  },
  "limegreen": {
    title:"limegreen", path:"/lime_green.gltf"
  },
  "pink": {
    title:"pink", path:"/candy_pink.gltf"
  },
}




type HtmlCompProps = {
  children: React.ReactNode,
  modelPath: string,
  positionY: number,
  offset: number
}
const HtmlComponent = ({children, modelPath, positionY, offset}: HtmlCompProps) => {
  const groupRef = useRef<THREE.Mesh>(null!);

  useFrame((_state, delta) => {
    return groupRef.current.rotation.y += delta / 2
  })

  // console.log({offset, positionY})
  return(
      <group ref={groupRef} position={[0, positionY, 0]}>
        <ModelComp modelPath={modelPath} />
        {children}
      </group>
  )
}


const TitleComp = ({title, offset}: {title: string, offset: number}) => {
  const containerRef = useRef<HTMLDivElement>(null!);
  const currentPage = useRef<string>('')

  const [pageHeight, setPageHeight] = useState(0);

  const pageOffset = offset // i.e the page current number, the first page starts from 0
  let pageDistanceFromTheTop = pageOffset * pageHeight
  const [pageStart, setPageStart] = useState(0);
  const [pageEnd, setPageEnd] = useState(0);

  const [scrollStart, setScrollStart] = useState(0);
  const [scrollEnd, setScrollEnd] = useState(0);

  const {scrollY} = useScroll({target: containerRef})
  const scrollPercentage = useTransform(scrollY, [scrollStart, scrollEnd], [0, 100])
  // const scrollPercentage = useTransform(scrollY, [scrollStart, scrollEnd], [0, 100], {clamp: false})

  // checks if the current scroll position is within the bounds of the current page
  const mySection = () => {
    if (scrollY.get() >= pageStart && scrollY.get() <= pageEnd) {
      currentPage.current = title;
      // console.log('now in current page', title)
    } else {
      currentPage.current = ''
    }
  
    return currentPage.current
  }

  // updates the page height and the page start and end positions
  const updateAllPages = () => {
    if (!containerRef.current) return

    const currentHeight = containerRef.current.getBoundingClientRect().height;
    setPageHeight(currentHeight);

    const pageHeightToRemove = currentHeight * .85 // the height of the page to remove from the scroll position
    pageDistanceFromTheTop = pageOffset * currentHeight; // the distance of the page from the top

    const start = pageDistanceFromTheTop
    const end = pageDistanceFromTheTop + currentHeight

    // console.log({title, pageStart: start, pageEnd: end, scrollStart: start-pageHeightToRemove, scrollEnd: end-pageHeightToRemove})

    setPageStart(start)
    setPageEnd(end)

    // i removed the pageHeightToRemove from the pageStart and pageEnd because by the time the user reaches the start of the page, the complete page is already in the viewport
    setScrollStart(start-pageHeightToRemove)
    setScrollEnd(end-pageHeightToRemove)
  }

  // if the user resizes the window, calls the "updateAllPages" function
  useEffect(() => {
    // calls the "updateAllPages" function on mount
    updateAllPages()

    const handleResize = () => {
      updateAllPages()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useMotionValueEvent(scrollPercentage, "change", (value) => {
    console.log('scroll update', {scrollStart, scrollEnd, title, scrollPercentage: value})
    mySection()
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
                <HtmlComponent modelPath={chair} positionY={-35 - (index * 150)} offset={index}  key={key}>
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

import * as THREE from 'three'
import { useRef, useState, useEffect} from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import {Html, useGLTF} from "@react-three/drei"
import { motion, useMotionValueEvent, useScroll, useTransform, transform, useSpring } from 'framer-motion'

import LightsComp from "./components/App-Components/LightsComp"
import ModelComp from "./components/App-Components/ModelComp"
// import Section from "./components/Section/Section"
import Header from "./components/Header/Header"
import './App.css'
import { useStore } from "./store/store";

type HtmlCompProps = {
  children: React.ReactNode,
  modelPath: string,
  positionY: number, // the starting positionY of the html component
  offset: number, // the page number
  viewRange: [number, number, number] // view range for the chairs [positionY at 0%, positionY at 100%, positionY at 200%]
}
const HtmlComponent = ({children, modelPath, positionY, offset, viewRange}: HtmlCompProps) => {
  const groupRef = useRef<THREE.Group>(null!);
  const {scrollYProgress} = useScroll()

  // initialize the springPositionY, useSpring creates a smooth animation for the positionY
  const springPositionY = useSpring(positionY, {duration: 600, stiffness: 50, damping: 10})

  // as the springPositionY changes, we update the groupMesh positionY
  useMotionValueEvent(springPositionY, "change", (value) => {
    groupRef.current.position.y = value
  })

  // as the scrollYProgress changes, we update the springPositionY value
  useMotionValueEvent(scrollYProgress, "change", () => {
    const {pageDetails} = useStore.getState()
    const thisPageDetails = pageDetails[offset]
    const this_page_scroll_percentage = thisPageDetails.scrollPercentage

    // calculateNewPositionY = transform([0%, 100%, 200%], [positionY at 0%, positionY at 100%, positionY at 200%], {clamp: false})
    const calculateNewPositionY = transform([0, 100, 200], [...viewRange], {clamp: false})
    const new_positionY = calculateNewPositionY(this_page_scroll_percentage) // calls the transform function to calculate the new positionY
    springPositionY.set(new_positionY) // updates the "springPositionY" value with the new "positionY"
  })

  // rotate the chairs
  useFrame((_state, delta) => {
    return groupRef.current.rotation.y += delta / 1.5
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
  const {setPageDetails, windowResized, setWindowResized} = useStore()

  const [pageHeight, setPageHeight] = useState(0); // stores the height for each page

  const pageOffset = offset // i.e the page current number, the first page starts from 0
  let pageDistanceFromTheTop = pageOffset * pageHeight // the distance of the page from the top
  const [_pageStart, setPageStart] = useState(0); // stores the start position of the page
  const [_pageEnd, setPageEnd] = useState(0); // stores the end position of the page

  const [scrollStart, setScrollStart] = useState(0);
  const [scrollEnd, setScrollEnd] = useState(0);

  const {scrollY} = useScroll({target: containerRef}) 
  const scrollPercentage = useTransform(scrollY, [scrollStart, scrollEnd], [0, 100], {clamp: false})

  // retrieve's the current height for the page
  // then uses it to calculate the pageDistanceFromTheTop
  // also used to calculate when the page enters the viewport `scrollStart` and when it leaves `scrollEnd`
  const updateAllPages = () => {
    if (!containerRef.current) return

    const currentHeight = containerRef.current.getBoundingClientRect().height;
    setPageHeight(currentHeight);

    const pageHeightToRemove = currentHeight * .85 // the height of the page to remove from the scroll position
    pageDistanceFromTheTop = pageOffset * currentHeight; // the distance of the page from the top

    const startOfPage = pageDistanceFromTheTop
    const endOfPage = pageDistanceFromTheTop + currentHeight

    setPageStart(startOfPage)
    setPageEnd(endOfPage)

    // i removed the pageHeightToRemove from the pageStart and pageEnd
    // because normally by the time the user reaches the start of the page, the complete page is already in the viewport
    setScrollStart(startOfPage-pageHeightToRemove)
    setScrollEnd(endOfPage-pageHeightToRemove)
  }

  // calls the "updateAllPages" function on mount
  useEffect(() => {
    updateAllPages()
  }, [])

  // if the user resizes the viewport, we call the "updateAllPages" function
  useEffect(() => {
    if (windowResized === true) {
      updateAllPages()
      setWindowResized(false)
    }
  }, [windowResized])

  // updates the global store pageDetails with the current scrollPercentage
  useMotionValueEvent(scrollPercentage, "change", (value) => {
    setPageDetails(offset, Math.round(value)) // where offset = pageNumber
  })

  return (
    <motion.div className='others' ref={containerRef}>
      <p>{title}</p>
    </motion.div>
  )
}


type ChairProps = {
  title: string,
  path: string,
  viewRange: [number, number, number]
}
const chairs: Record<string, ChairProps> = {
  "yellow": {
    title:"yellow", path:"/yellow.gltf", viewRange: [-200, -5, 200]
  },
  "grey": {
    title:"grey", path:"/grey.gltf", viewRange: [-200, -5, 200]
  },
  "limegreen": {
    title:"limegreen", path:"/lime_green.gltf", viewRange: [-200, -5, 200]
  },
  "pink": {
    title:"pink", path:"/candy_pink.gltf", viewRange: [-200, -5, 200]
  },
}
Object.values(chairs).forEach(chair => {
  useGLTF.preload(chair.path)
  console.log(chair.path)
});


export default function App() {
  const {setWindowResized} = useStore()

  // adds an event handler to update the viewport size whenever the user resizes the viewport
  useEffect(() => {
    const handleResize = () => {
      setWindowResized(true)
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="App">
      <Header />
      <div className="three_cvr">
        <div className="three_Canvas">
          <Canvas
            camera={{position: [0, 0, 120], fov: 70}}
          >
            {/* renders the lights */}
            <LightsComp />

            {/* renders the chairs */}
            {Object.keys(chairs).map((key, index) => {
              const chair = chairs[key].path
              const title = chairs[key].title
              const viewRange = chairs[key].viewRange

              return (
                <HtmlComponent key={key} modelPath={chair} positionY={-35 - (index * 150)} offset={index} viewRange={viewRange}>
                  <Html fullscreen>
                    <div className="title">{title}</div>
                  </Html>
                </HtmlComponent>
              )
            })}
          </Canvas>
        </div>

        {/* renders the titles */}
        {Object.keys(chairs).map((key, index) => {
          return <TitleComp title={chairs[key].title} offset={index} key={key} />
        })}
      </div>
    </div>
  )
}

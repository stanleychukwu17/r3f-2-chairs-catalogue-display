const LightsComp = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight intensity={Math.PI/2} position={[10, 10, 5]} />
      <directionalLight intensity={Math.PI/2} position={[-10, 10, 0]} />
    </>
  )
}

export default LightsComp;
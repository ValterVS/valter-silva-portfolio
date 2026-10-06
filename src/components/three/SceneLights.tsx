// Luz principal quente pela frente, recorte azul por trás e um preenchimento frio bem leve.
export function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.22} />
      <hemisphereLight args={["#9fb2ff", "#0b0d12", 0.35]} />
      <directionalLight position={[-3.5, 3.2, 4]} intensity={3.2} color="#ffcf8f" />
      <directionalLight position={[3.6, 2.4, -3.5]} intensity={4} color="#4f7cff" />
      <directionalLight position={[-3, 0.5, -3]} intensity={1.4} color="#7c6cff" />
      <directionalLight position={[2.5, -1, 3]} intensity={0.45} color="#c3ccff" />
      <pointLight position={[0, 1.3, 2.2]} intensity={5} distance={5} color="#d6a640" />
    </>
  );
}

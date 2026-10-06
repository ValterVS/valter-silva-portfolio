// Luz frontal suave, recorte azul à esquerda e âmbar à direita para separar o avatar do fundo.
export function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.28} />
      <hemisphereLight args={["#aab8ff", "#0b0d12", 0.3]} />
      <directionalLight position={[0.6, 1.8, 5]} intensity={1.7} color="#ffe9d6" />
      <directionalLight position={[-4.5, 1.6, -2.2]} intensity={5.5} color="#3d7bff" />
      <directionalLight position={[4.5, 1.4, -2.2]} intensity={4.8} color="#ffa94d" />
      <directionalLight position={[0, -2.5, 2]} intensity={0.35} color="#9fb2ff" />
    </>
  );
}

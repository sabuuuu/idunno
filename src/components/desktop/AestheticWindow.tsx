export function AestheticWindow({ src }: { src: string }) {
  return (
    <div className="w-full h-full bg-vapor-dark flex items-center justify-center overflow-hidden">
      <img src={src} alt="Aesthetic" className="w-full h-full object-cover pointer-events-none opacity-80" />
    </div>
  );
}

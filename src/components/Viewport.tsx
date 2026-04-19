import { useMemo, useRef, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Sparkles, Stars, useGLTF, Html, useProgress } from "@react-three/drei";
import { Eye, LayoutGrid, RotateCw, ScanLine } from "lucide-react";
import * as THREE from "three";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import type { QualityMode } from "@/types/studio";

function GLTFLoaderFallback() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="rounded-lg bg-black/70 px-4 py-2 text-sm text-foreground/80">Loading Panda… {Math.round(progress)}%</div>
    </Html>
  );
}

function PandaModel({ scale = 1, position = [0, -1.1, 0] }: { scale?: number; position?: [number, number, number] }) {
  const localModel = "/models/antcell_ghibli_panda.glb";
  const remoteModel =
    "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Panda/glTF-Binary/Panda.glb";

  const [modelUrl, setModelUrl] = useState<string>(remoteModel);

  useEffect(() => {
    let cancelled = false;
    // Prefer a curated local GLB if present in /public/models/
    fetch(localModel, { method: "HEAD" })
      .then((res) => {
        if (!cancelled && res.ok) setModelUrl(localModel);
      })
      .catch(() => {
        /* ignore and use remote fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const gltf = useGLTF(modelUrl) as any;

  const gradientMap = useMemo(() => {
    if (typeof document === "undefined") return null;
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = 1;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createLinearGradient(0, 0, size, 0);
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.45, "#f4e7d0");
    gradient.addColorStop(0.78, "#e0c090");
    gradient.addColorStop(1, "#b08050");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, 1);
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    return texture;
  }, []);

  if (gltf?.scene) {
    gltf.scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Preserve original maps if present
        const map = child.material?.map ?? null;
        const normalMap = child.material?.normalMap ?? null;

        child.material = new THREE.MeshToonMaterial({
          color: new THREE.Color("#ffffff"),
          gradientMap: gradientMap ?? undefined,
          map: map ?? undefined,
          normalMap: normalMap ?? undefined,
          emissive: new THREE.Color("#072028"),
          metalness: 0.0,
          roughness: 0.5,
        });
      }
    });
  }

  return <primitive object={gltf.scene} scale={scale} position={position} />;
}

function CinemaAssembly({ wireframe }: { wireframe: boolean }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.35;
      coreRef.current.rotation.x = Math.sin(Date.now() * 0.0005) * 0.08;
    }
    if (haloRef.current) {
      haloRef.current.rotation.z -= delta * 0.22;
    }
  });

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#88f7ff"),
        emissive: new THREE.Color("#2bd8ff"),
        emissiveIntensity: 0.9,
        metalness: 0.68,
        roughness: 0.18,
        transmission: 0.18,
        thickness: 0.6,
        wireframe,
      }),
    [wireframe],
  );

  return (
    <group>
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 5, 4]} intensity={44} color="#80f7ff" />
      <pointLight position={[-3, 2, -4]} intensity={18} color="#ffd38a" />
      <Stars radius={60} depth={30} count={1400} factor={3} fade speed={1} />
      <Sparkles count={120} size={4} speed={0.4} color="#80f7ff" scale={[6, 4, 6]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.45, 0]}>
        <circleGeometry args={[6.5, 64]} />
        <meshStandardMaterial color="#050b12" roughness={0.82} metalness={0.1} />
      </mesh>

      <Float speed={1.8} rotationIntensity={0.25} floatIntensity={0.5}>
        <group position={[0, 0, 0]}>
          <mesh ref={coreRef} material={material}>
            <icosahedronGeometry args={[1.08, 1]} />
          </mesh>

          <mesh ref={haloRef} rotation={[1.2, 0, 0]}>
            <torusGeometry args={[1.65, 0.04, 32, 120]} />
            <meshStandardMaterial color="#ffc76f" emissive="#d4a95d" emissiveIntensity={1.1} wireframe={wireframe} />
          </mesh>

          <mesh position={[0, 0, 0]}>
            <octahedronGeometry args={[0.42, 0]} />
            <meshStandardMaterial color="#ffffff" emissive="#80f7ff" emissiveIntensity={1.3} wireframe={wireframe} />
          </mesh>

          {[[-1.8, 0.2, -0.8], [1.8, -0.1, 0.5], [0, 1.8, -1.2]].map((position, index) => (
            <mesh key={index} position={position as [number, number, number]} rotation={[0.4, 0.8, 0.2]}>
              <boxGeometry args={[0.45, 0.22, 1.1]} />
              <meshStandardMaterial color="#0f1822" emissive={index === 1 ? "#d4a95d" : "#80f7ff"} emissiveIntensity={0.65} wireframe={wireframe} />
            </mesh>
          ))}
        </group>
      </Float>
    </group>
  );
}

// Optional postprocessing composer — dynamically imported so the app still runs
// without the package installed. To enable bloom, install:
// `npm install @react-three/postprocessing postprocessing`
function OptionalComposer() {
  const [mod, setMod] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    import("@react-three/postprocessing")
      .then((m) => {
        if (mounted) setMod(m);
      })
      .catch(() => {
        // optional dependency not present — silently fall back
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (!mod) return null;

  const {
    EffectComposer,
    Bloom,
    Vignette,
    ChromaticAberration,
    Noise,
    DepthOfField,
    SMAA,
  } = mod as any;

  return (
    // @ts-expect-error dynamic import types
    <EffectComposer>
      {/* Conditional SMAA anti-aliasing when provided */}
      {SMAA ? <SMAA /> : null}

      {/* Stronger cinematic bloom (safe defaults) */}
      <Bloom kernelSize={3} luminanceThreshold={0.2} intensity={1.0} mipmapBlur />

      {/* Depth of field for cinematic feel when available */}
      {DepthOfField ? (
        // @ts-expect-error dynamic prop types
        <DepthOfField focusDistance={0.0} focalLength={0.035} bokehScale={2.4} height={480} />
      ) : null}

      {/* subtle chromatic aberration for cinematic warmth */}
      {/* @ts-expect-error dynamic prop types */}
      {ChromaticAberration ? <ChromaticAberration offset={[0.0015, 0.0012]} /> : null}

      {/* gentle film noise */}
      {/* @ts-expect-error dynamic prop types */}
      {Noise ? <Noise opacity={0.03} /> : null}

      <Vignette eskil={false} offset={0.06} darkness={0.36} />
    </EffectComposer>
  );
}

export function Viewport({
  wireframe,
  onWireframeChange,
  qualityMode,
  stylePreset,
}: {
  wireframe: boolean;
  onWireframeChange: (checked: boolean) => void;
  qualityMode: QualityMode;
  stylePreset: string;
}) {
  const [autoOrbit, setAutoOrbit] = useState(true);
  return (
    <Card className="relative min-h-0 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Realtime 3D Viewport</CardTitle>
            <p className="mt-2 text-sm text-foreground/55">
              Orbit-enabled hero stage with live lighting preview, holographic materials, and pipeline controls.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="cyan" className="gap-1">
              <Eye className="h-3.5 w-3.5" />
              Live Preview
            </Badge>
            <Badge variant="gold" className="gap-1">
              <ScanLine className="h-3.5 w-3.5" />
              {qualityMode === "fast" ? "Fast Mode" : "Selective HQ"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid min-h-0 flex-1 grid-rows-[auto,1fr] gap-4 pb-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-2xl border border-border/70 bg-white/5 px-3 py-2 text-sm text-foreground/65">
            Style DNA: <span className="text-foreground/90">{stylePreset}</span>
          </div>
          <div className="rounded-2xl border border-border/70 bg-white/5 px-3 py-2 text-sm text-foreground/65">
            Camera Rig: <span className="text-cyan-bright">Orbit / Cine Crane</span>
          </div>
          <div className="ml-auto flex items-center gap-3 rounded-2xl border border-border/70 bg-white/5 px-3 py-2">
            <LayoutGrid className="h-4 w-4 text-gold-bright" />
            <span className="text-sm text-foreground/65">Wireframe</span>
            <Switch checked={wireframe} onCheckedChange={onWireframeChange} />
          </div>
          <Button
            variant={autoOrbit ? "secondary" : "ghost"}
            onClick={() => setAutoOrbit((s) => !s)}
            className="gap-2 rounded-2xl"
          >
            <RotateCw className={`h-4 w-4 ${autoOrbit ? "animate-spin-slow" : ""}`} />
            {autoOrbit ? "Auto Orbit: On" : "Auto Orbit"}
          </Button>
        </div>

          <div className="relative min-h-0 overflow-hidden rounded-[28px] border border-border/70 bg-[#03060b]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(110,242,255,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(212,169,93,0.10),transparent_24%)]" />

          <Canvas
            camera={{ position: [4.2, 2.4, 5.4], fov: 42 }}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.06, outputEncoding: THREE.sRGBEncoding }}
          >
            <fog attach="fog" args={["#05070d", 8, 22]} />
            <CinemaAssembly wireframe={wireframe} />

            <Suspense fallback={<GLTFLoaderFallback />}>
              <PandaModel scale={1.3} position={[-1.65, -1.05, 0]} />
            </Suspense>

            <OrbitControls enablePan={false} minDistance={3.4} maxDistance={8.5} autoRotate={autoOrbit} autoRotateSpeed={0.6} />
            <OptionalComposer />
          </Canvas>

          {/* Visual overlays (scanlines, film grain, vignette, color grade) */}
          <div className="pointer-events-none absolute inset-0 scanlines opacity-25" />
          <div className="pointer-events-none absolute inset-0 film-grain opacity-30" />
          <div className="pointer-events-none absolute inset-0 color-grade" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent mix-blend-multiply" />

          <div className="pointer-events-none absolute left-4 top-4 flex gap-2">
            <Badge variant="ghost">Viewport A</Badge>
            <Badge variant="ghost">8K Preview Safe</Badge>
          </div>

          <div className="absolute bottom-4 left-4 flex items-center gap-3">
            <div className="rounded-2xl border border-border/70 bg-black/40 px-3 py-2 text-xs uppercase tracking-[0.24em] text-foreground/60 backdrop-blur-md">
              Orbit Controls Enabled
            </div>
            <div className="rounded-2xl border border-border/70 bg-black/40 px-3 py-2 text-xs uppercase tracking-[0.24em] text-cyan-bright backdrop-blur-md">
              Preview 24 FPS
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

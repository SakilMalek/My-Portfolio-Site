/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useRef, useState } from "react";
import { Color, Scene, Fog, PerspectiveCamera, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import { useThree, Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "@/data/globe.json";
import { JSX } from "react/jsx-dev-runtime";
declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: JSX.IntrinsicElements["group"]; // ✅ Fix: Use "group" instead of Object3DNode
  }
}


extend({ ThreeGlobe });

const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;
const cameraZ = 300;

type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: {
    lat: number;
    lng: number;
  };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[];
}

let numbersOfRings = [0];

export function Globe({ globeConfig, data }: WorldProps) {
  const [globeData, setGlobeData] = useState<
    | {
        size: number;
        order: number;
        color: (t: number) => string;
        lat: number;
        lng: number;
      }[]
    | null
  >(null);

  const globeRef = useRef<ThreeGlobe | null>(null);

  const defaultProps = {
    pointSize: 1,
    atmosphereColor: "#ffffff",
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: "rgba(255,255,255,0.7)",
    globeColor: "#1d072e",
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    ...globeConfig,
  };
  
  // Validate all coordinates to ensure no NaN values
  const validateCoordinates = (positions: Position[]) => {
    return positions.filter(pos => {
      // Check if any coordinate is NaN, undefined, or null
      const isValid = 
        !isNaN(pos.startLat) && 
        !isNaN(pos.startLng) && 
        !isNaN(pos.endLat) && 
        !isNaN(pos.endLng) && 
        !isNaN(pos.arcAlt) &&
        typeof pos.color === 'string'; // Ensure color is a string
      
      if (!isValid) {
        console.warn("Invalid coordinate or color detected and filtered:", pos);
      }
      return isValid;
    });
  };

  // Safely convert hex to RGB, handling non-string inputs
  const safeHexToRgb = (hex: any) => {
    // Ensure hex is a string
    if (typeof hex !== 'string') {
      console.warn("Invalid color format (not a string):", hex);
      return { r: 255, g: 255, b: 255 }; // Default to white
    }
    
    // Ensure hex starts with #
    if (!hex.startsWith('#')) {
      hex = '#' + hex;
    }
    
    const result = hexToRgb(hex);
    if (!result) {
      console.warn("Could not parse color:", hex);
      return { r: 255, g: 255, b: 255 }; // Default to white
    }
    return result;
  };

  useEffect(() => {
    if (globeRef.current) {
      // Initialize the globe with basic configuration first
      try {
        globeRef.current
          .hexPolygonsData(countries.features)
          .hexPolygonResolution(3)
          .hexPolygonMargin(0.7)
          .showAtmosphere(defaultProps.showAtmosphere)
          .atmosphereColor(defaultProps.atmosphereColor)
          .atmosphereAltitude(defaultProps.atmosphereAltitude)
          .hexPolygonColor(() => defaultProps.polygonColor);
        
        // Then build material
        _buildMaterial();
        
        // Finally process data
        _buildData();
      } catch (error) {
        console.error("Error initializing globe:", error);
      }
    }
  }, [globeRef.current]);

  const _buildMaterial = () => {
    if (!globeRef.current) return;

    try {
      const globeMaterial = globeRef.current.globeMaterial() as unknown as {
        color: Color;
        emissive: Color;
        emissiveIntensity: number;
        shininess: number;
      };
      
      globeMaterial.color = new Color(globeConfig.globeColor || defaultProps.globeColor);
      globeMaterial.emissive = new Color(globeConfig.emissive || defaultProps.emissive);
      globeMaterial.emissiveIntensity = globeConfig.emissiveIntensity || defaultProps.emissiveIntensity;
      globeMaterial.shininess = globeConfig.shininess || defaultProps.shininess;
    } catch (error) {
      console.error("Error setting globe material:", error);
    }
  };

  const _buildData = () => {
    // Validate data first
    const validatedData = validateCoordinates(data);
    
    let points = [];
    for (let i = 0; i < validatedData.length; i++) {
      try {
        const arc = validatedData[i];
        const rgb = safeHexToRgb(arc.color);
        
        points.push({
          size: defaultProps.pointSize,
          order: arc.order,
          color: (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
          lat: arc.startLat,
          lng: arc.startLng,
        });
        points.push({
          size: defaultProps.pointSize,
          order: arc.order,
          color: (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
          lat: arc.endLat,
          lng: arc.endLng,
        });
      } catch (error) {
        console.error("Error processing data point:", error);
      }
    }

    try {
      // Remove duplicates for same lat and lng
      const filteredPoints = points.filter(
        (v, i, a) =>
          a.findIndex((v2) =>
            ["lat", "lng"].every(
              (k) => v2[k as "lat" | "lng"] === v[k as "lat" | "lng"]
            )
          ) === i
      );

      setGlobeData(filteredPoints);
    } catch (error) {
      console.error("Error filtering points:", error);
    }
  };

  useEffect(() => {
    if (globeRef.current && globeData && globeData.length > 0) {
      startAnimation();
    }
  }, [globeData]);

  const startAnimation = () => {
    if (!globeRef.current || !globeData || globeData.length === 0) return;
    
    // Validate data again before animation
    const validatedData = validateCoordinates(data);

    try {
      // Set arcs data
      globeRef.current
        .arcsData(validatedData)
        .arcStartLat((d: any) => {
          const val = (d as { startLat: number }).startLat * 1;
          return isNaN(val) ? 0 : val;
        })
        .arcStartLng((d: any) => {
          const val = (d as { startLng: number }).startLng * 1;
          return isNaN(val) ? 0 : val;
        })
        .arcEndLat((d: any) => {
          const val = (d as { endLat: number }).endLat * 1;
          return isNaN(val) ? 0 : val;
        })
        .arcEndLng((d: any) => {
          const val = (d as { endLng: number }).endLng * 1;
          return isNaN(val) ? 0 : val;
        })
        .arcColor((e: any) => {
          const color = (e as { color: string }).color;
          return typeof color === 'string' ? color : '#ffffff';
        })
        .arcAltitude((e: any) => {
          const val = (e as { arcAlt: number }).arcAlt * 1;
          return isNaN(val) ? 0.1 : val;
        })
        .arcStroke(() => {
          return [0.32, 0.28, 0.3][Math.round(Math.random() * 2)];
        })
        .arcDashLength(defaultProps.arcLength)
        .arcDashInitialGap((e: any) => {
          const val = (e as { order: number }).order * 1;
          return isNaN(val) ? 0 : val;
        })
        .arcDashGap(15)
        .arcDashAnimateTime(() => defaultProps.arcTime);

      // Set points data
      globeRef.current
        .pointsData(globeData)
        .pointColor((e: any) => {
          if (typeof e === 'object' && e && typeof e.color === 'function') {
            return e.color(0); // Call the color function with time=0
          }
          return '#ffffff'; // Default color
        })
        .pointsMerge(true)
        .pointAltitude(0.0)
        .pointRadius(2);

      // Setup rings
      globeRef.current
        .ringsData([])
        .ringColor((e: any) => (t: any) => {
          if (typeof e === 'object' && e && typeof e.color === 'function') {
            return e.color(t);
          }
          return '#ffffff'; // Default color
        })
        .ringMaxRadius(defaultProps.maxRings)
        .ringPropagationSpeed(RING_PROPAGATION_SPEED)
        .ringRepeatPeriod(
          (defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings
        );
    } catch (error) {
      console.error("Error starting animation:", error);
    }
  };

  useEffect(() => {
    if (!globeRef.current || !globeData || globeData.length === 0) return;

    const interval = setInterval(() => {
      if (!globeRef.current || !globeData || globeData.length === 0) return;
      try {
        const maxCount = Math.min(Math.floor((globeData.length * 4) / 5), globeData.length);
        numbersOfRings = genRandomNumbers(0, globeData.length, maxCount > 0 ? maxCount : 1);

        globeRef.current.ringsData(
          globeData.filter((d, i) => numbersOfRings.includes(i))
        );
      } catch (error) {
        console.error("Error updating rings:", error);
      }
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [globeRef.current, globeData]);

  return (
    <>
      <threeGlobe ref={globeRef} />
    </>
  );
}

export function WebGLRendererConfig() {
  const { gl, size } = useThree();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // The code will only run in the client-side (browser)
      gl.setPixelRatio(window.devicePixelRatio);
      gl.setSize(size.width, size.height);
      gl.setClearColor(0xffaaff, 0);
    }
  }, []);
  return null;
}

export function World(props: WorldProps) {
  const { globeConfig } = props;
  const scene = new Scene();
  scene.fog = new Fog(0xffffff, 400, 2000);
  return (
    <Canvas scene={scene} camera={new PerspectiveCamera(50, aspect, 180, 1800)}>
      <WebGLRendererConfig />
      <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
      <directionalLight
        color={globeConfig.directionalLeftLight}
        position={new Vector3(-400, 100, 400)}
      />
      <directionalLight
        color={globeConfig.directionalTopLight}
        position={new Vector3(-200, 500, 200)}
      />
      <pointLight
        color={globeConfig.pointLight}
        position={new Vector3(-200, 500, 200)}
        intensity={0.8}
      />
      <Globe {...props} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotateSpeed={1}
        autoRotate={true}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}

export function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function genRandomNumbers(min: number, max: number, count: number) {
  const arr = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (arr.indexOf(r) === -1) arr.push(r);
  }

  return arr;
}
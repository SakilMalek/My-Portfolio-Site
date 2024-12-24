/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "tailwindcss/lib/util/flattenColorPalette" {
    export default function flattenColorPalette(
      pallette: Record<string, string>,
    ): Record<string, string>;
  }

  /// <reference types="react" />
import { JSX } from "@react-three/fiber";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: JSX.IntrinsicElements["ambientLight"];
      directionalLight: JSX.IntrinsicElements["directionalLight"];
      pointLight: JSX.IntrinsicElements["pointLight"];
      [key: string]: any; // Add this line for other elements or custom props
    }
  }
}

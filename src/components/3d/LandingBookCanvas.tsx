"use client";

import React, { Children } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollControls, Environment, Html } from "@react-three/drei";

export function LandingBookCanvas({ children }: { children: React.ReactNode }) {
  const pages = Children.toArray(children);

  return (
    <div className="fixed inset-0 w-full h-screen bg-background">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Environment preset="city" />

        <ScrollControls pages={pages.length} damping={0.2}>
          {pages.map((pageContent, index) => (
            <BookPage key={index} index={index}>
              {pageContent}
            </BookPage>
          ))}
        </ScrollControls>
      </Canvas>
    </div>
  );
}

function BookPage({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    // Replaced the mesh/RenderTexture with a group and Html portal
    <group position={[0, 0, -index * 0.1]}>
      {/* transform allows the HTML to respect the 3D camera zoom and perspective */}
      <Html transform distanceFactor={15} center>
        <div className="w-screen h-screen overflow-hidden bg-background">
          {children}
        </div>
      </Html>
    </group>
  );
}
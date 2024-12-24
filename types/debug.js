import * as THREE from 'three';

// Create a BoxGeometry
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Check if the geometry has the 'position' attribute
if (geometry.attributes.position) {
  const positions = geometry.attributes.position.array;
  
  // Check for NaN values in the position array
  for (let i = 0; i < positions.length; i++) {
    if (isNaN(positions[i])) {
      console.error(`NaN value found in position at index ${i}`);
    }
  }
  
  // Recompute the bounding sphere
  geometry.computeBoundingSphere();
} else {
  console.error('Geometry does not have a position attribute.');
}

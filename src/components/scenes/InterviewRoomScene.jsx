import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Plane, Text, Sphere } from '@react-three/drei';

const InterviewRoomScene = ({ onComplete, onShowUI, completed }) => {
  const fileRef = useRef();
  const hrRef = useRef();

  useFrame((state) => {
    if (hrRef.current) {
      hrRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
    if (fileRef.current) {
      fileRef.current.position.y = 1.02 + Math.sin(state.clock.elapsedTime * 2) * 0.03;
    }
  });

  const handleFileClick = () => {
    if (!completed) {
      onShowUI('interview');
    }
  };

  return (
    <group>
      {/* Floor */}
      <Plane 
        args={[20, 20]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]}
      >
        <meshStandardMaterial color="#f8fafc" />
      </Plane>

      {/* Walls */}
      <Plane args={[20, 8]} position={[0, 4, -10]}>
        <meshStandardMaterial color="#e2e8f0" />
      </Plane>
      
      <Plane args={[20, 8]} position={[-10, 4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#f1f5f9" />
      </Plane>

      {/* Interview Table */}
      <group position={[0, 0, 0]}>
        <Box args={[6, 0.15, 3]} position={[0, 1, 0]}>
          <meshStandardMaterial color="#6b7280" />
        </Box>
        
        {/* Table Legs */}
        {[[-2.8, 0.5, -1.3], [2.8, 0.5, -1.3], [-2.8, 0.5, 1.3], [2.8, 0.5, 1.3]].map((pos, i) => (
          <Box key={i} args={[0.1, 1, 0.1]} position={pos}>
            <meshStandardMaterial color="#374151" />
          </Box>
        ))}
      </group>

      {/* HR Character */}
      <group ref={hrRef} position={[0, 0, -2]}>
        {/* Head */}
        <Sphere args={[0.4]} position={[0, 2.5, 0]}>
          <meshStandardMaterial color="#fbbf24" />
        </Sphere>
        
        {/* Body */}
        <Box args={[0.8, 1.2, 0.4]} position={[0, 1.6, 0]}>
          <meshStandardMaterial color="#1f2937" />
        </Box>
        
        {/* Arms */}
        <Box args={[0.2, 0.8, 0.2]} position={[-0.5, 1.6, 0]}>
          <meshStandardMaterial color="#fbbf24" />
        </Box>
        <Box args={[0.2, 0.8, 0.2]} position={[0.5, 1.6, 0]}>
          <meshStandardMaterial color="#fbbf24" />
        </Box>

        {/* Eyes */}
        <Sphere args={[0.05]} position={[-0.15, 2.6, 0.35]}>
          <meshStandardMaterial color="#000000" />
        </Sphere>
        <Sphere args={[0.05]} position={[0.15, 2.6, 0.35]}>
          <meshStandardMaterial color="#000000" />
        </Sphere>

        {/* HR Label */}
        <Text
          position={[0, 3.2, 0]}
          fontSize={0.15}
          color="#1f2937"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          HR INTERVIEWER
        </Text>
      </group>

      {/* Interview File */}
      <group
        ref={fileRef}
        position={[1.5, 1, 0.5]}
        onClick={handleFileClick}
        onPointerOver={(e) => (document.body.style.cursor = 'pointer')}
        onPointerOut={(e) => (document.body.style.cursor = 'auto')}
      >
        <Box args={[1, 0.05, 0.7]} position={[0, 0.03, 0]}>
          <meshStandardMaterial 
            color={completed ? "#10b981" : "#ef4444"} 
            emissive={completed ? "#059669" : "#dc2626"}
            emissiveIntensity={0.2}
          />
        </Box>
        
        <Text
          position={[0, 0.06, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.1}
          color="white"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {completed ? "INTERVIEW\nCOMPLETED ✓" : "INTERVIEW FILE\nClick to Open"}
        </Text>
      </group>

      {/* Room Decorations */}
      <group position={[-7, 0, -8]}>
        <Box args={[2, 3, 0.2]} position={[0, 1.5, 0]}>
          <meshStandardMaterial color="#7c3aed" />
        </Box>
        <Text
          position={[0, 2.8, 0.11]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          INTERVIEW ROOM
        </Text>
      </group>



      {/* Professional Atmosphere */}
      {Array.from({ length: 10 }, (_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 15,
            Math.random() * 6 + 1,
            (Math.random() - 0.5) * 15
          ]}
        >
          <sphereGeometry args={[0.025]} />
          <meshStandardMaterial
            color="#7c3aed"
            emissive="#6d28d9"
            emissiveIntensity={0.4}
          />
        </mesh>
      ))}

      {/* Success key if completed */}
      {completed && (
        <group position={[-3, 2.5, 0]}>
          <mesh rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.1]} />
            <meshStandardMaterial 
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={0.3}
            />
          </mesh>
          <Text
            position={[0, 0, 0.06]}
            fontSize={0.2}
            color="#92400e"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            C
          </Text>
        </group>
      )}
    </group>
  );
};

export default InterviewRoomScene;
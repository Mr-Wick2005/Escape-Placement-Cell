import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Plane, Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const ClassroomScene = ({ onComplete, onShowUI, completed }) => {
  const teacherRef = useRef();
  const bookletRef = useRef();
  const blackboardRef = useRef();

  useFrame((state) => {
    if (teacherRef.current) {
      // Gentle swaying animation for teacher
      teacherRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
    if (bookletRef.current) {
      bookletRef.current.position.y = 1.02 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
    if (blackboardRef.current) {
      // Subtle glow animation for blackboard
      blackboardRef.current.material.emissiveIntensity = 0.1 + Math.sin(state.clock.elapsedTime) * 0.05;
    }
  });

  const handleBookletClick = (event) => {
    event.stopPropagation();
    console.log('Booklet clicked!', event);
    if (!completed) {
      onShowUI('aptitude');
    }
  };

  return (
    <group>
      {/* Floor - Classroom tile pattern */}
      <Plane 
        args={[25, 20]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]}
      >
        <meshStandardMaterial color="#f0f0f0" />
      </Plane>

      {/* Walls - Box-like classroom */}
      {/* Back wall */}
      <Plane args={[25, 10]} position={[0, 5, -10]}>
        <meshStandardMaterial color="#e8f4f8" />
      </Plane>
      
      {/* Side walls */}
      <Plane args={[20, 10]} position={[-12.5, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#f0f8ff" />
      </Plane>
      <Plane args={[20, 10]} position={[12.5, 5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <meshStandardMaterial color="#f0f8ff" />
      </Plane>

      {/* Front wall with door opening */}
      <Plane args={[10, 10]} position={[-7.5, 5, 10]}>
        <meshStandardMaterial color="#f0f8ff" />
      </Plane>
      <Plane args={[10, 10]} position={[7.5, 5, 10]}>
        <meshStandardMaterial color="#f0f8ff" />
      </Plane>

      {/* Blackboard */}
      <Box 
        ref={blackboardRef}
        args={[8, 4, 0.2]} 
        position={[0, 4, -9.8]}
      >
        <meshStandardMaterial 
          color="#1a4d3a"
          emissive="#0f2518"
          emissiveIntensity={0.1}
        />
      </Box>

      {/* Blackboard frame */}
      <Box args={[8.4, 4.4, 0.1]} position={[0, 4, -9.7]}>
        <meshStandardMaterial color="#8b4513" />
      </Box>

      {/* Blackboard text */}
      <Text
        position={[0, 4.5, -9.6]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        APTITUDE ROUND
      </Text>

      <Text
        position={[0, 3.5, -9.6]}
        fontSize={0.2}
        color="#90ee90"
        anchorX="center"
        anchorY="middle"
      >
        "Success is where preparation meets opportunity"
      </Text>

      {/* Teacher Character */}
      <group ref={teacherRef} position={[2, 0, -8]}>
        {/* Head */}
        <Sphere args={[0.5]} position={[0, 3, 0]}>
          <meshStandardMaterial color="#fdbcb4" />
        </Sphere>
        
        {/* Body */}
        <Box args={[1, 1.5, 0.5]} position={[0, 2, 0]}>
          <meshStandardMaterial color="#4169e1" />
        </Box>
        
        {/* Arms */}
        <Box args={[0.25, 1, 0.25]} position={[-0.6, 2, 0]}>
          <meshStandardMaterial color="#fdbcb4" />
        </Box>
        <Box args={[0.25, 1, 0.25]} position={[0.6, 2, 0]}>
          <meshStandardMaterial color="#fdbcb4" />
        </Box>

        {/* Legs */}
        <Box args={[0.3, 1.2, 0.3]} position={[-0.3, 0.6, 0]}>
          <meshStandardMaterial color="#2f4f4f" />
        </Box>
        <Box args={[0.3, 1.2, 0.3]} position={[0.3, 0.6, 0]}>
          <meshStandardMaterial color="#2f4f4f" />
        </Box>

        {/* Eyes */}
        <Sphere args={[0.08]} position={[-0.2, 3.1, 0.4]}>
          <meshStandardMaterial color="#000000" />
        </Sphere>
        <Sphere args={[0.08]} position={[0.2, 3.1, 0.4]}>
          <meshStandardMaterial color="#000000" />
        </Sphere>

        {/* Teacher name tag */}
        <Text
          position={[0, 1.2, 0.6]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          Prof. Smith
        </Text>
      </group>

      {/* Student Desks arranged in rows */}
      {Array.from({ length: 12 }, (_, i) => {
        const row = Math.floor(i / 4);
        const col = i % 4;
        const x = -4.5 + col * 3;
        const z = 2 + row * 2.5;
        
        return (
          <group key={i} position={[x, 0, z]}>
            {/* Desk */}
            <Box args={[2, 0.1, 1.2]} position={[0, 1, 0]}>
              <meshStandardMaterial color="#d2691e" />
            </Box>
            
            {/* Desk Legs */}
            {[[-0.9, 0.5, -0.5], [0.9, 0.5, -0.5], [-0.9, 0.5, 0.5], [0.9, 0.5, 0.5]].map((pos, j) => (
              <Box key={j} args={[0.08, 1, 0.08]} position={pos}>
                <meshStandardMaterial color="#8b4513" />
              </Box>
            ))}
            
            {/* Chair */}
            <Box args={[0.6, 0.05, 0.6]} position={[0, 0.5, 0.8]}>
              <meshStandardMaterial color="#654321" />
            </Box>
            <Box args={[0.6, 0.8, 0.05]} position={[0, 0.9, 0.5]}>
              <meshStandardMaterial color="#654321" />
            </Box>
          </group>
        );
      })}

      {/* Main Interactive Desk (Player's desk) */}
      <group position={[0, 0, 5]}>
        <Box args={[2.5, 0.15, 1.5]} position={[0, 1, 0]}>
          <meshStandardMaterial color="#8b4513" />
        </Box>
        
        {/* Desk Legs */}
        {[[-1.1, 0.5, -0.7], [1.1, 0.5, -0.7], [-1.1, 0.5, 0.7], [1.1, 0.5, 0.7]].map((pos, i) => (
          <Box key={i} args={[0.1, 1, 0.1]} position={pos}>
            <meshStandardMaterial color="#654321" />
          </Box>
        ))}

        {/* Interactive Booklet */}
        <group
          ref={bookletRef}
          position={[0, 1.08, 0]}
          onClick={handleBookletClick}
          onPointerOver={(e) => (document.body.style.cursor = 'pointer')}
          onPointerOut={(e) => (document.body.style.cursor = 'auto')}
        >
          <Box args={[1.8, 0.08, 1.2]} position={[0, 0.04, 0]}>
            <meshStandardMaterial 
              color={completed ? "#22c55e" : "#3b82f6"} 
              emissive={completed ? "#16a34a" : "#1d4ed8"}
              emissiveIntensity={0.3}
            />
          </Box>
          
          <Text
            position={[0, 0.09, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.12}
            color="white"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            {completed ? "✓ APTITUDE TEST\nCOMPLETED" : "📝 APTITUDE TEST\nClick to Start"}
          </Text>
        </group>
      </group>

      {/* Classroom atmosphere - floating particles */}
      {Array.from({ length: 15 }, (_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 20,
            Math.random() * 8 + 1,
            (Math.random() - 0.5) * 18
          ]}
        >
          <sphereGeometry args={[0.02]} />
          <meshStandardMaterial 
            color="#60a5fa" 
            emissive="#3b82f6"
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}

      {/* Ceiling lights */}
      {Array.from({ length: 6 }, (_, i) => {
        const x = -7.5 + (i % 3) * 7.5;
        const z = -5 + Math.floor(i / 3) * 10;
        
        return (
          <group key={i} position={[x, 8, z]}>
            <Box args={[2, 0.2, 1]} position={[0, 0, 0]}>
              <meshStandardMaterial 
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={0.8}
              />
            </Box>
          </group>
        );
      })}

      {/* Success key if completed */}
      {completed && (
        <group position={[3, 2.5, 5]}>
          <mesh>
            <cylinderGeometry args={[0.4, 0.4, 0.15]} />
            <meshStandardMaterial 
              color="#ffd700"
              emissive="#ffaa00"
              emissiveIntensity={0.5}
            />
          </mesh>
          <Text
            position={[0, 0, 0.08]}
            fontSize={0.25}
            color="#8b4513"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            A
          </Text>
          
          {/* Sparkle effects */}
          {Array.from({ length: 8 }, (_, i) => (
            <mesh
              key={i}
              position={[
                Math.sin((i * Math.PI) / 4) * 0.8,
                Math.sin(i) * 0.3,
                Math.cos((i * Math.PI) / 4) * 0.8
              ]}
            >
              <sphereGeometry args={[0.03]} />
              <meshStandardMaterial 
                color="#ffff00"
                emissive="#ffff00"
                emissiveIntensity={1}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};

export default ClassroomScene;
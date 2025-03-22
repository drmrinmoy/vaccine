'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  Square, 
  Circle, 
  XCircle, 
  Edit2, 
  User,
  Users,
  Eye,
  X
} from 'lucide-react';
import { BottomNav } from '@/components/bottom-nav';

// Types for pedigree
type Gender = 'male' | 'female' | 'unknown';
type HealthStatus = 'healthy' | 'affected' | 'carrier' | 'deceased';
type RelativeType = 
  | 'proband' 
  | 'father' 
  | 'mother' 
  | 'brother' 
  | 'sister' 
  | 'son' 
  | 'daughter' 
  | 'paternal_grandfather'
  | 'paternal_grandmother'
  | 'maternal_grandfather'
  | 'maternal_grandmother'
  | 'paternal_uncle'
  | 'paternal_aunt'
  | 'maternal_uncle'
  | 'maternal_aunt'
  | 'cousin'
  | 'spouse'
  | 'unknown';

interface PedigreeNode {
  id: string;
  name: string;
  gender: Gender;
  healthStatus: HealthStatus;
  relativeType: RelativeType;
  generation: number;
  position: number;
  parents?: string[]; // IDs of parents
  children?: string[]; // IDs of children
  partners?: string[]; // IDs of partners
  x: number;
  y: number;
  isSiblingGroup?: boolean; // Flag for sibling groups
  siblingCount?: number; // Number of siblings in the group
  groupedSiblings?: string[]; // IDs of siblings in the group
}

const PedigreePage = () => {
  const [nodes, setNodes] = useState<PedigreeNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [relationMode, setRelationMode] = useState<'none' | 'sibling' | 'child'>('none');
  const [relationStart, setRelationStart] = useState<string | null>(null);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const pedigreeCanvasRef = useRef<HTMLDivElement>(null);
  
  // Constants for layout
  const nodeWidth = 60;
  const nodeHeight = 60;
  const generationHeight = 120;
  const horizontalSpacing = 140; // Increased horizontal spacing to prevent overlaps

  // Initialize default family structure on load
  useEffect(() => {
    if (nodes.length === 0) {
      createDefaultFamily();
    }
  }, []);

  // Create default family structure centered around the proband
  const createDefaultFamily = () => {
    const proband: PedigreeNode = {
      id: 'proband',
      name: 'Proband',
      gender: 'unknown',
      healthStatus: 'affected',
      relativeType: 'proband',
      generation: 1,
      position: 0,
      parents: ['father', 'mother'],
      x: 375, // Center position
      y: 220
    };
    
    const father: PedigreeNode = {
      id: 'father',
      name: 'Father',
      gender: 'male',
      healthStatus: 'healthy',
      relativeType: 'father',
      generation: 0,
      position: 0,
      children: ['proband'],
      partners: ['mother'],
      x: 300, // Position more centered
      y: 100
    };
    
    const mother: PedigreeNode = {
      id: 'mother',
      name: 'Mother',
      gender: 'female',
      healthStatus: 'healthy',
      relativeType: 'mother',
      generation: 0,
      position: 1,
      children: ['proband'],
      partners: ['father'],
      x: 450, // Position more centered and away from father
      y: 100
    };
    
    setNodes([father, mother, proband]);
    setSelectedNode('proband');
  };

  // Handle selecting a node
  const handleSelectNode = (nodeId: string) => {
    if (isDrawing && relationStart && nodeId !== relationStart) {
      // Handle relationship drawing here
      completeRelationship(nodeId);
    } else {
      setSelectedNode(nodeId);
    }
  };
  
  // Change node gender
  const toggleNodeGender = (nodeId: string) => {
    setNodes(prevNodes => 
      prevNodes.map(node => {
        if (node.id === nodeId) {
          // Cycle through genders: male -> female -> unknown -> male
          let newGender: Gender = 'male';
          if (node.gender === 'male') newGender = 'female';
          else if (node.gender === 'female') newGender = 'unknown';
          
          // Update the relationship type based on the new gender
          let newRelativeType = node.relativeType;
          
          // Adjust relationship type based on gender
          if (newGender === 'male') {
            if (node.relativeType === 'sister') newRelativeType = 'brother';
            else if (node.relativeType === 'daughter') newRelativeType = 'son';
            else if (node.relativeType === 'mother') newRelativeType = 'father';
            else if (node.relativeType === 'maternal_aunt') newRelativeType = 'maternal_uncle';
            else if (node.relativeType === 'paternal_aunt') newRelativeType = 'paternal_uncle';
            else if (node.relativeType === 'maternal_grandmother') newRelativeType = 'maternal_grandfather';
            else if (node.relativeType === 'paternal_grandmother') newRelativeType = 'paternal_grandfather';
          } else if (newGender === 'female') {
            if (node.relativeType === 'brother') newRelativeType = 'sister';
            else if (node.relativeType === 'son') newRelativeType = 'daughter';
            else if (node.relativeType === 'father') newRelativeType = 'mother';
            else if (node.relativeType === 'maternal_uncle') newRelativeType = 'maternal_aunt';
            else if (node.relativeType === 'paternal_uncle') newRelativeType = 'paternal_aunt';
            else if (node.relativeType === 'maternal_grandfather') newRelativeType = 'maternal_grandmother';
            else if (node.relativeType === 'paternal_grandfather') newRelativeType = 'paternal_grandmother';
          }
          
          // Update the name to match the relationship type
          const newName = newRelativeType.charAt(0).toUpperCase() + newRelativeType.slice(1).replace('_', ' ');
          
          return { 
            ...node, 
            gender: newGender,
            relativeType: newRelativeType,
            name: newName
          };
        }
        return node;
      })
    );
  };
  
  // Change node health status
  const toggleNodeHealthStatus = (nodeId: string) => {
    setNodes(prevNodes => 
      prevNodes.map(node => {
        if (node.id === nodeId) {
          // Cycle through health statuses
          let newStatus: HealthStatus = 'healthy';
          if (node.healthStatus === 'healthy') newStatus = 'affected';
          else if (node.healthStatus === 'affected') newStatus = 'carrier';
          else if (node.healthStatus === 'carrier') newStatus = 'deceased';
          
          return { ...node, healthStatus: newStatus };
        }
        return node;
      })
    );
  };

  // Add a relative to the selected node
  const addRelative = (relativeType: 'sibling' | 'child') => {
    if (!selectedNode) return;
    
    setRelationMode(relativeType);
    setRelationStart(selectedNode);
    setIsDrawing(true);
  };
  
  // Complete relationship after dragging/selecting
  const completeRelationship = (targetNodeId: string) => {
    const startNode = nodes.find(n => n.id === relationStart);
    if (!startNode) return;
    
    if (relationMode === 'sibling') {
      // Add a sibling - needs to have same parents as the start node
      // Determine proper relationship type based on node relationship to proband
      let relationType: RelativeType = 'brother'; // Default
      
      if (startNode.id === 'proband') {
        relationType = 'brother';
      } else if (startNode.relativeType === 'father') {
        relationType = 'paternal_uncle';
      } else if (startNode.relativeType === 'mother') {
        relationType = 'maternal_uncle';
      }
      
      const sibling: PedigreeNode = {
        id: `sibling-${Date.now()}`,
        name: relationType.charAt(0).toUpperCase() + relationType.slice(1).replace('_', ' '),
        gender: 'unknown',
        healthStatus: 'healthy',
        relativeType: relationType,
        generation: startNode.generation,
        position: startNode.position + 1,
        parents: [...(startNode.parents || [])],
        x: startNode.x + 100,
        y: startNode.y
      };
      
      // Update parents to include this child
      const updatedNodes = nodes.map(node => {
        if (sibling.parents?.includes(node.id)) {
          return {
            ...node,
            children: [...(node.children || []), sibling.id]
          };
        }
        return node;
      });
      
      setNodes([...updatedNodes, sibling]);
      handleAutoLayout(); // Auto organize after adding
      
    } else if (relationMode === 'child') {
      // Determine proper relationship type based on node relationship to proband
      let relationType: RelativeType = 'son'; // Default
      
      if (startNode.id === 'proband') {
        relationType = 'son';
      } else if (startNode.relativeType === 'brother' || startNode.relativeType === 'sister') {
        relationType = 'cousin';
      }
      
      // Add a child - if partner exists, use both as parents
      const child: PedigreeNode = {
        id: `child-${Date.now()}`,
        name: relationType.charAt(0).toUpperCase() + relationType.slice(1).replace('_', ' '),
        gender: 'unknown',
        healthStatus: 'healthy',
        relativeType: relationType,
        generation: startNode.generation + 1,
        position: 0,
        parents: [startNode.id],
        x: startNode.x,
        y: startNode.y + 120
      };
      
      // If the start node has a partner, add them as a parent too
      if (startNode.partners && startNode.partners.length > 0) {
        // Fix for linter error - ensure parents exists before spreading
        child.parents = child.parents ? [...child.parents, startNode.partners[0]] : [startNode.id, startNode.partners[0]];
      }
      
      const updatedNodes = nodes.map(node => {
        if (child.parents?.includes(node.id)) {
          return {
            ...node,
            children: [...(node.children || []), child.id]
          };
        }
        return node;
      });
      
      setNodes([...updatedNodes, child]);
      handleAutoLayout(); // Auto organize after adding
    }
    
    // Reset drawing state
    setIsDrawing(false);
    setRelationMode('none');
    setRelationStart(null);
  };

  // Cancel current drawing action
  const handleCancelDrawing = () => {
    setIsDrawing(false);
    setRelationMode('none');
    setRelationStart(null);
  };

  // Add a direct child to a node
  const addDirectChild = (nodeId: string) => {
    console.log("Adding direct child to node:", nodeId);
    const parentNode = nodes.find(n => n.id === nodeId);
    if (!parentNode) {
      console.error("Parent node not found!");
      return;
    }
    
    // Determine proper relationship type based on gender and relation to proband
    let relationType: RelativeType = 'unknown';
    const probandNode = nodes.find(n => n.id === 'proband');
    
    if (nodeId === 'proband') {
      // Child of proband
      relationType = 'son'; // Default, will change based on gender later
    } else if (parentNode.relativeType === 'father' || parentNode.relativeType === 'mother') {
      // Sibling of proband
      relationType = 'brother'; // Default, will change based on gender later
    } else {
      // Some other relation
      relationType = 'unknown';
    }
    
    // Create a new child
    const childId = `child-${Date.now()}`;
    const child: PedigreeNode = {
      id: childId,
      name: relationType.charAt(0).toUpperCase() + relationType.slice(1).replace('_', ' '),
      gender: 'unknown',
      healthStatus: 'healthy',
      relativeType: relationType,
      generation: parentNode.generation + 1,
      position: 0,
      parents: [parentNode.id],
      x: parentNode.x,
      y: parentNode.y + generationHeight
    };
    
    let updatedNodes = [...nodes];
    
    // If the parent has a partner, add them as a parent too
    if (parentNode.partners && parentNode.partners.length > 0) {
      const partnerId = parentNode.partners[0];
      child.parents = [...(child.parents || []), partnerId];
      
      // Update all nodes in one go
      updatedNodes = nodes.map(node => {
        if (node.id === partnerId) {
          // Update partner node
          return {
            ...node,
            children: [...(node.children || []), childId]
          };
        } else if (node.id === nodeId) {
          // Update parent node
          return {
            ...node,
            children: [...(node.children || []), childId]
          };
        }
        return node;
      });
    } else {
      // Update just the parent node
      updatedNodes = nodes.map(node => {
        if (node.id === nodeId) {
          return {
            ...node,
            children: [...(node.children || []), childId]
          };
        }
        return node;
      });
    }
    
    // Add the new child
    updatedNodes.push(child);
    
    // Update state once with all changes
    console.log("All updated nodes:", updatedNodes.length);
    setNodes(updatedNodes);
    setSelectedNode(childId);
    
    // Position child intelligently
    const positionChildManually = () => {
      setNodes(prevNodes => {
        // Find the newly added child
        const newChild = prevNodes.find(n => n.id === childId);
        if (!newChild) return prevNodes;
        
        // Find parents
        const parents = prevNodes.filter(n => newChild.parents?.includes(n.id));
        
        // Calculate average x position of parents
        let xPos = newChild.x;
        if (parents.length > 0) {
          xPos = parents.reduce((sum, p) => sum + p.x, 0) / parents.length;
        }
        
        // Find siblings - other children with same parents
        const siblings = prevNodes.filter(n => 
          n.id !== childId && 
          n.parents && 
          newChild.parents && 
          JSON.stringify(n.parents.sort()) === JSON.stringify(newChild.parents.sort()) &&
          n.generation === newChild.generation
        );
        
        // If we have siblings, position the new child next to them with proper spacing
        if (siblings.length > 0) {
          // Find the rightmost sibling
          const rightmostSibling = siblings.reduce(
            (rightmost, current) => current.x > rightmost.x ? current : rightmost,
            siblings[0]
          );
          
          // Position child to the right of siblings with proper spacing
          xPos = rightmostSibling.x + horizontalSpacing;
        }
        
        // Update child position
        return prevNodes.map(node => {
          if (node.id === childId) {
            return {
              ...node,
              x: xPos,
              y: parents[0]?.y + generationHeight
            };
          }
          return node;
        });
      });
    };
    
    // Position manually after a short delay
    setTimeout(positionChildManually, 100);
  };
  
  // Add a direct parent to a node
  const addDirectParent = (nodeId: string, gender: Gender) => {
    console.log("Adding direct parent with gender:", gender, "to node:", nodeId);
    const childNode = nodes.find(n => n.id === nodeId);
    if (!childNode) {
      console.error("Child node not found!");
      return;
    }
    
    // Determine proper relationship type based on gender and relation to proband
    let relationType: RelativeType;
    
    if (nodeId === 'proband') {
      // Direct parent of proband
      relationType = gender === 'male' ? 'father' : 'mother';
    } else if (childNode.relativeType === 'father') {
      // Parent of proband's father
      relationType = gender === 'male' ? 'paternal_grandfather' : 'paternal_grandmother';
    } else if (childNode.relativeType === 'mother') {
      // Parent of proband's mother
      relationType = gender === 'male' ? 'maternal_grandfather' : 'maternal_grandmother';
    } else {
      // Default parent type
      relationType = gender === 'male' ? 'father' : 'mother';
    }
    
    // Generate a unique ID
    const parentId = `parent-${gender}-${Date.now()}`;
    
    // Create a new parent
    const parent: PedigreeNode = {
      id: parentId,
      name: relationType.charAt(0).toUpperCase() + relationType.slice(1).replace('_', ' '),
      gender: gender,
      healthStatus: 'healthy',
      relativeType: relationType,
      generation: childNode.generation - 1,
      position: 0,
      children: [nodeId],
      x: childNode.x + (gender === 'male' ? -horizontalSpacing : horizontalSpacing),
      y: childNode.y - generationHeight
    };
    
    // Create a copy of nodes to work with
    let updatedNodes = [...nodes];
    
    // Find any existing opposite gender parent
    let oppositeGenderParentId: string | undefined;
    if (childNode.parents && childNode.parents.length > 0) {
      const existingParents = nodes.filter(n => childNode.parents?.includes(n.id));
      const oppositeGenderParent = existingParents.find(p => 
        (gender === 'male' && p.gender === 'female') || 
        (gender === 'female' && p.gender === 'male')
      );
      
      if (oppositeGenderParent) {
        oppositeGenderParentId = oppositeGenderParent.id;
      }
    }
    
    // Update all nodes in one go
    updatedNodes = updatedNodes.map(node => {
      // Update child to add this parent
      if (node.id === nodeId) {
        const updatedParents = node.parents ? [...node.parents, parentId] : [parentId];
        return {
          ...node,
          parents: updatedParents
        };
      }
      
      // If there's an opposite gender parent, update them to be a partner
      if (oppositeGenderParentId && node.id === oppositeGenderParentId) {
        return {
          ...node,
          partners: node.partners ? [...node.partners, parentId] : [parentId]
        };
      }
      
      return node;
    });
    
    // Add partner to the new parent if opposite gender parent exists
    let newParent = {...parent};
    if (oppositeGenderParentId) {
      newParent.partners = [oppositeGenderParentId];
    }
    
    // Add the new parent to nodes
    updatedNodes.push(newParent);
    
    // Update state with all changes at once
    console.log("Adding new parent:", newParent);
    setNodes(updatedNodes);
    setSelectedNode(parentId);
    
    // Position parent in relation to child and opposite gender parent
    const positionParentManually = () => {
      setNodes(prevNodes => {
        // Find the opposite gender parent if it exists
        const oppositeParent = oppositeGenderParentId 
          ? prevNodes.find(n => n.id === oppositeGenderParentId)
          : undefined;
        
        // Find other nodes in the same generation
        const sameGeneration = prevNodes.filter(n => 
          n.id !== parentId && n.generation === parent.generation
        );
        
        // Calculate parent position
        let newX = parent.x;
        
        if (oppositeParent) {
          // If opposite gender parent exists, position correctly with proper spacing
          newX = oppositeParent.x + (gender === 'male' ? -horizontalSpacing : horizontalSpacing);
        } else {
          // If no opposite parent, check for other nodes to avoid overlap
          if (sameGeneration.length > 0) {
            // If male, find closest node to the right of proposed position
            // If female, find closest node to the left of proposed position
            if (gender === 'male') {
              const nodesOnRight = sameGeneration.filter(n => n.x > childNode.x);
              const closestRight = nodesOnRight.length > 0 
                ? nodesOnRight.reduce((closest, current) => 
                    current.x < closest.x ? current : closest, nodesOnRight[0]) 
                : null;
                
              if (closestRight && (childNode.x - horizontalSpacing) > (closestRight.x + horizontalSpacing)) {
                // If enough space, position between child and node on right
                newX = (childNode.x + closestRight.x) / 2;
              } else {
                // Otherwise position far enough to the left
                newX = childNode.x - horizontalSpacing;
              }
            } else {
              const nodesOnLeft = sameGeneration.filter(n => n.x < childNode.x);
              const closestLeft = nodesOnLeft.length > 0 
                ? nodesOnLeft.reduce((closest, current) => 
                    current.x > closest.x ? current : closest, nodesOnLeft[0]) 
                : null;
                
              if (closestLeft && (childNode.x + horizontalSpacing) < (closestLeft.x - horizontalSpacing)) {
                // If enough space, position between child and node on left
                newX = (childNode.x + closestLeft.x) / 2;
              } else {
                // Otherwise position far enough to the right
                newX = childNode.x + horizontalSpacing;
              }
            }
          }
        }
        
        return prevNodes.map(node => {
          if (node.id === parentId) {
            return {
              ...node,
              x: newX,
              y: childNode.y - generationHeight
            };
          }
          return node;
        });
      });
    };
    
    // Position manually after a short delay
    setTimeout(positionParentManually, 100);
  };

  // Add a direct sibling to a node
  const addDirectSibling = (nodeId: string) => {
    console.log("Adding direct sibling to node:", nodeId);
    const siblingNode = nodes.find(n => n.id === nodeId);
    if (!siblingNode) {
      console.error("Sibling node not found!");
      return;
    }
    
    // Determine proper relationship type based on gender and relation to proband
    let relationType: RelativeType = 'brother'; // Default, will be updated based on gender
    
    if (nodeId === 'proband') {
      // Direct sibling of proband
      relationType = 'brother'; // Default to brother, will be updated when gender is set
    } else if (siblingNode.relativeType === 'father') {
      // Sibling of father (uncle/aunt)
      relationType = 'paternal_uncle';
    } else if (siblingNode.relativeType === 'mother') {
      // Sibling of mother (uncle/aunt)
      relationType = 'maternal_uncle';
    } else if (siblingNode.relativeType === 'son' || siblingNode.relativeType === 'daughter') {
      // Sibling of proband's child
      relationType = 'son'; // Default to son, will be updated when gender is set
    }
    
    // Create a new sibling ID
    const siblingId = `sibling-${Date.now()}`;
    
    // Create a new sibling
    const sibling: PedigreeNode = {
      id: siblingId,
      name: relationType.charAt(0).toUpperCase() + relationType.slice(1).replace('_', ' '),
      gender: 'unknown',
      healthStatus: 'healthy',
      relativeType: relationType,
      generation: siblingNode.generation,
      position: siblingNode.position + 1,
      parents: siblingNode.parents ? [...siblingNode.parents] : [],
      x: siblingNode.x + horizontalSpacing, // Use horizontalSpacing for consistent layout
      y: siblingNode.y
    };
    
    // Create a copy of nodes to work with
    let updatedNodes = [...nodes];
    
    // Update the parents to include this child
    updatedNodes = updatedNodes.map(node => {
      if (sibling.parents && sibling.parents.length > 0 && sibling.parents.includes(node.id)) {
        return {
          ...node,
          children: [...(node.children || []), siblingId]
        };
      }
      return node;
    });
    
    // Add the new sibling to nodes
    updatedNodes.push(sibling);
    
    // Update state once with all changes
    console.log("Adding new sibling:", sibling);
    setNodes(updatedNodes);
    setSelectedNode(siblingId);
    
    // Position sibling in relation to existing siblings with improved spacing
    const positionSiblingManually = () => {
      setNodes(prevNodes => {
        // Find all siblings (nodes with same parents)
        const parentIds = sibling.parents || [];
        const siblings = prevNodes.filter(n => 
          n.id !== siblingId && 
          n.parents && 
          n.generation === sibling.generation &&
          JSON.stringify(n.parents.sort()) === JSON.stringify(parentIds.sort())
        );
        
        // Sort siblings by position (left to right)
        siblings.sort((a, b) => a.x - b.x);
        
        // Position to the right of siblings with proper spacing
        let newX = siblingNode.x + horizontalSpacing;
        
        // If we have multiple siblings, make sure to space properly
        if (siblings.length > 0) {
          // Find the rightmost sibling
          const rightmostSibling = siblings.reduce(
            (rightmost, current) => current.x > rightmost.x ? current : rightmost, 
            siblings[0]
          );
          
          newX = rightmostSibling.x + horizontalSpacing;
        }
        
        // Additional check to avoid overlap with other nodes in the same generation
        const nodesInSameGen = prevNodes.filter(n => 
          n.id !== siblingId && 
          n.generation === sibling.generation
        );
        
        // Find any nodes that would be too close to our proposed position
        const tooCloseNodes = nodesInSameGen.filter(n => 
          Math.abs(n.x - newX) < horizontalSpacing * 0.8
        );
        
        if (tooCloseNodes.length > 0) {
          // If there are nodes too close, position further to the right
          const rightmostTooClose = tooCloseNodes.reduce(
            (rightmost, current) => current.x > rightmost.x ? current : rightmost,
            tooCloseNodes[0]
          );
          
          newX = rightmostTooClose.x + horizontalSpacing;
        }
        
        return prevNodes.map(node => {
          if (node.id === siblingId) {
            return {
              ...node,
              x: newX,
              y: siblingNode.y
            };
          }
          return node;
        });
      });
    };
    
    // Position manually after a short delay
    setTimeout(positionSiblingManually, 100);
  };

  // Render a pedigree node
  const renderNode = (node: PedigreeNode) => {
    const isSelected = node.id === selectedNode;
    
    // Determine node style based on gender and health status
    let nodeSymbol;
    let fillColor = 'bg-gray-800';
    let borderColor = 'border-gray-600';
    
    // Apply scientific pedigree coloring standards
    if (node.healthStatus === 'affected') {
      fillColor = 'bg-red-900';
      borderColor = 'border-red-700';
    } else if (node.healthStatus === 'carrier') {
      // Carriers are typically half-filled in scientific pedigrees
      fillColor = 'bg-gradient-to-r from-yellow-800 to-gray-800';
      borderColor = 'border-yellow-600';
    } else if (node.healthStatus === 'deceased') {
      fillColor = 'bg-gray-700';
      borderColor = 'border-gray-500';
    }
    
    if (isSelected) {
      borderColor = 'border-green-500';
    }
    
    // Highlight proband with a special border
    if (node.relativeType === 'proband' || node.id === 'proband') {
      borderColor = 'border-blue-500';
    }
    
    // Check if this node needs parent buttons
    const showAddParents = !node.parents || node.parents.length < 2;
    const currentParents = node.parents ? nodes.filter(n => n.id && node.parents && node.parents.includes(n.id)) : [];
    const hasFather = currentParents.some(p => p.gender === 'male');
    const hasMother = currentParents.some(p => p.gender === 'female');
    
    // Common handler for adding buttons
    const handleButtonClick = (e: React.MouseEvent, action: Function) => {
      e.stopPropagation(); // Stop event from reaching the node click handler
      e.preventDefault();
      action();
    };
    
    // Special rendering for sibling groups
    if (node.isSiblingGroup) {
      // Render a special diamond with a number for sibling groups
      return (
        <div 
          key={node.id} 
          className="absolute flex flex-col items-center transition-all duration-300 ease-in-out"
          style={{ 
            left: `${node.x}px`, 
            top: `${node.y}px`,
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          <div 
            className={`w-16 h-16 rotate-45 ${fillColor} border-2 ${borderColor} flex items-center justify-center transition-colors duration-300 relative cursor-pointer hover:shadow-lg hover:scale-105`}
            onClick={() => expandSiblingGroup(node.id)}
          >
            <div className="-rotate-45 font-bold text-xl">{node.siblingCount}</div>
          </div>
          <div className="mt-1 text-xs text-center">
            <span className="whitespace-nowrap">{node.siblingCount} Siblings</span>
            <div className="mt-1 text-xs opacity-70">(Click to expand)</div>
          </div>
        </div>
      );
    }
    
    // Apply standard pedigree chart symbols with transitions
    if (node.gender === 'male') {
      nodeSymbol = (
        <div 
          className={`w-12 h-12 ${fillColor} border-2 ${borderColor} flex items-center justify-center transition-all duration-300 ease-in-out relative hover:shadow-lg ${isSelected ? 'scale-110' : 'hover:scale-105'}`}
          style={{ cursor: isDrawing ? 'crosshair' : 'pointer' }}
          onClick={() => handleSelectNode(node.id)}
        >
          {/* Deceased marker (diagonal line through symbol) */}
          {node.healthStatus === 'deceased' && <div className="absolute w-16 h-0.5 bg-gray-400 rotate-45"></div>}
          
          {/* Add Child Button */}
          {isSelected && (
            <button 
              onClick={(e) => handleButtonClick(e, () => addDirectChild(node.id))}
              className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center shadow-lg z-10 border border-purple-400"
              title="Add child"
            >
              <Plus className="w-3 h-3 text-white" />
            </button>
          )}
          
          {/* Add Sibling Button */}
          {isSelected && node.parents && node.parents.length > 0 && (
            <button 
              onClick={(e) => handleButtonClick(e, () => addDirectSibling(node.id))}
              className="absolute -right-5 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center shadow-lg z-10 border border-green-400"
              title="Add sibling"
            >
              <Plus className="w-3 h-3 text-white" />
            </button>
          )}
          
          {/* Add Father Button */}
          {isSelected && showAddParents && !hasFather && (
            <button 
              onClick={(e) => handleButtonClick(e, () => addDirectParent(node.id, 'male'))}
              className="absolute -top-5 -left-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shadow-lg z-10 border border-blue-400"
              title="Add father"
            >
              <Plus className="w-3 h-3 text-white" />
            </button>
          )}
          
          {/* Add Mother Button */}
          {isSelected && showAddParents && !hasMother && (
            <button 
              onClick={(e) => handleButtonClick(e, () => addDirectParent(node.id, 'female'))}
              className="absolute -top-5 -right-3 w-5 h-5 bg-pink-600 rounded-full flex items-center justify-center shadow-lg z-10 border border-pink-400"
              title="Add mother"
            >
              <Plus className="w-3 h-3 text-white" />
            </button>
          )}
          
          {/* Proband indicator (arrow) */}
          {(node.relativeType === 'proband' || node.id === 'proband') && (
            <div className="absolute -left-5 top-0 w-5 h-5 flex items-center justify-center">
              <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-blue-500"></div>
            </div>
          )}
        </div>
      );
    } else if (node.gender === 'female') {
      nodeSymbol = (
        <div 
          className={`w-12 h-12 rounded-full ${fillColor} border-2 ${borderColor} flex items-center justify-center transition-all duration-300 ease-in-out relative hover:shadow-lg ${isSelected ? 'scale-110' : 'hover:scale-105'}`}
          style={{ cursor: isDrawing ? 'crosshair' : 'pointer' }}
          onClick={() => handleSelectNode(node.id)}
        >
          {node.healthStatus === 'deceased' && <div className="absolute w-16 h-0.5 bg-gray-400 rotate-45"></div>}
          
          {/* Add Child Button */}
          {isSelected && (
            <button 
              onClick={(e) => handleButtonClick(e, () => addDirectChild(node.id))}
              className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center shadow-lg z-10 border border-purple-400"
              title="Add child"
            >
              <Plus className="w-3 h-3 text-white" />
            </button>
          )}
          
          {/* Add Sibling Button */}
          {isSelected && node.parents && node.parents.length > 0 && (
            <button 
              onClick={(e) => handleButtonClick(e, () => addDirectSibling(node.id))}
              className="absolute -right-5 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center shadow-lg z-10 border border-green-400"
              title="Add sibling"
            >
              <Plus className="w-3 h-3 text-white" />
            </button>
          )}
          
          {/* Add Father Button */}
          {isSelected && showAddParents && !hasFather && (
            <button 
              onClick={(e) => handleButtonClick(e, () => addDirectParent(node.id, 'male'))}
              className="absolute -top-5 -left-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shadow-lg z-10 border border-blue-400"
              title="Add father"
            >
              <Plus className="w-3 h-3 text-white" />
            </button>
          )}
          
          {/* Add Mother Button */}
          {isSelected && showAddParents && !hasMother && (
            <button 
              onClick={(e) => handleButtonClick(e, () => addDirectParent(node.id, 'female'))}
              className="absolute -top-5 -right-3 w-5 h-5 bg-pink-600 rounded-full flex items-center justify-center shadow-lg z-10 border border-pink-400"
              title="Add mother"
            >
              <Plus className="w-3 h-3 text-white" />
            </button>
          )}
          
          {/* Proband indicator (arrow) */}
          {(node.relativeType === 'proband' || node.id === 'proband') && (
            <div className="absolute -left-5 top-0 w-5 h-5 flex items-center justify-center">
              <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-blue-500"></div>
            </div>
          )}
        </div>
      );
    } else {
      // Unknown gender is represented as a diamond in scientific pedigrees
      nodeSymbol = (
        <div 
          className={`w-12 h-12 rotate-45 ${fillColor} border-2 ${borderColor} flex items-center justify-center transition-all duration-300 ease-in-out relative hover:shadow-lg ${isSelected ? 'scale-110' : 'hover:scale-105'}`}
          style={{ cursor: isDrawing ? 'crosshair' : 'pointer' }}
          onClick={() => handleSelectNode(node.id)}
        >
          {node.healthStatus === 'deceased' && <div className="absolute w-16 h-0.5 bg-gray-400 rotate-45 -rotate-45"></div>}
          
          {/* Add Child Button */}
          {isSelected && (
            <button 
              onClick={(e) => handleButtonClick(e, () => addDirectChild(node.id))}
              className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 rotate-[-45deg] w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center shadow-lg z-10 border border-purple-400"
              title="Add child"
            >
              <Plus className="w-3 h-3 text-white" />
            </button>
          )}
          
          {/* Add Sibling Button */}
          {isSelected && node.parents && node.parents.length > 0 && (
            <button 
              onClick={(e) => handleButtonClick(e, () => addDirectSibling(node.id))}
              className="absolute -right-7 top-1/2 transform -translate-y-1/2 rotate-[-45deg] w-5 h-5 bg-green-600 rounded-full flex items-center justify-center shadow-lg z-10 border border-green-400"
              title="Add sibling"
            >
              <Plus className="w-3 h-3 text-white" />
            </button>
          )}
          
          {/* Add Father Button */}
          {isSelected && showAddParents && !hasFather && (
            <button 
              onClick={(e) => handleButtonClick(e, () => addDirectParent(node.id, 'male'))}
              className="absolute -top-7 -left-3 rotate-[-45deg] w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shadow-lg z-10 border border-blue-400"
              title="Add father"
            >
              <Plus className="w-3 h-3 text-white" />
            </button>
          )}
          
          {/* Add Mother Button */}
          {isSelected && showAddParents && !hasMother && (
            <button 
              onClick={(e) => handleButtonClick(e, () => addDirectParent(node.id, 'female'))}
              className="absolute -top-7 -right-3 rotate-[-45deg] w-5 h-5 bg-pink-600 rounded-full flex items-center justify-center shadow-lg z-10 border border-pink-400"
              title="Add mother"
            >
              <Plus className="w-3 h-3 text-white" />
            </button>
          )}
          
          {/* Proband indicator (arrow) */}
          {(node.relativeType === 'proband' || node.id === 'proband') && (
            <div className="absolute -left-7 top-0 rotate-[-45deg] w-5 h-5 flex items-center justify-center">
              <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-blue-500"></div>
            </div>
          )}
        </div>
      );
    }
    
    // Format relationship name for display
    const getRelationshipLabel = () => {
      if (node.relativeType === 'proband') return 'Proband';
      return node.relativeType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };
    
    // Return node with transitions
    return (
      <div 
        key={node.id} 
        className="absolute flex flex-col items-center transition-all duration-300 ease-in-out"
        style={{ 
          left: `${node.x}px`, 
          top: `${node.y}px`,
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
        {nodeSymbol}
        <div className="mt-1 text-xs text-center max-w-[80px] whitespace-nowrap overflow-hidden text-ellipsis">
          {getRelationshipLabel()}
          
          {/* Quick-edit buttons for selected node with animation */}
          {isSelected && (
            <div className="flex mt-2 gap-1 bg-gray-900 p-1 rounded-full shadow-md animate-fadeIn">
              <button 
                onClick={(e) => toggleNodeGender(node.id)}
                className="p-1 bg-blue-900 rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-800 transition-colors" 
                title="Change gender"
              >
                {node.gender === 'male' ? 
                  <Square className="w-3 h-3" /> : 
                  node.gender === 'female' ? 
                  <Circle className="w-3 h-3" /> :
                  <div className="w-3 h-3 rotate-45 border border-current"></div>
                }
              </button>
              <button 
                onClick={(e) => toggleNodeHealthStatus(node.id)}
                className="p-1 bg-red-900 rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-800 transition-colors"
                title="Change health status"
              >
                <div className={`w-3 h-3 rounded-sm ${
                  node.healthStatus === 'affected' ? 'bg-red-500' : 
                  node.healthStatus === 'carrier' ? 'bg-yellow-500' :
                  node.healthStatus === 'deceased' ? 'bg-gray-500' : 'bg-green-500'
                }`}></div>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render relationship lines
  const renderRelationships = () => {
    const relationships: React.ReactNode[] = [];
    
    // First, draw all partnership lines (horizontal)
    nodes.forEach(node => {
      if (node.partners && node.partners.length > 0) {
        node.partners.forEach(partnerId => {
          // Only render if the current node id is less than partner id to avoid duplicates
          if (node.id < partnerId) {
            const partner = nodes.find(n => n.id === partnerId);
            if (partner) {
              // Calculate positions for straight lines
              const startX = node.x + nodeWidth/2;
              const endX = partner.x + nodeWidth/2;
              const centerY = node.y + nodeHeight/2;
              
              // Partnership line (horizontal) with animation
              relationships.push(
                <div 
                  key={`partner-${node.id}-${partnerId}`}
                  className="absolute bg-gray-600 transition-all duration-300 ease-in-out"
                  style={{
                    height: '2px',
                    width: `${Math.abs(endX - startX)}px`,
                    left: `${Math.min(startX, endX)}px`,
                    top: `${centerY}px`,
                    zIndex: 1
                  }}
                />
              );
              
              // Draw vertical line down from the middle of the partnership line
              // Only if they have common children
              const commonChildren = nodes.filter(child => 
                child.parents && 
                child.parents.includes(node.id) && 
                child.parents.includes(partnerId)
              );
              
              if (commonChildren.length > 0) {
                const midX = (startX + endX) / 2;
                
                // Find the y coordinate for the top child
                const minChildY = Math.min(...commonChildren.map(c => c.y));
                
                // Draw vertical line from partnership to children
                relationships.push(
                  <div 
                    key={`descent-${node.id}-${partnerId}`}
                    className="absolute bg-gray-600 transition-all duration-300 ease-in-out"
                    style={{
                      width: '2px',
                      height: `${minChildY - centerY}px`,
                      left: `${midX - 1}px`,
                      top: `${centerY}px`,
                      zIndex: 1
                    }}
                  />
                );
                
                // If multiple children, draw a horizontal line connecting them
                if (commonChildren.length > 1) {
                  const leftMostChild = commonChildren.reduce(
                    (left, current) => (current.x < left.x) ? current : left,
                    commonChildren[0]
                  );
                  
                  const rightMostChild = commonChildren.reduce(
                    (right, current) => (current.x > right.x) ? current : right,
                    commonChildren[0]
                  );
                  
                  const leftX = leftMostChild.x + nodeWidth/2;
                  const rightX = rightMostChild.x + nodeWidth/2;
                  
                  relationships.push(
                    <div 
                      key={`sibling-line-${node.id}-${partnerId}`}
                      className="absolute bg-gray-600 transition-all duration-300 ease-in-out"
                      style={{
                        height: '2px',
                        width: `${rightX - leftX}px`,
                        left: `${leftX}px`,
                        top: `${minChildY - 10}px`,
                        zIndex: 1
                      }}
                    />
                  );
                  
                  // Draw vertical lines from the horizontal sibling line to each child
                  commonChildren.forEach(child => {
                    const childCenterX = child.x + nodeWidth/2;
                    relationships.push(
                      <div 
                        key={`child-connector-${child.id}`}
                        className="absolute bg-gray-600 transition-all duration-300 ease-in-out"
                        style={{
                          width: '2px',
                          height: '10px',
                          left: `${childCenterX - 1}px`,
                          top: `${minChildY - 10}px`,
                          zIndex: 1
                        }}
                      />
                    );
                  });
                }
              }
            }
          }
        });
      }
    });
    
    // Draw parent-child lines for single parents
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        // Check if this node has a partner
        const hasPartner = node.partners && node.partners.length > 0;
        
        node.children.forEach(childId => {
          const child = nodes.find(n => n.id === childId);
          if (child) {
            // If this child has two parents and one is a partner, skip - already handled above
            const childHasTwoParents = child.parents && child.parents.length > 1;
            const otherParentIsPartner = childHasTwoParents && 
              child.parents!.some(pid => pid !== node.id && node.partners && node.partners.includes(pid));
            
            if (!otherParentIsPartner) {
              // Calculate positions for straight lines
              const parentCenterX = node.x + nodeWidth/2;
              const childCenterX = child.x + nodeWidth/2;
              const parentBottomY = node.y + nodeHeight;
              
              // If child is directly below parent
              if (Math.abs(childCenterX - parentCenterX) < 10) {
                // Draw direct vertical line
                relationships.push(
                  <div 
                    key={`direct-parent-child-${node.id}-${childId}`}
                    className="absolute bg-gray-600 transition-all duration-300 ease-in-out"
                    style={{
                      width: '2px',
                      height: `${child.y - parentBottomY}px`,
                      left: `${parentCenterX - 1}px`,
                      top: `${parentBottomY}px`,
                      zIndex: 1
                    }}
                  />
                );
              } else {
                // Draw line with two segments if child is not directly below
                // First vertical segment from parent
                relationships.push(
                  <div 
                    key={`parent-down-${node.id}-${childId}`}
                    className="absolute bg-gray-600 transition-all duration-300 ease-in-out"
                    style={{
                      width: '2px',
                      height: `${(child.y - parentBottomY) / 2}px`,
                      left: `${parentCenterX - 1}px`,
                      top: `${parentBottomY}px`,
                      zIndex: 1
                    }}
                  />
                );
                
                // Middle horizontal segment
                const midY = parentBottomY + (child.y - parentBottomY) / 2;
                relationships.push(
                  <div 
                    key={`parent-across-${node.id}-${childId}`}
                    className="absolute bg-gray-600 transition-all duration-300 ease-in-out"
                    style={{
                      height: '2px',
                      width: `${Math.abs(childCenterX - parentCenterX)}px`,
                      left: `${Math.min(childCenterX, parentCenterX)}px`,
                      top: `${midY}px`,
                      zIndex: 1
                    }}
                  />
                );
                
                // Final vertical segment to child
                relationships.push(
                  <div 
                    key={`parent-to-child-${node.id}-${childId}`}
                    className="absolute bg-gray-600 transition-all duration-300 ease-in-out"
                    style={{
                      width: '2px',
                      height: `${(child.y - parentBottomY) / 2}px`,
                      left: `${childCenterX - 1}px`,
                      top: `${midY}px`,
                      zIndex: 1
                    }}
                  />
                );
              }
            }
          }
        });
      }
    });
    
    return relationships;
  };

  // Auto-layout the pedigree with improved centering and spacing
  const handleAutoLayout = () => {
    console.log("Running auto layout on nodes:", nodes.length);
    if (nodes.length === 0) {
      console.warn("No nodes to layout");
      return;
    }
    
    try {
      // Log the current nodes for debugging
      console.log("Current nodes before layout:", JSON.stringify(nodes));
      
      // Create a deep copy of nodes to avoid modifying state directly
      const updatedNodes = [...nodes].map(node => ({...node}));
      
      // Step 1: Find the proband as our central reference point
      let probandNode = updatedNodes.find(node => node.relativeType === 'proband' || node.id === 'proband');
      
      if (!probandNode) {
        console.warn("No proband found for centering the pedigree");
        // Default to the first node if no proband is found
        probandNode = updatedNodes[0];
      }
      
      console.log("Using proband as central reference:", probandNode.id);
      
      // Step 2: Assign generations correctly relative to the proband
      // The proband's generation is set as the reference (usually generation 0 or 1)
      const probandGeneration = 1; // Standard is to put proband at generation 1
      probandNode.generation = probandGeneration;
      
      // Step 3: Assign generations for all relatives based on their relationship to the proband
      // Parents are one generation above
      updatedNodes.forEach(node => {
        if (probandNode.parents?.includes(node.id)) {
          node.generation = probandGeneration - 1;
        }
      });
      
      // Process generations both upward and downward from the proband
      // Process upward (ancestors)
      let processed = new Set<string>([probandNode.id]);
      let currentGenProcessing = [probandNode];
      let currentGen = probandGeneration;
      
      // Process ancestors (generations above proband)
      while (currentGenProcessing.length > 0) {
        const nextGenNodes: PedigreeNode[] = [];
        currentGen -= 1; // Move up a generation
        
        // For each node in current generation being processed, find its parents
        for (const node of currentGenProcessing) {
          if (node.parents && node.parents.length > 0) {
            for (const parentId of node.parents) {
              const parentNode = updatedNodes.find(n => n.id === parentId);
              if (parentNode && !processed.has(parentId)) {
                parentNode.generation = currentGen;
                nextGenNodes.push(parentNode);
                processed.add(parentId);
              }
            }
          }
        }
        
        currentGenProcessing = nextGenNodes;
      }
      
      // Process downward (descendants)
      currentGenProcessing = [probandNode];
      currentGen = probandGeneration;
      
      while (currentGenProcessing.length > 0) {
        const nextGenNodes: PedigreeNode[] = [];
        currentGen += 1; // Move down a generation
        
        // For each node in current generation being processed, find its children
        for (const node of currentGenProcessing) {
          if (node.children && node.children.length > 0) {
            for (const childId of node.children) {
              const childNode = updatedNodes.find(n => n.id === childId);
              if (childNode && !processed.has(childId)) {
                childNode.generation = currentGen;
                nextGenNodes.push(childNode);
                processed.add(childId);
              }
            }
          }
        }
        
        currentGenProcessing = nextGenNodes;
      }
      
      // Make sure all nodes have a generation assigned
      updatedNodes.filter(node => !processed.has(node.id))
        .forEach(node => {
          console.log("Unprocessed node:", node.id, node.relativeType);
          // Try to determine generation based on relationship if not assigned
          if (node.relativeType.includes('grandfather') || node.relativeType.includes('grandmother')) {
            node.generation = probandGeneration - 2;
          } else if (node.relativeType.includes('uncle') || node.relativeType.includes('aunt')) {
            node.generation = probandGeneration - 1;
          } else if (node.relativeType === 'cousin') {
            node.generation = probandGeneration;
          } else if (node.relativeType === 'son' || node.relativeType === 'daughter') {
            node.generation = probandGeneration + 1;
          } else {
            node.generation = probandGeneration; // Default to same generation as proband
          }
        });
      
      // Step 4: Improved positioning to center the pedigree around the proband
      
      // Group nodes by generation
      const generationGroups: Record<number, PedigreeNode[]> = {};
      updatedNodes.forEach(node => {
        if (!generationGroups[node.generation]) {
          generationGroups[node.generation] = [];
        }
        generationGroups[node.generation].push(node);
      });
      
      // Calculate centering based on the canvas width
      const canvasWidth = 1200; // Effective canvas width
      const canvasHeight = 800; // Effective canvas height
      
      // Position proband at the center of the canvas horizontally
      probandNode.x = canvasWidth / 2;
      probandNode.y = 100 + probandNode.generation * generationHeight;
      
      // Step 5: Position other nodes generation by generation
      // Position nodes in each generation
      Object.keys(generationGroups).forEach(genKey => {
        const generation = parseInt(genKey);
        const nodesInGeneration = generationGroups[generation];
        
        // Skip if this is the proband's generation and there's only the proband
        if (generation === probandGeneration && nodesInGeneration.length === 1 && nodesInGeneration[0].id === probandNode.id) {
          return;
        }
        
        // Group by relationships (family units)
        const familyGroups: Map<string, PedigreeNode[]> = new Map();
        
        // Group nodes by parent sets (family units)
        nodesInGeneration.forEach(node => {
          const parentKey = node.parents ? node.parents.sort().join('-') : 'no-parents';
          if (!familyGroups.has(parentKey)) {
            familyGroups.set(parentKey, []);
          }
          familyGroups.get(parentKey)!.push(node);
        });
        
        // Calculate the total width needed for this generation
        const totalFamilies = familyGroups.size;
        const nodesInFamilies = Array.from(familyGroups.values()).map(family => family.length);
        const totalNodesWidth = nodesInGeneration.length * horizontalSpacing;
        const extraFamilySpacing = totalFamilies * 50; // Extra space between families
        
        // Total width needed for the entire generation
        const totalWidth = totalNodesWidth + extraFamilySpacing;
        
        // Calculate starting X position to center this generation
        let startX = Math.max(100, (canvasWidth - totalWidth) / 2);
        if (startX < 100) startX = 100; // Minimum margin
        
        // Set Y position based on generation
        const yPosition = 100 + generation * generationHeight;
        
        // Sort family groups to maintain logical order
        const sortedFamilies = Array.from(familyGroups.entries()).sort((a, b) => {
          // If one group contains the proband's direct relatives, prioritize it
          const aHasProbandRelatives = a[1].some(node => 
            node.id === 'proband' || 
            node.relativeType === 'father' || 
            node.relativeType === 'mother' || 
            node.relativeType === 'brother' || 
            node.relativeType === 'sister' || 
            node.relativeType === 'son' || 
            node.relativeType === 'daughter'
          );
          
          const bHasProbandRelatives = b[1].some(node => 
            node.id === 'proband' || 
            node.relativeType === 'father' || 
            node.relativeType === 'mother' || 
            node.relativeType === 'brother' || 
            node.relativeType === 'sister' || 
            node.relativeType === 'son' || 
            node.relativeType === 'daughter'
          );
          
          if (aHasProbandRelatives && !bHasProbandRelatives) return -1;
          if (!aHasProbandRelatives && bHasProbandRelatives) return 1;
          
          // Otherwise, use position
          const aFirstNode = a[1][0];
          const bFirstNode = b[1][0];
          return aFirstNode.position - bFirstNode.position;
        });
        
        // Special case for the proband's parents generation
        if (generation === probandGeneration - 1) {
          // Find the mother and father if they exist
          const father = nodesInGeneration.find(n => n.relativeType === 'father');
          const mother = nodesInGeneration.find(n => n.relativeType === 'mother');
          
          if (father && mother) {
            // Position parents centered above the proband
            father.x = probandNode.x - horizontalSpacing / 2;
            mother.x = probandNode.x + horizontalSpacing / 2;
            father.y = yPosition;
            mother.y = yPosition;
            
            // Remove them from further processing
            const processedParents = new Set([father.id, mother.id]);
            
            // Position other nodes in this generation
            let xOffset = startX;
            sortedFamilies.forEach(([parentKey, familyNodes]) => {
              // Skip the proband's parents
              const filteredNodes = familyNodes.filter(node => !processedParents.has(node.id));
              if (filteredNodes.length === 0) return;
              
              // Position the remaining nodes
              // Identify partnered nodes
              const processedNodeIds = new Set<string>();
              const partneredNodes: PedigreeNode[] = [];
              const remainingNodes: PedigreeNode[] = [];
              
              filteredNodes.forEach(node => {
                if (processedNodeIds.has(node.id)) return;
                
                if (node.partners && node.partners.length > 0) {
                  // Find partners in this generation
                  const partners = filteredNodes.filter(n => 
                    node.partners!.includes(n.id) && !processedNodeIds.has(n.id)
                  );
                  
                  partneredNodes.push(node);
                  processedNodeIds.add(node.id);
                  
                  // Add partners
                  partners.forEach(partner => {
                    partneredNodes.push(partner);
                    processedNodeIds.add(partner.id);
                  });
                } else {
                  remainingNodes.push(node);
                  processedNodeIds.add(node.id);
                }
              });
              
              // Position partnered nodes first
              partneredNodes.forEach((node, index) => {
                node.x = xOffset + index * horizontalSpacing;
                node.y = yPosition;
              });
              
              // Update xOffset after partners
              if (partneredNodes.length > 0) {
                xOffset += partneredNodes.length * horizontalSpacing + 20;
              }
              
              // Then position remaining nodes
              remainingNodes.forEach(node => {
                node.x = xOffset;
                node.y = yPosition;
                xOffset += horizontalSpacing;
              });
              
              // Add extra space between families
              xOffset += 50;
            });
          } else {
            // Handle case where only one parent exists
            processFamilyGroups(sortedFamilies, yPosition, startX);
          }
        } 
        // Special case for proband's children generation
        else if (generation === probandGeneration + 1) {
          // Find direct children of the proband
          const probandChildren = nodesInGeneration.filter(n => 
            n.parents && n.parents.includes(probandNode.id)
          );
          
          if (probandChildren.length > 0) {
            // Position children centered below the proband
            const totalChildrenWidth = probandChildren.length * horizontalSpacing;
            let childStartX = probandNode.x - (totalChildrenWidth / 2) + (horizontalSpacing / 2);
            
            probandChildren.forEach((child, index) => {
              child.x = childStartX + index * horizontalSpacing;
              child.y = yPosition;
            });
            
            // Remove them from further processing
            const processedChildren = new Set(probandChildren.map(c => c.id));
            
            // Position other nodes in this generation
            let xOffset = startX;
            sortedFamilies.forEach(([parentKey, familyNodes]) => {
              // Skip the proband's children
              const filteredNodes = familyNodes.filter(node => !processedChildren.has(node.id));
              if (filteredNodes.length === 0) return;
              
              // Position the remaining nodes using the helper function
              positionFamilyGroup(filteredNodes, yPosition, xOffset);
              xOffset += filteredNodes.length * horizontalSpacing + 50;
            });
          } else {
            // No direct children of proband
            processFamilyGroups(sortedFamilies, yPosition, startX);
          }
        } else {
          // Handle all other generations
          processFamilyGroups(sortedFamilies, yPosition, startX);
        }
      });
      
      // Helper function to position a family group
      function positionFamilyGroup(nodes: PedigreeNode[], yPos: number, startXPos: number) {
        // Identify partnered nodes
        const processedNodeIds = new Set<string>();
        const partneredNodes: PedigreeNode[] = [];
        const remainingNodes: PedigreeNode[] = [];
        
        nodes.forEach(node => {
          if (processedNodeIds.has(node.id)) return;
          
          if (node.partners && node.partners.length > 0) {
            // Find partners in this group
            const partners = nodes.filter(n => 
              node.partners!.includes(n.id) && !processedNodeIds.has(n.id)
            );
            
            partneredNodes.push(node);
            processedNodeIds.add(node.id);
            
            // Add partners
            partners.forEach(partner => {
              partneredNodes.push(partner);
              processedNodeIds.add(partner.id);
            });
          } else {
            remainingNodes.push(node);
            processedNodeIds.add(node.id);
          }
        });
        
        // Position partnered nodes first
        let xPos = startXPos;
        partneredNodes.forEach((node, index) => {
          node.x = xPos + index * horizontalSpacing;
          node.y = yPos;
        });
        
        // Update xPos after partners
        if (partneredNodes.length > 0) {
          xPos += partneredNodes.length * horizontalSpacing + 20;
        }
        
        // Then position remaining nodes
        remainingNodes.forEach(node => {
          node.x = xPos;
          node.y = yPos;
          xPos += horizontalSpacing;
        });
        
        return xPos;
      }
      
      // Helper function to process all family groups in a generation
      function processFamilyGroups(families: [string, PedigreeNode[]][], yPos: number, startXPos: number) {
        let xPos = startXPos;
        
        families.forEach(([parentKey, familyNodes]) => {
          xPos = positionFamilyGroup(familyNodes, yPos, xPos);
          xPos += 50; // Add extra space between families
        });
      }
      
      // Step 6: Ensure no overlaps within the same generation
      Object.values(generationGroups).forEach(nodesInGen => {
        // Sort nodes by x position
        nodesInGen.sort((a, b) => a.x - b.x);
        
        // Check for overlaps and fix them
        for (let i = 1; i < nodesInGen.length; i++) {
          const prevNode = nodesInGen[i-1];
          const currentNode = nodesInGen[i];
          
          // Check if too close
          const minDistance = horizontalSpacing - 20; // Allow slight overlap of margins
          if (currentNode.x - prevNode.x < minDistance) {
            // Move current node to the right
            currentNode.x = prevNode.x + minDistance;
          }
        }
      });
      
      console.log("Layout complete, updating nodes with", updatedNodes.length, "nodes");
      console.log("Updated nodes:", updatedNodes.map(n => ({id: n.id, x: n.x, y: n.y})));
      
      // Final step: Group siblings after layout
      const groupedNodes = groupSiblings(updatedNodes);
      
      // Update state with new node positions and grouping
      setNodes(groupedNodes);
    } catch (error) {
      console.error("Error in auto layout:", error);
    }
  };

  // Add these new functions for sibling grouping
  const groupSiblings = (nodes: PedigreeNode[]) => {
    // Create deep copy to avoid modifying original array
    const updatedNodes = [...nodes];
    const siblingGroups: Record<string, PedigreeNode[]> = {};
    const nodesToRemove: Set<string> = new Set();
    
    // Find sets of healthy siblings with the same parents
    updatedNodes.forEach(node => {
      if (node.healthStatus === 'healthy' && node.parents && node.parents.length > 0) {
        // Create a key based on parents and generation
        const parentKey = [...node.parents].sort().join('-') + `-gen${node.generation}`;
        
        // Add to sibling group
        if (!siblingGroups[parentKey]) {
          siblingGroups[parentKey] = [];
        }
        siblingGroups[parentKey].push(node);
      }
    });
    
    // Process each sibling group with more than 3 siblings
    Object.entries(siblingGroups).forEach(([key, siblings]) => {
      if (siblings.length >= 3) {
        // Skip if one of the siblings is a proband
        if (siblings.some(s => s.relativeType === 'proband' || s.id === 'proband')) {
          return;
        }
        
        // Calculate average position for the group
        const avgX = siblings.reduce((sum, sibling) => sum + sibling.x, 0) / siblings.length;
        const avgY = siblings.reduce((sum, sibling) => sum + sibling.y, 0) / siblings.length;
        
        // Create a "sibling group" node
        const groupNode: PedigreeNode = {
          id: `sibling-group-${key}`,
          name: `${siblings.length} Siblings`,
          gender: 'unknown', // We'll handle this with special rendering
          healthStatus: 'healthy',
          relativeType: siblings[0].relativeType, // Use the same relative type
          generation: siblings[0].generation,
          position: siblings[0].position,
          parents: [...siblings[0].parents!],
          x: avgX,
          y: avgY,
          isSiblingGroup: true,
          siblingCount: siblings.length,
          groupedSiblings: siblings.map(s => s.id)
        };
        
        // Mark original siblings for removal
        siblings.forEach(s => nodesToRemove.add(s.id));
        
        // Add the new group node
        updatedNodes.push(groupNode);
      }
    });
    
    // Filter out the nodes that were grouped
    const filteredNodes = updatedNodes.filter(node => !nodesToRemove.has(node.id));
    
    return filteredNodes;
  };

  // Expand a sibling group back to individual siblings
  const expandSiblingGroup = (groupId: string) => {
    setNodes(prevNodes => {
      const groupNode = prevNodes.find(n => n.id === groupId);
      if (!groupNode || !groupNode.isSiblingGroup) return prevNodes;
      
      // Get the original siblings
      const siblingIds = groupNode.groupedSiblings || [];
      // Create individual sibling nodes
      const expandedSiblings: PedigreeNode[] = [];
      
      // Position siblings in a row
      for (let i = 0; i < groupNode.siblingCount!; i++) {
        const siblingId = `expanded-sibling-${groupId}-${i}`;
        const sibling: PedigreeNode = {
          id: siblingId,
          name: groupNode.relativeType.charAt(0).toUpperCase() + groupNode.relativeType.slice(1).replace('_', ' '),
          gender: groupNode.relativeType.includes('brother') ? 'male' : 
                  groupNode.relativeType.includes('sister') ? 'female' : 
                  groupNode.relativeType.includes('uncle') ? 'male' :
                  groupNode.relativeType.includes('aunt') ? 'female' : 'unknown',
          healthStatus: 'healthy',
          relativeType: groupNode.relativeType,
          generation: groupNode.generation,
          position: groupNode.position + i,
          parents: groupNode.parents ? [...groupNode.parents] : [],
          x: groupNode.x + (i - Math.floor(groupNode.siblingCount! / 2)) * (horizontalSpacing / 2),
          y: groupNode.y
        };
        expandedSiblings.push(sibling);
      }
      
      // Filter out the group node
      const updatedNodes = prevNodes.filter(n => n.id !== groupId);
      
      // Update the parents to include these children
      expandedSiblings.forEach(sibling => {
        if (sibling.parents) {
          sibling.parents.forEach(parentId => {
            const parentIndex = updatedNodes.findIndex(n => n.id === parentId);
            if (parentIndex >= 0) {
              // Ensure children array exists
              if (!updatedNodes[parentIndex].children) {
                updatedNodes[parentIndex].children = [];
              }
              // Add the child
              updatedNodes[parentIndex].children!.push(sibling.id);
            }
          });
        }
      });
      
      // Add the expanded siblings
      return [...updatedNodes, ...expandedSiblings];
    });
  };

  // Function to download the pedigree chart as an image
  const handleDownloadChart = async () => {
    if (!pedigreeCanvasRef.current) return;
    
    try {
      setDownloadLoading(true);
      
      // Set original zoom for high quality image
      const originalZoom = zoom;
      setZoom(1);
      
      // Wait for zoom change to render
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Import html2canvas dynamically
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;
      
      // Take screenshot of the pedigree canvas
      const canvas = await html2canvas(pedigreeCanvasRef.current, {
        backgroundColor: '#111827', // Match the background color
        scale: 2, // Higher resolution
        logging: false,
        allowTaint: true,
        useCORS: true
      });
      
      // Convert to data URL and create download link
      const dataUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = `pedigree-chart-${new Date().toISOString().slice(0, 10)}.png`;
      
      // Trigger download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Restore original zoom
      setZoom(originalZoom);
      
    } catch (error) {
      console.error("Error downloading pedigree chart:", error);
      alert("There was an error downloading your pedigree chart. Please try again.");
    } finally {
      setDownloadLoading(false);
    }
  };

  // Preview pedigree chart in book-like style
  const handlePreviewChart = () => {
    setShowPreview(true);
  };

  return (
    <div className="pb-16">
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        .pedigree-canvas {
          min-width: 1200px;
          min-height: 800px;
          transition: transform 0.3s ease-in-out;
        }
        
        .pedigree-node {
          transition: all 0.3s ease-in-out;
        }
        
        .pedigree-relation {
          transition: all 0.3s ease-in-out;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .spinner {
          animation: spin 1s linear infinite;
        }
      `}</style>
      
      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-auto">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-black text-lg font-semibold">Pedigree Chart Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 bg-white">
              <div className="w-full h-[600px] relative overflow-auto bg-white">
                <div className="absolute min-w-full min-h-full">
                  {/* Nodes */}
                  {nodes.map((node) => (
                    <div
                      key={`preview-${node.id}`}
                      style={{
                        position: 'absolute',
                        left: `${node.x}px`,
                        top: `${node.y}px`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      className="transition-all duration-300 ease-in-out"
                    >
                      {node.isSiblingGroup ? (
                        <div 
                          className="w-16 h-16 rotate-45 bg-white border-2 border-black flex items-center justify-center transform"
                        >
                          <span className="text-lg font-bold text-black -rotate-45">{node.siblingCount}</span>
                        </div>
                      ) : node.gender === 'male' ? (
                        <div 
                          className={`w-16 h-16 bg-white border-2 border-black flex items-center justify-center
                            ${node.healthStatus === 'affected' ? 'bg-black' : 
                              node.healthStatus === 'carrier' ? 'bg-white' : 
                              node.healthStatus === 'deceased' ? 'bg-white' : 'bg-white'}`}
                        >
                          {node.healthStatus === 'deceased' && (
                            <div className="absolute w-20 h-0.5 bg-black rotate-45"></div>
                          )}
                          {node.healthStatus === 'carrier' && (
                            <div className="w-8 h-8 rounded-full bg-black"></div>
                          )}
                          {node.relativeType === 'proband' && (
                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                              <div className="h-1 w-6 bg-black"></div>
                            </div>
                          )}
                        </div>
                      ) : node.gender === 'female' ? (
                        <div 
                          className={`w-16 h-16 rounded-full bg-white border-2 border-black flex items-center justify-center
                            ${node.healthStatus === 'affected' ? 'bg-black' : 
                              node.healthStatus === 'carrier' ? 'bg-white' : 
                              node.healthStatus === 'deceased' ? 'bg-white' : 'bg-white'}`}
                        >
                          {node.healthStatus === 'deceased' && (
                            <div className="absolute w-20 h-0.5 bg-black rotate-45"></div>
                          )}
                          {node.healthStatus === 'carrier' && (
                            <div className="w-8 h-8 rounded-full bg-black"></div>
                          )}
                          {node.relativeType === 'proband' && (
                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                              <div className="h-1 w-6 bg-black"></div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div 
                          className={`w-16 h-16 rotate-45 bg-white border-2 border-black flex items-center justify-center
                            ${node.healthStatus === 'affected' ? 'bg-black' : 
                              node.healthStatus === 'carrier' ? 'bg-white' : 
                              node.healthStatus === 'deceased' ? 'bg-white' : 'bg-white'}`}
                        >
                          {node.healthStatus === 'deceased' && (
                            <div className="absolute w-20 h-0.5 bg-black rotate-45"></div>
                          )}
                          {node.relativeType === 'proband' && (
                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 -rotate-45">
                              <div className="h-1 w-6 bg-black"></div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        <p className="text-sm text-black font-medium">{node.name}</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Relationship lines */}
                  <svg
                    width="100%"
                    height="100%"
                    className="absolute top-0 left-0 pointer-events-none"
                  >
                    {/* Partnership lines */}
                    {nodes.map((node) => (
                      <React.Fragment key={`preview-rel-${node.id}`}>
                        {node.partners?.map((partnerId) => {
                          const partnerNode = nodes.find((n) => n.id === partnerId);
                          if (partnerNode && node.id < partnerId) { // Avoid duplicate lines
                            // Calculate the start and end positions
                            const startX = node.x + (node.gender === 'male' ? 8 : 0);
                            const endX = partnerNode.x - (partnerNode.gender === 'male' ? 8 : 0);
                            const centerY = node.y;
                            
                            // Find common children
                            const commonChildren = nodes.filter(
                              (n) => 
                                n.parents && 
                                n.parents.includes(node.id) && 
                                n.parents.includes(partnerId)
                            );
                            
                            return (
                              <React.Fragment key={`preview-partner-${node.id}-${partnerId}`}>
                                {/* Horizontal line between partners */}
                                <line
                                  x1={startX}
                                  y1={centerY}
                                  x2={endX}
                                  y2={centerY}
                                  stroke="black"
                                  strokeWidth="2"
                                />
                                
                                {/* Vertical line down to children if they exist */}
                                {commonChildren.length > 0 && (
                                  <>
                                    {commonChildren.length === 1 ? (
                                      // Single child - direct line down
                                      <>
                                        <line
                                          x1={(startX + endX) / 2}
                                          y1={centerY}
                                          x2={(startX + endX) / 2}
                                          y2={commonChildren[0].y - 8}
                                          stroke="black"
                                          strokeWidth="2"
                                        />
                                      </>
                                    ) : (
                                      // Multiple children - horizontal line connecting them
                                      <>
                                        {/* Vertical line from partnership */}
                                        <line
                                          x1={(startX + endX) / 2}
                                          y1={centerY}
                                          x2={(startX + endX) / 2}
                                          y2={centerY + 30}
                                          stroke="black"
                                          strokeWidth="2"
                                        />
                                        
                                        {/* Horizontal line above children */}
                                        {(() => {
                                          const childrenX = commonChildren.map(c => c.x).sort((a, b) => a - b);
                                          const leftmostChildX = childrenX[0];
                                          const rightmostChildX = childrenX[childrenX.length - 1];
                                          
                                          return (
                                            <line
                                              x1={leftmostChildX}
                                              y1={centerY + 30}
                                              x2={rightmostChildX}
                                              y2={centerY + 30}
                                              stroke="black"
                                              strokeWidth="2"
                                            />
                                          );
                                        })()}
                                        
                                        {/* Vertical lines to each child */}
                                        {commonChildren.map(child => (
                                          <line
                                            key={`preview-child-line-${child.id}`}
                                            x1={child.x}
                                            y1={centerY + 30}
                                            x2={child.x}
                                            y2={child.y - 8}
                                            stroke="black"
                                            strokeWidth="2"
                                          />
                                        ))}
                                      </>
                                    )}
                                  </>
                                )}
                              </React.Fragment>
                            );
                          }
                          return null;
                        })}
                        
                        {/* Parent-child lines for single parents */}
                        {node.children?.map((childId) => {
                          const childNode = nodes.find((n) => n.id === childId);
                          if (childNode && (!childNode.parents || childNode.parents.length === 1)) {
                            return (
                              <line
                                key={`preview-single-parent-${node.id}-${childId}`}
                                x1={node.x}
                                y1={node.y + 8}
                                x2={childNode.x}
                                y2={childNode.y - 8}
                                stroke="black"
                                strokeWidth="2"
                              />
                            );
                          }
                          return null;
                        })}
                      </React.Fragment>
                    ))}
                  </svg>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Close
                </button>
                <button
                  onClick={handleDownloadChart}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                  disabled={downloadLoading}
                >
                  {downloadLoading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Save as Image</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="mr-4">
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </Link>
              <h1 className="text-lg font-semibold">Pedigree Chart</h1>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
                className="p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
                title="Zoom out"
              >
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
                className="p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
                title="Zoom in"
              >
                <ChevronUp className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={handleAutoLayout}
                className="p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
                title="Auto layout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M12 3v18" />
                  <path d="M3 12h18" />
                </svg>
              </button>
              <button
                onClick={() => {
                  // Toggle between grouped and expanded views
                  const currentNodes = [...nodes];
                  const hasGroups = currentNodes.some(n => n.isSiblingGroup);
                  
                  if (hasGroups) {
                    // Expand all groups
                    const expandedNodes = currentNodes.filter(n => !n.isSiblingGroup);
                    const allExpandedSiblings: PedigreeNode[] = [];
                    
                    currentNodes.forEach(node => {
                      if (node.isSiblingGroup && node.groupedSiblings) {
                        // Create individual nodes for each sibling in the group
                        for (let i = 0; i < node.siblingCount!; i++) {
                          const siblingId = `expanded-sibling-${node.id}-${i}`;
                          const sibling: PedigreeNode = {
                            id: siblingId,
                            name: node.relativeType.charAt(0).toUpperCase() + node.relativeType.slice(1).replace('_', ' '),
                            gender: node.relativeType.includes('brother') ? 'male' : 
                                   node.relativeType.includes('sister') ? 'female' : 
                                   node.relativeType.includes('uncle') ? 'male' :
                                   node.relativeType.includes('aunt') ? 'female' : 'unknown',
                            healthStatus: 'healthy',
                            relativeType: node.relativeType,
                            generation: node.generation,
                            position: node.position + i,
                            parents: node.parents ? [...node.parents] : [],
                            x: node.x + (i - Math.floor(node.siblingCount! / 2)) * (horizontalSpacing / 2),
                            y: node.y
                          };
                          allExpandedSiblings.push(sibling);
                        }
                      }
                    });
                    
                    setNodes([...expandedNodes, ...allExpandedSiblings]);
                    handleAutoLayout();
                  } else {
                    // Group siblings
                    const groupedNodes = groupSiblings(currentNodes);
                    setNodes(groupedNodes);
                    handleAutoLayout();
                  }
                }}
                className="p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
                title="Toggle sibling grouping"
              >
                <Users className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={handlePreviewChart}
                className="p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors flex items-center"
                title="Preview in book style"
              >
                <Eye className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={handleDownloadChart}
                disabled={downloadLoading}
                className="p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors relative"
                title="Download pedigree as image"
              >
                {downloadLoading ? (
                  <div className="spinner w-4 h-4 border-2 border-t-transparent border-gray-400 rounded-full" />
                ) : (
                  <Download className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <button
                onClick={() => {/* Save functionality would go here */}}
                className="p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
                title="Save pedigree"
              >
                <Save className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4">
        {/* Drawing Instructions */}
        {isDrawing && (
          <div className="bg-indigo-900/30 border border-indigo-800 rounded-lg p-3 mb-4">
            <p className="text-sm text-indigo-300">
              {relationMode === 'child' ? 
                'Tap where you want to add a child' :
                'Tap where you want to add a sibling'}
            </p>
            <button
              onClick={handleCancelDrawing}
              className="mt-2 text-xs bg-indigo-700 text-white px-3 py-1 rounded-md"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Quick Help */}
        {!isDrawing && (
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-3 mb-4">
            <p className="text-sm text-gray-300">
              <span className="font-semibold">Tap a person</span> to select and see available actions
            </p>
            <div className="flex gap-3 flex-wrap mt-2 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                <span>Add child</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span>Add sibling</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span>Add father</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-pink-600 rounded-full"></div>
                <span>Add mother</span>
              </div>
            </div>
          </div>
        )}

        {/* Pedigree Canvas - updated for better centering and smoother interactions */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          <div 
            ref={canvasRef}
            className="relative w-full h-[70vh] overflow-auto"
            style={{ cursor: isDrawing ? 'crosshair' : 'default' }}
          >
            <div 
              ref={pedigreeCanvasRef}
              className="absolute pedigree-canvas" 
              style={{ 
                width: '100%', 
                height: '100%',
                minWidth: '1200px',
                minHeight: '800px',
                transform: `scale(${zoom})`,
                transformOrigin: '0 0',
              }}
            >
              {renderRelationships()}
              {nodes.map(renderNode)}
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-3 mt-4">
          <h3 className="text-xs font-semibold mb-2">Quick Guide</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-800 mr-2"></div>
              <span>Male</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-gray-800 mr-2"></div>
              <span>Female</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-900 mr-2"></div>
              <span>Affected</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-800 mr-2"></div>
              <span>Carrier</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rotate-45 bg-gray-800 mr-2 flex items-center justify-center">
                <span className="text-xs -rotate-45">3</span>
              </div>
              <span>Multiple siblings</span>
            </div>
          </div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default PedigreePage;
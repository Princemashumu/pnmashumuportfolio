# Blender Integration Guide for Portfolio RPG

## Overview
This guide explains how to integrate Blender-created 3D models into your Three.js RPG portfolio game.

## Blender Export Settings

### For Characters:
1. **File Format**: Export as .glb (recommended) or .gltf
2. **Settings**:
   - Include: Selected Objects
   - Transform: Apply Modifiers ✓
   - Geometry: UVs ✓, Normals ✓, Vertex Colors ✓
   - Animation: Use Current Frame ✓, Export Deform Bones Only ✓
   - Compression: Draco (optional for smaller files)

### For Environments:
1. **File Format**: .glb with Draco compression
2. **Optimization**:
   - Decimate modifier for LOD
   - Combine materials where possible
   - Bake lighting into textures for better performance

### For Particle Effects:
1. **Export as animated .glb**
2. **Use Shape Keys or Bone Animations**
3. **Keep particle count reasonable (< 1000 for performance)**

## Directory Structure
```
public/
├── models/
│   ├── characters/
│   │   ├── warrior.glb
│   │   ├── mage.glb
│   │   ├── archer.glb
│   │   └── rogue.glb
│   ├── environments/
│   │   ├── castle.glb
│   │   ├── tower.glb
│   │   └── vault.glb
│   ├── effects/
│   │   ├── sparkles.glb
│   │   ├── fire.glb
│   │   └── healing.glb
│   └── scenes/
│       └── rpg_world.glb
├── draco/
│   └── (Draco decoder files)
```

## Animation Names Convention
- **idle**: Default standing animation
- **walk**: Walking/moving animation  
- **run**: Running animation
- **attack**: Attack/action animation
- **spell**: Magic casting animation
- **death**: Death/defeat animation
- **victory**: Victory/celebration animation

## Blender to Three.js Workflow

### Step 1: Create Model in Blender
1. Model your character/environment
2. Create materials with PBR workflow
3. Add armature and rig if animated
4. Create animations using keyframes

### Step 2: Export from Blender
1. Select your model
2. File → Export → glTF 2.0
3. Configure export settings (see above)
4. Save to appropriate folder in `/public/models/`

### Step 3: Use in React Component
```tsx
import { BlenderRPGCharacter } from '@/components/blender/BlenderRPGComponents';

<BlenderRPGCharacter
  characterType="warrior"
  position={[0, 0, 0]}
  modelPath="/models/characters/my_warrior.glb"
  animationState="idle"
  name="Custom Warrior"
  level={25}
/>
```

## Performance Optimization

### Model Optimization:
- Keep polygon count under 10k for characters
- Use LOD (Level of Detail) for distant objects
- Combine meshes where possible
- Use texture atlasing

### Animation Optimization:
- Limit bone count (< 50 bones per character)
- Use animation compression
- Remove unused keyframes
- Use animation blending sparingly

### Loading Optimization:
- Preload frequently used models
- Use Draco compression for static meshes
- Implement progressive loading for large scenes

## Lighting Setup
Your Blender models will work best with these Three.js lighting settings:

```tsx
<ambientLight intensity={0.4} color="#ffffff" />
<directionalLight
  position={[10, 15, 5]}
  intensity={1}
  castShadow
  shadow-mapSize={[2048, 2048]}
/>
<pointLight position={[0, 10, 0]} intensity={0.8} />
```

## Material Considerations
- Use PBR materials in Blender (Principled BSDF)
- Export textures at reasonable resolutions (1024x1024 or 2048x2048)
- Consider using vertex colors for simple materials
- Avoid complex node setups that won't export properly

## Testing Your Models
1. Use Blender's glTF preview addon
2. Test in online glTF viewers
3. Check animations work correctly
4. Verify file sizes are reasonable

## Common Issues & Solutions

### Model Not Appearing:
- Check file path is correct
- Ensure model has materials
- Check console for loading errors
- Verify model scale (might be too small/large)

### Animations Not Playing:
- Check animation names match code
- Ensure animations were exported
- Verify armature is properly bound
- Check for console animation warnings

### Performance Issues:
- Reduce polygon count
- Use simpler materials
- Enable Draco compression
- Implement LOD system

## Advanced Features

### Custom Shaders:
You can create custom materials in Three.js that work with your Blender models:

```tsx
const customMaterial = new THREE.ShaderMaterial({
  uniforms: { time: { value: 0 } },
  vertexShader: `...`,
  fragmentShader: `...`
});
```

### Physics Integration:
Add physics to your Blender models using libraries like Cannon.js or Rapier.

### Interactive Elements:
Use invisible collision meshes for interaction zones around your Blender models.

## Next Steps
1. Create your first character in Blender
2. Export and test in the portfolio
3. Add animations
4. Create environment pieces
5. Build complete scenes

Happy Blending! 🎨🎮

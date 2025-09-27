# Blender Portfolio RPG Project

## Sample Blender Models for Testing

### Character Specifications:

**Warrior Character:**
- Polygon Count: ~5,000 triangles
- Bones: 25-30 (humanoid rig)
- Animations: idle, walk, attack_sword, victory, death
- Textures: 1024x1024 diffuse, normal, roughness
- Armor: Medieval plate armor with sword and shield

**Mage Character:**
- Polygon Count: ~4,500 triangles  
- Bones: 25-30 (humanoid rig with additional face bones)
- Animations: idle, walk, cast_spell, meditate, victory
- Textures: 1024x1024 with emissive maps for magical effects
- Equipment: Robe, staff, spell book, magical aura particles

**Archer Character:**
- Polygon Count: ~4,800 triangles
- Bones: 25-30 (humanoid rig with finger bones for bow)
- Animations: idle, walk, aim_bow, shoot_arrow, victory
- Textures: 1024x1024 leather and cloth materials
- Equipment: Leather armor, longbow, quiver with arrows

**Rogue Character:**
- Polygon Count: ~4,200 triangles
- Bones: 25-30 (agile humanoid rig)
- Animations: idle, sneak, backstab, dodge, vanish
- Textures: 1024x1024 dark leather and metal
- Equipment: Dual daggers, hood, stealth cloak

### Environment Pieces:

**Fantasy Castle:**
- Main structure: ~15,000 triangles
- Modular pieces: walls, towers, gates
- Textures: 2048x2048 stone and wood
- Interactive elements: doors, flags, torches

**Magic Tower:**
- Structure: ~8,000 triangles
- Spiral staircase, floating platforms
- Textures: 1024x1024 mystical stone with runes
- Particle effects: Floating magical orbs

**Treasure Vault:**
- Structure: ~6,000 triangles
- Gold piles, treasure chests, gems
- Textures: 1024x1024 gold, stone, crystal
- Interactive: Opening chests, collectible items

### Particle Effects:

**Magic Sparkles:**
- 200-500 particles
- Shape keys animation for twinkling
- Duration: 3-5 seconds loop

**Fire Effect:**
- 100-300 particles
- Bone-based animation for flame movement
- Color gradient from yellow to red

**Healing Aura:**
- 150-400 particles
- Circular motion around character
- Green to white color transition

## Blender Setup Instructions:

1. **Scene Setup:**
   - Units: Metric, Scale 0.01
   - Frame Rate: 30 FPS
   - Render Engine: Eevee (for real-time preview)

2. **Modeling Guidelines:**
   - Keep quads where possible
   - Use edge loops for deformation
   - Apply modifiers before export
   - Check for non-manifold geometry

3. **Rigging Guidelines:**
   - Use standard humanoid rig (Rigify)
   - Keep bone count under 50
   - Add IK constraints for limbs
   - Create custom bone shapes for clarity

4. **Animation Guidelines:**
   - Use constant interpolation for game loops
   - Keep idle animations subtle
   - 30-60 frame loops for most animations
   - Export root motion for walking

5. **Material Setup:**
   - Use Principled BSDF only
   - Metallic workflow (metallic + roughness)
   - Keep node trees simple
   - Use vertex colors for variations

6. **Export Settings:**
   - Format: glTF 2.0 (.glb)
   - Include: Selected Objects
   - Transform: +Y Up
   - Geometry: Apply Modifiers, UVs, Normals
   - Animation: Export Deform Bones Only
   - Compression: Draco (for final builds)

## File Organization:

```
BlenderProjects/
├── Characters/
│   ├── Warrior.blend
│   ├── Mage.blend
│   ├── Archer.blend
│   └── Rogue.blend
├── Environments/
│   ├── Castle.blend
│   ├── Tower.blend
│   └── Vault.blend
├── Effects/
│   ├── Sparkles.blend
│   ├── Fire.blend
│   └── Healing.blend
└── Exports/
    ├── characters/
    ├── environments/
    └── effects/
```

## Testing Workflow:

1. Model in Blender
2. Export to `/public/models/`
3. Test in Three.js viewer
4. Iterate on performance/quality
5. Integrate into portfolio

## Performance Targets:

- Characters: < 5k triangles each
- Environments: < 20k triangles each
- Textures: ≤ 1024x1024 for characters, ≤ 2048x2048 for environments
- Total scene: < 100k triangles
- Load time: < 3 seconds on average hardware

## Next Steps:

1. Create basic character in Blender
2. Add simple walk cycle animation
3. Export and test in portfolio
4. Expand to full character set
5. Add environment pieces
6. Implement particle effects

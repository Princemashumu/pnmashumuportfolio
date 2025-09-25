export class WebGL2Renderer {
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram | null = null;
  private animationId: number | null = null;
  private buffers: { [key: string]: WebGLBuffer } = {};
  private uniforms: { [key: string]: WebGLUniformLocation } = {};

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('webgl2');
    if (!context) {
      throw new Error('WebGL2 not supported');
    }
    this.gl = context;
    this.setupCanvas();
    this.initShaders();
  }

  private setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  private createShader(type: number, source: string): WebGLShader | null {
    const shader = this.gl.createShader(type);
    if (!shader) return null;
    
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }

  private initShaders() {
    // Vertex shader for server room visualization
    const vertexShaderSource = `#version 300 es
      in vec4 a_position;
      in vec2 a_texCoord;
      in vec3 a_normal;
      
      uniform mat4 u_projectionMatrix;
      uniform mat4 u_modelViewMatrix;
      uniform mat4 u_normalMatrix;
      uniform float u_time;
      
      out vec2 v_texCoord;
      out vec3 v_normal;
      out vec3 v_position;
      out float v_time;
      
      void main() {
        v_texCoord = a_texCoord;
        v_normal = (u_normalMatrix * vec4(a_normal, 0.0)).xyz;
        v_position = (u_modelViewMatrix * a_position).xyz;
        v_time = u_time;
        
        gl_Position = u_projectionMatrix * u_modelViewMatrix * a_position;
      }
    `;

    // Fragment shader with server room effects
    const fragmentShaderSource = `#version 300 es
      precision highp float;
      
      in vec2 v_texCoord;
      in vec3 v_normal;
      in vec3 v_position;
      in float v_time;
      
      uniform vec3 u_lightPosition;
      uniform vec3 u_lightColor;
      uniform vec3 u_ambientColor;
      uniform vec3 u_serverColor;
      uniform float u_activity;
      uniform int u_roomType;
      
      out vec4 outColor;
      
      // Noise function for procedural effects
      float noise(vec2 uv) {
        return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
      }
      
      // LED blinking effect
      float ledEffect(vec2 uv, float time) {
        float led = step(0.8, sin(uv.x * 20.0) * sin(uv.y * 10.0));
        return led * (0.5 + 0.5 * sin(time * 5.0));
      }
      
      // Holographic effect
      vec3 hologram(vec2 uv, float time) {
        float scanline = sin(uv.y * 800.0 + time * 10.0) * 0.1;
        float interference = noise(uv + time) * 0.05;
        return vec3(0.0, 1.0, 1.0) * (scanline + interference);
      }
      
      // Server room specific effects
      vec3 getServerRoomEffect(vec2 uv, int roomType, float time, float activity) {
        vec3 color = u_serverColor;
        
        if (roomType == 0) { // Server Room
          color += ledEffect(uv, time) * vec3(0.0, 1.0, 0.0) * activity;
          color += hologram(uv, time) * 0.3;
        } else if (roomType == 1) { // Database Room  
          color += vec3(0.2, 0.6, 1.0) * sin(time * 2.0 + uv.x * 10.0) * 0.3;
        } else if (roomType == 2) { // Code Laboratory
          float grid = step(0.95, sin(uv.x * 50.0)) + step(0.95, sin(uv.y * 50.0));
          color += vec3(1.0, 0.5, 0.0) * grid * 0.4;
        } else if (roomType == 3) { // Project Warehouse
          float boxes = step(0.7, noise(uv * 10.0));
          color += vec3(0.5, 0.0, 1.0) * boxes * 0.3;
        } else if (roomType == 4) { // Communication Hub
          float waves = sin(length(uv - 0.5) * 20.0 - time * 5.0) * 0.5 + 0.5;
          color += vec3(0.0, 1.0, 0.5) * waves * 0.4;
        } else if (roomType == 5) { // System Status
          float pulse = sin(time * 3.0) * 0.5 + 0.5;
          color += vec3(1.0, 1.0, 0.0) * pulse * 0.3;
        }
        
        return color;
      }
      
      void main() {
        // Basic lighting
        vec3 normal = normalize(v_normal);
        vec3 lightDir = normalize(u_lightPosition - v_position);
        float lightIntensity = max(dot(normal, lightDir), 0.0);
        
        vec3 ambient = u_ambientColor;
        vec3 diffuse = u_lightColor * lightIntensity;
        
        // Get room-specific effects
        vec3 roomEffect = getServerRoomEffect(v_texCoord, u_roomType, v_time, u_activity);
        
        // Combine lighting with room effects
        vec3 finalColor = (ambient + diffuse) * roomEffect;
        
        // Add some glow effect
        float glow = 1.0 - length(v_texCoord - 0.5) * 2.0;
        finalColor += vec3(0.1, 0.3, 0.6) * glow * u_activity * 0.2;
        
        outColor = vec4(finalColor, 1.0);
      }
    `;

    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) {
      throw new Error('Failed to create shaders');
    }

    this.program = this.gl.createProgram();
    if (!this.program) {
      throw new Error('Failed to create program');
    }

    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error('Program linking error:', this.gl.getProgramInfoLog(this.program));
      throw new Error('Failed to link program');
    }

    this.gl.useProgram(this.program);

    // Get uniform locations
    this.uniforms = {
      projectionMatrix: this.gl.getUniformLocation(this.program, 'u_projectionMatrix')!,
      modelViewMatrix: this.gl.getUniformLocation(this.program, 'u_modelViewMatrix')!,
      normalMatrix: this.gl.getUniformLocation(this.program, 'u_normalMatrix')!,
      time: this.gl.getUniformLocation(this.program, 'u_time')!,
      lightPosition: this.gl.getUniformLocation(this.program, 'u_lightPosition')!,
      lightColor: this.gl.getUniformLocation(this.program, 'u_lightColor')!,
      ambientColor: this.gl.getUniformLocation(this.program, 'u_ambientColor')!,
      serverColor: this.gl.getUniformLocation(this.program, 'u_serverColor')!,
      activity: this.gl.getUniformLocation(this.program, 'u_activity')!,
      roomType: this.gl.getUniformLocation(this.program, 'u_roomType')!,
    };
  }

  // Create a cube geometry for server racks
  createCube(): {
    vertices: Float32Array;
    normals: Float32Array;
    texCoords: Float32Array;
    indices: Uint16Array;
  } {
    const vertices = new Float32Array([
      // Front face
      -1, -1,  1,   1, -1,  1,   1,  1,  1,  -1,  1,  1,
      // Back face
      -1, -1, -1,  -1,  1, -1,   1,  1, -1,   1, -1, -1,
      // Top face
      -1,  1, -1,  -1,  1,  1,   1,  1,  1,   1,  1, -1,
      // Bottom face
      -1, -1, -1,   1, -1, -1,   1, -1,  1,  -1, -1,  1,
      // Right face
       1, -1, -1,   1,  1, -1,   1,  1,  1,   1, -1,  1,
      // Left face
      -1, -1, -1,  -1, -1,  1,  -1,  1,  1,  -1,  1, -1,
    ]);

    const normals = new Float32Array([
      // Front face
       0,  0,  1,   0,  0,  1,   0,  0,  1,   0,  0,  1,
      // Back face
       0,  0, -1,   0,  0, -1,   0,  0, -1,   0,  0, -1,
      // Top face
       0,  1,  0,   0,  1,  0,   0,  1,  0,   0,  1,  0,
      // Bottom face
       0, -1,  0,   0, -1,  0,   0, -1,  0,   0, -1,  0,
      // Right face
       1,  0,  0,   1,  0,  0,   1,  0,  0,   1,  0,  0,
      // Left face
      -1,  0,  0,  -1,  0,  0,  -1,  0,  0,  -1,  0,  0,
    ]);

    const texCoords = new Float32Array([
      // Front face
      0, 0,   1, 0,   1, 1,   0, 1,
      // Back face
      1, 0,   1, 1,   0, 1,   0, 0,
      // Top face
      0, 1,   0, 0,   1, 0,   1, 1,
      // Bottom face
      1, 1,   0, 1,   0, 0,   1, 0,
      // Right face
      1, 0,   1, 1,   0, 1,   0, 0,
      // Left face
      0, 0,   1, 0,   1, 1,   0, 1,
    ]);

    const indices = new Uint16Array([
      0,  1,  2,    0,  2,  3,     // front
      4,  5,  6,    4,  6,  7,     // back
      8,  9, 10,    8, 10, 11,     // top
      12, 13, 14,   12, 14, 15,    // bottom
      16, 17, 18,   16, 18, 19,    // right
      20, 21, 22,   20, 22, 23,    // left
    ]);

    return { vertices, normals, texCoords, indices };
  }

  // Render a server room with WebGL2
  renderServerRoom(roomType: number, activity: number = 1.0, time: number = 0) {
    if (!this.program) return;

    const cube = this.createCube();

    // Create and bind buffers
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, cube.vertices, this.gl.STATIC_DRAW);

    const normalBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, cube.normals, this.gl.STATIC_DRAW);

    const texCoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texCoordBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, cube.texCoords, this.gl.STATIC_DRAW);

    const indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, cube.indices, this.gl.STATIC_DRAW);

    // Set up attributes
    const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
    const normalLocation = this.gl.getAttribLocation(this.program, 'a_normal');
    const texCoordLocation = this.gl.getAttribLocation(this.program, 'a_texCoord');

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 3, this.gl.FLOAT, false, 0, 0);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer);
    this.gl.enableVertexAttribArray(normalLocation);
    this.gl.vertexAttribPointer(normalLocation, 3, this.gl.FLOAT, false, 0, 0);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texCoordBuffer);
    this.gl.enableVertexAttribArray(texCoordLocation);
    this.gl.vertexAttribPointer(texCoordLocation, 2, this.gl.FLOAT, false, 0, 0);

    // Set uniforms
    const projectionMatrix = this.createPerspectiveMatrix(45, this.canvas.width / this.canvas.height, 0.1, 100.0);
    const modelViewMatrix = this.createModelViewMatrix();
    const normalMatrix = this.createNormalMatrix(modelViewMatrix);

    this.gl.uniformMatrix4fv(this.uniforms.projectionMatrix, false, projectionMatrix);
    this.gl.uniformMatrix4fv(this.uniforms.modelViewMatrix, false, modelViewMatrix);
    this.gl.uniformMatrix4fv(this.uniforms.normalMatrix, false, normalMatrix);
    this.gl.uniform1f(this.uniforms.time, time);
    this.gl.uniform3fv(this.uniforms.lightPosition, [2.0, 2.0, 2.0]);
    this.gl.uniform3fv(this.uniforms.lightColor, [1.0, 1.0, 1.0]);
    this.gl.uniform3fv(this.uniforms.ambientColor, [0.1, 0.1, 0.2]);
    this.gl.uniform3fv(this.uniforms.serverColor, [0.3, 0.3, 0.4]);
    this.gl.uniform1f(this.uniforms.activity, activity);
    this.gl.uniform1i(this.uniforms.roomType, roomType);

    // Render
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.drawElements(this.gl.TRIANGLES, cube.indices.length, this.gl.UNSIGNED_SHORT, 0);
  }

  private createPerspectiveMatrix(fov: number, aspect: number, near: number, far: number): Float32Array {
    const f = Math.tan(Math.PI * 0.5 - 0.5 * fov * Math.PI / 180);
    const rangeInv = 1.0 / (near - far);

    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0
    ]);
  }

  private createModelViewMatrix(): Float32Array {
    // Simple translation back from camera
    return new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, -5, 1
    ]);
  }

  private createNormalMatrix(modelViewMatrix: Float32Array): Float32Array {
    // For simplicity, just return identity matrix
    // In a real implementation, you'd compute the inverse transpose
    return new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }

  clear() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  resize() {
    this.setupCanvas();
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    // Clean up WebGL resources
    Object.values(this.buffers).forEach(buffer => {
      this.gl.deleteBuffer(buffer);
    });
    
    if (this.program) {
      this.gl.deleteProgram(this.program);
    }
  }
}

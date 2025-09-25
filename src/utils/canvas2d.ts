export class Canvas2DRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationId: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Unable to get 2D rendering context');
    }
    this.ctx = context;
    this.setupCanvas();
  }

  private setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    
    this.ctx.scale(dpr, dpr);
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
  }

  // Draw server rack visualization
  drawServerRack(x: number, y: number, width: number, height: number, isActive: boolean = false) {
    const ctx = this.ctx;
    
    // Main rack frame
    ctx.fillStyle = isActive ? '#1e293b' : '#0f172a';
    ctx.fillRect(x, y, width, height);
    
    // Server units
    const unitHeight = height / 8;
    for (let i = 0; i < 8; i++) {
      const unitY = y + i * unitHeight;
      
      // Server unit background
      ctx.fillStyle = isActive ? '#334155' : '#1e293b';
      ctx.fillRect(x + 5, unitY + 2, width - 10, unitHeight - 4);
      
      // LED indicators
      const ledColors = isActive ? ['#10b981', '#f59e0b', '#ef4444'] : ['#374151', '#374151', '#374151'];
      ledColors.forEach((color, index) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x + 15 + index * 8, unitY + unitHeight / 2, 2, 0, 2 * Math.PI);
        ctx.fill();
      });
      
      // Ventilation grilles
      ctx.strokeStyle = isActive ? '#64748b' : '#374151';
      ctx.lineWidth = 1;
      for (let j = 0; j < 4; j++) {
        ctx.beginPath();
        ctx.moveTo(x + width - 30 + j * 5, unitY + 3);
        ctx.lineTo(x + width - 30 + j * 5, unitY + unitHeight - 3);
        ctx.stroke();
      }
    }
    
    // Power indicator
    if (isActive) {
      ctx.fillStyle = '#10b981';
      ctx.fillRect(x + width - 8, y + 5, 3, 15);
    }
  }

  // Draw data flow lines
  drawDataFlow(points: { x: number; y: number }[], progress: number, color: string = '#3b82f6') {
    const ctx = this.ctx;
    
    if (points.length < 2) return;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    const totalLength = points.length - 1;
    const currentProgress = progress * totalLength;
    const currentIndex = Math.floor(currentProgress);
    const segmentProgress = currentProgress - currentIndex;
    
    for (let i = 0; i < Math.min(currentIndex + 1, points.length - 1); i++) {
      if (i === currentIndex && segmentProgress > 0) {
        // Animate the current segment
        const x = points[i].x + (points[i + 1].x - points[i].x) * segmentProgress;
        const y = points[i].y + (points[i + 1].y - points[i].y) * segmentProgress;
        ctx.lineTo(x, y);
      } else if (i < currentIndex) {
        ctx.lineTo(points[i + 1].x, points[i + 1].y);
      }
    }
    
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Draw circuit board pattern
  drawCircuitBoard(x: number, y: number, width: number, height: number, density: number = 0.3) {
    const ctx = this.ctx;
    const gridSize = 20;
    
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    
    // Grid lines
    for (let i = 0; i <= width; i += gridSize) {
      if (Math.random() < density) {
        ctx.beginPath();
        ctx.moveTo(x + i, y);
        ctx.lineTo(x + i, y + height);
        ctx.stroke();
      }
    }
    
    for (let j = 0; j <= height; j += gridSize) {
      if (Math.random() < density) {
        ctx.beginPath();
        ctx.moveTo(x, y + j);
        ctx.lineTo(x + width, y + j);
        ctx.stroke();
      }
    }
    
    // Circuit nodes
    ctx.fillStyle = '#3b82f6';
    for (let i = 0; i < width; i += gridSize) {
      for (let j = 0; j < height; j += gridSize) {
        if (Math.random() < density * 0.5) {
          ctx.beginPath();
          ctx.arc(x + i, y + j, 2, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }
  }

  // Animate particle systems
  animateParticles(particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    color: string;
  }>) {
    const ctx = this.ctx;
    
    particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 2 * alpha, 0, 2 * Math.PI);
      ctx.fill();
      
      // Update particle
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 1;
    });
    
    ctx.globalAlpha = 1;
    
    // Remove dead particles
    return particles.filter(p => p.life > 0);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  resize() {
    this.setupCanvas();
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

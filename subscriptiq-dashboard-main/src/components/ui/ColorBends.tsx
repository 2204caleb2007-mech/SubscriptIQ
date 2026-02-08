import React, { useRef, useEffect } from 'react';

interface ColorBendsProps {
    rotation?: number;
    speed?: number;
    colors?: string[];
    transparent?: boolean;
    autoRotate?: number;
    scale?: number;
    frequency?: number;
    warpStrength?: number;
    mouseInfluence?: number;
    parallax?: number;
    noise?: number;
}

export const ColorBends: React.FC<ColorBendsProps> = ({
    rotation = 45,
    speed = 0.2,
    colors = ["#5227FF", "#FF9FFC", "#7cff67", "#ffffff"],
    transparent = true,
    autoRotate = 0,
    scale = 1,
    frequency = 1,
    warpStrength = 1,
    mouseInfluence = 1,
    parallax = 0.5,
    noise = 0.1,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl');
        if (!gl) return;

        const hexToRgb = (hex: string) => {
            const r = parseInt(hex.slice(1, 3), 16) / 255;
            const g = parseInt(hex.slice(3, 5), 16) / 255;
            const b = parseInt(hex.slice(5, 7), 16) / 255;
            return [r, g, b];
        };

        const rgbColors = colors.map(hexToRgb);

        const vertexShaderSource = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

        const fragmentShaderSource = `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform vec3 uColors[4];
      uniform float uRotation;
      uniform float uWarpStrength;
      uniform float uFrequency;
      uniform float uNoise;

      // Simple noise function
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);
        
        // Rotation
        float angle = uRotation * 0.0174533 + uTime * 0.1;
        mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
        uv = rot * uv;

        // Warp effect
        for(float i = 1.0; i < 4.0; i++) {
          uv.x += uWarpStrength * 0.1 / i * sin(i * uFrequency * uv.y + uTime + noise(uv * 0.1) * uNoise);
          uv.y += uWarpStrength * 0.1 / i * cos(i * uFrequency * uv.x + uTime + noise(uv * 0.2) * uNoise);
        }

        float pattern = sin(uv.x * uFrequency + uv.y * uFrequency + uTime) * 0.5 + 0.5;
        
        vec3 color = mix(uColors[0], uColors[1], pattern);
        color = mix(color, uColors[2], sin(uTime * 0.5) * 0.5 + 0.5);
        color = mix(color, uColors[3], noise(uv + uTime) * 0.1);

        gl_FragColor = vec4(color, ${transparent ? '0.8' : '1.0'});
      }
    `;

        const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const program = gl.createProgram();
        if (!program) return;
        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        if (!vertexShader || !fragmentShader) return;

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        const timeLoc = gl.getUniformLocation(program, 'uTime');
        const resLoc = gl.getUniformLocation(program, 'uResolution');
        const colorsLoc = gl.getUniformLocation(program, 'uColors');
        const warpLoc = gl.getUniformLocation(program, 'uWarpStrength');
        const freqLoc = gl.getUniformLocation(program, 'uFrequency');
        const rotLoc = gl.getUniformLocation(program, 'uRotation');
        const noiseLoc = gl.getUniformLocation(program, 'uNoise');

        let animationFrameId: number;
        const render = (time: number) => {
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.uniform1f(timeLoc, time * 0.001 * speed);
            gl.uniform2f(resLoc, canvas.width, canvas.height);
            gl.uniform1f(warpLoc, warpStrength);
            gl.uniform1f(freqLoc, frequency);
            gl.uniform1f(rotLoc, rotation);
            gl.uniform1f(noiseLoc, noise);

            const flatColors = new Float32Array(rgbColors.flat());
            gl.uniform3fv(colorsLoc, flatColors);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            animationFrameId = requestAnimationFrame(render);
        };

        const handleResize = () => {
            canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
            canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, [colors, speed, warpStrength, frequency, rotation, noise]);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full block opacity-80"
            style={{ filter: 'blur(40px)', transform: `scale(${scale * 1.5})` }}
        />
    );
};

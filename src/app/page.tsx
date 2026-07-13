"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0B0B0C] text-[#e4e1e5]">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
          <p className="text-sm font-medium tracking-wide">Loading Strata...</p>
        </div>
      </div>
    );
  }

  const handleActionClick = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      signIn("github");
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0B0C] text-[#e4e1e5] relative overflow-hidden font-body-md selection:bg-[#c8c6c7]/20 selection:text-[#e4e1e5] flex flex-col justify-between">

      <div
        className="pointer-events-none fixed inset-0 z-[2] transition-opacity duration-300 opacity-0 md:opacity-100"
        style={{
          background: `radial-gradient(200px at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.05), transparent 85%)`,
        }}
      />


      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <WebGLBackground />
      </div>


      <div className="fixed inset-0 z-[1] bg-[linear-gradient(to_right,#8080800d_1px,transparent_1px),linear-gradient(to_bottom,#8080800d_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>


      <nav className="fixed top-0 right-0 left-0 h-16 z-50 flex items-center justify-between px-8 border-b border-outline-variant bg-[#0b0b0c]/80 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-on-surface rounded flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-background text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>layers</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-on-surface">Strata</span>
          </div>
          <div className="hidden md:flex gap-6">
            <span className="text-xs font-semibold text-on-surface hover:text-primary transition-colors cursor-default">Product</span>
            <span className="text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors cursor-default">Solutions</span>
            <span className="text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors cursor-default">Docs</span>
            <span className="text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors cursor-default">Pricing</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {session ? (
            <button
              onClick={() => router.push("/dashboard")}
              className="text-xs font-semibold bg-on-surface text-background px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all cursor-pointer shadow-lg"
            >
              Go to Dashboard
            </button>
          ) : (
            <button
              onClick={() => signIn("github")}
              className="text-xs font-semibold bg-on-surface text-background px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all cursor-pointer shadow-lg"
            >
              Connect your GitHub
            </button>
          )}
        </div>
      </nav>


      <section className="max-w-[1200px] mx-auto px-8 pt-36 pb-20 text-center relative overflow-hidden z-10">
        <div className="inline-flex items-center gap-2 border border-outline-variant px-3 py-1 rounded-full mb-8 bg-surface-container/50 backdrop-blur-sm shadow-md animate-fade-in-up">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-mono-code font-medium text-on-surface-variant">Now integrated with GitHub Enterprise</span>
        </div>

        <h1
          className="text-4xl md:text-7xl leading-[1.1] mb-6 font-extrabold tracking-tighter text-on-surface animate-fade-in-up"
          style={{ animationDelay: "100ms", animationFillMode: "backwards" }}
        >
          The Architectural Brain <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-outline to-[#e4e1e5]/20">for Your Repositories.</span>
        </h1>

        <p
          className="text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed font-medium animate-fade-in-up"
          style={{ animationDelay: "200ms", animationFillMode: "backwards" }}
        >
          Harness AST-level analysis and vector-based retrieval to map complex dependencies instantly. Stop searching through endless files; start querying your system's structural DNA.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-in-up"
          style={{ animationDelay: "300ms", animationFillMode: "backwards" }}
        >
          <button
            onClick={handleActionClick}
            className="w-full sm:w-auto h-12 px-8 bg-on-surface text-background font-semibold rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(255,255,255,0.1)] cursor-pointer"
          >
            {session ? "Go to Dashboard" : "Start Indexing Free"}
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
          <button className="w-full sm:w-auto h-12 px-8 border border-outline-variant bg-surface-container/50 backdrop-blur-sm text-on-surface font-semibold rounded-lg hover:bg-surface-container-low transition-all flex items-center justify-center gap-2 cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">play_circle</span>
            Watch the Deep Dive
          </button>
        </div>
      </section>


      <section className="max-w-[1200px] mx-auto px-8 py-20 z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 auto-rows-fr">
          

          <div
            className="glass-card feature-card p-8 rounded-2xl flex flex-col gap-4 border border-outline-variant bg-surface-container/40 backdrop-blur-md md:col-span-2 md:row-span-2 relative overflow-hidden group animate-fade-in-up"
            style={{ animationDelay: "400ms", animationFillMode: "backwards" }}
          >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#c8c6c7]/5 rounded-full blur-3xl group-hover:bg-[#c8c6c7]/10 transition-colors duration-700"></div>
            <div className="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center border border-outline-variant/50 shadow-sm mb-2">
              <span className="material-symbols-outlined text-primary text-[24px]">psychology</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight">Contextual RAG</h3>
            <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">
              Beyond keywords. Semantic understanding of interfaces, traits, and dependencies through deep AST-level analysis.
            </p>
            <div className="mt-auto pt-8">
              <div className="bg-[#0B0B0C] rounded-lg p-4 font-mono-code text-[12px] text-on-surface-variant/70 border border-outline-variant/30 flex flex-col gap-2 shadow-inner">
                <span className="text-primary/70">// Vector query analysis</span>
                <span>&gt; Querying semantic graph...</span>
                <span className="text-primary">&gt; Found 14 architectural correlations</span>
              </div>
            </div>
          </div>


          <div
            className="glass-card feature-card p-8 rounded-2xl flex flex-col gap-4 border border-outline-variant bg-surface-container/40 backdrop-blur-md md:col-span-2 md:row-span-1 relative overflow-hidden group animate-fade-in-up"
            style={{ animationDelay: "550ms", animationFillMode: "backwards" }}
          >
            <div className="w-10 h-10 bg-surface-container-high rounded-lg flex items-center justify-center border border-outline-variant/50 mb-1">
              <span className="material-symbols-outlined text-primary text-[20px]">account_tree</span>
            </div>
            <h3 className="text-xl font-bold tracking-tight">Live Graphing</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Visualize your architecture as it evolves with every PR. Spot circular dependencies instantly.
            </p>
          </div>


          <div
            className="glass-card feature-card p-8 rounded-2xl flex flex-col gap-4 border border-outline-variant bg-surface-container/40 backdrop-blur-md md:col-span-1 md:row-span-1 animate-fade-in-up"
            style={{ animationDelay: "700ms", animationFillMode: "backwards" }}
          >
            <div className="w-10 h-10 bg-surface-container-high rounded-lg flex items-center justify-center border border-outline-variant/50 mb-1">
              <span className="material-symbols-outlined text-primary text-[20px]">groups</span>
            </div>
            <h3 className="text-xl font-bold tracking-tight">Team Intelligence</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Onboard engineers in minutes, not weeks, by chatting with your code.
            </p>
          </div>


          <div
            className="glass-card feature-card p-8 rounded-2xl flex flex-col gap-4 border border-outline-variant bg-surface-container/40 backdrop-blur-md md:col-span-1 md:row-span-1 animate-fade-in-up"
            style={{ animationDelay: "850ms", animationFillMode: "backwards" }}
          >
            <div className="w-10 h-10 bg-surface-container-high rounded-lg flex items-center justify-center border border-outline-variant/50 mb-1">
              <span className="material-symbols-outlined text-primary text-[20px]">shield</span>
            </div>
            <h3 className="text-xl font-bold tracking-tight">Security & Privacy</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              SOC2 compliant infrastructure with robust local-first indexing options.
            </p>
          </div>

        </div>
      </section>


      <section className="max-w-[1200px] mx-auto px-8 py-24 z-10 w-full">
        <div className="glass-card rounded-3xl p-16 text-center border border-outline-variant relative overflow-hidden group bg-surface-container/30 backdrop-blur-lg shadow-2xl">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-gradient-to-br from-primary/30 to-transparent"></div>
          <h2 className="text-4xl mb-6 font-bold tracking-tight">Ready to index your architecture?</h2>
          <p className="text-on-surface-variant mb-10 max-w-lg mx-auto text-base">
            Deploy the architectural brain to your repositories today and eliminate technical debt before it merges.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleActionClick}
              className="h-12 px-8 bg-on-surface text-background font-semibold rounded-lg hover:opacity-90 transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] cursor-pointer"
            >
              Start Indexing Free
            </button>
            <button className="h-12 px-8 border border-outline-variant text-on-surface bg-surface-container/50 font-semibold rounded-lg hover:bg-surface-container-low transition-all cursor-pointer">
              Talk to Sales
            </button>
          </div>
        </div>
      </section>


      <footer className="border-t border-outline-variant/40 py-16 px-8 bg-background relative z-10">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-on-surface rounded flex items-center justify-center">
                <span className="material-symbols-outlined text-background text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>layers</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-on-surface">Strata</span>
            </div>
            <p className="text-on-surface-variant max-w-xs text-[13px] leading-relaxed">
              Building the future of software understanding. Powered by advanced RAG systems.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 text-sm">
            <div className="flex flex-col gap-4">
              <span className="text-[11px] font-mono-code font-bold uppercase tracking-widest text-outline">Product</span>
              <span className="text-on-surface-variant hover:text-on-surface transition-colors cursor-default">Features</span>
              <span className="text-on-surface-variant hover:text-on-surface transition-colors cursor-default">Security</span>
              <span className="text-on-surface-variant hover:text-on-surface transition-colors cursor-default">API</span>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[11px] font-mono-code font-bold uppercase tracking-widest text-outline">Resources</span>
              <span className="text-on-surface-variant hover:text-on-surface transition-colors cursor-default">Docs</span>
              <span className="text-on-surface-variant hover:text-on-surface transition-colors cursor-default">Guides</span>
              <span className="text-on-surface-variant hover:text-on-surface transition-colors cursor-default">Community</span>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[11px] font-mono-code font-bold uppercase tracking-widest text-outline">Legal</span>
              <span className="text-on-surface-variant hover:text-on-surface transition-colors cursor-default">Privacy</span>
              <span className="text-on-surface-variant hover:text-on-surface transition-colors cursor-default">Terms</span>
              <span className="text-on-surface-variant hover:text-on-surface transition-colors cursor-default">Compliance</span>
            </div>
          </div>

        </div>

        <div className="max-w-[1200px] mx-auto mt-16 pt-8 border-t border-outline-variant/30 flex flex-col sm:flex-row justify-between text-on-surface-variant text-xs gap-4">
          <span>© {new Date().getFullYear()} Strata Intelligence Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <span className="hover:text-on-surface cursor-default">Twitter</span>
            <span className="hover:text-on-surface cursor-default">GitHub</span>
            <span className="hover:text-on-surface cursor-default">LinkedIn</span>
          </div>
        </div>
      </footer>
    </main>
  );
}


function WebGLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;


    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;

      float grid(vec2 st, float res) {
        vec2 grid = sin(st * 3.14159265 * res);
        return (1.0 - smoothstep(0.0, 0.03, grid.x)) * (1.0 - smoothstep(0.0, 0.03, grid.y));
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        st.x *= u_resolution.x / u_resolution.y;

        // Slow morphing animation offsets
        vec2 grid_st = st + vec2(sin(u_time * 0.03) * 0.05, cos(u_time * 0.03) * 0.05);
        float val = grid(grid_st, 14.0);

        // Soft ambient vignette glows
        float glow1 = 1.0 - length(st - vec2(0.5, 0.5 + sin(u_time * 0.05) * 0.05));
        glow1 = pow(max(glow1, 0.0), 3.5) * 0.3;

        vec3 color = vec3(0.043, 0.043, 0.047); // Dark mode bg
        
        // Add subtle grid glow
        color += vec3(0.2, 0.22, 0.28) * val * (0.05 + sin(u_time * 0.1) * 0.03);
        color += vec3(0.3, 0.25, 0.45) * glow1; // Purple hue glow

        gl_FragColor = vec4(color, 1.0);
      }
    `;


    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;


    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Setup viewport attributes
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0,
      ]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");

    // Handle resizing
    const resize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };
    window.addEventListener("resize", resize);
    resize();

    // Render loop
    let animId: number;
    const render = (time: number) => {
      if (gl.getUniformLocation(program, "u_resolution")) {
        gl.uniform2f(uResolution, canvas.width, canvas.height);
      }
      gl.uniform1f(uTime, time * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(render);
    };
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}

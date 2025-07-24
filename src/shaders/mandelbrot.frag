// Colorful Mandelbrot Set visualization
// Based on "Mandelbrot - distance" by Inigo Quilez - 2013
// https://www.shadertoy.com/view/lsX3W4
// Enhanced with color palette for more vibrant visualization

precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

// Color palette for vibrant Mandelbrot coloring
vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.30, 0.20, 0.20);
    return a + b * cos(6.28318 * (c * t + d));
}

// Distance to Mandelbrot Set
float distanceToMandelbrot(in vec2 c) {
    // Optimization: skip computation inside main bulbs
    float c2 = dot(c, c);
    if(256.0*c2*c2 - 96.0*c2 + 32.0*c.x - 3.0 < 0.0) return 0.0;
    if(16.0*(c2+2.0*c.x+1.0) - 1.0 < 0.0) return 0.0;

    // Mandelbrot iteration
    float di = 1.0;
    vec2 z = vec2(0.0);
    float m2 = 0.0;
    vec2 dz = vec2(0.0);
    
    for(int i = 0; i < 300; i++) {
        if(m2 > 1024.0) { 
            di = 0.0; 
            break; 
        }
        dz = 2.0 * vec2(z.x*dz.x - z.y*dz.y, z.x*dz.y + z.y*dz.x) + vec2(1.0, 0.0);
        z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
        m2 = dot(z, z);
    }

    float d = 0.5 * sqrt(dot(z, z) / dot(dz, dz)) * log(dot(z, z));
    if(di > 0.5) d = 0.0;
    
    return d;
}

void main() {
    vec2 p = (2.0 * gl_FragCoord.xy - u_resolution.xy) / u_resolution.y;

    // Animated zoom
    float tz = 0.5 - 0.5 * cos(0.225 * u_time);
    float zoo = pow(0.5, 13.0 * tz);
    vec2 c = vec2(-0.05, 0.6805) + p * zoo;

    // Get distance to Mandelbrot set
    float d = distanceToMandelbrot(c);
    
    // Create multiple color bands based on distance
    float d0 = clamp(pow(4.0 * d / zoo, 0.2), 0.0, 1.0);
    float d1 = clamp(pow(8.0 * d / zoo, 0.15), 0.0, 1.0);
    float d2 = clamp(pow(16.0 * d / zoo, 0.1), 0.0, 1.0);
    
    // Create colorful visualization
    vec3 col = vec3(0.0);
    
    // Inner glow (closest to set)
    col += palette(d0 * 5.0 + u_time * 0.2) * (1.0 - d0) * 0.5;
    
    // Middle bands
    col += palette(d1 * 3.0 + u_time * 0.15 + 0.5) * d1 * (1.0 - d0);
    
    // Outer bands
    col += palette(d2 * 2.0 + u_time * 0.1 + 1.0) * d2 * 0.7;
    
    // Add subtle edge highlighting
    float edge = abs(d1 - d0);
    col += vec3(1.0, 0.8, 0.6) * edge * 2.0;
    
    // Brighten the result
    col = pow(col, vec3(0.8));
    
    gl_FragColor = vec4(col, 1.0);
}
// https://www.shadertoy.com/view/tsVyDt and https://www.shadertoy.com/view/wlGGWG

precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

// Theme uniforms
uniform float u_isDark;
uniform float u_baseBrightness;
uniform float u_lightMultiplier;
uniform float u_baseColorMultiplier;
uniform float u_mouseSpotlightIntensity;
uniform float u_whitePoint;
uniform float u_mouseSpotRadius;
uniform float u_mouseSpotFalloff;
uniform vec3 u_primaryColor;
uniform float u_patternScale;
uniform float u_resizeScale;
uniform float u_centerSpotlightIntensity;
uniform float u_centerSpotRadius;
uniform float u_centerSpotFalloff;

#define PI      3.14159265357989
#define TAU     (PI * 2.0)
#define HEX_COS (0.86602540378443 * 0.5)
#define HEX_TAN (0.57735026918962 * 0.5)

mat2 rotate(float angle) {
  float s = sin(angle), c = cos(angle);
  return mat2(c, -s, s, c);
}

vec2 pmod(vec2 pos, float num, out float id) {
  float angle = atan(pos.x, pos.y) + PI / num;
  float split = TAU / num;
  id = floor(angle / split);
  angle = id * split;
  return rotate(-angle) * pos;
}

// for normal
vec4 normalmap(vec2 uv) {
  vec2 point = vec2(0);
  vec3 near = vec3(1e+4);
  vec3 neighbor = vec3(1e+4);
  
  for(float y=-1.0; y<=1.0; y+=2.0) {
    point = vec2(0.0, HEX_COS + y * HEX_TAN * 0.5);
    float dist = distance(uv, point);
    near = near.z < dist ? near : vec3(point, dist);
  }
  
  for(float y=-1.0; y<=1.0; y+=2.0) {
    point = vec2(0.0, HEX_COS + y * HEX_TAN * 0.5);
    if(near.xy != point) {
      vec2 center = (point + near.xy) * 0.5;
      float dist = dot(uv - center, normalize(near.xy - point));
      neighbor = neighbor.z < dist ? neighbor : vec3(point, dist);
    }
  }
  
  for(float x=-1.0; x<=1.0; x+=2.0) {
    for(float y=-1.0; y<=1.0; y+=2.0) {
      point = vec2(x * 0.25, HEX_COS - y * (HEX_COS - HEX_TAN * 0.5));
      vec2 center = (point + near.xy) * 0.5;
      float dist = dot(uv - center, normalize(near.xy - point));
      neighbor = neighbor.z < dist ? neighbor : vec3(point, dist);
    }
  }
  
  return vec4(normalize(vec3(neighbor.xy - near.xy, 1.0)), neighbor.z);
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  vec2 iResolution = u_resolution;
  float iTime = u_time;
  vec2 iMouse = u_mouse;
  
  // Calculate aspect ratio for mobile detection
  float aspectRatio = iResolution.x / iResolution.y;
  
  // Use aspect ratio to create a smooth scale modifier
  // When aspect < 1 (portrait), apply more scaling adjustment
  float aspectModifier = smoothstep(0.5, 1.5, aspectRatio);
  
  // Adjust UV calculation based on aspect ratio
  float scaleDivisor = min(iResolution.x, iResolution.y);
  float avgDimension = (iResolution.x + iResolution.y) * 0.5;
  
  // Blend between min dimension and average based on aspect ratio and resize scale setting
  scaleDivisor = mix(scaleDivisor, avgDimension, (1.0 - aspectModifier) * u_resizeScale);
  
  vec2 uv = (fragCoord.xy * 2.0 - iResolution.xy) / scaleDivisor;
  
  // Subtle animations (no mouse influence on geometry)
  float screenScale = u_patternScale + sin(iTime * 0.1) * 0.3;
  float screenAngle = PI * 0.166667 - iTime * 0.05;
  vec2 screenOffset = vec2(0, 0);

  // Apply transformations
  uv *= screenScale;
  uv += screenOffset;
  uv = rotate(screenAngle) * uv;

  // Tiling
  vec2 uvLocal = uv;
  uvLocal.x = mod(uv.x, 1.0) - 0.5;
  uvLocal.y = mod(uv.y, HEX_COS * 2.0) - HEX_COS;
  
  // Rot tiling
  float id;
  uvLocal = pmod(uvLocal, 6.0, id);

  // Get normal map
  vec4 normal = normalmap(uvLocal);
  // Rotate normals back to local space, then to world space
  normal.xy = rotate(id * PI / 3.0) * normal.xy;
  // Undo the screen rotation to keep normals in world space
  normal.xy = rotate(-screenAngle) * normal.xy;
  
  float dist = normal.w;
  dist = 1.0 - pow(1.0 - dist, 20.0);

  // Fixed light source from top-right
  vec3 lightDir = normalize(vec3(1.0, 1.0, 0.5));
  float light = dot(normal.xyz, lightDir) * 0.8 + 0.2;
  
  // Theme-aware base darkness
  bool isDark = u_isDark > 0.5;
  
  float solid = (dist * light) * u_lightMultiplier + u_baseBrightness;
  
  // Apply different curves for dark vs light mode
  if (isDark) {
    solid = 1.0 - pow(1.0 - solid, 3.0);
  } else {
    // Light mode: use a gentler curve and add white point adjustment
    solid = 1.0 - pow(1.0 - solid, 1.5);
    solid = solid + (1.0 - solid) * u_whitePoint;
  }
  
  // Calculate mouse position in UV space (use same scaling as UV)
  vec2 mouseNorm = (iMouse * 2.0 - iResolution.xy) / scaleDivisor;
  mouseNorm *= screenScale;
  mouseNorm = rotate(screenAngle) * mouseNorm;
  
  // Mouse spotlight
  float mouseSpotDistance = distance(uv, mouseNorm);
  // Use radius directly in UV space (constant screen size regardless of pattern scale)
  float mouseSpotRadius = u_mouseSpotRadius;
  float mouseSpotFalloff = 1.0 - smoothstep(0.0, mouseSpotRadius, mouseSpotDistance);
  mouseSpotFalloff = pow(mouseSpotFalloff, u_mouseSpotFalloff);
  
  // Center spotlight (fixed at center)
  vec2 centerPos = vec2(0.0, 0.0); // Center in UV space
  float centerSpotDistance = distance(uv, centerPos);
  // Use radius directly in UV space (constant screen size regardless of pattern scale)
  float centerSpotRadius = u_centerSpotRadius;
  float centerSpotFalloff = 1.0 - smoothstep(0.0, centerSpotRadius, centerSpotDistance);
  centerSpotFalloff = pow(centerSpotFalloff, u_centerSpotFalloff);
  
  // Base color (theme-aware)
  vec3 fragColor = vec3(solid * u_baseColorMultiplier);
  
  // Add center spotlight (constant white light)
  fragColor += vec3(1.0) * centerSpotFalloff * u_centerSpotlightIntensity;
  
  // Add mouse spotlight with primary color
  fragColor += u_primaryColor * mouseSpotFalloff * solid * u_mouseSpotlightIntensity;
  
  // Degamma
  fragColor = pow(fragColor, vec3(1.0 / 2.2));
  
  gl_FragColor = vec4(fragColor, 1.0);
}
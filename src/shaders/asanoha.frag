// https://www.shadertoy.com/view/tsVyDt and https://www.shadertoy.com/view/wlGGWG

precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

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
  
  vec2 uv = (fragCoord.xy * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y);
  
  // Subtle animations (no mouse influence on geometry)
  float screenScale = 2.0 + sin(iTime * 0.1) * 0.3; // More noticeable zoom: 1.7 to 2.3
  float screenAngle = PI * 0.166667 - iTime * 0.05; // Slow rotation - reversed direction
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
  vec3 lightDir = normalize(vec3(1.0, 1.0, 0.5)); // top-right direction
  float light = dot(normal.xyz, lightDir) * 0.8 + 0.2;
  
  // Darken the base scene even more
  float solid = (dist * light) * 0.15 + 0.03;
  solid = 1.0 - pow(1.0 - solid, 3.0);
  
  // Calculate mouse position in UV space, then transform it to match the shader's coordinate system
  vec2 mouseNorm = (iMouse * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y);
  // Apply the same transformations as the geometry
  mouseNorm *= screenScale;
  mouseNorm = rotate(screenAngle) * mouseNorm;
  
  // Green spotlight effect - 160% of viewport width (doubled)
  float spotDistance = distance(uv, mouseNorm);
  // Calculate radius as percentage of viewport width in UV space
  float aspectRatio = iResolution.x / iResolution.y;
  float viewportWidthInUV = 2.0 * max(1.0, aspectRatio);
  float spotRadius = viewportWidthInUV * 1.6; // 160% of viewport width (doubled from 0.8)
  float spotFalloff = 1.0 - smoothstep(0.0, spotRadius, spotDistance);
  spotFalloff = pow(spotFalloff, 2.5); // Softer falloff
  
  // Base color (darkened more)
  vec3 fragColor = vec3(solid * 0.5);
  
  // Add green spotlight - slightly brighter
  vec3 spotColor = vec3(0.3, 1.0, 0.4); // Brighter green tint
  fragColor += spotColor * spotFalloff * solid * 1.0; // Increased from 0.8 to 1.0
  
  // Vignette effect
  vec2 screenUV = fragCoord.xy / iResolution.xy;
  vec2 vignetteUV = screenUV * (1.0 - screenUV);
  float vignette = vignetteUV.x * vignetteUV.y * 15.0;
  vignette = pow(vignette, 0.25);
  fragColor *= vignette;
  
  // Degamma
  fragColor = pow(fragColor, vec3(1.0 / 2.2));
  
  gl_FragColor = vec4(fragColor, 1.0);
}
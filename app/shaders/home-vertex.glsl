#define PI 3.1415926535897932384626433832795

attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec2 uViewPortSizes;
uniform float uSpeed;

varying vec2 vUv;

void main() {
  vUv = uv;

  vec4 newPosition = modelViewMatrix * vec4(position, 1.0);

  newPosition.z -= (sin(newPosition.y / uViewPortSizes.y * PI + PI / 2.0) + sin(newPosition.x / uViewPortSizes.x * PI + PI / 2.0)) * abs(uSpeed);

  gl_Position = projectionMatrix * newPosition;
}
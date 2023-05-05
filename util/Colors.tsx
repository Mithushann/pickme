
function interpolateColor(color1: number[], color2: number[], factor: number): number[] {
    const result = [];
    for (let i = 0; i < color1.length; i++) {
      result[i] = Math.round(color1[i] + (color2[i] - color1[i]) * factor);
    }
    return result;
  }
  
  function color() {
    const blue = [0, 0, 255]; // RGB value of blue
    const red = [255, 0, 0]; // RGB value of red
  
    const colorScale = [];
    for (let i = 0; i < 10; i++) {
      const factor = i / 5; // factor ranges from 0 to 1
      const color = interpolateColor(blue, red, factor);
      colorScale.push(color);
    }
    return colorScale;
  }

  export { color}
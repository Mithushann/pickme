// A function that visualizes the traffic light given d3 svg element, x and y coordinates, and the color of the light
function drawTrafficLight(svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>, x: number, y: number, color: string) {
    svg.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 3)
        .attr("fill", color);
}

function generateNumber(): number {
    // generate a random number between 0 and 10
    return Math.floor(Math.random() * 1000);

}

function randomIntFromInterval(arg0: number, arg1: number): number {
    //create random number between two numbers
    return Math.floor(Math.random() * (arg1 - arg0 + 1) + arg0);

}


export { drawTrafficLight, generateNumber, randomIntFromInterval}
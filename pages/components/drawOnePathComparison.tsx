import * as d3 from "d3";
import axios from "axios";
import print from 'util/print';
import { getAllCords, getCords } from "pages/api/getData";
import { useEffect } from "react";

async function drawWithDelay(svg: any, data: any, xScale: any, yScale: any) {
    if (data.length === 0) {
        return;
    }

    for (let i = 0; i < data.length; i++) {

        let routeTrajectories = data[i].routeTrajectories;
        let timeForEachRoute = data[i].finishTime * 10;

        const colors = ["#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231"];

        svg.selectAll("path.route").remove();
        svg.selectAll("circle").remove();
        svg
            .selectAll("route")
            .data([routeTrajectories])
            .enter()
            .append("path")
            .attr("class", "route")
            .attr("fill", "none")
            .attr("stroke", colors[0])
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 3)
            .attr("d", d3.line()
                .x((d) => xScale(Number(d.xCoor)))
                .y((d) => yScale(Number(d.yCoor)))
            );

        d3.selectAll("path.route").raise();
        const path = svg.selectAll("path.route");

        path
            .style("stroke", "none")
            .style("fill", "none");

        // Define the icon
        var icon = svg.append("circle")
            .attr("r", 5)
            .style("fill", "red");

        // Animate the icon along the path
        var totalLength = path.node().getTotalLength();
        icon.transition()
            .duration(timeForEachRoute)
            .attrTween("transform", function () {
                return function (t) {
                    var p = path.node().getPointAtLength(t * totalLength);
                    return "translate(" + p.x + "," + p.y + ")";
                }
            });

        await new Promise(resolve => setTimeout(resolve, timeForEachRoute));
    }
}

// async function draw(svg: any, data: any, shelves:any, xScale: any, yScale: any) {
//     if (data.length === 0 || shelves.size === 0) {
//         return;
//     }
    
//     console.log("------------------")
//     data.map((element: { shelfId: string; }, index: number) => {
//         let key = element.shelfId.split("-")[0]+"-"+element.shelfId.split("-")[1]
//         let shelf = shelves.get(key)

//         // add circle for each shelf

//         svg.selectAll(".routeCircle") // Update the selection to include a dot before the class name
//         .data([shelf]) // Use the data for binding
//         .enter() // Enter the data selection
//         .append("circle") // Append a circle for each data point
//         .attr("class", "routeCircle")
//         .attr("cx", xScale(shelf.xCoor))
//         .attr("cy", yScale(shelf.yCoor))
//         .attr("r", 5)
//         .style("fill", "red")
//         .style("stroke", "black")
//         .style("stroke-width", 1);

//         // add text for each shelf
//         svg.append("text")
//             .attr("x", xScale(shelf.xCoor))
//             .attr("y", yScale(shelf.yCoor))
//             .text(index+1)
//             .style("font-size", "10px")
//             .style("font-weight", "bold")
//             .style("fill", "black")
//             .style("text-anchor", "middle")
//             .style("alignment-baseline", "middle");

//             console.log("Shelf: ", index+1, " ", shelf.xCoor, " ", shelf.yCoor)
        

//         svg.selectAll(".routeCircle").raise() // Update the selection to include a dot before the class name
//     })
//     console.log("------------------")

//     await new Promise(resolve => setTimeout(resolve, 1000));

// }
async function draw(svg: any, data: any, shelves: any, xScale: any, yScale: any) {
    if (data.length === 0 || shelves.size === 0) {
        return;
    }

    // Clear existing circles before appending new ones
    svg.selectAll("circle").remove();

    let shel: any[] = [];
    data.forEach((element: { shelfId: string }, index: number) => {
        let key = element.shelfId.split("-")[0] + "-" + element.shelfId.split("-")[1];
        shel.push(shelves.get(key));
    });

    // Append circle for each shelf using the array shel
    svg.selectAll("circle")
        .data(shel)
        .enter()
        .append("circle")
        .attr("class", "routeCircle")
        .attr("cx", (d: any) => xScale(d.xCoor))
        .attr("cy", (d: any) => yScale(d.yCoor))
        .attr("r", 5)
        .style("fill", "red")
        .style("stroke", "black")
        .style("stroke-width", 1);


    await new Promise(resolve => setTimeout(resolve, 1000));
}



export default async function drawOnePathComparison(
    svgRef: React.MutableRefObject<SVGSVGElement | null>,
    data: any,
    shelves: any,
    inWidth: number,
    inHeight: number) {

    // console.log("Data: ", data[0])
    const xmin = -74
    const xmax = 37.5
    const ymin = -40
    const ymax = 39.5

    const xScale = d3.scaleLinear().domain([xmin, xmax + 11]).range([0, inWidth]);
    const yScale = d3.scaleLinear().domain([ymin, ymax]).range([inHeight, 0]);

    const svg = d3.select(svgRef.current)
        .attr("width", inWidth)
        .attr("height", inHeight)
        .style("margin-top", 0)
        .style("margin-left", 0);

        
data.map(async (element) => {
    // console.log("Element: ", element.routeStops)
    await draw(svg, element.routeStops, shelves,  xScale, yScale);
})
}
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
        let timeForEachRoute = data[i].finishTime*10;

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

export default async function drawOnePathComparison(
    svgRef: React.MutableRefObject<SVGSVGElement | null>,
    data: any,
    inWidth: number,
    inHeight: number) {

        console.log("Data: ", data)
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

        drawWithDelay(svg, data, xScale, yScale);

}
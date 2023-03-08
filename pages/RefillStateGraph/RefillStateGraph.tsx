import * as React from "react";
import * as d3 from "d3";
import axios from "axios";
import Layout from "../components/Layout";
import print from 'util/print';
import { getAllCords, getCords } from "pages/api/getData";

// A function that visualizes the traffic light given d3 svg element, x and y coordinates, and the color of the light
function drawTrafficLight(svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>, x: number, y: number, color: string) {
    svg.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 3)
        .attr("fill", color);
}

function generateNumber(): number {
    const rand = Math.random();
    if (rand < 0.8) {
        return 2; // return 2 with 40% probability
    } else if (rand < 0.98) {
        return 1; // return 1 with 40% probability
    } else {
        return 0; // return 0 with 20% probability
    }
}

async function RefillChart(svgRef: React.RefObject<SVGSVGElement>) {
    getAllCords().then((dataAll) => {

        const width = window.innerWidth;
        const height = window.innerHeight - 4;

        const xExtent = d3.extent(dataAll, (d) => d[0]);
        const yExtent = d3.extent(dataAll, (d) => d[1]);
        const xmin = Number(xExtent[0]) //-74
        const xmax = Number(xExtent[1]) //37.5 
        const ymin = Number(yExtent[0]) //-40 
        const ymax = Number(yExtent[1]) //39.5 //here this need to be replaced the actual max value of the data

        // normalize the data to fit the svg element
        const xScale = d3.scaleLinear().domain([xmin - 2, xmax + 12]).range([0, width]); //here
        const yScale = d3.scaleLinear().domain([ymin - 1.5, ymax + 1.5]).range([0, height]);

        // create the svg element
        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .style("margin-top", 0)
            .style("margin-left", 0);


        dataAll.map((d) => {
            print(d)
            if (d[2] == "PICKUP") {
                let colors = ["red", "yellow", "green"];
                let color = colors[Math.floor(generateNumber())];
                drawTrafficLight(svg, xScale(d[0]), height - yScale(d[1]), color);
            }
        })

        // create legend
        drawTrafficLight(svg, 15, 10, "red");
        svg.append("text")
            .attr("x", 25)
            .attr("y", 15)
            .text("Refill Needed");

        drawTrafficLight(svg, 15, 30, "yellow");
        svg.append("text")
            .attr("x", 25)
            .attr("y", 35)
            .text("Refill Soon");

        drawTrafficLight(svg, 15, 50, "green");
        svg.append("text")
            .attr("x", 25)
            .attr("y", 55)
            .text("Refill Not Needed");
    }
    )
}

// Rewrite the chart component so that it updates when the selected option changes
const RefillStateGraph = (props: { userType: string }) => {

    const svg = React.useRef<SVGSVGElement>(null);

    React.useEffect(() => {
        Layout(svg, props.userType);
        RefillChart(svg);
    }, [svg, props.userType]);

    return (
        <div id="chart">
            <svg ref={svg} />
        </div>
    );
};

export default RefillStateGraph;
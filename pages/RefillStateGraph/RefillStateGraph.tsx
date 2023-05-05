import * as React from "react";
import * as d3 from "d3";
import axios from "axios";
import Layout from "../components/Layout";
import print from 'util/print';
import { getAllCords, getCords } from "pages/api/getData";
import { getLayoutShelf } from "../api/getLayout";
import { drawTrafficLight, generateNumber } from "@/util/helperFunc";
import Draggable from "react-draggable";
import LegendRefill from "./LegendRefill";



async function RefillChart(svgRef: React.RefObject<SVGSVGElement>, detailSvgRef: React.RefObject<SVGSVGElement>) {
    getAllCords().then((Routes) => {

        const width = window.innerWidth;
        const height = window.innerHeight - 4;

        Routes.sort((a: any, b: any) => { return a.number - b.number })

        let xmin = Infinity; let xmax = -Infinity; let ymin = Infinity; let ymax = -Infinity

        // Fake data: number of items left on each shelf
        let inventory = new Map<String, number>()
        // let overallInventory = new Map<String, number>()
        let shelfCoordinatesMap = new Map<String, { "xCoor": number, "yCoor": number, "subShelfs": String[] }>()

        Routes.map((d: any) => {
            d.routeStops.map((d: any) => {
                if (d.shelf.xCoor < xmin) xmin = d.shelf.xCoor
                if (d.shelf.xCoor > xmax) xmax = d.shelf.xCoor
                if (d.shelf.yCoor < ymin) ymin = d.shelf.yCoor
                if (d.shelf.yCoor > ymax) ymax = d.shelf.yCoor
            })
        })

        // normalize the data to fit the svg element
        const xScale = d3.scaleLinear().domain([xmin - 2000, xmax + 12000]).range([0, width]); //here
        const yScale = d3.scaleLinear().domain([ymin - 1500, ymax + 1500]).range([height, 0]); //here

        // create the svg element
        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .style("margin-top", 0)
            .style("margin-left", 0);

        // svg.on("click", function () {
        //     svg.selectAll("#DetailBox").remove();
        //     svg.selectAll("#DetailCircle").remove();
        //     svg.selectAll("#DetailText").remove();
        // })

        const detailSvg = d3.select(detailSvgRef.current)
            .attr("width", 100)
            .attr("height", 100)
            .style("margin-top", 0)
            .style("margin-left", 0);

        // shelf layout
        const layout = getLayoutShelf().then((layout) => {
            layout.shelves.map((d: any) => {
                inventory.set(d.orgShelfId, generateNumber());
            })

            // 0 - RED, 1 - YELLOW, 2 - GREEN            
            // iterate through all items in the inventory map
            inventory.forEach((value, key) => {
                let keySplit = key.split("-");
                let overallKey = String(keySplit[0] + "-" + keySplit[1]);

                if (!shelfCoordinatesMap.has(overallKey)) {
                    shelfCoordinatesMap.set(overallKey, { "xCoor": layout.shelves.find((d: any) => d.orgShelfId == key).xCoor, "yCoor": layout.shelves.find((d: any) => d.orgShelfId == key).yCoor, "subShelfs": [key] })
                }
                else {
                    let subShelfs = shelfCoordinatesMap.get(overallKey).subShelfs;
                    subShelfs.push(key);
                }

            })

            // iterate through all items in the overall inventory map
            shelfCoordinatesMap.forEach((d, key) => {
                svg.append("circle")
                    .attr("cx", xScale(d.xCoor))
                    .attr("cy", yScale(d.yCoor))
                    .attr("r", 3)
                    .attr("fill", () => {
                        let minShelf = ""
                        d.subShelfs.map((shelf) => {
                            minShelf = String(shelf)
                            if (inventory.get(shelf) < inventory.get(minShelf)) {
                                minShelf = String(shelf)
                            }
                        })
                        if (inventory.get(minShelf) <=3) {
                            return "red"
                        }
                        else if (inventory.get(minShelf) <= 10) {
                            return "black"
                        }
                        else {
                            return "green"
                        }


                    })
                    .on("mouseover", function () {
                        d3.select(this).attr("r", 10)
                        // svg.selectAll("#DetailBox").remove();
                        // svg.selectAll("#DetailCircle").remove();
                        // svg.selectAll("#DetailText").remove();
                        let count = 1;
                        const rectWidth = 100;
                        const rectHeight = (d.subShelfs.length + 1) * 15;
                        const maxScreenWidth = window.innerWidth - rectWidth - 10; // 10 is the margin
                        const maxScreenHeight = window.innerHeight - rectHeight - 10; // 10 is the margin
                        const rectX = Math.min(maxScreenWidth, xScale(d.xCoor));
                        const rectY = Math.min(maxScreenHeight, yScale(d.yCoor));
                        svg.append("rect")
                            .attr("id", "DetailBox")
                            .attr("x", rectX)
                            .attr("y", rectY)
                            .attr("width", rectWidth)
                            .attr("height", rectHeight)
                            .attr("fill", "white")
                            .attr("stroke", "black")
                            .attr("stroke-width", 1)

                        d.subShelfs.map((orgShelfIDD: any) => {
                            let overallID = orgShelfIDD.split("-")[0] + "-" + orgShelfIDD.split("-")[1];
                            svg.append("circle")
                                .attr("id", "DetailCircle")
                                .attr("cx", Math.min(maxScreenWidth, xScale(d.xCoor) + 15))
                                .attr("cy", Math.min(maxScreenHeight + count * 15, yScale(d.yCoor) + count * 15))
                                .attr("r", 3)
                                .attr("fill", () => {
                                    if (inventory.has(orgShelfIDD)) {
                                        let amount = inventory.get(orgShelfIDD);
                                        if (amount <= 3) return "red";
                                         else if (amount <= 10) return "black";
                                        else return "green";
                                    }
                                    else return "blue";
                                })

                            svg.append("text")
                                .attr("id", "DetailText")
                                .attr("x", Math.min(maxScreenWidth + 5, xScale(d.xCoor) + 20))
                                .attr("y", Math.min(maxScreenHeight+2 + count * 15, yScale(d.yCoor) + 2 + count * 15))
                                .text(orgShelfIDD + " : " + inventory.get(orgShelfIDD))
                                //smaller font size
                                .attr("font-size", "10px")

                            count += 1;

                            // console.log(orgShelfIDD + " : " + inventory.get(orgShelfIDD));
                        })
                    })
                    .on("mouseout", function () {
                        d3.select(this).attr("r", 3)
                        svg.selectAll("#DetailBox").remove();
                        svg.selectAll("#DetailCircle").remove();
                        svg.selectAll("#DetailText").remove();
                    })
            })
        })
    }
    )
}

// Rewrite the chart component so that it updates when the selected option changes
const RefillStateGraph = (props: { userType: string }) => {

    const svg = React.useRef<SVGSVGElement>(null);
    const detailSvg = React.useRef<SVGSVGElement>(null);
    const nodeRef = React.useRef(null);

    React.useEffect(() => {
        Layout(svg, props.userType);
        RefillChart(svg, detailSvg);
    }, [svg, props.userType]);

    return (
        <div id="refillChart">
           <LegendRefill />
            <svg ref={svg} />
        </div>
    );
};

export default RefillStateGraph;
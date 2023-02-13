import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import print from 'util/print';
import * as d3 from "d3";
import MyComponent from "../Common/tooltip";

// Get the size of the window at any given time
const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        // Calls the handleResize function when the window is resized
        window.addEventListener("resize", handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
}

async function getAllCords() {
    try {
        const response = await axios.get("http://localhost:3333/api/getAll");
        const Data = response.data;
        const cords = Data.map((d: any) => [d.Xcorrdinate, d.Ycorrdinate]);
        return cords;
    }
    catch (error) {
        console.log(error);
    }
}

const normalizeCoordinates = (data: number[][]) => {
    const x = data.map((d) => d[0]);
    const y = data.map((d) => d[1]);
    const xMin = Math.min(...x);
    const xMax = Math.max(...x);
    const yMin = Math.min(...y);
    const yMax = Math.max(...y);
    const xRange = xMax - xMin;
    const yRange = yMax - yMin;
    const normalizedData = data.map((d) => [
        (d[0] - xMin) / xRange,
        (d[1] - yMin) / yRange,
    ]);
    return normalizedData;
};

function Tooltip(svg, x, y, content, windowWidth, windowHeight) {

    svg.append("rect")
        .attr("id", "tooltip_rect")
        .attr("x", ()=>{
            if(x > windowWidth/2) return x-220
            else return x 
        })
        .attr("y", ()=>{if(y > windowHeight/2){return y-50}else{return y}})
        .attr("width", 220)
        .attr("height", 50)
        .attr("fill", "blue")
        .attr("opacity", .75)

    svg.append("text")
        .attr("id", "tooltip_text")
        .attr("x", ()=>{if(x > windowWidth/2){return x-220+10}else{return x+10}})
        .attr("y", ()=>{if(y > windowHeight/2){return y-50+25}else{return y+25}})
        .text("Number of visits: "+content)
        .attr("font-size", 20)
        .attr("fill", "black")

}

const CreateHeat = (svgRef: any, data: any, inWidth: number, inHeight: number) => {
    var margin = { top: 0, right: 0, bottom: 0, left: 0 },
        width = inWidth - margin.left - margin.right,
        height = inHeight - margin.top - margin.bottom;

    var x = d3.scaleLinear()
        .range([0, width])
        .domain([0, data[0].length]);

    var y = d3.scaleLinear()
        .range([0, height])
        .domain([0, data.length]);

    const blackShades: string[] = ["#FFFFFF", "#F2F2F2", "#D9D9D9", "#BFBFBF", "#A6A6A6", "#8C8C8C", "#737373", "#595959", "#404040", "#262626", "#000000"];

    var colorScale = d3.scaleLinear()
        .domain([0, 10])
        .range(blackShades);

    var svg = d3.select(svgRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // print a rect for each color in the blackShades array
    // blackShades.forEach((color, i) => {
    //     svg.append("rect")
    //         .attr("x", 0)
    //         .attr("y", i * 20)
    //         .attr("width", 20)
    //         .attr("height", 20)
    //         .style("fill", color);
    // });

    var row = svg.selectAll(".row")
        .data(data)
        .enter().append("svg:g")
        .attr("class", "row");

    var col = row.selectAll(".cell")
        .data(function (d, i) { return d.map(function (a: any) { return { value: a, row: i }; }) })
        .enter().append("svg:rect")
        .attr("class", "cell")
        .attr("x", function (d, i) { return x(i); })
        .attr("y", function (d, i) { return y(d.row); })
        .attr("width", x(1))
        .attr("height", y(1))
        .attr('opacity', '.3')
        .style("fill", function (d) {
            return colorScale(d.value);
        })
        // Our hover effects for the crossAisle
        .on('mouseover', function (event,d) {
            d3.select(this).transition().duration('50').attr('opacity', '0')
            Tooltip(svg, event.pageX, event.pageY, d.value, width, height);
        })

        .on('mouseout', function () {
            d3.select(this).transition().duration('50').attr('opacity', '.3')
            svg.select("#tooltip_rect").remove();
            svg.select("#tooltip_text").remove();
        })

};

const Heat = () => {
    const [data, setData] = useState<number[][]>([]);
    let matrix = Array(10).fill(0).map(() => Array(10).fill(0));

    const width = useWindowSize().width;
    const height = useWindowSize().height;

    // matrix[9][9] += 1;
    useEffect(() => {

        getAllCords().then((data) => {
            const d = normalizeCoordinates(data);
            setData(d);

        });
    }, []);

    data.map((d) => {
        const x = Math.floor(d[0] * 9.9);
        const y = Math.floor(d[1] * 9.9);
        matrix[x][y] += 1;
    });

    const svg = useRef<SVGSVGElement>(null);

    useEffect(() => {
        CreateHeat(svg, matrix, width, height);
    }, [matrix]);


    return (
        <div id='Heat' style={{ position: "absolute", zIndex: 1 }}>
            <svg ref={svg} />
        </div>
    )
}

export default Heat;

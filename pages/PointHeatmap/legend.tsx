import React from 'react';
import * as d3 from 'd3';
import { color } from 'util/Colors';
import Draggable from 'react-draggable';


function createLegend(svgRef: React.RefObject<SVGSVGElement>) {
    const svg = d3.select(svgRef.current);
    color().map((d, i) => {
        svg.append("circle")
            .attr("cx", 10)
            .attr("cy", 10 + (i * 20))
            .attr("r", i + 1)
            .attr("fill", `rgb(${d[0]},${d[1]},${d[2]})`)
            .attr("opacity", .75)

        svg.append("text")
            .attr("x", 30)
            .attr("y", 10 + (i * 20) + 5)
            .text(i + 1)
            .attr("font-size", 20)
            .attr("fill", "black")

        svg.append("line")
            .attr("x1", 60)
            .attr("y1", 10 + (i * 20))
            .attr("x2", 100)
            .attr("y2", 10 + (i * 20))
            .attr("stroke", `rgb(${d[0]},${d[1]},${d[2]})`)
            .attr("stroke-width", i + 1)
            .attr("opacity", .75)

        svg.append("text")
            .attr("x", 110)
            .attr("y", 10 + (i * 20) + 5)
            .text((i * 10) + " - " + (((i + 1) * 10) - 1))
            .attr("font-size", 20)
            .attr("fill", "black")
    })

}

const Legend = () => {
    const nodeRef = React.useRef(null);
    const svg = React.useRef<SVGSVGElement>(null);
    React.useEffect(() => {
        createLegend(svg);
    }, [svg]);
 
    return (
        <React.StrictMode>
        <Draggable nodeRef={nodeRef} bounds='parent'>
            <div ref={nodeRef} id="pointHeatLegend" style={{padding:10,position: 'absolute', border:5, borderRadius:30,backgroundColor: "lightgray", borderColor:"black"}}>
                <svg ref={svg} width={200} height={200} />
            </div>
        </Draggable>
        </React.StrictMode>
    );
};

export default Legend;


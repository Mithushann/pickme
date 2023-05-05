import React from 'react';
import * as d3 from 'd3';
import { color } from 'util/Colors';
import Draggable from 'react-draggable';
import { drawTrafficLight } from 'util/helperFunc';


function createLegendRefill(svgRef: React.RefObject<SVGSVGElement>) {
    const detailSvg = d3.select(svgRef.current);
        drawTrafficLight(detailSvg, 15, 10, "red");
        detailSvg.append("text")
            .attr("x", 25)
            .attr("y", 15)
            .text("Refill Needed");

        drawTrafficLight(detailSvg, 15, 30, "black");
        detailSvg.append("text")
            .attr("x", 25)
            .attr("y", 35)
            .text("Refill Soon");

        drawTrafficLight(detailSvg, 15, 50, "green");
        detailSvg.append("text")
            .attr("x", 25)
            .attr("y", 55)
            .text("Refill Not Needed");
}

const LegendRefill = () => {
    const nodeRef = React.useRef(null);

    const svg = React.useRef<SVGSVGElement>(null);
    React.useEffect(() => {
        createLegendRefill(svg);
    }, [svg]);

    return (
        <Draggable nodeRef={nodeRef} bounds='parent' >
            <div ref={nodeRef} id="refillLegend" style={{padding:10,position: 'absolute', border:5, borderRadius:30,backgroundColor: "lightgray", borderColor:"black"}}>
                <svg ref={svg} width={200} height={75} />
            </div>
        </Draggable>
    );
};

export default LegendRefill;

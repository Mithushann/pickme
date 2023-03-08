import * as React from "react";
import * as d3 from "d3";
import axios from "axios";
import Layout from "../components/Layout";
import print from 'util/print';
import { getAllCords, getCords } from "pages/api/getData";
import colors from "@/util/Constants";

// Rewrite the chart component so that it updates when the selected option changes
// draw the chart given the ROuteId 
async function Chart(svgRef: React.RefObject<SVGSVGElement>, RouteIds: number[], play: boolean) {
  if (play) {
    const xmin = -74
    const xmax = 37.5
    const ymin = -40
    const ymax = 39.5  //here this need to be replaced the actual max value of the data
    const width = window.innerWidth;
    const height = window.innerHeight - 4;

    // normalize the data to fit the svg element
    const xScale = d3.scaleLinear().domain([xmin, xmax + 11]).range([0, width]); //here
    const yScale = d3.scaleLinear().domain([ymin, ymax]).range([0, height]);

    // create the svg element
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("margin-top", 0)
      .style("margin-left", 0);

    RouteIds.map(async (RouteId) => {
      let data = await getCords(RouteId);

      svg
        .selectAll("circle" + RouteId)
        .attr("class", "circle" + RouteId)
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d: any) => xScale(Number(d.Xcorrdinate)))
        .attr("cy", (d: any) => height - yScale(Number(d.Ycorrdinate)))
        .attr("r", 7.5)
        .attr("opacity", 0.3)
        .attr("fill", (d: any) => {
          if (d.Nodetype == "PICKUP") {
          
            return 'red';
          }
          else return "none"
        })

            // Our hover effects for the crossAisle
      .on('click', function (event, d) {
        d3.select(this).attr("opacity", 1);
      })
  
      .on('dbclick', function (d, i) {
        d3.select(this).attr("opacity", 0.3);
      });
       
        d3.selectAll("circle" + RouteId).raise();
    })
  }

  else {
    const svg = d3.select(svgRef.current);
    svg.selectAll("circle").remove();
    RouteIds.map((RouteId) => {
      svg.selectAll("path.route" + RouteId).remove();
    })
    svg.selectAll("path").remove();
    svg.selectAll("text").remove();
  }
}

const ManuelTrajectoryPlot = (props) => {
  const svg = React.useRef<SVGSVGElement>(null);
  React.useEffect(() => {
    Layout(svg, props.userType);
    Chart(svg, props.RouteIds, props.play);
  }, [svg, props.play, props.RouteIds, props.userType]);

  return (
    <div id="chart">
      <svg ref={svg} />
    </div>
  );
};

export default ManuelTrajectoryPlot;

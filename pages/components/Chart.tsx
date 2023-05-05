import React from 'react';
import * as d3 from 'd3';
import drawOnePath from './DrawOnePath';
import print from 'util/print';

// draw the chart given the ROuteId 
export default async function Chart(svgRef: React.RefObject<SVGSVGElement>, RouteIds: number[], play: boolean,  isStatic=false, inWidth: number=window.innerWidth, inHeight: number=window.innerHeight - 4) {
    if (play) {
      const xmin = -74
      const xmax = 37.5
      const ymin = -40
      const ymax = 39.5  //here this need to be replaced the actual max value of the data
      const width = inWidth;
      const height = inHeight;
  
      // normalize the data to fit the svg element
      const xScale = d3.scaleLinear().domain([xmin, xmax + 11]).range([0, width]); //here
      const yScale = d3.scaleLinear().domain([ymin, ymax]).range([height, 0]);
  
      // create the svg element
      const svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .style("margin-top", 0)
        .style("margin-left", 0);
  
      for (let i = 0; i < RouteIds.length; i++) {
        await drawOnePath(svg , RouteIds[i], xScale, yScale, width, height, isStatic);
        print("RouteIds", String(RouteIds[i]))
        
      }

    }
    else {
      const svg = d3.select(svgRef.current);
      svg.selectAll("circle").remove();
      RouteIds.map((RouteId) => {
        svg.selectAll("path.route"+RouteId).remove();
  
      })
      // svg.selectAll("path").remove();
      svg.selectAll("text").remove();
    }
  }


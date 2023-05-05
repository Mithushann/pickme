import * as React from "react";
import * as d3 from "d3";
import { svg } from "d3";
import print from 'util/print';
import colors from "@/util/Constants";
import { getLayout, getDataFromOptiplanWarehouse } from "../api/getData";
import { getBoudningBox, getLayoutRacks } from "../api/getLayout";
import { getAllCords } from "../api/getData";

function Tooltip(svg, x, y, content, windowWidth, windowHeight) {

  svg.append("rect")
    .attr("id", "tooltip_rect_t")
    .attr("x", () => {
      if (x > windowWidth / 2) return x - 220
      else return x
    })
    .attr("y", () => { if (y > windowHeight / 2) { return y - 50 } else { return y } })
    .attr("width", 257)
    .attr("height", 50)
    .attr("fill", "blue")
    .attr("opacity", .75)

  svg.append("text")
    .attr("id", "tooltip_text_t")
    .attr("x", () => { if (x > windowWidth / 2) { return x - 220 + 10 } else { return x + 10 } })
    .attr("y", () => { if (y > windowHeight / 2) { return y - 50 + 25 } else { return y + 25 } })
    .text(content)
    .attr("font-size", 20)
    .attr("fill", "black")

}

// A function to draw the svg element given data and a ref to the svg element
function drawRect(svg, data, xScale, yScale, inWidth, inHeight, color, class_name) {
  svg
    .selectAll(class_name)
    .attr("class", class_name)
    .data(data)
    .enter()
    .append("rect")

    .attr("x", (d: any[]) => xScale(d[0]))
    .attr("y", (d: any[]) => yScale(d[1]))
    .attr("width", (d: number[]) => (xScale(d[2]) - xScale(d[0])))
    .attr("height", (d: number[]) => (yScale(d[3]) - yScale(d[1])))

    .attr("fill", color)
    .attr("stroke", colors.SecondaryColorKontroll)
    .attr("stroke-width", .5)

  // Our hover effects for the crossAisle
  .on('mouseover', function (event, d) {
    d3.select(this).transition().duration('50').attr('opacity', '.5')
    let content = d[4].split("'")[1]
    Tooltip(svg, d3.pointer(event)[0], d3.pointer(event)[1], content, inWidth, inHeight)
  })

  .on('mouseout', function (d, i) {
    d3.select(this).transition().duration('50').attr('opacity', '1')
    svg.select("#tooltip_rect_t").remove();
    svg.select("#tooltip_text_t").remove();
  });
}

function drawArrow(svg, data, xScale, yScale, width, height, color) {
  data.map((d: any) => {
    if (d[4].includes("ONEWAY")) {

      svg
        .append('svg:line')
        .attr('class', 'right-axis')
        .attr('x1', (xScale(2 * d[0] + d[2])) / 2)
        .attr('x2', (xScale(2 * d[0] + d[2])) / 2)
        .attr('y1', () => {
          if (d[4].includes('RIGHT')) return (height - yScale(d[1]))
          else return (height - (yScale(d[1] + d[3])))
        })

        .attr('y2', () => {
          if (d[4].includes('RIGHT')) return (height - yScale(d[1]) - 25)
          else return (height - (yScale(d[1] + d[3])) + 25)
        })
        .attr("marker-end", "url(#arrowLayout)")
        .attr("stroke", color)
        .attr("stroke-width", 5);

      var defs1 = svg.append("defs");

      defs1.append("marker")
        .attr('class', 'arrowHead')
        .attr("id", "arrowLayout")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 5)
        .attr("refY", 0)
        .attr("markerWidth", 2)
        .attr("markerHeight", 2)
        .attr("orient", "auto")
        .attr("fill", color)

        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("class", "arrowHead");

    }
  });

}

export default function Layout(svgRef: React.RefObject<SVGSVGElement>, userType: string, inWidth = 0, inHeight = 0) {

  let racks: any[] = [];
  let margin = 5;
  getAllCords().then((Routes) => {
    Routes.sort((a: any, b: any) => { return a.number - b.number })

    let xmin = Infinity; let xmax = -Infinity; let ymin = Infinity; let ymax = -Infinity

    Routes.map((d: any) => {
      d.routeStops.map((d: any) => {
        if (d.shelf.xCoor < xmin) xmin = d.shelf.xCoor
        if (d.shelf.xCoor > xmax) xmax = d.shelf.xCoor
        if (d.shelf.yCoor < ymin) ymin = d.shelf.yCoor
        if (d.shelf.yCoor > ymax) ymax = d.shelf.yCoor
      })
    })

    if (inWidth === 0 && inHeight === 0) {
      inWidth = window.innerWidth;
      inHeight = window.innerHeight - 4;
    }

    // normalize the data to fit the svg element
    const xScale = d3.scaleLinear().domain([xmin - 2000, xmax + 12000]).range([0, inWidth]); //here
    const yScale = d3.scaleLinear().domain([ymin - 1500, ymax + 1500]).range([inHeight, 0]); //here

    getLayoutRacks().then((data) => {
      data.racks.map((d: any) => {
        racks.push([(d.topLeft[0]), (d.topLeft[1]), (d.bottomRight[0]), (d.bottomRight[1]), d.id])
      })

      const svg = d3.select(svgRef.current);
      svg
        .attr("width", inWidth)
        .attr("height", inHeight)
        .style("margin-top", 0)
        .style("margin-left", 0);

      svg.selectAll("rect").remove();

      drawRect(svg, racks, xScale, yScale, inWidth, inHeight, colors.SecondaryColorTillit, "rect");

    // getLayoutDepot().then((data) => {});

      // draw the Depot using drawRect function
      // drawRect(svg, data.Depot, xScale, yScale, width, height, colors.PrimaryColorKvalite, "depot");

      // if userType is "employee" draw the crossAisle using drawRect function
      // if (userType === "employee") {
      //   drawRect(svg, data.CrossAisle, xScale, yScale, width, height, "#ffe09c", "crossAisle");
      //   drawRect(svg, data.Wall, xScale, yScale, width, height, "#29191a", "wall");
      //   drawRect(svg, data.Aisle, xScale, yScale, width, height, "#ffe7be", "aisle");
      //   drawRect(svg, data.Elevator, xScale, yScale, width, height, "#9a674a ", "elevator");
      // }
      // drawArrow(svg, data.Aisle, xScale, yScale, width, height, "lightgrey");

      d3.selectAll('rect').lower()

    });
  });

}
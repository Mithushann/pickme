// import * as d3 from "d3";
import axios from "axios";
import print from 'util/print';
import { getAllCords, getCords } from "pages/api/getData";

export default async function drawOnePath(svg: d3.Selection<SVGSVGElement |
  null, unknown, null, undefined>, RouteId: number, xScale: d3.ScaleLinear<number, number, never>,
  yScale: d3.ScaleLinear<number, number, never>, width: number, height: number, isStatic: boolean = false) {

  let OptimizationId = "clhqcwryx32723906r0iqsreysv";
  if (isStatic) {
    console.log(RouteId)
    getCords(OptimizationId, RouteId).then((data) => {
      let [routeStops, routeTrajectories] = data;

      let routeStopsShelf = routeStops.map((d: any) => {
        return d.shelf;
      });

      const colors = ["#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231"];

      svg
        .selectAll("circle" + RouteId)
        .attr("class", "circle" + RouteId)
        .data(routeStopsShelf)
        .enter()
        .append("circle")
        .attr("cx", (d: any) => { return xScale(Number(d.xCoor / 1000)) })
        .attr("cy", (d: any) => { return yScale(Number(d.yCoor / 1000)) })
        .attr("r", 6)
        .attr("fill", "gray")
        .attr("stroke", "white")
        .attr("opacity", 1)
        .attr("stroke-width", .5)

      svg
        .selectAll("path.route" + RouteId)
        .data([routeTrajectories])
        .enter()
        .append("path")
        .attr("class", "route" + RouteId)
        .style("stroke", "black")
        .style("stroke-width", "2px")
        .style("stroke-dasharray", "2,2")
        .style("stroke-linecap", "round")
        .style("fill", "none")
        .attr("d", d3.line()
          .x((d) => xScale(Number(d.xCoor)))
          .y((d) => yScale(Number(d.yCoor)))
        )
        .attr("marker-end", "url(#arrow)");

      svg.append("svg:defs").append("svg:marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 -5 20 10")
        .attr("refX", 8)
        .attr("refY", 0)
        .attr("markerWidth", 8)
        .attr("markerHeight", 4)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L15,0L0,5")
        .attr("fill", "black");

      svg.selectAll("path.route" + RouteId).each(function () {
        var path = d3.select(this);
        var pathLength = path.node().getTotalLength();
        var startPoint = path.node().getPointAtLength(0);
        var endPoint = path.node().getPointAtLength(pathLength);
        var angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x) * 180 / Math.PI;
        path.attr("marker-end", "")
          .attr("marker-start", "")
          .attr("marker-mid", "url(#arrow)")
          .attr("stroke", "black")
          .attr("stroke-width", 2)
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("transform", "rotate(" + angle + " " + endPoint.x + " " + endPoint.y + ")");
      });
    });
  }

}


// import * as d3 from "d3";
// import axios from "axios";
// import print from 'util/print';
// import { getAllCords, getCords } from "pages/api/getData";

// export default async function drawOnePath(svg: d3.Selection<SVGSVGElement |
//   null, unknown, null, undefined>, RouteId: number, xScale: d3.ScaleLinear<number, number, never>,
//   yScale: d3.ScaleLinear<number, number, never>, width: number, height: number, isStatic: boolean = false) {

//   let OptimizationId = "clhqcwryx32723906r0iqsreysv";
//   if (isStatic) {
//     getCords(OptimizationId, RouteId).then((data) => {
//       let [routeStops, routeTrajectories] = data;

//       let routeStopsShelf = routeStops.map((d: any) => {
//         return d.shelf;
//       });

//       const colors = ["#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231"];

//       svg
//         .selectAll("circle" + RouteId)
//         .attr("class", "circle" + RouteId)
//         .data(routeStopsShelf)
//         .enter()
//         .append("circle")
//         .attr("cx", (d: any) => { return xScale(Number(d.xCoor / 1000)) })
//         .attr("cy", (d: any) => { return yScale(Number(d.yCoor / 1000)) })
//         .attr("r", 6)
//         .attr("fill", "gray")
//         .attr("stroke", "white")
//         .attr("opacity", 1)
//         .attr("stroke-width", .5)

//       svg
//         .selectAll("path.route" + RouteId)
//         .data([routeTrajectories])
//         .enter()
//         .append("path")
//         .attr("class", "route" + RouteId)
//         .style("stroke", "black")
//         .style("stroke-width", "2px")
//         .style("stroke-dasharray", "2,2")
//         .style("stroke-linecap", "round")
//         .style("fill", "none")
//         .attr("d", d3.line()
//           .x((d) => xScale(Number(d.xCoor)))
//           .y((d) => yScale(Number(d.yCoor)))
//         )
//         .attr("marker-end", "url(#arrow)");

//       svg.append("svg:defs").append("svg:marker")
//         .attr("id", "arrow")
//         .attr("viewBox", "0 -5 20 10")
//         .attr("refX", 8)
//         .attr("refY", 0)
//         .attr("markerWidth", 8)
//         .attr("markerHeight", 4)
//         .attr("orient", "auto")
//         .append("svg:path")
//         .attr("d", "M0,-5L15,0L0,5")
//         .attr("fill", "black");

//       svg.selectAll("path.route" + RouteId).each(function () {
//         var path = d3.select(this);
//         var pathLength = path.node().getTotalLength();
//         var startPoint = path.node().getPointAtLength(0);
//         var endPoint = path.node().getPointAtLength(pathLength);
//         var angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x) * 180 / Math.PI;
//         path.attr("marker-end", "")
//           .attr("marker-start", "")
//           .attr("marker-mid", "url(#arrow)")
//           .attr("stroke", "black")
//           .attr("stroke-width", 2)
//           .attr("stroke-linejoin", "round")
//           .attr("stroke-linecap", "round")
//           .attr("transform", "rotate(" + angle + " " + endPoint.x + " " + endPoint.y + ")");
//       });
//     });
//   }

// }

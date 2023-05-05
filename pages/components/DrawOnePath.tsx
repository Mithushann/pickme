import * as d3 from "d3";
import axios from "axios";
import print from 'util/print';
import { getAllCords, getCords } from "pages/api/getData";

export default async function drawOnePath(svg: d3.Selection<SVGSVGElement |
  null, unknown, null, undefined>, RouteId: number, xScale: d3.ScaleLinear<number, number, never>,
  yScale: d3.ScaleLinear<number, number, never>, width: number, height: number, isStatic: boolean = false) {

  let OptimizationId = "clfth396f84847606p7ox1fi3l4";
  if (isStatic) {
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

        //------------------------------------------------
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

svg.selectAll("path.route" + RouteId).each(function() {
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

    //   svg
    //     .selectAll("path.route" + RouteId)
    //     .data([routeTrajectories])
    //     .enter()
    //     .append("path")
    //     .attr("class", "route" + RouteId)
    //     .style("stroke", "black")
    //     .style("stroke-width", "2px")
    //     .style("stroke-dasharray", "2,2")
    //     .style("stroke-linecap", "triangle")
    //     .style("fill", "none")
    //     .attr("marker-start", "url(#arrow)")
    //     .attr("d", d3.line()
    //       .x((d) => xScale(Number(d.xCoor)))
    //       .y((d) => yScale(Number(d.yCoor))));

    //   svg.append("svg:defs").append("svg:marker")
    //     .attr("id", "arrow")
    //     .attr("viewBox", "0 -5 10 10")
    //     .attr("refX", 8)
    //     .attr("refY", 0)
    //     .attr("markerWidth", 4)
    //     .attr("markerHeight", 4)
    //     .attr("orient", "auto")
    //     .append("svg:path")
    //     .attr("d", "M0,-5L10,0L0,5")
    //     .attr("fill", "black");

    //   // add pointy arrow to the path
    //   svg
    //     .selectAll("path.route" + RouteId)
    //     // .attr("marker-end", "url(#arrow)")
    //     // .attr("marker-start", "url(#arrow)")
    //     .attr("marker-mid", "url(#arrow)")
    //     .attr("fill", "none")
    //     .attr("stroke", "black")
    //     .attr("stroke-linejoin", "round")
    //     .attr("stroke-linecap", "round")
    //     .attr("stroke-width", 10)
    // });
    //----------------------------------------
  }

  // else {

  //   getCords(OptimizationId, RouteId).then((data) => {
  //     let [routeStops, routeTrajectories] = data;

  //     // An array of 5 diffrent colors
  //     const colors = ["#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231"];

  //     // svg.selectAll("path.route").remove();
  //     svg
  //       .selectAll("path.route" + RouteId)
  //       .data([routeTrajectories])
  //       .enter()
  //       .append("path")
  //       .attr("class", "route" + RouteId)
  //       .attr("fill", "none")
  //       .attr("stroke", colors[RouteId % 5])
  //       .attr("stroke-linejoin", "round")
  //       .attr("stroke-linecap", "round")
  //       .attr("stroke-width", 3)
  //       .attr("d", d3.line()
  //         .x((d) => xScale(Number(d.xCoor)))
  //         .y((d) => yScale(Number(d.yCoor)))

  //       );
  //     d3.selectAll("path.route" + RouteId).raise();
  //     const path = svg.selectAll("path.route" + RouteId);

  //     const pathLength = path.node().getTotalLength();
  //     const transitionPath = d3.transition().duration(10000);

  //     //growing path 
  //     path
  //       .attr("stroke-dashoffset", pathLength)
  //       .attr("stroke-dasharray", pathLength)
  //       .transition(transitionPath)
  //       .attr("stroke-dashoffset", 0)
  //       .transition()

  //       // Stringing path 
  //       .duration(100000)
  //       .attr("stroke-dashoffset", pathLength)
  //       .attr("stroke-dasharray", pathLength)
  //       .transition()
  //       .attr("stroke-dashoffset", pathLength)

  //     //--Draw the path and animate an icon along the path---

  //     path
  //       .style("stroke", "none")
  //       .style("fill", "none");

  //     // Define the icon
  //     var icon = svg.append("circle")
  //       .attr("r", 10)
  //       .style("fill", "red");

  //     // Animate the icon along the path
  //     var totalLength = path.node().getTotalLength();
  //     icon.transition()
  //       .duration(20000)
  //       .attrTween("transform", function () {
  //         return function (t) {
  //           var p = path.node().getPointAtLength(t * totalLength);
  //           return "translate(" + p.x + "," + p.y + ")";
  //         }
  //       });

  //     svg
  //       .selectAll("circle" + RouteId)
  //       .attr("class", "circle" + RouteId)
  //       .data(routeStops)
  //       .enter()
  //       .append("circle")
  //       .attr("cx", (d: any) => xScale(Number(d.xCoor)))
  //       .attr("cy", (d: any) => yScale(Number(d.yCoor)))
  //       .attr("r", 7.5)
  //       .attr("fill", (d: any) => {
  //         if (d.Nodetype == "PICKUP") {
  //           return colors[RouteId % 5];
  //         }
  //         else return "none"
  //       })
  //     d3.selectAll("circle" + RouteId).raise();
  //   });
  // }
}



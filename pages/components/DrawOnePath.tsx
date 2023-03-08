import * as d3 from "d3";
import axios from "axios";
import print from 'util/print';
import { getAllCords, getCords } from "pages/api/getData";

export default async function drawOnePath(svg: d3.Selection<SVGSVGElement |
  null, unknown, null, undefined>, RouteId: number, xScale: d3.ScaleLinear<number, number, never>, yScale: d3.ScaleLinear<number, number, never>, width: number, height: number) {
  // print("RouteIds", String(RouteId))


  getCords(RouteId).then((data) => {
    // sort the data based on the order
    data.sort((a: any, b: any) => a.order - b.order);

    // An array of 5 diffrent colors
    const colors = ["#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231"];

    // svg.selectAll("path.route").remove();
    svg
      .selectAll("path.route" + RouteId)
      .data([data])
      .enter()
      .append("path")
      .attr("class", "route" + RouteId)
      .attr("fill", "none")
      .attr("stroke", colors[RouteId % 5])
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 3)
      .attr("d", d3.line()
        .x((d) => xScale(Number(d.Xcorrdinate)))
        .y((d) => height - yScale(Number(d.Ycorrdinate)))

      );
    d3.selectAll("path.route" + RouteId).raise();
    const path = svg.selectAll("path.route" + RouteId);

    const pathLength = path.node().getTotalLength();
    const transitionPath = d3.transition().duration(10000);

    //growing path 
    path
      .attr("stroke-dashoffset", pathLength)
      .attr("stroke-dasharray", pathLength)
      .transition(transitionPath)
      .attr("stroke-dashoffset", 0)
      .transition()

    // Stringing path 
      .duration(100000)
      .attr("stroke-dashoffset", pathLength)
      .attr("stroke-dasharray", pathLength)
      .transition()
      .attr("stroke-dashoffset", pathLength) 

    //--Draw the path and animate an icon along the path---

    path
      .style("stroke", "none")
      .style("fill", "none");

    // Define the icon
    var icon = svg.append("circle")
      .attr("r", 10)
      .style("fill", "red");


    // Animate the icon along the path
    var totalLength = path.node().getTotalLength();
    icon.transition()
      .duration(20000)
      .attrTween("transform", function () {
        return function (t) {
          var p = path.node().getPointAtLength(t * totalLength);
          return "translate(" + p.x + "," + p.y + ")";
        }
      });

    //---------------------------------------------------




    // svg.selectAll("circle").remove();
    svg
      .selectAll("circle" + RouteId)
      .attr("class", "circle" + RouteId)
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d: any) => xScale(Number(d.Xcorrdinate)))
      .attr("cy", (d: any) => height - yScale(Number(d.Ycorrdinate)))
      .attr("r", 7.5)
      .attr("fill", (d: any) => {
        if (d.Nodetype == "PICKUP") {
          return colors[RouteId % 5];
        }
        else return "none"
      })
    d3.selectAll("circle" + RouteId).raise();
  });

}

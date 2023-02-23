import * as React from "react";
import * as d3 from "d3";
import axios from "axios";
import jsonParser from '@/util/JsonParser';
import { svg } from "d3";
import print from 'util/print';
import colors from "@/util/Constants";

// Function to get data from the database 3d layout
async function getLayout() {
  let data = null;
  const url = 'http://localhost:3333/api/get3d';
  await fetch(url)
    .then((response) => response.json())
    .then((d) => {
      data = jsonParser(d[0]);
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  return data;
}
//Function to get all the data from the database
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
//function to call an api and get data from it
async function getCords(RouteId: number) {
  try {
    const response = await axios.get("http://localhost:3333/api/get/" + RouteId);
    const Data = response.data;
    const cords = Data;
    return cords;
  }
  catch (error) {
    console.log(error);
  }
}

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
function drawRect(svg, data, xScale, yScale, width, height, color, class_name) {
  svg
    .selectAll(class_name)
    .attr("class", class_name)
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d: any) => xScale(d[0]))
    .attr("y", (d: any) => height - yScale((d[1] + d[3])))
    .attr("width", (d: any) => xScale(d[2]))
    .attr("height", (d: any) => yScale(d[3]))
    .attr("fill", color)
    .attr("stroke", colors.SecondaryColorKontroll)
    .attr("stroke-width", .5)

    // Our hover effects for the crossAisle
    .on('mouseover', function (event, d) {
      d3.select(this).transition().duration('50').attr('opacity', '.5')
      let content = d[4].split("'")[1]
      Tooltip(svg, d3.pointer(event)[0], d3.pointer(event)[1], content, width, height)
    })

    .on('mouseout', function (d, i) {
      d3.select(this).transition().duration('50').attr('opacity', '1')
      svg.select("#tooltip_rect_t").remove();
      svg.select("#tooltip_text_t").remove();
    });
}

// A function to draw arrow given the start and end point of the arrow and the svg element
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
        .attr("marker-end", "url(#arrow)")
        .attr("stroke", color)
        .attr("stroke-width", 5);

      var defs = svg.append("defs");

      defs.append("marker")
        .attr('class', 'arrowHead')
        .attr("id", "arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 5)
        .attr("refY", 0)
        .attr("markerWidth", 2)
        .attr("markerHeight", 2)
        .attr("orient", "auto")
        .attr("fill", color)

        .append("path")
        .attr('class', 'arrowHead')
        .attr("d", "M0,-5L10,0L0,5")
        .attr("class", "arrowHead");

    }
  });

}

function Layout(svgRef: React.RefObject<SVGSVGElement>, userType: string) {
  getLayout().then((data) => {
    const width = window.innerWidth - 20;
    const height = window.innerHeight - 20;

    // normalize the data to fit the svg element
    const xScale = d3.scaleLinear().domain([0, 1]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, 1]).range([0, height]);

    const svg = d3.select(svgRef.current);
    svg
      .attr("width", width)
      .attr("height", height)
      .style("margin-top", 0)
      .style("margin-left", 0);

    svg.selectAll("rect").remove();

    // draw the rack using drawRect function
    drawRect(svg, data.Rack, xScale, yScale, width, height, colors.SecondaryColorTillit, "rack");

    // draw the Depot using drawRect function
    drawRect(svg, data.Depot, xScale, yScale, width, height, colors.PrimaryColorKvalite, "depot");

    // if userType is "employee" draw the crossAisle using drawRect function
    if (userType === "employee") {
      drawRect(svg, data.CrossAisle, xScale, yScale, width, height, "#ffe09c", "crossAisle");
      drawRect(svg, data.Wall, xScale, yScale, width, height, "#29191a", "wall");
      drawRect(svg, data.Aisle, xScale, yScale, width, height, "#ffe7be", "aisle");
      drawRect(svg, data.Elevator, xScale, yScale, width, height, "#9a674a ", "elevator");
    }
    drawArrow(svg, data.Aisle, xScale, yScale, width, height, "lightgrey");
  });
}

// draw the chart
function Chart(svgRef: React.RefObject<SVGSVGElement>, RouteId: number, play: boolean) {

  if (play) {

    getAllCords().then((dataAll) => {
      // find the min and max values of the data
      const xExtent = d3.extent(dataAll, (d) => d[0]);
      const yExtent = d3.extent(dataAll, (d) => d[1]);
      const xmin = -74//Number(xExtent[0])
      const xmax = 37.5 //Number(xExtent[1])
      const ymin = -40 //Number(yExtent[0])
      const ymax = 39.5 //Number(yExtent[1]) //here this need to be replaced the actual max value of the data

      //Draw the data points on the chart
      getCords(RouteId).then((data) => {
        const width = window.innerWidth - 20;
        const height = window.innerHeight - 20;

        // normalize the data to fit the svg element
        const xScale = d3.scaleLinear().domain([xmin, xmax + 11]).range([0, width]); //here
        const yScale = d3.scaleLinear().domain([ymin, ymax]).range([0, height]);

        // create the svg element
        const svg = d3.select(svgRef.current)
          .attr("width", width)
          .attr("height", height)
          .style("margin-top", 0)
          .style("margin-left", 0);

        //Draw the path of the order picker 
        svg.selectAll("path.route").remove();
        svg
          .selectAll("path.route")
          .data([data])
          .enter()
          .append("path")
          .attr("class", "route")
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 3)
          .attr("d", d3.line()
            .x((d) => xScale(Number(d.Xcorrdinate)))
            .y((d) => height - yScale(Number(d.Ycorrdinate)))
           
          )
          .attr("marker-start", "url(#arrow)")
         

        var defs = svg.append("defs");


        defs.append("marker")
          .attr("viewBox", "0 -5 10 10")
          .attr("refX", 5)
          .attr("refY", 0)
          .attr("markerWidth", 5)
          .attr("markerHeight", 5)
          .attr("orient", "auto")
          .attr("fill", 'red')

          .append("path")
          .attr("d", "M0,-5L10,0L0,5")
          .attr("class", "arrowHead1");


        const path = svg.selectAll("path.route");
        const pathLength = path.node().getTotalLength();
        const transitionPath = d3.transition().duration(10000);

        path
          .attr("stroke-dashoffset", pathLength)
          .attr("stroke-dasharray", pathLength)
          .transition(transitionPath)
          .attr("stroke-dashoffset", 0);

        //Draw the dots(PICKUP) on the chart
        svg.selectAll("circle").remove();
        svg
          .selectAll("circle")
          .attr("class", "circle")
          .data(data)
          .enter()
          .append("circle")
          .attr("cx", (d) => xScale(Number(d.Xcorrdinate)))
          .attr("cy", (d) => height - yScale(Number(d.Ycorrdinate)))
          .attr("r", 7.5)
          .attr("fill", (d) => {
            if (d.Nodetype == "PICKUP") return "#0096f0"
            else return "none"
          })

          // Our hover effects for the dots
          .on('mouseover', function (mouseevent, d) {
            d3.select(this).transition().duration('50').attr('opacity', '.5')
            d3.select("#text").attr("x", (d: any) => 10).attr("y", (d: any) => 25).text(" * Node Id: " + d.NodeId + " * Node Type: " + d.Nodetype + " * Oder: " + d.order)
          })
          .on('mouseout', function () {
            d3.select(this).transition().duration('50').attr('opacity', '1')
            d3.select("#text").text("")
          });
      });
    });
  }
  else {
    const svg = d3.select(svgRef.current);
    svg.selectAll("circle").remove();
    svg.selectAll("path.route").remove();
    svg.selectAll("text").remove();
  }
}

// Rewrite the chart component so that it updates when the selected option changes
const TrajectoryPlot = (props: { play: boolean; RouteId: number; userType: string }) => {
  const svg = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    Layout(svg, props.userType);
    Chart(svg, props.RouteId, props.play);
  }, [svg, props.play, props.RouteId, props.userType]);

  return (
    <div id="chart">
      <svg ref={svg} />
    </div>
  );
};

export default TrajectoryPlot;

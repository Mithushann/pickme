import * as React from "react";
import * as d3 from "d3";
import axios from "axios";
import jsonParser from '@/util/JsonParser';
import { svg } from "d3";
import print from 'util/print';
import colors from "@/util/Constants";

// When the curser moves over the svg element, the function will be called


// Function to get data from the database 3d
async function getLayout() {
  // fetch 3D object from api
  let data = null;
  const url = 'http://localhost:3333/api/get3d';
  await fetch(url)
    .then((response) => response.json())
    .then((d) => {
      data = jsonParser(d[0]);
      // print(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  // print(data)

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
    // print(Data)
    // const cords = Data.map((d: any) => [Number(d.Xcorrdinate), Number(d.Ycorrdinate), d.NodeId, d.Nodetype]);
    const cords = Data;
    // print(cords)
    return cords;
  }
  catch (error) {
    console.log(error);
  }
}

function Tooltip(svg, x, y, content, windowWidth, windowHeight) {

  svg.append("rect")
      .attr("id", "tooltip_rect_t")
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
      .attr("id", "tooltip_text_t")
      .attr("x", ()=>{if(x > windowWidth/2){return x-220+10}else{return x+10}})
      .attr("y", ()=>{if(y > windowHeight/2){return y-50+25}else{return y+25}})
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

function Layout(svgRef: React.RefObject<SVGSVGElement>) {
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

    // svg
    //   .append("text")
    //   .attr("id", "text")

    svg.selectAll("rect").remove();

    // draw the rack using drawRect function
    drawRect(svg, data.Rack, xScale, yScale, width, height, colors.SecondaryColorTillit, "rack");

    // draw the Depot using drawRect function
    drawRect(svg, data.Depot, xScale, yScale, width, height, colors.PrimaryColorKvalite, "depot");

    // Elevator, Aisle, CrossAisle, Wall
    

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

      // const d = [[10, 10], [10, height - 10], [width - 10, height - 10], [width - 10, 10], [100, 100], [10, 10]];

      // normalize the data to fit the svg element
      // print(xmin + " " + xmax + " " + ymin + " " + ymax)
      const xScale = d3.scaleLinear().domain([xmin, xmax + 11]).range([0, width]); //here
      const yScale = d3.scaleLinear().domain([ymin, ymax]).range([0, height]);

      // create the svg element
      const svg = d3.select(svgRef.current);

      svg.selectAll("circle").remove();

      svg
        .attr("width", width)
        .attr("height", height)
        .style("margin-top", 0)
        .style("margin-left", 0);

      // // draw the path
      svg.selectAll("path").remove();
      
      svg
        .selectAll("path")
        .attr("class", "path")
        .data([data].sort((a, b) => d3.ascending(a.order, b.order)))
        .enter()
        .append("path")
        .attr("id", (d) => "path" + d.order)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 3)
        .attr("d", d3.line()
          .x((d) => xScale(Number(d.Xcorrdinate)))
          .y((d) => height - yScale(Number(d.Ycorrdinate)))
        )

      const path = svg.select("path");
      const pathLength = path.node().getTotalLength();
      const transitionPath = d3.transition().duration(10000);

      path
        .attr("stroke-dashoffset", pathLength)
        .attr("stroke-dasharray", pathLength)
        .transition(transitionPath)
        .attr("stroke-dashoffset", 0);
                       
      svg
        .selectAll("circle")
        .attr("class", "circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(Number(d.Xcorrdinate)))
        .attr("cy", (d) => height - yScale(Number(d.Ycorrdinate)))
        .attr("r",7.5)
        .attr("fill", (d) => {
          if (d.Nodetype == "PICKUP") return "#0096f0"
          else return "none"
        })

        // Our hover effects for the dots
        .on('mouseover', function (mouseevent, d) {
          d3.select(this).transition().duration('50').attr('opacity', '.5')
          d3.select("#text").attr("x", (d: any) => 10).attr("y", (d: any) => 25).text(" * Node Id: " + d.NodeId + " * Node Type: " + d.Nodetype + " * Oder: " + d.order )
        })
        .on('mouseout', function () {
          d3.select(this).transition().duration('50').attr('opacity', '1')
          d3.select("#text").text("")
        });
    });
  });
}
else{
  const svg = d3.select(svgRef.current);
  svg.selectAll("circle").remove();
  svg.selectAll("path").remove();
  svg.selectAll("text").remove();
}
}

// Rewrite the chart component so that it updates when the selected option changes
const TrajectoryPlot = (props: { play: boolean; RouteId: number; }) => {
  const svg = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    Layout(svg);
    Chart(svg, props.RouteId, props.play);
  }, [svg, props.play, props.RouteId]);

  return (
    <div id="chart">
      <svg ref={svg} />
    </div>
  );
};

export default TrajectoryPlot;

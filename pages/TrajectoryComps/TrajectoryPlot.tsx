import * as React from "react";
import * as d3 from "d3";
import axios from "axios";
import Layout from "../components/Layout";
import print from 'util/print';

// A function to get all route data from the api (getAllCords())
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

// A function to get the route data (given RouteID) from the api (getCords(RouteId))
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

async function drawOnePath(svgRef: React.RefObject<SVGSVGElement>, RouteId: number, allCords: any) {
// print("allCords", allCords)
//   allCords.then((dataAll) => {
//     // find the min and max values of the data
//     const xExtent = d3.extent(dataAll, (d) => d[0]);
//     const yExtent = d3.extent(dataAll, (d) => d[1]);
    const xmin = -74//Number(xExtent[0])
    const xmax = 37.5 //Number(xExtent[1])
    const ymin = -40 //Number(yExtent[0])
    const ymax = 39.5 //Number(yExtent[1]) //here this need to be replaced the actual max value of the data
  
  await getCords(RouteId).then((data) => {
    const colors = ['#e6194B', '#3cb44b', '#ffe119', '#0082c8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#d2f53c', '#fabebe']
    const color_names = ['Red', 'Green', 'Yellow', 'Blue', 'Orange', 'Purple', 'Cyan', 'Magenta', 'Lime', 'Pink']
    
    const randomColor = colors[Math.floor(Math.random() * colors.length)]

    print("Rouidprint:", String(RouteId))
    const width = window.innerWidth ;
    const height = window.innerHeight-4;

    // print("width", width)
    // print("height", height)


    // normalize the data to fit the svg element
    const xScale = d3.scaleLinear().domain([xmin, xmax + 11]).range([0, width]); //here
    const yScale = d3.scaleLinear().domain([ymin, ymax]).range([0, height]);

    // create the svg element
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("margin-top", 0)
      .style("margin-left", 0);

 
    svg
    // .append("g")
      .selectAll("path.route"+RouteId)
      .data([data])
      .enter()
      .append("path")
      .attr("class", "route"+RouteId)
      .attr("fill", "none")
      .attr("stroke", randomColor)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 3)
      .attr("d", d3.line()
        .x((d) => xScale(Number(d.Xcorrdinate)))
        .y((d) => height - yScale(Number(d.Ycorrdinate)))
       
      );


    // const path = svg.selectAll("path.route"+RouteId);

    // const pathLength = path.node().getTotalLength();
    // const transitionPath = d3.transition().duration(10000);

    // path
    //   .attr("stroke-dashoffset", pathLength)
    //   .attr("stroke-dasharray", pathLength)
    //   .transition(transitionPath)
    //   .attr("stroke-dashoffset", 0);

    svg
      .selectAll("circle"+RouteId)
      .attr("class", "circle"+RouteId)
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d: any) => xScale(Number(d.Xcorrdinate)))
      .attr("cy", (d: any) => height - yScale(Number(d.Ycorrdinate)))
      .attr("r", 7.5)
      .attr("fill", (d: any) => {
        if (d.Nodetype == "PICKUP"){ 
          return randomColor
      
      }
        else return "none"
      })

  
  });
// });
}


// draw the chart given the ROuteId 
function Chart(svgRef: React.RefObject<SVGSVGElement>, RouteIds: number[], play: boolean, allCords: any) {

  if (play) {
    RouteIds.map((RouteId) => {
      drawOnePath(svgRef, RouteId, allCords);
    }
    );
  }
  else {
    const svg = d3.select(svgRef.current);
    svg.selectAll("circle").remove();
    RouteIds.map((RouteId) => {
    svg.selectAll("path.route"+ RouteId).remove();
    });
    svg.selectAll("text").remove();
  }
}

// Rewrite the chart component so that it updates when the selected option changes
  const TrajectoryPlot = (props: { play: boolean; RouteIds: number[]; userType: string }) => {

  const [allCords, setAllCords] = React.useState([])
  const svg = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
   getAllCords().then((dataAll) => {
    print("hello")
    setAllCords(dataAll)
  })
}, [svg ]);

  React.useEffect(() => {
    Layout(svg, props.userType);
    Chart(svg, props.RouteIds, props.play, allCords);
  }, [svg, props.play, props.RouteIds, props.userType]);

  return (
    <div id="chart">
      <svg ref={svg} />
    </div>
  );
};

export default TrajectoryPlot;

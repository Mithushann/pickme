import React from 'react';
import * as d3 from 'd3';
import Layout from '../components/Layout';
import print from 'util/print';
import axios from 'axios';
import { getCords, getDataFromOptiplanWarehouse } from '../api/getData';

function interpolateColor(color1: number[], color2: number[], factor: number): number[] {
  const result = [];
  for (let i = 0; i < color1.length; i++) {
    result[i] = Math.round(color1[i] + (color2[i] - color1[i]) * factor);
  }
  return result;
}

function color(){
const blue = [0, 0, 255]; // RGB value of blue
const red = [255, 0, 0]; // RGB value of red

const colorScale = [];
for (let i = 0; i < 10; i++) {
  const factor = i / 5; // factor ranges from 0 to 1
  const color = interpolateColor(blue, red, factor);
  colorScale.push(color);
}
return colorScale;
}

function Tooltip(svg, x, y, content, windowWidth, windowHeight) {

  svg.append("rect")
    .attr("id", "tooltip_circle_t")
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
    .attr("id", "tooltip_circle_text_t")
    .attr("x", () => { if (x > windowWidth / 2) { return x - 220 + 10 } else { return x + 10 } })
    .attr("y", () => { if (y > windowHeight / 2) { return y - 50 + 25 } else { return y + 25 } })
    .text(content)
    .attr("font-size", 20)
    .attr("fill", "black")

}



async function getAllCords() {
  try {
    const response = await axios.get("http://localhost:3333/api/getAll");
    const Data = response.data;
    return Data;
  }
  catch (error) {
    console.log(error);
  }
}

function PointMap(svgRef: React.RefObject<SVGSVGElement>) {
  const width = window.innerWidth;
  const height = window.innerHeight - 4;

  const svg = d3.select(svgRef.current);

  getDataFromOptiplanWarehouse().then((data) => {
    print(data);
  });

  getAllCords().then((dataAll) => {

    const xExtent = d3.extent(dataAll, (d) => d.Xcorrdinate);
    const yExtent = d3.extent(dataAll, (d) => d.Ycorrdinate);
    const xmin = Number(xExtent[0]) //-74
    const xmax = Number(xExtent[1]) //37.5 
    const ymin = Number(yExtent[0]) //-40 
    const ymax = Number(yExtent[1]) //39.5 //here this need to be replaced the actual max value of the data

    // normalize the data to fit the svg element
    const xScale = d3.scaleLinear().domain([xmin - 2, xmax + 12]).range([0, width]); //here
    const yScale = d3.scaleLinear().domain([ymin - 1.5, ymax + 1.5]).range([0, height]);

    let uniqueVec: number[][] = []
    let NodeIdMap = new Map<String, number>()

    // create an array of objects with unique x and y properties
    dataAll.map((d: any) => {
      let keyString = String(d.NodeId.split("-")[0]) + String(d.NodeId.split("-")[1])
      if (d.Nodetype == "PICKUP" && uniqueVec.length == 0) {
        uniqueVec.push([d.Xcorrdinate, d.Ycorrdinate])
        NodeIdMap.set(keyString, 1)
      }
      else if (d.Nodetype == "PICKUP" && uniqueVec.length > 0) {
        let isDuplicate = false

        for (let i = 0; i < uniqueVec.length; i++) {
          if (uniqueVec[i][0] == d.Xcorrdinate && uniqueVec[i][1] == d.Ycorrdinate) {
            isDuplicate = true
          }
        }
        if (!isDuplicate) {
          uniqueVec.push([d.Xcorrdinate, d.Ycorrdinate])
          NodeIdMap.set(keyString, 1)
        }
        else {
          let count = NodeIdMap.get(keyString)
          NodeIdMap.set(keyString, count + 1)
        }
      }

      return uniqueVec

    });
    //--------------------------------------------------------------------------------
    color().map((d, i) => { 
      svg.append("circle")
        .attr("cx", 10)
        .attr("cy", 10 + (i * 20))
        .attr("r", i+1)
        .attr("fill", `rgb(${d[0]},${d[1]},${d[2]})`)
        .attr("opacity", .75)

      svg.append("text")
        .attr("x", 30)
        .attr("y", 10 + (i * 20) + 5)
        .text(i + 1)
        .attr("font-size", 20)
        .attr("fill", "black")
    })
    //--------------------------------------------------------------------------------
    let max = 0
    let min = 1000000000
    dataAll.forEach((d: any) => {
      if (d.Nodetype == "PICKUP") {
        // find the max value of the data and min value of the data
        
        let keyString = String(d.NodeId.split("-")[0]) + String(d.NodeId.split("-")[1])
        let num = NodeIdMap.get(keyString)
        if (num > max) {
          max = num
        }
        if (num < min) {
          min = num
        } 

        svg.append("circle")
          .attr("cx", xScale(d.Xcorrdinate))
          .attr("cy", height - yScale(d.Ycorrdinate))
          .attr("r", ()=>{
            let keyString = String(d.NodeId.split("-")[0]) + String(d.NodeId.split("-")[1])
            return (NodeIdMap.get(keyString))
          })
          .attr("fill", ()=>{
            let keyString = String(d.NodeId.split("-")[0]) + String(d.NodeId.split("-")[1])
            let c = color()
             
            if(NodeIdMap.get(keyString)==1){
              let d = c[0]
              return `rgb(${d[0]},${d[1]},${d[2]})`
            }
            else if(NodeIdMap.get(keyString)==2){
              let d = c[1]
              return `rgb(${d[0]},${d[1]},${d[2]})`
            }
            else if(NodeIdMap.get(keyString)==3){
              let d = c[2]
              return `rgb(${d[0]},${d[1]},${d[2]})`
            }
            else if(NodeIdMap.get(keyString)==4){
              let d = c[3]
              return `rgb(${d[0]},${d[1]},${d[2]})`
            }
            else if(NodeIdMap.get(keyString)==5){
              let d = c[4]
              return `rgb(${d[0]},${d[1]},${d[2]})`
            }
            else if(NodeIdMap.get(keyString)==6){
              let d = c[5]
              return `rgb(${d[0]},${d[1]},${d[2]})`
            }
            else if(NodeIdMap.get(keyString)==7){
              let d = c[6]
              return `rgb(${d[0]},${d[1]},${d[2]})`
            }
            else if(NodeIdMap.get(keyString)==8){
              let d = c[7]
              return `rgb(${d[0]},${d[1]},${d[2]})`
            }
            else if(NodeIdMap.get(keyString)==9){
              let d = c[8]
              return `rgb(${d[0]},${d[1]},${d[2]})`
            }
            else if(NodeIdMap.get(keyString)==10){
              let d = c[9]
              return `rgb(${d[0]},${d[1]},${d[2]})`
            }
            else return "yellow"
            
          })
          .attr("transparency", ".1")
          // Our hover effects for the crossAisle
          .on('mouseover', function (event, d1) {
            d3.select(this).transition().duration('50').attr('opacity', '.5')
            let content = "X: " + d.Xcorrdinate + " Y: " + d.Ycorrdinate;
            let content1 = d.NodeId
            Tooltip(svg, d3.pointer(event)[0], d3.pointer(event)[1], content1, width, height)
          })

          .on('mouseout', function (d, i) {
            d3.select(this).transition().duration('50').attr('opacity', '1')
            svg.select("#tooltip_circle_t").remove();
            svg.select("#tooltip_circle_text_t").remove();
          });
      }
    })
  })
    .catch((error) => {
      console.log(error);
    });

}

const PointHeatmap = (props: { userType: string }) => {
  const svg = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    Layout(svg, props.userType);
    PointMap(svg)
  }, [svg, props.userType]);

  return (
    <div id="Heat">
      <svg ref={svg} />
    </div>
  );
};

export default PointHeatmap;
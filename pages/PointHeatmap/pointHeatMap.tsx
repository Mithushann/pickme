import React from 'react';
import * as d3 from 'd3';
import Layout from '../components/Layout';
import print from 'util/print';
import axios from 'axios';
import { getCords, getAllCords, getDataFromOptiplanWarehouse, getLayout } from '../api/getData';
import { getBoudningBox, getLayoutAisle } from '../api/getLayout';
import { color } from 'util/Colors';
import Legend from './legend';

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

function PointMap(svgRef: React.RefObject<SVGSVGElement>) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const svg = d3.select(svgRef.current);

  getBoudningBox().then((data) => {
    let box = data.layoutBoundingBox
    const xmin = box.xMin
    const xmax = box.xMax
    const ymin = box.yMin
    const ymax = box.yMax

  getAllCords().then((Routes) => {
    Routes.sort((a: any, b: any) => { return a.number - b.number })

    // normalize the data to fit the svg element
    const xScale = d3.scaleLinear().domain([xmin - 2000, xmax + 12000]).range([0, width]); //here
    const yScale = d3.scaleLinear().domain([ymin - 1500, ymax + 1500]).range([height, 0]); //here

    let ShelfMap = new Map<String, number>()
    let AisleMap = new Map<String, number>()

    let colorScale = color()


    // create an array of objects with unique x and y properties
    Routes.map((route: any) => {
      route.routeStops.map((d: any) => {
        let shelfKey = String(d.shelf.orgShelfId)
        let aisleKey = String(d.aisle.orgAisleId)
    
        if (!ShelfMap.has(shelfKey)) {
          ShelfMap.set(shelfKey, 1)
        } 
        else {
          ShelfMap.set(shelfKey, ShelfMap.get(shelfKey) + 1)
        }
    
        if (!AisleMap.has(aisleKey)) {
          AisleMap.set(aisleKey, 1)
        } else {
          AisleMap.set(aisleKey, AisleMap.get(aisleKey) + 1)
        }

        // append legend to the svg element (circle)
        
        svg.append("circle")
          .attr("cx", xScale(d.shelf.xCoor))
    
        svg.append("circle")
          .attr("cx", xScale(d.shelf.xCoor))
          .attr("cy", yScale(d.shelf.yCoor))
          .attr("r", ShelfMap.get(shelfKey))
          .attr("fill", () => {
            let color = colorScale[Math.floor(ShelfMap.get(shelfKey) % 10)]
            return `rgb(${color[0]}, ${color[1]}, ${color[2]})`
          }
          )
          .attr("opacity", .5)
          .on("mouseover", function () {
            d3.select(this).attr("fill", "red")
            Tooltip(svg, xScale(d.shelf.xCoor), yScale(d.shelf.yCoor), shelfKey, width, height)
          })
          .on("mouseout", function () {
            d3.select(this).attr("fill", "black")
            d3.select("#tooltip_circle_t").remove()
            d3.select("#tooltip_circle_text_t").remove()
          })

    });
  });

    // draw a box for each aisle
    //0- up
    //1- down
    //2- Mainly horizzontal both left and right
    getLayoutAisle().then((layout) => {
      layout.aisles.map((d: any) => {
        //append a line to the svg element
        if (d.position === 0) { // horizontal
          svg.append("line")
            .attr("x1", xScale(d.frontEndX))
            .attr("y1", yScale(d.frontEndY))
            .attr("x2", xScale((d.frontEndX + d.tailEndX) / 2)-5)
            .attr("y2", yScale(((d.tailEndY + d.frontEndY) / 2)))
            .attr("stroke", () => {
              let key = String(d.orgAisleId)
              if(AisleMap.has(key)){
              let color = colorScale[Math.ceil(AisleMap.get(key) / 10)]
              return `rgb(${color[0]}, ${color[1]}, ${color[2]})`
              }
              else{
                return "black"
              }
            }
            )
            .attr("stroke-width", Math.floor(AisleMap.get(d.orgAisleId)/10))

            svg.append("line")
            .attr("x1", xScale(d.tailEndX))
            .attr("y1", yScale(d.tailEndY))
            .attr("x2", xScale((d.frontEndX + d.tailEndX) / 2)+25)
            .attr("y2", yScale(((d.tailEndY + d.frontEndY) / 2)))
            .attr("stroke", () => {
              let key = String(d.orgAisleId)
              if(AisleMap.has(key)){
              let color = colorScale[Math.ceil(AisleMap.get(key) / 10)]
              return `rgb(${color[0]}, ${color[1]}, ${color[2]})`
              }
              else{
                return "black"
              }
            }
            )
            .attr("stroke-width", Math.ceil(AisleMap.get(d.orgAisleId)/10))
        }
        else if (d.position === 1) { // vertival
          svg.append("line")
            .attr("x1", xScale(d.frontEndX))
            .attr("y1", yScale(d.frontEndY))
            .attr("x2", xScale((d.frontEndX + d.tailEndX) / 2))
            .attr("y2", yScale(((d.tailEndY + d.frontEndY) / 2))+10)
            .attr("stroke", () => {
              let key = String(d.orgAisleId)
              if(AisleMap.has(key)){
              let color = colorScale[Math.ceil(AisleMap.get(key) / 10)]
              return `rgb(${color[0]}, ${color[1]}, ${color[2]})`
              }
              else{
                return "black"
              }
            }
            )
            .attr("stroke-width", Math.floor(AisleMap.get(d.orgAisleId)/10)) // stroke width range 1-10

            svg.append("line")
            .attr("x1", xScale(d.tailEndX))
            .attr("y1", yScale(d.tailEndY))
            .attr("x2", xScale((d.frontEndX + d.tailEndX) / 2))
            .attr("y2", yScale(((d.tailEndY + d.frontEndY) / 2))-10)
            .attr("stroke", () => {
              let key = String(d.orgAisleId)
              if(AisleMap.has(key)){
              let color = colorScale[Math.ceil(AisleMap.get(key) / 10)]
              return `rgb(${color[0]}, ${color[1]}, ${color[2]})`
              }
              else{
                return "black"
              }
            }
            )
            .attr("stroke-width", Math.floor(AisleMap.get(d.orgAisleId)/10))
        }



        // add text to the aisle
        if (d.position === 1) {
          svg.append("text")
            .attr("x", xScale(d.frontEndX - 500))
            .attr("y", yScale((d.tailEndY + d.frontEndY) / 2))
            .attr("font-size", 10)
            .attr("fill", "black")
            .text(d.orgAisleId )
        }
        else if (d.position === 0) {
          svg.append("text")
            .attr("x", xScale((d.tailEndX + d.frontEndX) / 2))
            .attr("y", yScale(d.tailEndY))
            .attr("font-size", 10)
            .attr("fill", "black")
            .text(d.orgAisleId )
        }

      }
      )
    })
  });
});

}
const PointHeatmap = (props: { userType: string }) => {
  const svg = React.useRef<SVGSVGElement>(null);


  React.useEffect(() => {
    Layout(svg, props.userType,0,0, false);
    PointMap(svg)
  }, [svg, props.userType]);

  return (
    <div id="PointHeat">
      <Legend/>
      <svg ref={svg} />
    </div>
  );
};

export default PointHeatmap;
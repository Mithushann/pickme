import React from 'react';
import * as d3 from 'd3';
import Layout from '../components/Layout';
import axios from "axios";
import print from 'util/print';


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

function PointMap(svgRef: React.RefObject<SVGSVGElement>){
    const width = window.innerWidth - 20;
    const height = window.innerHeight - 20;

    const svg = d3.select(svgRef.current);
    
    getAllCords().then((dataAll) => {

        const xExtent = d3.extent(dataAll, (d) => d[0]);
        const yExtent = d3.extent(dataAll, (d) => d[1]);
        const xmin = -74//Number(xExtent[0])
        const xmax = 37.5 //Number(xExtent[1])
        const ymin = -40 //Number(yExtent[0])
        const ymax = 39.5 //Number(yExtent[1]) //here this need to be replaced the actual max value of the data
  
          // normalize the data to fit the svg element
          const xScale = d3.scaleLinear().domain([xmin, xmax + 11]).range([0, width]); //here
          const yScale = d3.scaleLinear().domain([ymin, ymax]).range([0, height]);

          // create an array of objects with unique x and y properties
          const data = dataAll.map((d) => {
            let uniqueVec: number[][]= []
            if(d.Nodetype =="PICKUP" && uniqueVec.length==0){
                uniqueVec.push([d.Xcorrdinate, d.Ycorrdinate])
            }
            else if(d.Nodetype =="PICKUP" && uniqueVec.length>0){
              let isDuplicate = false
                for(let i=0; i<uniqueVec.length; i++){
                    if(uniqueVec[i][0] == d.Xcorrdinate && uniqueVec[i][1] == d.Ycorrdinate){
                       isDuplicate = true
                    }
                }
                if(!isDuplicate){ 
                  uniqueVec.push([d.Xcorrdinate, d.Ycorrdinate])
                  print("d", d )
                }
            }

            return uniqueVec
        
          });
          //-------------------------------------------------

        // create a heatmap
        const heatmap = svg
          .append("g")
          .attr("class", "heatmap")
          .selectAll("rect")
          .data(data)
          .enter()
          .append("rect")
          .attr("x", (d) => xScale(d.x))
          .attr("y", (d) => yScale(d.y))
          .attr("width", 3)
          .attr("height", 3)
          .attr("fill", "red")
          .attr("opacity", 0.5);
    
        dataAll.forEach((d: any) => {
            if(d.Nodetype =="PICKUP"){
            svg.append("circle")
                .attr("cx", xScale(d.Xcorrdinate))
                .attr("cy", height-yScale(d.Ycorrdinate))
                .attr("r", 3)
                .attr("fill", "black")
                .attr("transparency", "0.1")
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
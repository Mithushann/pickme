import React from 'react';
import * as d3 from 'd3';

async function drawBars(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, 
  data: { Time?: number[]; TimeOptimized: any; }, 
  x: d3.ScaleLinear<number, number, never>, 
  margin: { top: any; right?: number; bottom?: number; left: any; }
  ) 
  {
  let sum = 0;
  for (let i = 0; i < data.TimeOptimized.length; i++) {
    const timeForEachRoute = data.TimeOptimized[i];
    sum += timeForEachRoute;
    svg
      .append('rect')
      .attr('class', 'barOptimized')
      .attr('x', margin.left)
      .attr('y', margin.top + 35)
      .attr('width', x(sum) - margin.left)
      .attr('height', 27)
      .attr('fill', '#354454');
    svg.selectAll(".barOptimized").raise();
    await new Promise(resolve => setTimeout(resolve, timeForEachRoute*10));
  }
}

interface BarChartProps {
  data: { Time: number[], TimeOptimized: number[] }
  dataMax: { TotalTime: number, TotalTimeOptimized: number }
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
}

 const BarChart: React.FC<BarChartProps> = ({
  data,
  dataMax,
  width,
  height,
  margin = { top: 40, right: 40, bottom: 50, left: 50 },
}) => {
  const svgRef = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    // console.log("Data: ", data);
    // console.log("DataMax: ", dataMax)

    // set the dimensions and margins of the graph
    svg.attr('width', width).attr('height', height);


    const y = d3.scaleBand()
      .domain(['Distance', 'DistanceOptimized'])
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    const x = d3
      .scaleLinear()
      .domain([0, Math.ceil(Math.max(dataMax.TotalTime, dataMax.TotalTimeOptimized) / 100) * 100])
      .range([margin.left, width - margin.right]);

    svg
      .append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y));

    svg.selectAll(".x-axis").remove();
    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    // draw the bars for the first time using the dataMax
    svg
      .selectAll('.bar')
      .data(Object.values(dataMax))
      .join('rect')
      .attr('class', 'bar')
      .attr('x', margin.left)
      .attr('y', (d, i) => margin.top * (1.2 + i))
      .attr('width', (d) => x(d) - margin.left)
      .attr('height', 27)
      .attr('fill', '#ccc');
  
      drawBars(svg, data, x, margin);

   }, [data, height, margin, width]);

  return (
    <svg ref={svgRef} >
      <text x={width / 2} y={margin.top / 2} textAnchor="middle" fontWeight="bold">
        Comparision of the distance travelled between the optimized and current solution.
      </text>
    </svg>
  );

};

export default BarChart;

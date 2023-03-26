import React from 'react';
import * as d3 from 'd3';

interface BarChartProps {
  data: { name: string; value: number }[];
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  width,
  height,
  margin = { top: 40, right: 40, bottom: 50, left: 50 },
}) => {
  const svgRef = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) as number])
      .nice()
      .range([margin.left, width - margin.right]);

    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y));

    svg
      .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg
      .selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', margin.left)
      .attr('y', (d) => y(d.name) as number)
      .attr('width', (d) => x(d.value) - margin.left)
      .attr('height', y.bandwidth())
      .attr('fill', 'steelblue');
  }, [data, height, margin, width]);

  return (
    <svg ref={svgRef} width={width} height={height}>
      <text x={width / 2} y={margin.top / 2} textAnchor="middle" fontWeight="bold">
        Comparision of the distance travelled between the optimized and current solution.
      </text>
    </svg>
  );
};

export default BarChart;

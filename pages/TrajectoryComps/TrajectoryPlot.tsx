import * as React from "react";
import Layout from "../components/Layout";
import Chart from "../components/Chart";

// A function to get all route data from the api (getAllCords())

// Rewrite the chart component so that it updates when the selected option changes
const TrajectoryPlot = (props: { play: boolean; RouteIds: number[]; userType: string }) => {

  const svg = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    Layout(svg, props.userType);
    Chart(svg, props.RouteIds, props.play, true); // Last parameter is for isStatic= true, Other wise it will draw the animation 
  }, [svg, props.play, props.RouteIds, props.userType]);

  return (
    <div id="chart">
      <svg ref={svg} />
    </div>
  );
};

export default TrajectoryPlot;
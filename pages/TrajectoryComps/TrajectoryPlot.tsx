import * as React from "react";
import * as d3 from "d3";
import axios from "axios";
import Layout from "../components/Layout";
import print from 'util/print';
import { getAllCords, getCords } from "pages/api/getData";
import drawOnePath from "../components/DrawOnePath";
import Chart from "../components/Chart";

// A function to get all route data from the api (getAllCords())

// Rewrite the chart component so that it updates when the selected option changes
const TrajectoryPlot = (props: { play: boolean; RouteIds: number[]; userType: string }) => {

  const svg = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    Layout(svg, props.userType);
    Chart(svg, props.RouteIds, props.play, true);
  }, [svg, props.play, props.RouteIds, props.userType]);

  return (
    <div id="chart">
      <svg ref={svg} />
    </div>
  );
};

export default TrajectoryPlot;
import * as React from "react";
import * as d3 from "d3";
import Layout from "../components/Layout";
import print from 'util/print';
import { getAllCords, getCords } from "pages/api/getData";
import drawOnePath from "../components/DrawOnePath";
import { color } from "d3";
import { red } from "@mui/material/colors";
import BarChart from "../components/Barchart";
import Chart from "../components/Chart";

const ComparisonView = (props: { userType: string, RouteIds:number[], play: boolean }) => {


    const svgLeft = React.useRef<SVGSVGElement>(null);
    const svgRight = React.useRef<SVGSVGElement>(null);

    // width and height of the svg element
    const width = window.innerWidth;
    const height = window.innerHeight;
    let data: { name: string; value: number; }[] = []

    React.useEffect(() => {
        Layout(svgLeft, props.userType, width/2, height* (3/4));
        Chart(svgLeft, props.RouteIds, props.play, width/2, height* (3/4));

        Layout(svgRight, props.userType, width/2, height* (3/4));
        Chart(svgRight, props.RouteIds, props.play, width/2, height* (3/4));
    
     
        
    }, [ props.userType ]);

    data = [
        { name: 'Optimized ', value: randomIntFromInterval(100, 200) },
        { name: 'Current ', value: randomIntFromInterval(100, 500)},

      ];

    return (
        <div className="cv-container">
            <div className="cv-top-view">
                <div className="cv-top-view-left">
                    <svg ref={svgLeft} />
                </div>
                <div className="cv-top-view-right">
                    <svg ref={svgRight} />
                </div>
            </div>
            <div className="cv-bottom-view" >
                {/* /* Rerender the bar chat when the data changes */}
                <BarChart data={data} width={1000} height={150} />
            </div>
        </div>

    );
};

export default ComparisonView;
function randomIntFromInterval(arg0: number, arg1: number): number {
    //create random number between two numbers
    return Math.floor(Math.random() * (arg1 - arg0 + 1) + arg0);

}


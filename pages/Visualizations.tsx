import React, { useState, useEffect } from "react";

import Dropdown from "./TrajectoryComps/Dropdown";
import TrjectoryPlot from "./TrajectoryComps/TrajectoryPlot";
import Controller from "./TrajectoryComps/Controller";
import colors from "@/util/Constants";
import print from "@/util/print";
import HeatMap from "./HeatMapComps/HeatMap";
import TrajectoryPlot from "./TrajectoryComps/TrajectoryPlot";
import CustomizedMenus from "./components/menubutton"
import PointHeatmap from "./PointHeatmap/pointHeatMap";

interface Props {
    userType: string;
}

class Visualizations extends React.Component<Props> {
    constructor(props) {
        super(props);

        this.state = {
            selected: 4,
            play: false,
            userType: this.props.userType,
            Vis: 0,
        };
        this.handleSelectedChange = this.handleSelectedChange.bind(this);
        this.handlePlayChange = this.handlePlayChange.bind(this);
        this.onSelectedValueChange = this.onSelectedValueChange.bind(this);
        this.onSelectedVizChange = this.onSelectedVizChange.bind(this);
    }


    handleSelectedChange(selected) {
        this.setState({ selected: selected });
    }

    onSelectedValueChange = (value) => {
        console.log("value", value);
        this.setState({ selected: value });
    }


    handlePlayChange(play) {
        this.setState({ play: play });
    }

    onSelectedVizChange = (Viss) => {
        console.log("viz", Viss);
        this.setState({ Vis: Viss });
    }


    // Get the size of the window at any given time
    useWindowSize() {
        const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

        useEffect(() => {
            function handleResize() {
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            }

            // Calls the handleResize function when the window is resized
            window.addEventListener("resize", handleResize);

            // Call handler right away so state gets updated with initial window size
            handleResize();

            // Remove event listener on cleanup
            return () => window.removeEventListener("resize", handleResize);
        }, []); // Empty array ensures that effect is only run on mount
        return windowSize;
    }

    render() {
        return (

            //flexbox container
            <div style={{
                width: this.useWindowSize.width, height: this.useWindowSize.height, display: "flex", flexDirection: "row",
                backgroundColor: colors.PrimaryColorKvalite
            }}>

                <CustomizedMenus
                    onVisChange={this.onSelectedVizChange}
                />
                {this.state.Vis == 0 &&
                    // Trajectory plot
                    <div>
                        <Dropdown
                            selected={this.state.selected}
                            onSelectedChange={this.handleSelectedChange}
                        />
                        <Controller
                            play={this.state.play}
                            onPlayChange={this.handlePlayChange}
                        />

                        <TrjectoryPlot
                            RouteId={this.state.selected}
                            play={this.state.play}
                            userType={this.state.userType} />
                    </div>
                }

                {this.state.Vis == 1 &&
                    // Point Heatmap
                    <div>

                        <PointHeatmap
                            RouteId={this.state.selected}
                            play={this.state.play}
                            userType={this.state.userType}
                            
                        
                        />

                    </div>

                }
                {this.state.Vis == 2 &&
                    // heatmap
                    <div>
                        <HeatMap />
                        <TrjectoryPlot
                            RouteId={this.state.selected}
                            play={false}
                            userType={this.state.userType} />

                    </div>}
            </div>

        );
    }
}

export default Visualizations;


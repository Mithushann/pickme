import React, { useState, useEffect } from "react";
// import Dropdown from "./TrajectoryComps/Dropdown";
import TrjectoryPlot from "./TrajectoryComps/TrajectoryPlot";
import Controller from "./TrajectoryComps/Controller";
import colors from "@/util/Constants";
import HeatMap from "./HeatMapComps/HeatMap";
import CustomizedMenus from "./components/CustomizedMenuButton"
import PointHeatmap from "./PointHeatmap/pointHeatMap";
import UserTypeButton from "./components/UserType";
import ManuelTrajectoryPlot from "./ManuelTrajectoryPlot/ManuelTrajectoryPlot";
import RefillStateGraph from "./RefillStateGraph/RefillStateGraph";


class Visualizations extends React.Component {
    constructor(props: {} | Readonly<{}>) {
        super(props);
        // There is two types of user 1) customer 2)employee
        this.state = {
            selected: [],
            play: false,
            userType: "",
            Vis: 0,
            windowWidth: 0,
            windowHeight: 0,
        };
        // this.handleSelectedChange = this.handleSelectedChange.bind(this);
        this.handlePlayChange = this.handlePlayChange.bind(this);
        this.onSelectedValueChange = this.onSelectedValueChange.bind(this);
        this.onSelectedVizChange = this.onSelectedVizChange.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);

    }
    // handleSelectedChange(selected: any) {
    //     this.setState({ selected: selected });
    // }
    onSelectedValueChange = (values: Number[]) => {
        this.setState({ selected: values });
    }
    handlePlayChange(play: boolean) {
        this.setState({ play: play });
    }
    onSelectedVizChange = (Viss: number) => {
        this.setState({ Vis: Viss });
    }
    handleUserChange = (userType: string) => {
        this.setState({ userType: userType });
    }


    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions);
    }

    updateWindowDimensions = () => {
        this.setState({
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight
        });
    };



    render() {
        return (
            //flexbox container
            <div style={{
                width: this.state.width, height: this.state.height, display: "flex", flexDirection: "row",
                backgroundColor: colors.PrimaryColorKvalite, justifyContent: "right", alignItems: "right"
            }}>
                <CustomizedMenus
                    onVisChange={this.onSelectedVizChange}
                />
                <UserTypeButton
                    onUserChange={this.handleUserChange}
                />
                {this.state.Vis == 0 &&
                    // Trajectory plot
                    <div>
                        <Controller
                            play={this.state.play}
                            onPlayChange={this.handlePlayChange}
                            selected={this.state.selected}
                            onSelectedChange={this.onSelectedValueChange}
                        />

                        <TrjectoryPlot
                            RouteIds={this.state.selected}
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

                {this.state.Vis == 3 &&

                    <div>
                           <Controller
                            play={this.state.play}
                            onPlayChange={this.handlePlayChange}
                            selected={this.state.selected}
                            onSelectedChange={this.onSelectedValueChange}
                        />
                        
                        <ManuelTrajectoryPlot
                            play={this.state.play}
                            RouteIds={this.state.selected}
                            userType={this.state.userType} />
                    </div>

                }
                {
                this.state.Vis == 4 &&
                <div>
                    <RefillStateGraph 
                    userType="this.state.userType"
                    />
                </div>
                }

            </div>
        );
    }
}

export default Visualizations;


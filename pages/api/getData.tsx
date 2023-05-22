
import React from "react";
import axios from "axios";
import jsonParser from '@/util/JsonParser';

async function getAllCords(optimizationId: String = "clhqcwryx32723906r0iqsreysv") {
  try {
    // graphql query
    const query = `{
      optimization(optimizationId: "${optimizationId}") {
        subGroups {
          solution {
            routes {             
              number
              routeStops {
                   shelf {
                     orgShelfId
                     xCoor
                     yCoor
                   }
                   aisle {
                     orgAisleId
                     frontEndX
                   }
                 }
                 routeTrajectories {
                   xCoor
                   yCoor
                 }

            }
          }
        }
      }
    }`;
    // graphql query headers
    let headers = {
      "Content-Type": "application/json",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsZGVuaHJpODE2MjkwNDAwNm1nZDlxejFuNnYiLCJpYXQiOjE2NzYyOTU1MzV9.YECHFjT0o1Ekx4BPKx0ulie0w0TbYP76gihBpG0f6Ds"
    };
    // graphql query url
    const url = "https://optiplanwarehouse.com/graphql";
    // graphql query
    const response = await axios.post(url, {
      query: query
    }, { headers: headers });
    const Routes = response.data.data.optimization.subGroups[0].solution.routes;
    return Routes;
  }
  catch (error) {
    console.log("Error in api/getData.tsx");
    console.log(error);
  }

}

// A function to get the route data (given RouteID) from the api (getCords(RouteId))
async function getCords(Id: string = "clhqcwryx32723906r0iqsreysv", RouteId: number = 0) {
  try {
    // graphql query
    const query = `{
      optimization(optimizationId: "${Id}") {
        subGroups {
          solution {
            routes {             
              number
              routeStops {
                   shelf {
                     orgShelfId
                     xCoor
                     yCoor
                   }
                   aisle {
                     orgAisleId
                     frontEndX
                   }
                 }
                 routeTrajectories {
                   xCoor
                   yCoor
                 }

            }
          }
        }
      }
    }`;
    // graphql query headers
    let headers = {
      "Content-Type": "application/json",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsZGVuaHJpODE2MjkwNDAwNm1nZDlxejFuNnYiLCJpYXQiOjE2NzYyOTU1MzV9.YECHFjT0o1Ekx4BPKx0ulie0w0TbYP76gihBpG0f6Ds"
    };
    // graphql query url
    const url = "https://optiplanwarehouse.com/graphql";
    // graphql query
    const response = await axios.post(url, {
      query: query
    }, { headers: headers });

    const Routes = response.data.data.optimization.subGroups[0].solution.routes;
    const Route = Routes.filter((route: any) => route.number === RouteId)[0];
    const RouteStops = Route.routeStops;
    const RouteTrajectories = Route.routeTrajectories;

    return [RouteStops, RouteTrajectories];
  }
  catch (error) {
    console.log("Error in api/getData.tsx");
    console.log(error);
  }
}

async function getDataFromOptiplanWarehouse(optimizationId = "clfth396f84847606p7ox1fi3l4") {//cle41z5es815906mgsx34ry3v
  try {
    const query = `{
      optimization(optimizationId: "${optimizationId}") {
        subGroups{
          solution{
            routes{
              routeStops{
                shelf{
                  orgShelfId, xCoor, yCoor}, 
                  aisle{
                    orgAisleId, 
                    frontEndX
                  }
                  },
                     routeTrajectories {
                      xCoor, yCoor}
                    }
                  }
                }
              }
            }`;
    const headers = {
      "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsZGVuaHJpODE2MjkwNDAwNm1nZDlxejFuNnYiLCJpYXQiOjE2NzYyOTU1MzV9.YECHFjT0o1Ekx4BPKx0ulie0w0TbYP76gihBpG0f6Ds"
    };

    const response = await axios.get("https://optiplanwarehouse.com/graphql", { params: { query }, headers });
    return response.data.data.optimization.subGroups[0].solution.routes;
  }
  catch (error) {
    console.log(error);
  }
}

// A function to get the data for comparison view given the optimizationId
async function getDataForComparison(optimizationId: string = "cle4178bc167483306mgp7zz1fl8") {
  try {
    const query = `{
      optimization(optimizationId: "${optimizationId}") {
        subGroups {
          solution {
            totalTime
            totalCost
            totalWindowPenalty
            pickingRounds {
              number
            }
            routes {
              maxWeight
              startTime
              finishTime
              totalTravelDistance
              routeStops {
                shelf {
                  orgShelfId
                  xCoor
                  yCoor
                }
                aisle {
                  orgAisleId
                  frontEndX
                }
                deliveryTime
                orderRow {
                  orderRowId
                  quantity
                  weight
                  volume
                }
              }
              routeTrajectories {
                xCoor
                yCoor
              }
            }
          }
        }
      }
    } `;
    const headers = {
      "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsZGVuaHJpODE2MjkwNDAwNm1nZDlxejFuNnYiLCJpYXQiOjE2NzYyOTU1MzV9.YECHFjT0o1Ekx4BPKx0ulie0w0TbYP76gihBpG0f6Ds"
    };

    const response = await axios.get("https://optiplanwarehouse.com/graphql", { params: { query }, headers });
    // console.log(response)
    return response.data.data.optimization.subGroups[0].solution;
  }
  catch (error) {
    console.log(error);
  }
}

export { getAllCords, getCords, getDataFromOptiplanWarehouse, getDataForComparison };


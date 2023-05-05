import axios from "axios";

export default async function getDropDownElements(Id: string = "clfth396f84847606p7ox1fi3l4") {
    try {
        // graphql query
        const query = `{
      optimization(optimizationId: "${Id}") {
        subGroups {
          solution {
            routes {             
              number
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

        const RouteNumber = response.data.data.optimization.subGroups[0].solution.routes;

        return RouteNumber;
    }
    catch (error) {
        console.log("Error in api/getDropDownElements.tsx");
        console.log(error);
    }
}

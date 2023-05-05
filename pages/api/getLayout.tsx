import axios from "axios";


async function getBoudningBox(datasetId="clgxhsig8372409qfwj5lsoh5"){
  try{
    const query = `  {layoutBoundingBox(datasetId:"clgxhsig8372409qfwj5lsoh5"){
      xMin
      xMax
      yMin
      yMax
    }} `;
    const headers = {
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsZGVuaHJpODE2MjkwNDAwNm1nZDlxejFuNnYiLCJpYXQiOjE2NzYyOTU1MzV9.YECHFjT0o1Ekx4BPKx0ulie0w0TbYP76gihBpG0f6Ds"
    };

     const response = await axios.get("https://optiplanwarehouse.com/graphql", {params: {query}, headers});
     return response.data.data;
    }
    catch (error) {
      console.log("Error in api/getLayout.tsx");
      console.log(error);
  }
}

async function getLayoutAisle(datasetId="clgxhsig8372409qfwj5lsoh5") {
    try {
    const query= `  {aisles(datasetId:"${datasetId}"){
      frontEndX
      tailEndX
      frontEndY
      tailEndY
      orgAisleId
      direction
      position
    }
  }`;
    const headers = {
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsZGVuaHJpODE2MjkwNDAwNm1nZDlxejFuNnYiLCJpYXQiOjE2NzYyOTU1MzV9.YECHFjT0o1Ekx4BPKx0ulie0w0TbYP76gihBpG0f6Ds"
    };

     const response = await axios.get("https://optiplanwarehouse.com/graphql", {params: {query}, headers});
     return response.data.data;
    }
    catch (error) {
      console.log("Error in api/getLayout.tsx");
      console.log(error);
      
    }
  }

  async function getLayoutShelf(datasetId="clgxhsig8372409qfwj5lsoh5") {
    try {
    const query= ` {
      shelves(datasetId: "${datasetId}") {
        xCoor
        yCoor
        orgShelfId
      }
    }`;

    const headers = {
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsZGVuaHJpODE2MjkwNDAwNm1nZDlxejFuNnYiLCJpYXQiOjE2NzYyOTU1MzV9.YECHFjT0o1Ekx4BPKx0ulie0w0TbYP76gihBpG0f6Ds"
    };

    const response = await axios.get("https://optiplanwarehouse.com/graphql", {params: {query}, headers});
    return response.data.data;
    }
    catch (error) {
      console.log("Error in api/getLayout.tsx");
      console.log(error);
    }
  }

  async function getLayoutRacks(datasetId="clgxhsig8372409qfwj5lsoh5") {
    try {
    const query= `{
      racks(datasetId: "${datasetId}") {
          id
           bottomLeft
           topLeft
           topRight
           bottomRight
      }
    }`;

    const headers = {
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsZGVuaHJpODE2MjkwNDAwNm1nZDlxejFuNnYiLCJpYXQiOjE2NzYyOTU1MzV9.YECHFjT0o1Ekx4BPKx0ulie0w0TbYP76gihBpG0f6Ds"
    };

    const response = await axios.get("https://optiplanwarehouse.com/graphql", {params: {query}, headers});
    // console.log(response.data.data.racks)
    return response.data.data;
    }
    catch (error) {
      console.log("Error in api/getLayout.tsx");
      console.log(error);
    }
  }

  async function getLayoutDepot(datasetId="clgxhsig8372409qfwj5lsoh5") {
    try {
    const query= `{depots(datasetId:"clgxhsig8372409qfwj5lsoh5")
    {
      id
      orgDepotId
      depotId
      name  
      xCoor
      yCoor
    }
    }`;

    const headers = {
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsZGVuaHJpODE2MjkwNDAwNm1nZDlxejFuNnYiLCJpYXQiOjE2NzYyOTU1MzV9.YECHFjT0o1Ekx4BPKx0ulie0w0TbYP76gihBpG0f6Ds"
    };

    const response = await axios.get("https://optiplanwarehouse.com/graphql", {params: {query}, headers});
    // console.log(response.data.data.racks)
    return response.data.data;
    }
    catch (error) {
      console.log("Error in api/getLayout.tsx");
      console.log(error);
    }
  }

  // async function getLayoutFromOptiplan(datasetId="clgxhsig8372409qfwj5lsoh5") {
  //   try {
  //     let BoundingBox = getBoudningBox(datasetId);
  //     let Ailse = getLayoutAisle(datasetId);
  //     let Shelf = getLayoutShelf(datasetId);
  //     let Racks = getLayoutRacks(datasetId);
  //     let data = {"BoundingBox": BoundingBox, "Aisle": Ailse, "Shelf": Shelf, "Racks": Racks};
  //     return data;
  //   }
  //   catch (error) {
  //     console.log("Error in api/getLayout.tsx");
  //     console.log(error);
  //   }
  // }



    export {getBoudningBox, getLayoutAisle, getLayoutShelf, getLayoutRacks, getLayoutDepot};
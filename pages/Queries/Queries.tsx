
  import { gql } from '@apollo/client';

  // Query for getting all the shelves in a dataset
const SHELVES = gql`
  query shelves($datasetId: String!) {
    shelves(datasetId: $datasetId) {
      orgShelfId
      xCoor
      yCoor
      shelfId
    }
  }
`;

// Query for getting all the --- in a dataset

const optimization = gql`
optimization(optimizationId:"cle41z5es815906mgsx34ry3v") {
   subGroups{
     solution{
       routes{
         routeStops{
           id, 
           pickingTime,
           order{id},
           deliveryTime
         }
       
         routeStops{
           shelf{
             orgShelfId, 
             xCoor, 
             yCoor
           }
         }
       }
     }
   }
 }`;


 


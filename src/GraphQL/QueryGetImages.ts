import gql from "graphql-tag";

export default gql`query {
    getImages {
        id
        timestamp
    }
}`;
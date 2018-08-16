import gql from 'graphql-tag';

export default gql`
    mutation ($file: S3ObjectInput!) {
        postImages(
            file: $file
        ) {
            id
            timestamp
        }
    }`;
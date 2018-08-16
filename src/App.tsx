import Amplify from 'aws-amplify'
import {Auth} from 'aws-amplify'
import AWSAppSyncClient from "aws-appsync"
import {Rehydrated} from "aws-appsync-react"
import { Component } from 'react'
import * as React from 'react'
import {ApolloProvider} from 'react-apollo'
import './App.css'
import aws_exports from './aws-exports'
import Home from "./Components/Home"

Amplify.configure(aws_exports);

// @ts-ignore
const client = new AWSAppSyncClient({
    auth: {
        apiKey: aws_exports.aws_appsync_apiKey,
        type: aws_exports.aws_appsync_authenticationType,
    },
    complexObjectsCredentials: () => Auth.currentCredentials(),
    disableOffline: true,
    region: aws_exports.aws_appsync_region,
    url: aws_exports.aws_appsync_graphqlEndpoint,
});

class App extends Component {
    public async componentWillMount() {
        client.initQueryManager();
        await client.resetStore();
    }

    public render() {
        return (
            <div className="App">
                <Home />
            </div>
        );
    }
}

export default () => (
    <ApolloProvider client={client}>
        <Rehydrated>
            <App />
        </Rehydrated>
    </ApolloProvider>
);

import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { MediaUploader } from './components/MediaUploader';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';

import './custom.css'
import { PersonalFeed } from './components/PersonalFeed';
import {FriendFeed} from "./components/FriendFeed";
import {Users} from "./components/Users";

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <Layout>
                <Route exact path='/' component={Home} />
                <AuthorizeRoute path='/upload' component={MediaUploader} />
                <AuthorizeRoute path='/feed' component={FetchData} />
                <AuthorizeRoute path='/personalFeed' component={PersonalFeed} />
                <AuthorizeRoute path='/friendFeed' component={FriendFeed} />
                <AuthorizeRoute path='/users' component={Users} />
                <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
            </Layout>
        );
    }
}

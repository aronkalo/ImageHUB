import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'
import './PersonalFeed.css';
import setting_img from './images/settings.png'
import comment_img from './images/white-comment.png'
import like_img from './images/white-like.png'
import { Link } from 'react-router-dom';
import { ApplicationPaths } from './api-authorization/ApiAuthorizationConstants';
import { NavLink } from 'reactstrap';

export class PersonalFeed extends Component {
    static displayName = PersonalFeed.name;
    static profilePath = `${ApplicationPaths.Profile}`;

    constructor(props) {
        super(props)
        this.state = { loading: true };
    }

    componentDidMount() {
        this.PersonalDatas();
    }

    static renderHeader() {
        return (
            <header>
                <div class="container">
                    <div class="profile">
                        <div class="profile-image">
                            <img src="https://images.unsplash.com/photo-1513721032312-6a18a42c8763?w=152&h=152&fit=crop&crop=faces" alt=""></img>
                        </div>
                        <div class="profile-user-settings">
                            <h1 class="profile-user-name">janedoe_</h1>
                            <button class="btn profile-edit-btn">Edit Profile</button>
                            <NavLink tag={Link} className="btn profile-settings-btn" to={this.profilePath}>
                                <img class="profile-settings-img" src={setting_img}></img>
                            </NavLink>
                        </div>
                        <div class="profile-stats">
                            <ul>
                                <li><span class="profile-stat-count">{this.PostCount()}</span> posts</li>
                                <li><span class="profile-stat-count">{this.followersCount()}</span> followers</li>
                                <li><span class="profile-stat-count">{this.followingCount()}</span> following</li>
                            </ul>
                        </div>
                        <div class="profile-bio">
                            <p><span class="profile-real-name">Jane Doe</span> Lorem ipsum dolor sit, amet consectetur adipisicing elit 📷✈️🏕️</p>
                        </div>
                    </div>
                </div>
            </header>
        );
    }

    static renderMain() {
        if (this.PostCount() == 0) {
            return (<></>);
        }
        else {
            return (
                <main>
                    <div class="container">
                        <div class="gallery">
                            {this.renderPicture()}
                        </div>
                        <div class="loader">
                        </div>
                    </div>
                </main>
            );
        }
    }

    static renderPicture() {
        return (<>
            <div class="gallery-item" tabindex="0">
                <img src="https://images.unsplash.com/photo-1423012373122-fff0a5d28cc9?w=500&h=500&fit=crop" class="gallery-image" alt=""></img>
                <div class="gallery-item-type">
                    <img></img>
                </div>
                <div class="gallery-item-info">
                    <ul>
                        <li class="gallery-item-likes"><img class="like-img" src={like_img}></img> 30</li>
                        <li class="gallery-item-comments"><img class="comment-img" src={comment_img}></img> 2</li>
                    </ul>
                </div>
            </div>
            <div class="gallery-item" tabindex="0">
                <img src="https://images.unsplash.com/photo-1423012373122-fff0a5d28cc9?w=500&h=500&fit=crop" class="gallery-image" alt=""></img>
                <div class="gallery-item-type">
                    <img></img>
                </div>
                <div class="gallery-item-info">
                    <ul>
                        <li class="gallery-item-likes"><img class="like-img" src={like_img}></img> 30</li>
                        <li class="gallery-item-comments"><img class="comment-img" src={comment_img}></img> 2</li>
                    </ul>
                </div>
            </div>
            <div class="gallery-item" tabindex="0">
                <img src="https://images.unsplash.com/photo-1423012373122-fff0a5d28cc9?w=500&h=500&fit=crop" class="gallery-image" alt=""></img>
                <div class="gallery-item-type">
                    <img></img>
                </div>
                <div class="gallery-item-info">
                    <ul>
                        <li class="gallery-item-likes"><img class="like-img" src={like_img}></img> 30</li>
                        <li class="gallery-item-comments"><img class="comment-img" src={comment_img}></img> 2</li>
                    </ul>
                </div>
            </div></>
        );
    }

    static GetFeed() {
        return (
            <>
                {this.renderHeader()}
                {this.renderMain()}
            </>
        );
    }

    static PostCount() {
        return 3;
    }

    static followersCount() {
        return 148;
    }

    static followingCount() {
        return 190;
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : PersonalFeed.GetFeed();

        return (
            <div>
                {contents}
            </div>
        );
    }

    async PersonalDatas() {
        const token = await authService.getAccessToken();

        this.setState({ loading: false })
    }
}
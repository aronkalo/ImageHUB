import React, { Component, useEffect, useRef } from 'react';
import authService from './api-authorization/AuthorizeService'
import './PersonalFeed.css';
import setting_img from './images/settings.png'
import comment_img from './images/white-comment.png'
import like_img from './images/white-like.png'
import { Link } from 'react-router-dom';
import { ApplicationPaths } from './api-authorization/ApiAuthorizationConstants';
import { NavLink } from 'reactstrap';
import { useState } from 'react'
import { data } from 'jquery';

function Pictures(props) {
    const [buttonPopup, setButtonPopup] = useState(false)
    const [popupData, setPopupData] = useState()
    let popupRef = useRef();

    useEffect(() => {
        document.addEventListener("mousedown", (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setButtonPopup(false);
            }
        });
    });

    function Popup(props) {
        return (props.trigger) ? (
            <div class="popup">
                <div class="popup-inner" ref={popupRef}>
                    <img src={"https://localhost:44335/services/files/" + props.data.identifier} class="gallery-image" alt=""></img>
                </div>
            </div>
        ) : null;
    };

    function OnOrTwoPicture(props) {
        if (props.count == 1) {
            return (
                <div class="gallery-item" tabindex="0"></div>
            );
        }
        else if (props.count == 2) {
            return (
                <>
                    <div class="gallery-item" tabindex="0"></div>
                    <div class="gallery-item" tabindex="0"></div>
                </>
            );
        }
        else
            return null
    }

    return (
        <>
            {
                props.datas.map((data) =>
                    <div class="gallery-item" tabindex="0" onClick={() => { setButtonPopup(true); setPopupData(data); }}>
                        <img src={"https://localhost:44335/services/files/" + data.identifier} class="gallery-image" alt=""></img>
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
                )
            }
            <OnOrTwoPicture count={props.datas.postcount}></OnOrTwoPicture>
            <div>
                <Popup trigger={buttonPopup} setTrigger={setButtonPopup} data={popupData}>
                </Popup>
            </div>
        </>
    );
}

export class PersonalFeed extends Component {
    static displayName = PersonalFeed.name;
    static profilePath = `${ApplicationPaths.Profile}`;


    constructor(props) {
        super(props)
        this.state = { medias: [], loading: true };
    }

    componentDidMount() {
        this.PersonalDatas();
    }

    static renderHeader(datas) {
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
                                <li><span class="profile-stat-count">{datas.postcount}</span> posts</li>
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

    static renderMain(datas) {
        if (datas.postcount == 0) {
            return (<></>);
        }
        else {
            return (
                <main>
                    <div class="container">
                        <div class="gallery">
                            <Pictures datas={datas}></Pictures>
                        </div>
                        <div class="loader">
                        </div>
                    </div>
                </main>
            );
        }
    }

    static GetFeed(datas) {
        return (
            <>
                {this.renderHeader(datas)}
                {this.renderMain(datas)}
            </>
        );
    }

    static followersCount() {
        return 148;
    }

    static followingCount() {
        return 190;
    }

    render() {
        if (!this.state.loading) {
            this.state.medias.postcount = this.state.medias.length
        }

        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : PersonalFeed.GetFeed(this.state.medias);


        return (
            <div>
                {contents}
            </div>
        );
    }

    async PersonalDatas() {
        const token = await authService.getAccessToken();
        const response = await fetch('services/medias/', {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.setState({ medias: data, loading: false });
    }
}
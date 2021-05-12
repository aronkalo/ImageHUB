import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'
import './FeedCard.css';
import like from './images/like.png'
import testprofileimage from './images/tesztprofile.png'

export class FriendFeed extends Component {
    static displayName = FriendFeed.name;

    constructor(props) {
        super(props);
        this.state = { medias: [], loading: true, commentText: '' };
    }

    async populateMedias() {
        const token = await authService.getAccessToken();
        const friends = await fetch('services/users/friends', {
            method: 'GET',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const friendArray = await friends.json();
        let friendsConcat = '';
        friendArray.map(f => {
            if(f.verified === true){
                friendsConcat += (f.id + '__');
            }
        });
        const response = await fetch('services/medias/friends/' + friendsConcat, {
            method: 'GET',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type' : 'application/json' },
        });
        const data = await response.json();
        console.log(data);
        this.setState({ medias: data, loading: false });
    }

    async likeMedia (media){
        const token = await authService.getAccessToken();
        const response = await fetch('services/medias/likes/' + media.identifier, {
            method: 'POST',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const status = response.status;
        await this.populateMedias();
    }

    async commentMedia (media) {
        const comment = this.state.commentText;
        if (comment == null)
            return;

        const token = await authService.getAccessToken();
        const response = await fetch('services/medias/comments/' + media.identifier + '?commentText=' + comment, {
            method: 'POST',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const status = await response.status;
        await this.populateMedias();
    }

    componentDidMount() {
        this.populateMedias();
    }

    renderMediaTable(media) {
        return (
            <div>
                {media.map(media => this.renderCard(media))}
            </div>
        );
    }

    renderCard(media) {
        return (
            <><div className="card">
                {this.renderUsername(media)}
                {this.renderImage(media)}
                {this.renderStatus(media)}
                {this.renderComment(media)}
            </div>
                <div className="space-between-posts">
                </div></>
        );
    }

    renderUsername(media) {
        return (
            <div className="username">
                <img src={testprofileimage}></img>
                <p>{ media.userName }</p>
            </div>
        )
    }
    renderImage(media) {
        return (
            <img className="postImage" src={ window.location.origin + "/services/files/" + media.identifier }></img>
        )
    }

    renderStatus(media) {
        return (
            <div className="status">
                <div className="imgrow">
                    <div className="like">
                        <button onClick={ e => this.likeMedia(media) }>
                            <img src={like}></img>
                        </button>
                        
                    </div>
                    <div className="like">
                        <h5><strong>{media.numberOfLikes}</strong></h5>
                    </div>
                </div>

                <div><h5> { media.userName }<br/> <b>{ media.text }</b> </h5></div>

                <div className="comments">
                    <ul>
                        {
                            media.comments.map(x => {
                                return <li><h5><strong>{x.text}</strong> - {x.userName}</h5></li>
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }

    renderComment(media) {
        return (
            <div className="commentInput">
                <textarea onChange={ e => this.setState({ commentText: e.target.value }) } placeholder="Add a comment"></textarea>
                <button className="commentSendButton" onClick={ e => this.commentMedia(media)}>Send</button>
            </div>
        )
    }

    render() {
        let contents = this.state.loading
            ? <div className="loader"></div>
            : this.renderMediaTable(this.state.medias);

        return (
            <div>
                <h1 id="tabelLabel" >Friends media</h1>
                <p>Best community worldwide.</p>
                {contents}
            </div>
        );
    }
}

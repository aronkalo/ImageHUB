import { get } from 'jquery';
import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'
import './FeedCard.css';
import like from './images/like.png'
import comment from './images/comment.png'
import testprofileimage from './images/tesztprofile.png'

export class FetchData extends Component {
    static displayName = FetchData.name;

    constructor(props) {
        super(props);
        this.state = { medias: [], loading: true };
    }

    componentDidMount() {
        this.populateMedias();
    }

    static rendeMediaTable(forecasts) {
        return (
            <div>
                {forecasts.map(forecast => this.renderCard(forecast))}
            </div>
        );
    }

    static renderCard(forecast) {
        return (
            <><div className="card">
                {this.renderUsername()}
                {this.renderImage(forecast)}
                {this.renderStatus(forecast)}
                {this.renderComment()}
            </div>
                <div className="space-between-posts">
                </div></>
        );
    }

    static renderUsername() {
        return (
            <div className="username">
                <img src={testprofileimage}></img>
                <p>User neve</p>
            </div>
        )
    }
    static renderImage(forecast) {
        return (
            <img className="postImage" src={"https://localhost:44335/services/files/" + forecast.identifier}></img>
        )
    }

    static renderStatus(forecast) {
        return (
            <div className="status">
                <div className="imgrow">
                    <div className="like">
                        <button>
                            <img src={like}></img>
                        </button>
                    </div>
                    <div className="like">
                        <button>
                            <img src={comment}></img>
                        </button>
                    </div>
                </div>

                <div><b>Kispista</b> { forecast.text } </div>

                <div className="comments">
                    <span>Comments count: x</span>
                </div>

                <span>
                    <a className="user-comment-name" href="referencia az instára">PéterInsta</a>
                </span>
                <span className="user-comment">
                    Very good picture!
                </span>
            </div>
        )
    }

    static renderComment() {
        return (
            <div className="commentInput">
                <textarea placeholder="Add a comment…"></textarea>
                <button className="commentSendButton">Send</button>
            </div>
        )
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : FetchData.rendeMediaTable(this.state.medias);

        return (
            <div>
                <h1 id="tabelLabel" >User media</h1>
                <p>Best community worldwide.</p>
                {contents}
            </div>
        );
    }

    async populateMedias() {
        const token = await authService.getAccessToken();
        const response = await fetch('services/medias/', {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.setState({ medias: data, loading: false });
    }
}

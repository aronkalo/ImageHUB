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
        return (forecasts.map(forecast =>
                    {
                        this.renderCard(forecast)
                    })
        );
    }

    static renderCard(forecast) {
        return (
            <div className="card">
                { this.renderUsername()}
                { this.renderImage(forecast)}
                { this.renderStatus(forecast)}
                { this.renderComment()}
            </div>
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
            <img className="postImage" src={"https://localhost:5001/services/files/" + forecast.identifier}></img>
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

                <div><b>Kispista</b> Ez egy nagyon szép kép, én csináltam </div>

                <div class="comments">
                    <span>Ennyi DB komment van</span>
                </div>

                <span>
                    <a class="user-comment-name" href="referencia a másik csávó instájához">PéterInsta</a>
                </span>
                <span class="user-comment">
                    {forecast.text }
                </span>
            </div>
        )
    }

    static renderComment() {
        return (
            <div className="commentInput">
                <textarea placeholder="Add a comment…"></textarea>
                <button class="commentSendButton">Küldés</button>
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

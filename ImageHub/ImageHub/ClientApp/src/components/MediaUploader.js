import { post } from 'jquery';
import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'
import './MediaUploader.css';

export class MediaUploader extends Component {
    static displayName = MediaUploader.name;

    constructor(props) {
        super(props);
        this.state = {
            file: '',
            text: ''
        };
    }

    componentDidMount() {

    }

    submit = async (e) => {
        const url = 'services/medias';
        const token = await authService.getAccessToken();
        const config = {
            method: 'POST',
            headers: !token ? {} : {
                'Authorization': `Bearer ${token}`,
            },
            body: new FormData(document.getElementById('form')),
        };
        return await fetch(url, config)
            .catch(e => console.error(e));
    }

    render() {
        return (
                <form id='form'>
                    <label>Media</label><br></br>
                    <input name="file" type="file" onChange={e => this.setState({ file: e.target.files[0] })} /><br></br>
                    <label>Description</label>
                    <input name="text" type="text" value={this.state.text} onChange={e => this.setState({ text: e.target.value })} />
                    <button onClick={async e => await this.submit(e)}>Upload</button>
                </form>
        );
    }
}

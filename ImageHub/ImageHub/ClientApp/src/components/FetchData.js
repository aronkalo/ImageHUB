import { get } from 'jquery';
import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'

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
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <tbody>
                    {forecasts.map(forecast =>
                        <tr key={forecast.identifier}>
                            <td>
                                <div>
                                    <img src={"https://localhost:5001/services/files/" + forecast.identifier} />
                                    <p>{forecast.text}</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
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

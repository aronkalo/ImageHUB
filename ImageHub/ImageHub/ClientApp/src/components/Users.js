import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'

export class Users extends Component{
    static displayName = Users.name;
    
    constructor(props) {
        super(props);
        this.state = { allUsers: [], friends: [] };
    }
    
    async getUsers(){
        const token = await authService.getAccessToken();
        const userResponse = await fetch('services/users/', {
            method: 'GET',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const all = await userResponse.json();
        const friendResponse = await fetch('services/users/friends', {
            method: 'GET',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const fr = await friendResponse.json();
        this.setState({ allUsers: all, friends : fr});
    }
    
    async switchState(userId){
        const token = await authService.getAccessToken();
        await fetch('services/users/?userId='+userId, {
            method: 'POST',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        await this.getUsers();
    }
    
    componentDidMount() {
        this.getUsers();
    }

    render() {
        return (this.state.allUsers?.length === 0 ? <p>Loading...</p> : 
            <ul>
                {
                    this.state.allUsers.map(x => 
                    {
                        console.log(x);
                        const isFriend = this.state.friends.find(y => y.id === x.id);
                        return (<li id={ x.id }>
                                    <div style={{display: "flex", flex: "auto", alignContent: "space-evenly", margin: "20px"}}>
                                        <button style={{backgroundColor : (isFriend ? "indianred" : "lightblue"), color: "white", width: "150px"}} onClick={ e => this.switchState(x.id)}><h2>{isFriend ? 'Unfriend' : 'Friend' }</h2></button>
                                        <h3 style={{marginInlineStart: "50px"}}><strong>{ x.name }</strong></h3>
                                    </div>
                                </li>)
                    })
                }  
            </ul>);
    }
}
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
    
    async switchState(userId, positive){
        const token = await authService.getAccessToken();
        await fetch('services/users/?userId='+userId + '&positive=' + positive, {
            method: 'POST',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        await this.getUsers();
    }
    
    componentDidMount() {
        this.getUsers();
    }

    render() {
        return this.state.allUsers?.length === 0 ? <p>Loading...</p> : 
            <ul>
                {

                    this.state.allUsers.map(x => 
                    {
                        console.log(this.state.allUsers);
                        console.log(this.state.friends);
                        const isFriend = this.state.friends.filter(y => x.id === y.id);
                        console.log(isFriend);
                        return <li id={ x.id }>
                                    <div style={{display: "flex", flex: "auto", alignContent: "space-evenly", margin: "20px"}}>
                                        {this.renderButton(isFriend, x.id)}
                                        <h3 style={{marginInlineStart: "50px"}}><strong>{ x.name }</strong></h3>
                                    </div>
                                </li>
                    })
                }  
            </ul>
    }
    
    renderButton(isFriend, id){
        return (isFriend?.length > 0 ? (isFriend[0].verified === true ? <button style={{backgroundColor : "indianred", color: "white", width: "150px"}} onClick={ e => this.switchState(id, false)}><h2>Unfriend</h2></button>
            : (isFriend[0].other === false ?  <button style={{backgroundColor : "lightblue", color: "white", width: "150px"}} onClick={ e => this.switchState(id, false)}><h2>Waiting for approval</h2></button>
                : <div><button style={{backgroundColor : "lightblue", color: "white", width: "150px"}} onClick={ e => this.switchState(id, true)}><h2>Approve</h2></button><button style={{backgroundColor : "indianred", color: "white", width: "150px"}} onClick={ e => this.switchState(id, false)}><h2>Decline</h2></button></div>)
        ): <button style={{backgroundColor : "lightblue", color: "white", width: "150px"}} onClick={ e => this.switchState(id, true)}><h2>Friend</h2></button>);
    }
}
import React, { Component } from 'react';
import logo from './images/logo.png'
import bg from './images/bg-hd.jpg'
import './Home.css';

export class Home extends Component {
    static displayName = Home.name;

    render() {
        return (
            <div>
                <marquee direction="left">According to all known laws of aviation, there is no way that a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyways. Because bees don't care what humans think is impossible.</marquee>
                <img class="bg-image" src={bg}/>

                <div class="bg-text">
                    <img src={logo} />
                    <h1>The best way to make memories come to life.</h1>
                </div>

            </div>
        );
    }
}

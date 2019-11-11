import React from "react";
import Posts from "../post/Posts";
import { isAuthenticated } from "../auth";

const Home = () => (
    <div>
        <div className="jumbotron">
            <h2>Home</h2>
            <p className="lead">Channel F</p>
        </div>
        <div className="container">
               <h1><b>{ isAuthenticated() ? (< Posts/>) : "Please sigin to view posts" } </b></h1>
        </div>
    </div>
);

export default Home;

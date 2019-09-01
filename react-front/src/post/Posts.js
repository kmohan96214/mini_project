import React, { Component } from "react";
import { list } from "./apiPost";
import { isAuthenticated } from "../auth";
import DefaultPost from "../images/mountains.jpg";
import { Link } from "react-router-dom";

const test = (page,userid) => {
    return fetch(`http://localhost:8080/api/posts/?page=${page}&userid=${userid}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};


class Posts extends Component {
    constructor() {
        super();
        this.state = {
            posts: [],
            user: {},
            page: 1
        };
    }

    loadPosts = (page) => {
        // console.log(`here calling ${user._id}`);
        let usr = JSON.parse(localStorage.getItem("jwt"));
        // console.log(`id : ${usr.user._id} ${usr}`)
        let userid = null;
        if(usr)
            userid = usr.user._id;
        test(page,userid).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ posts: data });
            }
        });
    };

    componentDidMount() {
        let usr = JSON.parse(localStorage.getItem("jwt"));
        // console.log(`user : ${usr.user._id} ${JSON.parse(localStorage.getItem("new"))}`);
        // this.setState({ user: usr.user });
        this.loadPosts(this.state.page);
    }

    loadMore = number => {
        let dummy = this.state.page;
            this.setState({ page: (dummy + number) });
            this.loadPosts(dummy + number);    
    };

    loadLess = number => {
        this.setState({ page: this.state.page - number });
        this.loadPosts(this.state.page - number);
    };

    renderPosts = posts => {
        return (
            <div className="row">
                {posts.map((post, i) => {
                    const posterId = post.postedBy
                        ? `/user/${post.postedBy._id}`
                        : "";
                    const posterName = post.postedBy
                        ? post.postedBy.name
                        : " Unknown";

                    return (
                        <div className="card col-md-4" key={i}>
                            <div className="card-body">
                                <img
                                    src={`http://localhost:8080/api/post/photo/${post._id}`}
                                    alt={post.title}
                                    onError={i =>
                                        (i.target.src = `${DefaultPost}`)
                                    }
                                    className="img-thunbnail mb-3"
                                    style={{ height: "200px", width: "100%" }}
                                />
                                <h5 className="card-title">{post.title}</h5>
                                <p className="card-text">
                                    {post.body.substring(0, 100)}
                                </p>
                                <br />
                                <p className="font-italic mark">
                                    Posted by{" "}
                                    <Link to={`${posterId}`}>
                                        {posterName}{" "}
                                    </Link>
                                    on {new Date(post.created).toDateString()}
                                </p>
                                <Link
                                    to={`/post/${post._id}`}
                                    className="btn btn-raised btn-primary btn-sm"
                                >
                                    Read more
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    render() {
        const { posts, page } = this.state;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">
                    {!posts.length ? "No more posts!" : "Recent Posts"}
                </h2>

                {this.renderPosts(posts)}

                {page > 1 ? (
                    <button
                        className="btn btn-raised btn-warning mr-5 mt-5 mb-5"
                        onClick={() => this.loadLess(1)}
                    >
                        Previous ({this.state.page - 1})
                    </button>
                ) : (
                    ""
                )}

                {posts.length ? (
                    <button
                        className="btn btn-raised btn-success mt-5 mb-5"
                        onClick={() => this.loadMore(1)}
                    >
                        Next ({page + 1})
                    </button>
                ) : (
                    ""
                )}
            </div>
        );
    }
}

export default Posts;

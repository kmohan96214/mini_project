import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";
import { list } from "../user/apiUser"

const isActive = (history, path) => {
    if (history.location.pathname === path) return { color: "#ff9900" };
    else return { color: "#ffffff" };
};
//var wait = ms => new Promise((r, j)=>setTimeout(r, ms));

const Menu = ({ history }) => {
  useEffect(() => {
    getNum()
  }, [])

  const [num, updateNum] = useState(0)
  const [dataFetched, updateAfterAjaxCall] = useState(false)
  const getNum = () => {
    var count = 0
    list().then(data => {
        console.log(data.length);
        count = data.filter(d => { 
          return (new Date()).toString().substring(0,15) == (new Date(d.birthday)).toString().substring(0,15)
        })
        updateNum(count.length)
        updateAfterAjaxCall(true)
        console.log(dataFetched)
    })
  }
  
  let temp
  if(dataFetched) {
    temp = (
      <div>
        <ul className="nav nav-tabs bg-primary">
            <li className="nav-item">
                <Link
                    className="nav-link"
                    style={isActive(history, "/")}
                    to="/"
                >
                    Home
                </Link>
            </li>

            <li className="nav-item">
                <Link
                    className="nav-link"
                    style={isActive(history, "/users")}
                    to="/users"
                >
                    Users
                </Link>
            </li>

            {isAuthenticated() && (
                <li className="nav-item">
                <Link
                    className="nav-link"
                    style={isActive(history, "/birthdays")}
                    to="/birthdays"
                >
                    Birthdays ({ (num) })
                </Link>
            </li>
            )}

            <li className="nav-item">
                <Link
                    to={`/post/create`}
                    style={isActive(history, `/post/create`)}
                    className="nav-link"
                >
                    Create Post
                </Link>
            </li>

            {!isAuthenticated() && (
                <>
                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            style={isActive(history, "/signin")}
                            to="/signin"
                        >
                            Sign In
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            style={isActive(history, "/signup")}
                            to="/signup"
                        >
                            Sign Up
                        </Link>
                    </li>
                </>
            )}

            {isAuthenticated() && isAuthenticated().user.role === "admin" && (
                <li className="nav-item">
                    <Link
                        to={`/admin`}
                        style={isActive(history, `/admin`)}
                        className="nav-link"
                    >
                        Admin
                    </Link>
                </li>
            )}

            {isAuthenticated() && (
                <>
                    <li className="nav-item">
                        <Link
                            to={`/findpeople`}
                            style={isActive(history, `/findpeople`)}
                            className="nav-link"
                        >
                            Find People
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link
                            to={`/user/${isAuthenticated().user._id}`}
                            style={isActive(
                                history,
                                `/user/${isAuthenticated().user._id}`
                            )}
                            className="nav-link"
                        >
                            {`${isAuthenticated().user.name}'s profile`}
                        </Link>
                    </li>

                    <li className="nav-item">
                        <span
                            className="nav-link"
                            style={
                                (isActive(history, "/signup"),
                                { cursor: "pointer", color: "#fff" })
                            }
                            onClick={() => signout(() => history.push("/"))}
                        >
                            Sign Out
                        </span>
                    </li>
            </>
          )}
        </ul>
       </div>
    )
  }  else {
    temp = (
      <div>Loading</div>
   )
  }
    
  return temp
}

export default withRouter(Menu);
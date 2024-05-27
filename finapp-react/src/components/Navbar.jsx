import React from "react";

function Navbar({user}){
    function handleLogOut() {
        localStorage.setItem('user_id', JSON.stringify(null));
        window.location.reload();
    }

    return (
        <header className="mb-3">
            <nav className="navbar bg-light">
                <div className="container-fluid">
                    <span className="navbar-brand mb-0">
                        <i className="bi bi-coin"></i> Track Your Finances
                    </span>
                    { user ? (
                        <div className="d-flex float-end">
                            <div className="p-2">
                                <i className="bi bi-person"></i> Welcome, {user.username}
                            </div>
                            <button
                                className="btn btn-warning opacity-75 float-end" type="button"
                                onClick={handleLogOut}>Log Out <i className="bi bi-box-arrow-in-right"></i>
                            </button>
                        </div>
                    ) : ('') }

                </div>
            </nav>
        </header>
    );
}

export default Navbar;
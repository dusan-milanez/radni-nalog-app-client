import React, { useState, useEffect } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";


export default function Home() {
    const [radniNalozi, setRadniNalozi] = useState([]);
    const { isAuthenticated } = useAppContext();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function onLoad() {
            if (!isAuthenticated) {
                return;
            }

            try {
                const radniNalozi = await loadRadniNalozi();
                setRadniNalozi(radniNalozi);
            } catch (e) {
                onError(e);
            }

            setIsLoading(false);
        }

        onLoad();
    }, [isAuthenticated]);

    function loadRadniNalozi() {
        return API.get("radniNalog", "/radniNalog");
    }

    function renderRadniNaloziList(radniNalozi) {
        return [{}].concat(radniNalozi).map((radniNalog, i) =>
            i !== 0 ? (
                <LinkContainer key={radniNalog.radniNalogId} to={`/radniNalog/${radniNalog.radniNalogId}`}>
                    <ListGroupItem header={"klijent:"+radniNalog.klijent.trim().split("\n")[0] + " uredjaj:"+radniNalog.uredjaj.trim().split("\n")[0]}>
                        {"Created: " + new Date(radniNalog.createdAt).toLocaleString()}
                    </ListGroupItem>
                </LinkContainer>
            ) : (
                <LinkContainer key="new" to="/radniNalog/new">
                    <ListGroupItem>
                        <h4>
                            <b>{"\uFF0B"}</b> Kreiraj novi radni nalog
                        </h4>
                    </ListGroupItem>
                </LinkContainer>
            )
        );
    }

    function renderLander() {
        return (
            <div className="lander">
                <h1>Scratch</h1>
                <p>A simple note taking app</p>
                <div>
                    <Link to="/login" className="btn btn-info btn-lg">
                        Login
                    </Link>
                    <Link to="/signup" className="btn btn-success btn-lg">
                        Signup
                    </Link>
                </div>
            </div>
        );
    }

    function renderRadniNalozi() {
        return (
            <div className="radninalog">
                <PageHeader>Radni nalozi</PageHeader>
                <ListGroup>
                    {!isLoading && renderRadniNaloziList(radniNalozi)}
                </ListGroup>
            </div>
        );
    }

    return (
        <div className="Home">
            {isAuthenticated ? renderRadniNalozi() : renderLander()}
        </div>
    );
}
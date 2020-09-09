import React, {useState, useEffect} from "react";
import {PageHeader, ListGroup, ListGroupItem, FormControl, FormGroup, ControlLabel} from "react-bootstrap";
import {useAppContext} from "../libs/contextLib";
import {onError} from "../libs/errorLib";
import "./Home.css";
import {API} from "aws-amplify";
import {LinkContainer} from "react-router-bootstrap";
import {Link} from "react-router-dom";


export default function Home() {
    const [radniNalozi, setRadniNalozi] = useState([]);
    const {isAuthenticated} = useAppContext();
    const [isLoading, setIsLoading] = useState(true);

    const [searchValue, setSearchValue] = useState('')

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

    const filtered = radniNalozi.filter(r => r.klijent.toLowerCase().includes(searchValue.toLowerCase()) || r.uredjaj.toLowerCase().includes(searchValue.toLowerCase()))

    function loadRadniNalozi() {
        return API.get("radniNalog", "/radniNalog");
    }

    function renderRadniNaloziList(radniNalozi) {
        return [{}].concat(radniNalozi).map((radniNalog, i) =>
            i !== 0 ? (
                <LinkContainer key={radniNalog.radniNalogId} to={`/radniNalog/${radniNalog.radniNalogId}`}>
                    <ListGroupItem className={'item'}>
                        <h4>
                            {"Klijent: " + radniNalog.klijent.trim().split("\n")[0]}
                        </h4>
                        <h4>
                            {"Uredjaj: " + radniNalog.uredjaj.trim().split("\n")[0]}
                        </h4>
                        <p>
                            {"Created: " + new Date(radniNalog.createdAt).toLocaleString()}
                        </p>
                    </ListGroupItem>
                </LinkContainer>
            ) : (
                <LinkContainer key="new" to="/radniNalog/new">
                    <ListGroupItem className={'item'}>
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
            <>
                <h2 className="radninalog">
                    Radni nalozi
                </h2>

                <FormGroup>
                    <ControlLabel>Search</ControlLabel>
                    <FormControl
                        value={searchValue}
                        type={'text'}
                        onChange={e => setSearchValue(e.target.value)}
                    />
                </FormGroup>


                <div style={{height: 30}}/>

                <ListGroup>
                    {!isLoading && renderRadniNaloziList(filtered)}
                </ListGroup>
            </>
        );
    }

    return (
        <div className="Home">
            {isAuthenticated ? renderRadniNalozi() : renderLander()}
        </div>
    );
}

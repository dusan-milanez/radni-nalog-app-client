import React, {useRef, useState, useEffect} from "react";
import {useParams, useHistory} from "react-router-dom";
import {API, Storage} from "aws-amplify";
import {onError} from "../libs/errorLib";
import {FormGroup, FormControl, ControlLabel, Row, Col} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./RadniNalog.css";
import {s3Upload} from "../libs/awsLib";

export default function Notes() {
    const file = useRef(null);
    const {id} = useParams();
    const history = useHistory();
    const [radniNalog, setRadniNalog] = useState(null);
    const [klijent, setKlijent] = useState("");
    const [kontakt, setKontakt] = useState("");
    const [uredjaj, setUredjaj] = useState("");
    const [napomena, setNapomena] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        function loadRadniNalog() {
            return API.get("radniNalog", `/radniNalog/${id}`);
        }

        async function onLoad() {
            try {
                const radniNalog = await loadRadniNalog();
                const {klijent, kontakt, uredjaj, napomena, attachment} = radniNalog;

                if (attachment) {
                    radniNalog.attachmentURL = await Storage.vault.get(attachment);
                }

                setKlijent(klijent);
                setKontakt(kontakt);
                setUredjaj(uredjaj);
                setNapomena(napomena);
                setRadniNalog(radniNalog);
            } catch (e) {
                onError(e);
            }
        }

        onLoad();
    }, [id]);

    function validateForm() {
        return klijent.length > 0;
    }

    function formatFilename(str) {
        return str.replace(/^\w+-/, "");
    }

    function handleFileChange(event) {
        file.current = event.target.files[0];
    }

    function saveRadniNalog(radniNalog) {
        return API.put("radniNalog", `/radniNalog/${id}`, {
            body: radniNalog
        });
    }

    async function handleSubmit(event) {
        let attachment;

        event.preventDefault();

        if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
            alert(
                `Please pick a file smaller than ${
                    config.MAX_ATTACHMENT_SIZE / 1000000
                } MB.`
            );
            return;
        }

        setIsLoading(true);

        try {
            if (file.current) {
                attachment = await s3Upload(file.current);
            }

            await saveRadniNalog({
                klijent,
                kontakt,
                uredjaj,
                napomena,
                attachment: attachment || radniNalog.attachment
            });
            history.push("/");
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    function deleteRadniNalog() {
        return API.del("radniNalog", `/radniNalog/${id}`);
    }


    async function handleDelete(event) {
        event.preventDefault();

        const confirmed = window.confirm(
            "Jeste li sigurni da zelite da obrisete radni nalog?"
        );

        if (!confirmed) {
            return;
        }

        setIsDeleting(true);

        try {
            await deleteRadniNalog();
            history.push("/");
        } catch (e) {
            onError(e);
            setIsDeleting(false);
        }
    }

    return (
        <div className="RadniNalog">
            {radniNalog && (
                <form onSubmit={handleSubmit}>

                    <Row>
                        <Col xs={3}/>
                        <Col xs={6}>

                            <Row>
                                <Col xs={6}>
                                    <FormGroup controlId="klijent">
                                        <FormControl
                                            value={klijent}
                                            type={'text'}
                                            onChange={e => setKlijent(e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col xs={6}>
                                    <FormGroup controlId="kontakt">
                                        <FormControl
                                            value={kontakt}
                                            type={'text'}
                                            onChange={e => setKontakt(e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>


                            <Row>
                                <Col xs={12}>
                                    <FormGroup controlId="uredjaj">
                                        <FormControl
                                            value={uredjaj}
                                            as="textarea"
                                            row={5}
                                            onChange={e => setUredjaj(e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>


                            <Row>
                                <Col xs={12}>
                                    <FormGroup controlId="napomena">
                                        <FormControl
                                            value={napomena}
                                            as="textarea"
                                            row={5}
                                            onChange={e => setNapomena(e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12}>
                                    {radniNalog.attachment && (
                                        <FormGroup>
                                            <ControlLabel>Attachment</ControlLabel>
                                            <FormControl.Static>
                                                <a
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    href={radniNalog.attachmentURL}
                                                >
                                                    {formatFilename(radniNalog.attachment)}
                                                </a>
                                            </FormControl.Static>
                                        </FormGroup>
                                    )}
                                    <FormGroup controlId="file">
                                        {!radniNalog.attachment && <ControlLabel>Attachment</ControlLabel>}
                                        <FormControl onChange={handleFileChange} type="file"/>
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={6}>
                                    <LoaderButton
                                        block
                                        type="submit"
                                        bsSize="large"
                                        bsStyle="primary"
                                        isLoading={isLoading}
                                        disabled={!validateForm()}
                                    >
                                        Save
                                    </LoaderButton>
                                </Col>
                                <Col xs={6}>
                                    <LoaderButton
                                        block
                                        bsSize="large"
                                        bsStyle="danger"
                                        onClick={handleDelete}
                                        isLoading={isDeleting}
                                    >
                                        Delete
                                    </LoaderButton>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </form>
            )}
        </div>
    );
}

import React, {useRef, useState} from "react";
import {useHistory} from "react-router-dom";
import {FormGroup, FormControl, ControlLabel, Row, Col} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import {onError} from "../libs/errorLib";
import config from "../config";
import "./NewRadniNalog.css";
import {API} from "aws-amplify";
import {s3Upload} from "../libs/awsLib";

export default function NewRadniNalog() {
    const file = useRef(null);
    const history = useHistory();
    const [klijent, setKlijent] = useState("");
    const [kontakt, setKontakt] = useState("");
    const [uredjaj, setUredjaj] = useState("");
    const [napomena, setNapomena] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    function validateForm() {
        return klijent.length > 0;
    }

    function handleFileChange(event) {
        file.current = event.target.files[0];
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
            alert(
                `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
                1000000} MB.`
            );
            return;
        }

        setIsLoading(true);

        try {
            const attachment = file.current ? await s3Upload(file.current) : null;

            await createRadniNalog({klijent, kontakt, uredjaj, napomena, attachment});
            history.push("/");
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    function createRadniNalog(radniNalog) {
        return API.post("radniNalog", "/radniNalog", {
            body: radniNalog
        });
    }

    return (
        <div className="NewRadniNalog">
            <form onSubmit={handleSubmit}>

                <Row>
                    <Col xs={3}/>
                    <Col xs={6}>

                        <Row>
                            <Col xs={6}>
                                <FormGroup controlId="klijent">
                                    <ControlLabel>Klijent</ControlLabel>
                                    <FormControl
                                        size="lg"
                                        value={klijent}
                                        type={'text'}
                                        onChange={e => setKlijent(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={6}>
                                <FormGroup controlId="kontakt">
                                    <ControlLabel>Kontakt</ControlLabel>
                                    <FormControl
                                        size="lg"
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
                                    <ControlLabel>Uredjaj</ControlLabel>
                                    <FormControl
                                        size="lg"
                                        value={uredjaj}
                                        type={'text'}
                                        onChange={e => setUredjaj(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={12}>
                                <FormGroup controlId="napomena">
                                    <ControlLabel>Napomena</ControlLabel>
                                    <FormControl
                                        // as="textarea"
                                        rows="5"
                                        type={'textarea'}
                                        value={napomena}
                                        onChange={e => setNapomena(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>

                        <FormGroup controlId="file">
                            <ControlLabel>Attachment</ControlLabel>
                            <FormControl onChange={handleFileChange} type="file"/>
                        </FormGroup>
                        <LoaderButton
                            block
                            type="submit"
                            bsSize="large"
                            bsStyle="primary"
                            isLoading={isLoading}
                            disabled={!validateForm()}
                        >
                            Create
                        </LoaderButton>

                    </Col>
                </Row>
            </form>
        </div>
    );
}

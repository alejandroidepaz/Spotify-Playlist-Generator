import React, {useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

import Slider from 'rc-slider';
import '../styling/slider.css';

import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';

interface Credentials {
    access_token: String, 
    refresh_token: String
}

interface Props {
    params: Credentials
}

interface Track {
    name: String,
    uri: String,
    id: String,
    tempo: Number
}

function log(value) {
  console.log(value); //eslint-disable-line
}

const ProfilePreview = (props) =>{
    const params = new URLSearchParams(props.location.search);
    const userId = params.get('userId');
    const imageLink = params.get('image');
    const displayName = params.get('name');
    const profileLink = params.get('profileLink');
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    // default config values of 50
    const [ energy, setEnergy ] = useState(50);
    const [ danceability, setDanceability ] = useState(50);
    const [ mode, setMode ] = useState(50);
    const [ valence, setValence ] = useState(50);
    const [ liveness, setLiveness ] = useState(50);

    const [playlists, getPlaylists] = useState({
        "liveness": new Array<Track>()
    })

    // useEffect(()=>{

    //     var bodyData = {"access_token":accessToken, "refresh_token":refreshToken}
        
    //     var payload : any = {method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(bodyData),
    //     };

    //     // Fetch user songs
    //     fetch("http://localhost:8000/user_library", payload)
    //     .then(res => res.json())
    //     .then(data => getPlaylists(data.playlists))
    //     .catch(err => console.info(err));
        
    // }, [])

    const history = useHistory();

    return (
      <div className="Page">
          <div style={{ textAlign: 'right', margin: 20 }}>
            <Button variant="outline-danger" onClick={() => {history.push('/')}}>
                Log Out
            </Button>
          </div>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <h1> Welcome, {displayName}!</h1>
            <h3>Use the sliders below to pick the perfect mood for your next playlist.</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', width: '80vw', alignSelf: 'center', justifyContent: 'space-around'}}>
            <p>Energy</p>
            <p>Danceability</p>
            <p>Mode</p>
            <p>Valence</p>
            <p>Liveness</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', width: '80vw', alignSelf: 'center', height: 400, justifyContent: 'space-around', border: '3px solid black' }}>
            <Slider onChange={(val)=>{setEnergy(val)}} startPoint={50} defaultValue={50} vertical={true} trackStyle={{ width: '5vw' }} railStyle={{ width: '5vw' }} style={{ width: '5vw' }} />
            <Slider onChange={(val)=>{setDanceability(val)}} startPoint={50} defaultValue={50} vertical={true} trackStyle={{ width: '5vw' }} railStyle={{ width: '5vw' }} style={{ width: '5vw' }} />
            <Slider onChange={(val)=>{setMode(val)}} startPoint={50} defaultValue={50} vertical={true} trackStyle={{ width: '5vw' }} railStyle={{ width: '5vw' }} style={{ width: '5vw' }} />
            <Slider onChange={(val)=>{setValence(val)}} startPoint={50} defaultValue={50} vertical={true} trackStyle={{ width: '5vw' }} railStyle={{ width: '5vw' }} style={{ width: '5vw' }} />
            <Slider onChange={(val)=>{setLiveness(val)}} startPoint={50} defaultValue={50} vertical={true} trackStyle={{ width: '5vw' }} railStyle={{ width: '5vw' }} style={{ width: '5vw' }} />
          </div>
          <div>
          <div className="profile">
            
             
            <div style={{ textAlign: 'center', marginTop: 20 }}>
                <div>
                    {/* <h4>Playlists Preview</h4> */}
                    {Object.keys(playlists).map((key) =>{
                        
                        return (
                            playlists[key].map((song)=>{
                                return (
                                    <p key={song.id}>{song.name}</p>
                                )
                            })
                        )
                    })}
                </div>
                <Button onClick={()=> {
                    let uris = playlists["liveness"].map((song) => {
                        return song.uri;
                    });

                    let body = {
                        "user_id": userId,
                        "access_token": accessToken,
                        "refresh_token": refreshToken,
                        "uris" : uris
                    }
        
                    let payload : any = {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(body),
                    };

                    fetch('http://localhost:8000/playlist', payload)
                    .then(res => res.json())
                    .then(data => console.info(data))
                    .catch(err => console.error(err));
                }}>Generate Playlists!</Button>    
            </div>
        </div>
          </div>
      </div>
    );
}

export default ProfilePreview;
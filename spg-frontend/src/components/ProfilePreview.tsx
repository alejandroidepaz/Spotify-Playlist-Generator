import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface Credentials{
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

const ProfilePreview = (props) =>{
    const params = new URLSearchParams(props.location.search);
    const userId = params.get('userId');
    const imageLink = params.get('image');
    const displayName = params.get('name');
    const profileLink = params.get('profileLink');
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    const [playlists, getPlaylists] = useState({
        "liveness": new Array<Track>()
    })

    useEffect(()=>{

        var bodyData = {"access_token":accessToken, "refresh_token":refreshToken}
        
        var payload : any = {method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
        };

        // Fetch user songs
        fetch("http://localhost:8000/user_library", payload)
        .then(res => res.json())
        .then(data => getPlaylists(data.playlists))
        .catch(err => console.info(err));
        
    }, [])

    const history = useHistory();

    return (
        <div className="profile">
            <div style={{ textAlign: 'right', margin: 20 }}>
                <Button variant="outline-danger" onClick={() => {history.push('/')}}>
                    Log Out
                </Button>
            </div>
            <h1>{displayName}</h1>  
            <div>
                <div>
                    <h4>Playlists Preview</h4>
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
    );
}

export default ProfilePreview;
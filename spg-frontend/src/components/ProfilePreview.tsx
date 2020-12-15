import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Slider } from '@material-ui/core';

import { genres } from './genres';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300 + theme.spacing(3) * 2,
  },
  margin: {
    height: theme.spacing(3),
  },
}));

interface DropdownItem {
  value: String,
  label: String
}

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

const animatedComponents = makeAnimated();

const ProfilePreview = (props) => {
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
    });

    const [ genreOptions, setGenreOptions ] = useState<Array<DropdownItem>>([]);
    const [ genreSelection, setGenreSelection ] = useState<Array<String>>([]);

    // console.info(genreSelection);

    const classes = useStyles();

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

    // populate list of genres for dropdown
    let genreDropdownItems : DropdownItem[] = [];
    genres.genres.forEach((x) => {
      let i : DropdownItem = { value: x, label: x };
      genreDropdownItems.push(i);
    });

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
            <h3>Use the options below to pick the perfect mood for your next playlist.</h3>
          </div>
          <div style={{ width: '40vw', marginLeft: 'auto', marginRight: 'auto', marginBottom: 30 }}>  
            <h4 style={{ textAlign: 'center' }}>Genres</h4>
            <Select
              isMulti
              onChange={(selection) => {
                let g : Array<String> = [];
                selection.forEach((x) => {
                  g.push(x.value);
                })
                setGenreSelection(g);
              }}
              options={genreDropdownItems}
              closeMenuOnSelect={false}
              components={animatedComponents}
              className="basic-multi-select"
              classNamePrefix="select" />
          </div>
          <div>
            <h4 style={{ textAlign: 'center' }}>Audio Features</h4>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', width: '80vw', alignSelf: 'center', justifyContent: 'space-around'}}>
            <p>Energy</p>
            <p>Danceability</p>
            <p>Mode</p>
            <p>Valence</p>
            <p>Liveness</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', width: '80vw', alignSelf: 'center', height: 400, justifyContent: 'space-around', border: '3px solid black' }}>
            <CustomSlider
              orientation="vertical"
              aria-labelledby="continuous-slider"
              min={0}
              value={energy}
              onChange={(event, value)=>{
                // typecast to Number with +
                setEnergy(+value);
              }}
              max={100} />
            <CustomSlider
              orientation="vertical"
              aria-labelledby="continuous-slider"
              min={0}
              value={danceability}
              onChange={(event, value)=>{
                // typecast to Number with +
                setDanceability(+value);
              }}
              max={100} />
            <CustomSlider
              orientation="vertical"
              aria-labelledby="continuous-slider"
              min={0}
              value={mode}
              onChange={(event, value)=>{
                // typecast to Number with +
                setMode(+value);
              }}
              max={100} />
            <CustomSlider
              orientation="vertical"
              aria-labelledby="continuous-slider"
              min={0}
              value={valence}
              onChange={(event, value)=>{
                // typecast to Number with +
                setValence(+value);
              }}
              max={100} />
            <CustomSlider
              orientation="vertical"
              aria-labelledby="continuous-slider"
              min={0}
              value={liveness}
              onChange={(event, value)=>{
                // typecast to Number with +
                setLiveness(+value);
              }}
              max={100} />
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

const CustomSlider = withStyles({
  root: {
    color: '#52af77',
    height: 8,
    '&$vertical': {
      width: 8
    }
  },
  thumb: {
    height: 24,
    width: 24,
    // backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover': {
      boxShadow: '0px 0px 0px 8px rgba(84, 199, 97, 0.16)'
    },
    '&$active': {
      boxShadow: '0px 0px 0px 12px rgba(84, 199, 97, 0.16)'
    }
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)'
  },
  track: {
    height: 8,
    borderRadius: 4
  },
  rail: {
    height: 8,
    borderRadius: 4
  },
  vertical: {
    '& $rail': {
      width: 8
    },
    '& $track': {
      width: 8
    },
    '& $thumb': {
      marginLeft: -8,
      marginBottom: -11
    }
  }
})(Slider)

export default ProfilePreview;
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Slider } from '@material-ui/core';

// list of genres is hardcoded for now, TODO: add this as a useEffect call
import { genres } from './genres';

interface DropdownItem {
  value: String,
  label: String
}

// TODO: decide whether we needs to use these types on props
interface Credentials {
  access_token: String,
  refresh_token: String
}

// interface Props {
//   params: Credentials
// }

interface Track {
  name: String,
  uri: String,
  id: String,
  tempo: Number
}

// enable genre filter animations
const animatedComponents = makeAnimated();

const ProfilePreview = (props) => {
    // pull parameters from the url query
    const params = new URLSearchParams(props.location.search);
    const userId = params.get('userId');
    const imageLink = params.get('image');
    const displayName = params.get('name');
    const profileLink = params.get('profileLink');
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    // switch for displaying playlist preview vs. configuring playlist
    const [ playlistPreview, setPlaylistPreview ] = useState(false);

    // default config values of 50 (start sliders in the middle)
    const [ energy, setEnergy ] = useState(50);
    const [ danceability, setDanceability ] = useState(50);
    const [ mode, setMode ] = useState(50);
    const [ valence, setValence ] = useState(50);
    const [ liveness, setLiveness ] = useState(50);

    const [ prefetchedTracks, setPrefetchedTracks ] = useState<Array<Track>>([]);

    // const [ genreOptions, setGenreOptions ] = useState<Array<DropdownItem>>([]);
    const [ genreSelection, setGenreSelection ] = useState<Array<String>>([]);

    // pre-fetch user's saved songs
    useEffect(()=>{

        var bodyData = { "access_token": accessToken, "refresh_token": refreshToken }
        
        var payload : any = {method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
        };

        // Fetch user songs
        fetch("http://localhost:8000/user_library", payload)
        .then(res => res.json())
        // TODO: uncomment this once the endpoint is fixed to just send back tracks
        // .then(data => setPrefetchedTracks(data.songs))
        .catch(err => console.info(err));
        
    }, [])

    // populate list of genres for dropdown
    let genreDropdownItems : DropdownItem[] = [];
    genres.genres.forEach((x) => {
      let i : DropdownItem = { value: x, label: x };
      genreDropdownItems.push(i);
    });

    // history object allows us to enable navigation between pages for the user
    const history = useHistory();

    return (
      <div className="Page">
          <div style={{ textAlign: 'right', margin: 20 }}>
            <Button variant="outline-danger" onClick={() => {history.push('/')}}>
                Log Out
            </Button>
          </div>
          { !playlistPreview && <div>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <h1> Welcome, {displayName}!</h1>
            <h3>Use the options below to pick the perfect mood for your next playlist.</h3>
          </div>
          <div style={{ width: '40vw', marginLeft: 'auto', marginRight: 'auto', marginBottom: 30 }}>  
            <h4 style={{ textAlign: 'center' }}>Genres</h4>
            <Select
              isMulti
              onChange={(selection) => {
                // update selected genres when the selection is changed
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
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            paddingLeft: '2%',
            paddingRight: '2%',
            justifyContent: 'center'
            }}>
            <div style={{ display: 'flex', flexDirection: 'row', width: '80vw', alignSelf: 'center', justifyContent: 'space-around' }}>
              <p><em>Energy</em></p>
              <p><em>Danceability</em></p>
              <p><em>Mode</em></p>
              <p><em>Valence</em></p>
              <p><em>Liveness</em></p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', width: '80vw', alignSelf: 'center', height: 350, justifyContent: 'space-around' }}>
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
          </div>
          <div>
          <div className="profile">
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <Button onClick={()=> {
                  let body = {
                      "user_id": userId,
                      "access_token": accessToken,
                      "refresh_token": refreshToken,
                      "prefetchedTracks" : prefetchedTracks,
                      "preferences": {
                        energy,
                        danceability,
                        mode,
                        valence,
                        liveness,
                        genreSelection
                      }
                  }
      
                  let payload : any = {
                      method: 'POST',
                      headers: {
                      'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(body),
                  };

                  // TODO: make this request once the endpoint is in place
                  // fetch('http://localhost:8000/playlist', payload)
                  // .then(res => res.json())
                  // .then(data => console.info(data))
                  // .catch(err => console.error(err));
              }}>Generate Playlists!</Button>    
            </div>
          </div>
        </div>
        </div> }
      </div>
    );
}

// TODO: refactor this out into styles
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
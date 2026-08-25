import { useEffect, useState } from 'react';
import api from '../services/api';
import Reveal from './Reveal';

function About(){
    const [bio,setbio]=useState('');
    const [status, setStatus] = useState('loading');
    useEffect(() => {
        api.get('/about')
            .then(response => {
                setbio(Array.isArray(response.data) ? response.data : []);
                setStatus('ready');
            })
            .catch(error => {
                console.error("Erreur lors de la récupération de la bio :", error);
                setStatus('error');
            });
    }, []);

     return (
            <Reveal as="section">
                <h2>A propos de moi</h2>
                <p className='bio'>
                    {bio}
                </p>
                <br />
            </Reveal>
        )

}

export default About;
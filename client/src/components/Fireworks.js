// client/src/components/Fireworks.js
import React from 'react';
import { Fireworks } from '@fireworks-js/react';

const Celebration = () => {
    return (
        <Fireworks
            options={{
                rocketsPoint: {
                    min: 0,
                    max: 100
                },
                hue: {
                    min: 0,
                    max: 360
                },
                delay: {
                    min: 0.01,
                    max: 0.03
                },
                particles: 100,
                explosion: 5,
                intensity: 30,
                friction: 0.95,
                gravity: 1.5,
                brightness: {
                    min: 50,
                    max: 80,
                },
            }}
            style={{
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                position: 'fixed',
                background: 'rgba(0, 0, 0, 0.2)',
                pointerEvents: 'none' // <-- THE FIX: This makes the overlay unclickable
            }}
        />
    );
};

export default Celebration;
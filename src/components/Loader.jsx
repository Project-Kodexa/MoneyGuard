import {Circles} from 'react-loader-spinner';
import React from 'react';

export default function Loader() {
    return (
        <div className="flex items-center justify-center h-screen">
        <Circles
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
        />
        </div>
    );
    }
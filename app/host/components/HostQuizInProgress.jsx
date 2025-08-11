'use client';

import React from 'react';
import { RiLoader2Fill } from "react-icons/ri"; //loading icon

const HostQuizInProgress = ({ playersFinishedCount, joinedUsers }) => {
    return (
        <div className="text-center">

            {/* showing quiz status */}
            <p className="px-4 text-sm py-2 text-green-500 bg-green-100 rounded-lg flex gap-2 items-center">
                Quiz is in progress!
                <RiLoader2Fill className='text-lg animate-spin' />
            </p>

            {/* showing count of players who submitted quiz */}
            <p className="text-zinc-700 mb-4">
                Players finished: {playersFinishedCount} / {joinedUsers.length}
            </p>

        </div>
    );
};

export default HostQuizInProgress;

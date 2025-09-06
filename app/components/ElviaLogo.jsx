import React from 'react'
import Image from 'next/image'

const ElviaLogo = () => {
    return (
        <div className='-mb-12'>

            <Image src={'/logo.png'} alt='elvia' height={100} width={200} />

        </div>
    )
}

export default ElviaLogo
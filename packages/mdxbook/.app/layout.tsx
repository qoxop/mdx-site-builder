import React, { useEffect } from 'react';
// @ts-ignore
import { useMetaData } from '@mdxbook/data-provider.tsx';
export default function Layout() {
    const metadata = useMetaData();
    useEffect(() => {
        console.log(metadata);
    }, [metadata]);
    return (
        <div>
            {JSON.stringify(metadata)}
        </div>
    )
}